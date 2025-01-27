const currentTimeDisplay = document.getElementById('currentTime');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const snoozeBtn = document.getElementById('snoozeBtn');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');
const alarmMessage = document.getElementById('alarmMessage');
const alarmActions = document.getElementById('alarmActions');

let alarmTime = null;

// Update the current time every second
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    // Check if current time matches the alarm time
    if (alarmTime && currentTimeDisplay.textContent === alarmTime) {
        triggerAlarm();
    }
}

function triggerAlarm() {
    alarmMessage.textContent = "Alarm Ringing!";
    alarmMessage.classList.remove('hidden');
    alarmActions.classList.remove('hidden');
}

function setAlarm() {
    const alarmInput = document.getElementById('alarmTime').value;
    if (alarmInput) {
        alarmTime = alarmInput + ':00'; // Add seconds to match the current time format
        alarmMessage.textContent = `Alarm set for ${alarmTime}`;
        alarmMessage.classList.remove('hidden');
    }
}

function snoozeAlarm() {
    alarmMessage.textContent = "Snoozed for 5 minutes";
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    alarmTime = `${hours}:${minutes}:00`; // Reset alarm time 5 minutes later
    alarmActions.classList.add('hidden');
}

function stopAlarm() {
    alarmMessage.classList.add('hidden');
    alarmActions.classList.add('hidden');
    alarmTime = null; // Reset the alarm time
}

setAlarmBtn.addEventListener('click', setAlarm);
snoozeBtn.addEventListener('click', snoozeAlarm);
stopAlarmBtn.addEventListener('click', stopAlarm);

setInterval(updateTime, 1000); // Update the current time every second