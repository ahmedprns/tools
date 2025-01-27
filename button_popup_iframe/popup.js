// إضافة الـ CSS الخاص بالنافذة المنبثقة

const style = document.createElement('style');
let zIndexCounter = 10000;
style.innerHTML = `
    /* تصميم النافذة المنبثقة */
    .popup {
        display: block;
        position: fixed;
        background-color: white;
        border: 1px solid #ddd;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        padding: 0;
        z-index: 1000;
        cursor: move;
    }

    /* تصميم الهيدر */
    .popup-header {
        background-color: #4CAF50;
        color: white;
        padding: 10px;
        text-align: center;
        cursor: move;
        position: relative;
        user-select: none;  /* منع اختيار النص في الهيدر */
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

    /* الكلاس المخصص للتحريك */
    .draggable {
        cursor: move !important;
    }
`;
document.head.appendChild(style);

// دالة لعرض النافذة المنبثقة مع التحكم في الحجم وإضافة اسم الفورم ورابط الصفحة
function showPopup(width, height, formName, pageUrl) {
    let popupId = "popup" + new Date().getTime();  // تعيين معرف فريد للنافذة الجديدة باستخدام الوقت
    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.id = popupId;

    let popupHeader = document.createElement("div");
    popupHeader.classList.add("popup-header");
    popupHeader.id = "popupHeader" + popupId;

    let closeBtn = document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = "X";
    closeBtn.onclick = () => closePopup(popupId);

    let popupTitle = document.createElement("span");
    popupTitle.id = "popupTitle";
    popupTitle.innerText = formName;

    let iframe = document.createElement("iframe");
    iframe.id = "popupIframe";
    iframe.src = pageUrl;

    // إضافة المحتوى إلى الهيدر
    popupHeader.appendChild(closeBtn);
    popupHeader.appendChild(popupTitle);

    // إضافة كل العناصر إلى النافذة المنبثقة
    popup.appendChild(popupHeader);
    popup.appendChild(iframe);

    // إضافة الـ popup إلى الـ body
    document.body.appendChild(popup);

    // التحكم في الحجم
    popup.style.width = width + "px";
    popup.style.height = height + "px";
    popup.style.zIndex = zIndexCounter++;
    // إظهار الـ popup
    popup.style.display = "block";

    // جعل النافذة قابلة للسحب
    makeDraggable(popup, popupHeader, popupId);
}

// دالة لإغلاق النافذة المنبثقة
function closePopup(popupId) {
    let popup = document.getElementById(popupId);
    if (popup) popup.style.display = "none";

    // إزالة العناصر من DOM بعد الإغلاق
    popup && popup.remove();
}

// وظيفة سحب النافذة
let isDragging = false;
let offsetX, offsetY;

// دالة لجعل النافذة قابلة للسحب
function makeDraggable(popup, header, popupId) {
    header.addEventListener('mousedown', (e) => {
        isDragging = true;

        // رفع الـ z-index للنافذة التي يتم تحريكها
        
        popup.style.zIndex = zIndexCounter++;
        // إضافة الكلاس "draggable" للنافذة التي نقوم بتحريكها
        popup.classList.add('draggable');

        let rect = popup.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // منع التأثير على النوافذ الأخرى أثناء التحريك
        document.addEventListener('mousemove', (e) => dragPopup(e, popupId));
        document.addEventListener('mouseup', () => stopDragging(popup, popupId));
    });
}

// دالة لتحريك النافذة
function dragPopup(e, popupId) {
    let popup = document.getElementById(popupId);
    if (isDragging && popup && popup.classList.contains('draggable')) {
        popup.style.left = (e.clientX - offsetX) + 'px';
        popup.style.top = (e.clientY - offsetY) + 'px';
    }
}

// دالة لإيقاف التحريك
function stopDragging(popup, popupId) {
    isDragging = false;

    // إعادة الـ z-index للنافذة إلى القيمة الافتراضية
    // popup.style.zIndex = 1000;

    // إزالة الكلاس "draggable" بعد الانتهاء من التحريك
    popup.classList.remove('draggable');

    document.removeEventListener('mousemove', dragPopup);
    document.removeEventListener('mouseup', () => stopDragging(popup, popupId));
}

// إضافة الحدث عند الضغط على الأزرار لفتح النوافذ المنبثقة
document.querySelectorAll('.popup-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const formName = button.getAttribute('data-form-name');
        const pageUrl = button.getAttribute('data-page-url');
        const width = button.getAttribute('data-width') || 300;
        const height = button.getAttribute('data-height') || 410;
        showPopup(width, height, formName, pageUrl);  // فتح النافذة مع تخصيص الحجم
    });
});
