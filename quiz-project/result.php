<?php
session_start();

$score = $_SESSION['score'];
$total = count($_SESSION['questions']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars($_POST['name']);
    file_put_contents('scores.txt', "$name,$score\n", FILE_APPEND);
    header("Location: leaderboard.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>النتيجة</title>
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <h1>لقد أتممت الاختبار!</h1>
    <p>نتيجتك: <?= $score ?> / <?= $total ?></p>
    <form method="POST">
        <input type="text" name="name" placeholder="ادخل اسمك" required>
        <button type="submit">حفظ النتيجة</button>
    </form>
</body>
</html>
