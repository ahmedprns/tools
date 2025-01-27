<?php
session_start();

// التحقق إذا كانت اللعبة قد بدأت حديثًا
if (!isset($_SESSION['started'])) {
    $_SESSION['started'] = true;
    $_SESSION['current'] = 0;
    $_SESSION['score'] = 0;
    $_SESSION['answered'] = [];
    $_SESSION['feedback'] = [];
}

// جلب السؤال الحالي
$current = $_SESSION['current'];
$totalQuestions = count($_SESSION['questions']);
$question = $_SESSION['questions'][$current];
$answered = $_SESSION['answered'][$current] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'answer') {
        // تسجيل الإجابة
        $answer = (int) $_POST['answer'];
        $correctAnswer = (int) $_SESSION['questions'][$current][5];
        $isCorrect = ($answer === $correctAnswer);

        $_SESSION['answered'][$current] = $answer;
        $_SESSION['feedback'][$current] = [
            'isCorrect' => $isCorrect,
            'correctAnswerText' => $_SESSION['questions'][$current][$correctAnswer]
        ];

        if ($isCorrect) {
            $_SESSION['score']++;
        }

        echo json_encode($_SESSION['feedback'][$current]);
        exit;
    }

    if (isset($_POST['action']) && $_POST['action'] === 'next') {
        $_SESSION['current']++;
        if ($_SESSION['current'] >= $totalQuestions) {
            echo json_encode(['redirect' => 'result.php']);
            exit;
        }
        echo json_encode(['redirect' => 'question.php']);
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار المعرفة</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <script>
        // إرسال الإجابة
        function submitAnswer(answer) {
            const formData = new FormData();
            formData.append('action', 'answer');
            formData.append('answer', answer);

            fetch('question.php', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    const feedbackDiv = document.querySelector('.feedback');
                    feedbackDiv.innerHTML = data.isCorrect
                        ? '<p>إجابة صحيحة!</p>'
                        : `<p>إجابة خاطئة! الإجابة الصحيحة هي: ${data.correctAnswerText}</p>`;
                    feedbackDiv.classList.remove('hidden');

                    document.querySelectorAll('.answer-button').forEach(button => button.disabled = true);
                    document.querySelector('.next-button').classList.remove('hidden');
                });
        }

        // الانتقال للسؤال التالي
        function goToNextQuestion() {
            const formData = new FormData();
            formData.append('action', 'next');

            fetch('question.php', {
                method: 'POST',
                body: formData,
            })
                .then(response => response.json())
                .then(data => {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    }
                });
        }

        // إعادة تهيئة الأزرار عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.answer-button').forEach(button => button.disabled = false);
            document.querySelector('.next-button').classList.add('hidden');
            document.querySelector('.feedback').classList.add('hidden');
        });
    </script>
</head>
<body>
    <div class="container">
        <h1>السؤال <?= $current + 1 ?> من <?= $totalQuestions ?></h1>
        <p><?= $question[0] ?></p>

        <!-- أزرار الإجابة -->
        <?php for ($i = 1; $i <= 4; $i++): ?>
            <button
                type="button"
                class="answer-button"
                onclick="submitAnswer(<?= $i ?>)">
                <?= $question[$i] ?>
            </button><br>
        <?php endfor; ?>

        <!-- التغذية الراجعة -->
        <div class="feedback hidden"></div>

        <!-- زر "السؤال التالي" -->
        <button type="button" class="next-button hidden" onclick="goToNextQuestion()">السؤال التالي</button>
    </div>
</body>
</html>
