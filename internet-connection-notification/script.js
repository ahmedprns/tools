const wrapper = document.querySelector(".wrapper"),
toast = wrapper.querySelector(".toast"),
title = toast.querySelector("span"),
subTitle = toast.querySelector("p"),
wifiIcon = toast.querySelector(".icon"),
closeIcon = toast.querySelector(".close-icon");

// Function to handle the online state
function showOnlineStatus() {
wrapper.classList.remove("hide");
toast.classList.remove("offline"); // Remove the 'offline' class when online
toast.classList.add("online");
title.innerText = "You're online now";
subTitle.innerText = "Internet is connected.";
wifiIcon.innerHTML = '<i class="uil uil-wifi"></i>';

// Automatically hide the toast after 5 seconds
setTimeout(() => {
    wrapper.classList.add("hide");
}, 5000);
}

// Function to handle the offline state
function showOfflineStatus() {
wrapper.classList.remove("hide");
toast.classList.remove("online"); // Remove the 'online' class when offline
toast.classList.add("offline");
title.innerText = "You're offline now";
subTitle.innerText = "Internet is disconnected.";
wifiIcon.innerHTML = '<i class="uil uil-wifi-slash"></i>';

// Automatically hide the toast after 5 seconds
setTimeout(() => {
    wrapper.classList.add("hide");
}, 5000);
}

// Event listener for the "online" event
window.addEventListener("online", () => {
showOnlineStatus();
});

// Event listener for the "offline" event
window.addEventListener("offline", () => {
showOfflineStatus();
});

// Initial check when the page loads
if (!navigator.onLine) {
showOfflineStatus();
} else {
showOnlineStatus();
}

// Close button functionality
closeIcon.onclick = () => {
wrapper.classList.add("hide");
};