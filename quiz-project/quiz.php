<?php
session_start();

$category = $_POST['category'] ?? 'all';
$questionFiles = ($category === 'all') ? glob('questions/*.txt') : ["questions/$category.txt"];

$questions = [];
foreach ($questionFiles as $file) {
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $questions[] = explode(',', $line);
    }
}

shuffle($questions);
$_SESSION['questions'] = array_slice($questions, 0, 10);
$_SESSION['score'] = 0;
$_SESSION['current'] = 0;

header("Location: question.php");
exit;
?>
