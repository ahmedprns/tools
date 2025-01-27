function showToast(title, message, link, duration = 5000, canShow = true) {
    if (!canShow) return;
  
    const toast = document.getElementById("customToast");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");
    const toastLink = document.getElementById("toastLink");
  
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastLink.href = link;
  
    toast.classList.add("show");
  
    // Hide the toast after the specified duration
    setTimeout(() => {
      closeToast();
    }, duration);
  }
  
  function closeToast() {
    const toast = document.getElementById("customToast");
    toast.classList.remove("show");
  }
  
  // Example usage: Function to trigger the toast
  function triggerToast() {
    showToast(
      "عنوان التوست",
      "هذه هي الرسالة الخاصة بالتوست",
      "https://example.com",
      5000, // المدة بالمللي ثانية (5 ثوانٍ)
      true // إذا كان التوست مفعلًا أم لا
    );
  }
  