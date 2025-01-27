<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>نافذة منبثقة مع هيدر قابل للسحب و X للإغلاق</title>
    <style>
        /* تصميم النافذة المنبثقة */
        .popup {
            display: none; /* مخفي في البداية */
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ddd;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 0;
            z-index: 1000;
            cursor: move; /* لإظهار أن النافذة قابلة للسحب */
        }

        /* خلفية مظلمة للصفحة عند فتح النافذة */
        .overlay {
            display: none; /* مخفي في البداية */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }

        /* تصميم الهيدر */
        .popup-header {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            text-align: center;
            cursor: move; /* جعل الهيدر قابل للسحب */
            position: relative; /* لضبط الزر داخل الهيدر */
        }

        /* زر إغلاق (X) */
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>

    <!-- الزر الذي يفتح النافذة مع تحديد الطول والعرض -->
    <button onclick="showPopup(300, 410, 'الفورم')">فتح النافذة (عرض: 300px، ارتفاع: 410px)</button>
 

    <!-- خلفية مظلمة للصفحة -->
    <div id="overlay" class="overlay" onclick="closePopup()"></div>

    <!-- النافذة المنبثقة -->
    <div id="popup" class="popup">
        <div class="popup-header" id="popupHeader">
            <span class="close-btn" onclick="closePopup()">X</span>
            <span id="popupTitle">نافذة منبثقة</span>
        </div>
        <iframe src="calc.php" frameborder="0"></iframe>
    </div>

    <script>
        // دالة لعرض النافذة المنبثقة مع التحكم في الحجم وإضافة اسم الفورم
        function showPopup(width, height, formName) {
            let popup = document.getElementById("popup");
            popup.style.display = "block";
            popup.style.width = width + "px";  // تحديد العرض
            popup.style.height = height + "px"; // تحديد الارتفاع
            document.getElementById("overlay").style.display = "block";

            // تعيين اسم الفورم في الهيدر
            document.getElementById("popupTitle").innerText = formName;
        }

        // دالة لإغلاق النافذة المنبثقة
        function closePopup() {
            document.getElementById("popup").style.display = "none";
            document.getElementById("overlay").style.display = "none";
        }

        // وظيفة سحب النافذة
        let popup = document.getElementById("popup");
        let popupHeader = document.getElementById("popupHeader");
        let isDragging = false;
        let offsetX, offsetY;

        popupHeader.addEventListener('mousedown', (e) => {
            isDragging = true;

            // حفظ الإحداثيات الأولية بالنسبة لموضع النافذة مع أخذ نصف العرض والطول في الاعتبار
            let rect = popup.getBoundingClientRect();
            offsetX = e.clientX - rect.left - (rect.width / 2);
            offsetY = e.clientY - rect.top - (rect.height / 2);

            // تحديد بداية التحريك
            document.addEventListener('mousemove', dragPopup);
            document.addEventListener('mouseup', stopDragging);
        });

        function dragPopup(e) {
            if (isDragging) {
                // تحديد موضع النافذة خلال السحب
                popup.style.left = (e.clientX - offsetX) + 'px';
                popup.style.top = (e.clientY - offsetY) + 'px';
            }
        }

        function stopDragging() {
            isDragging = false;
            document.removeEventListener('mousemove', dragPopup);
            document.removeEventListener('mouseup', stopDragging);
        }
    </script>

</body>
</html>
