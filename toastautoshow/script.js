function closeToast() {
  const toast = document.getElementById("customToast");
  toast.classList.remove("show");
}

function showToast() {
  const toast = document.getElementById("customToast");
  toast.classList.add("show");
}

window.onload = () => {
  showToast();
  setTimeout(() => {
    closeToast();
  }, 120000); // 2 دقائق بالمللي ثانية
};