<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Custom Toast</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <?php
    // قيمة المتغير الذي يحدد إذا كان التوست يظهر أو لا
    $showToast = true;

    // بيانات التوست
    $toastTitle = "التطبيق الاسبوعي";
    $toastMessage = "تم رفع التطبيق الثامن للصفوف الثالث والرابع والخامس والسادس الابتدائى والتطبيق التاسع للصفوف الأول والثانى رياض أطفال والأول والثانى الابتدائى على الصفحة الشخصية للتلميذ";
    $toastLink = "https://example.com";

    // وظيفة لطباعة التوست إذا كان $showToast = true
    function displayToast($title, $message, $link, $show) {
      if ($show) {
        echo "<div id='customToast' class='toast'>
                <div class='toast-header'>
                  <span id='toastTitle'>$title</span>
                  <button class='close-toast' onclick='closeToast()'>×</button>
                </div>
                <div class='toast-body'>
                  <span id='toastMessage'>$message</span>
                  <p style='margin-bottom: 0;margin-top: 10px;'>
                  <a href='$link' id='toastLink' target='_blank'>عرض التفاصيل</a></p>
                </div>
              </div>";
      }
    }

    // استدعاء الوظيفة لطباعة التوست
    displayToast($toastTitle, $toastMessage, $toastLink, $showToast);
  ?>
  <script src="script.js"></script>
</body>
</html>
