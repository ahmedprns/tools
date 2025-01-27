<?php
$scores = file('scores.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$results = [];

foreach ($scores as $line) {
    [$name, $score] = explode(',', $line);
    $results[] = ['name' => $name, 'score' => (int) $score];
}

usort($results, fn($a, $b) => $b['score'] <=> $a['score']);
$topScores = array_slice($results, 0, 20);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>أفضل النتائج</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <h1>أفضل 20 نتائج</h1>
    <ol>
        <?php foreach ($topScores as $result): ?>
            <li><p style="text-align: right;padding-right: 20px;"><?= $result['name'] ?> &nbsp; ( النتيجة:<?= $result['score'] ?> )</p></li>
        <?php endforeach; ?>
    </ol>
    <a href="index.php">ابدأ لعبة جديدة</a>
</body>
</html>
