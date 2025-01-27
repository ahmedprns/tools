<?php
// جلب أفضل النتائج
$scores = file('scores.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$results = [];

foreach ($scores as $line) {
    [$name, $score] = explode(',', $line);
    $results[] = ['name' => $name, 'score' => (int) $score];
}

usort($results, fn($a, $b) => $b['score'] <=> $a['score']);
$topScores = array_slice($results, 0, 7);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>اختبار المعرفة العامة</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <div class="container">
        <h1>مرحبًا بك في لعبة اختبار المعرفة العامة</h1>
        <p>اختر مجال الأسئلة الذي تريده، وسيتم تقديم 10 أسئلة عشوائية <br>
        بعد كل سؤال، ستحصل علي نتيجة عن إجابتك. في النهاية، احفظ نتيجتك وانضم إلى قائمة أفضل النتائج</p>
        
        <div class="content">
            <div class="quiz-options">
                <h2>اختر مجال الأسئلة</h2>
                <form method="POST" action="quiz.php">
                    <button type="submit" name="category" value="sports">رياضة</button>
                    <button type="submit" name="category" value="geography">جغرافيا</button>
                    <button type="submit" name="category" value="science">علوم</button>
                    <button type="submit" name="category" value="history">تاريخ</button>
                    <button type="submit" name="category" value="all">كل المجالات</button>
                </form>
            </div>

            <div class="leaderboard">
                <h2>أفضل النتائج</h2>
                <ol>
                    <?php foreach ($topScores as $result): ?>
                        <li><p style="text-align: right;padding-right: 20px;"><?= $result['name'] ?> &nbsp; ( النتيجة:<?= $result['score'] ?> )</p></li>
                    <?php endforeach; ?>
                </ol>
                <a style="width: 320px;" href="leaderboard.php">افضل النتائج</a>
            </div>
            
        </div>
    </div>
</body>
</html>
