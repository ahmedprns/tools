<?php
$folder = "files"; // اسم المجلد الذي يحتوي الصور
$images = array();

// التحقق من وجود المجلد
if (is_dir($folder)) {
    $files = scandir($folder);
    foreach ($files as $file) {
        if (in_array(pathinfo($file, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif'])) {
            $images[] = $file;
        }
    }
}

header('Content-Type: application/json');
echo json_encode($images);
?>
