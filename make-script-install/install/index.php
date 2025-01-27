<?php
session_start();

// تحميل الإعدادات
$settings = include 'settings.php';

// إعداد اللغة
$lang = isset($_GET['lang']) ? $_GET['lang'] : $settings['default_language'];
$translations = $settings['translations'][$lang];

if($settings['rtl']=='true'){
    echo '<style>body {direction: rtl;} </style>';
}else{
    echo '<style>body {direction: ltr;} </style>';
}

// اللون الأساسي
$primary_color = $settings['primary_color'];

// الخطوة الحالية
$step = isset($_GET['step']) ? (int) $_GET['step'] : 1;

// مجموع الخطوات
$total_steps = 4;

// رسائل الأخطاء
$errors = [];

// ترجمة النصوص
function translate($key, $replacements = []) {
    global $translations;
    $text = $translations[$key] ?? $key;
    foreach ($replacements as $search => $replace) {
        $text = str_replace(":$search", $replace, $text);
    }
    return $text;
}

// عرض شريط الخطوات
function render_steps_bar($current_step, $total_steps) {
    echo '<div class="steps-bar">';
    for ($i = 1; $i <= $total_steps; $i++) {
        $class = $i <= $current_step ? 'completed' : 'pending';
        echo '<span class="step ' . $class . '">' . translate('step') . ' ' . $i . '</span>';
        if ($i < $total_steps) {
            echo '<span class="separator">></span>';
        }
    }
    echo '</div>';
}

// التحقق من المتطلبات
if ($step == 1 && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $min_php_version = $settings['min_php_version'];
    $required_extensions = $settings['required_extensions'];

    if (version_compare(PHP_VERSION, $min_php_version, '<')) {
        $errors[] = translate('php_version_error');
    }

    foreach ($required_extensions as $extension) {
        if (!extension_loaded($extension)) {
            $errors[] = translate('extension_error', ['extension' => $extension]);
        }
    }

    if (empty($errors)) {
        header("Location: index.php?step=2&lang=$lang");
        exit;
    }
}

// إعداد قاعدة البيانات
if ($step == 2 && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $db_host = $_POST['db_host'] ?? '';
    $db_name = $_POST['db_name'] ?? '';
    $db_user = $_POST['db_user'] ?? '';
    $db_pass = $_POST['db_pass'] ?? '';

    try {
        $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
        if ($conn->connect_error) {
            throw new Exception($conn->connect_error);
        }
        $_SESSION['db_config'] = compact('db_host', 'db_name', 'db_user', 'db_pass');
        header("Location: index.php?step=3&lang=$lang");
        exit;
    } catch (Exception $e) {
        $errors[] = translate('db_connection_error', ['error' => $e->getMessage()]);
    }
}

// تشغيل ملف SQL
if ($step == 3 && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $db_config = $_SESSION['db_config'] ?? null;
    if ($db_config) {
        try {
            $conn = new mysqli($db_config['db_host'], $db_config['db_user'], $db_config['db_pass'], $db_config['db_name']);
            $sql_file = file_get_contents('install.sql'); // قم بإنشاء ملف install.sql بجانب index.php
            if (!$conn->multi_query($sql_file)) {
                throw new Exception($conn->error);
            }
            while ($conn->more_results() && $conn->next_result()) {;} // تفريغ النتائج
            header("Location: index.php?step=4&lang=$lang");
            exit;
        } catch (Exception $e) {
            $errors[] = $e->getMessage();
        }
    } else {
        $errors[] = translate('db_connection_error', ['error' => 'Missing database configuration']);
    }
}

// تحديث ملف الإعدادات
if ($step == 4 && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $db_config = $_SESSION['db_config'] ?? null;
    try {
        $config_template = file_get_contents('config_template.php'); // قم بإنشاء ملف قالب للإعدادات
        $config_content = str_replace('DB_HOST_V', $db_config['db_host'], $config_template);
        $config_content = str_replace('DB_NAME_V', $db_config['db_name'], $config_content);
        $config_content = str_replace('DB_USER_V', $db_config['db_user'], $config_content);
        $config_content = str_replace('DB_PASS_V', $db_config['db_pass'], $config_content);

        if (file_put_contents('../config.php', $config_content)) {
            session_destroy();
            header("Location: index.php?step=5&lang=$lang");
            exit;
        } else {
            $errors[] = translate('config_write_error');
        }
    } catch (Exception $e) {
        $errors[] = $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo translate('welcome'); ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f9fc;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 70%;
            margin: auto;
            margin-top: 10px;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
        }

        h1 {
  color: <?php echo $primary_color; ?>;
  text-align: center;
  padding: 20px;
  margin-top: 0;
}
body {
  background-color: white;
}
        .steps-bar {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .step {
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            background: #ddd;
            color: #666;
            min-width: 100px;
        }
        .separator {
  font-size: 32px;
}
        .completed {
            background-color: <?php echo $primary_color; ?>;
            color: white;
        }
        .pending {
            background-color: #ddd;
            color: #666;
        }
        .errors {
            background: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
  direction: rtl;
        }
        .btn {
            background-color: <?php echo $primary_color; ?>;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
  font-weight: bold;
        }
        .btn:hover {
            background-color: #0056b3;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input {
            width: 100% ;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><?php echo translate('welcome'); ?></h1>

        <?php render_steps_bar($step, $total_steps); ?>

        <?php if (!empty($errors)): ?>
            <div class="errors">
                <?php foreach ($errors as $error): ?>
                    <p><?php echo $error; ?></p>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <?php if ($step == 1): ?>
            <form method="POST">
                <p style="font-weight: bold;font-size: 30px;text-align: center;"><?php echo translate('check_requirements'); ?></p>
                <p><?php echo translate('check_requirements_txt'); ?></p><br>
                <button type="submit" class="btn"><?php echo translate('next'); ?></button>
            </form>
        <?php elseif ($step == 2): ?>
            <form method="POST">
                <div class="form-group">
                    <label><?php echo translate('db_host'); ?></label>
                    <input type="text" name="db_host" required>
                </div>
                <div class="form-group">
                    <label><?php echo translate('db_name'); ?></label>
                    <input type="text" name="db_name" required>
                </div>
                <div class="form-group">
                    <label><?php echo translate('db_user'); ?></label>
                    <input type="text" name="db_user" required>
                </div>
                <div class="form-group">
                    <label><?php echo translate('db_pass'); ?></label>
                    <input type="password" name="db_pass">
                </div>
                <button type="submit" class="btn"><?php echo translate('next'); ?></button>
            </form>
        <?php elseif ($step == 3): ?>
            <form method="POST">
                <p style="font-weight: bold;font-size: 30px;text-align: center;"><?php echo translate('run_sql'); ?></p>
                <p><?php echo translate('run_sql_txt'); ?></p><br>
                <button type="submit" class="btn"><?php echo translate('next'); ?></button>
            </form>
        <?php elseif ($step == 4): ?>
            <form method="POST">
                <p style="font-weight: bold;font-size: 30px;text-align: center;"><?php echo translate('update_config'); ?></p>
                <p><?php echo translate('update_config_txt'); ?></p><br>
                <button type="submit" class="btn"><?php echo translate('finish'); ?></button>
            </form>
        <?php elseif ($step == 5): ?>
            <p style="font-weight: bold;font-size: 30px;text-align: center;"><?php echo translate('installation_success'); ?></p>
            <p><?php echo translate('installation_success_txt'); ?></p>
        <?php endif; ?>
    </div>
</body>
</html>
