// Initialize count and round 
let count = parseInt(localStorage.getItem('count')) || 0;
let round = parseInt(localStorage.getItem('round')) || 0;
let audio = document.getElementById('audio');
let countDisplay = document.getElementById('count-display');
let roundDisplay = document.getElementById('round-display');
let circleText = document.querySelector('.circle-text');
let popup108 = document.getElementById('popup-108');
let popupCountReset = document.getElementById('popup-count-reset');
let popupRoundReset = document.getElementById('popup-round-reset');
let confirmReset108Btn = document.getElementById('confirm-reset-108');
let cancelReset108Btn = document.getElementById('cancel-reset-108');
let confirmResetCountBtn = document.getElementById('confirm-reset-count');
let cancelResetCountBtn = document.getElementById('cancel-reset-count');
let confirmResetRoundBtn = document.getElementById('confirm-reset-round');
let cancelResetRoundBtn = document.getElementById('cancel-reset-round');
let resetCountBtn = document.getElementById('reset-count-btn');
let resetRoundBtn = document.getElementById('reset-round-btn');
let muteBtn = document.getElementById('mute-btn');
let unmuteBtn = document.getElementById('unmute-btn');
let isMuted = false;
let totalLetters = 108;
let radius = 120; // Initial radius of the outermost circle
let maxRadius = 180; // Maximum radius for the innermost circle

// Function to update the displayed count
function updateCountDisplay() {
countDisplay.textContent = count;
}

// Function to update the displayed round
function updateRoundDisplay() {
roundDisplay.textContent = `Round: ${round}`;
}

// Function to update the circle text based on the count
function updateCircleText() {
const letters = 'HAREKRISHNA'.repeat(9).split('');
const circleDivisions = [33, 36, 39]; // Increased letters per circle for tighter spacing
const radiusIncrement = 30; // Reduced increment radius for closer circles
const initialRadius = 100; // Starting radius
let letterIndex = 0; // Index to track which letter to display

// Clear existing letters
circleText.innerHTML = '';

// Loop through each circle
circleDivisions.forEach((lettersInCircle, circleIndex) => {
const currentRadius = initialRadius + circleIndex * radiusIncrement; // Calculate radius for this circle
const angleStep = 360 / lettersInCircle; // Angle step for this circle

// Loop through the letters for this circle
for (let i = 0; i < lettersInCircle; i++) {
const angle = angleStep * i; // Calculate angle for each letter
const x = Math.cos((angle * Math.PI) / 180) * currentRadius;
const y = Math.sin((angle * Math.PI) / 180) * currentRadius;

const letter = document.createElement('span');
letter.className = 'letter';
letter.textContent = letters[letterIndex % letters.length]; // Set letter text
letter.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

// Highlight the letters based on count
letter.style.color = letterIndex < count ? 'white' : 'grey';

circleText.appendChild(letter);
letterIndex++; // Move to the next letter
}
});
}

// Function to save count and round data in localStorage
function saveData() {
localStorage.setItem('count', count);
localStorage.setItem('round', round);
}

// Function to update the counter
function updateCounter() {
if (count < totalLetters) {
count++;
updateCountDisplay();
updateCircleText();
saveData();
if (count === totalLetters) {
round++;
updateRoundDisplay();
popup108.style.display = 'block';
audio.play();
}
} else {
showResetPopup(); // Function to show reset popup if 108 is reached
}
}

// Show the reset confirmation popup
function showResetPopup() {
popup108.style.display = 'block'; // Show the popup
}

// Event listener for the main count button
document.getElementById('count-btn').addEventListener('click', updateCounter);

// Event listeners for the 108-count popup
confirmReset108Btn.addEventListener('click', () => {
count = 0;
updateCountDisplay();
updateCircleText();
popup108.style.display = 'none';
saveData();
});

cancelReset108Btn.addEventListener('click', () => {
popup108.style.display = 'none';
});

// Event listeners for the count reset button
resetCountBtn.addEventListener('click', () => {
popupCountReset.style.display = 'block';
});

confirmResetCountBtn.addEventListener('click', () => {
count = 0;
updateCountDisplay();
updateCircleText();
popupCountReset.style.display = 'none';
saveData();
});

cancelResetCountBtn.addEventListener('click', () => {
popupCountReset.style.display = 'none';
});
// Event listeners for the round reset button
resetRoundBtn.addEventListener('click', () => {
popupRoundReset.style.display = 'block';
});

confirmResetRoundBtn.addEventListener('click', () => {
round = 0;
updateRoundDisplay();
popupRoundReset.style.display = 'none';
saveData();
});

cancelResetRoundBtn.addEventListener('click', () => {
popupRoundReset.style.display = 'none';
});

// Event listeners for mute and unmute buttons
muteBtn.addEventListener('click', () => {
isMuted = true;
audio.muted = true;
muteBtn.style.display = 'none';
unmuteBtn.style.display = 'inline-block';
localStorage.setItem('isMuted', JSON.stringify(isMuted));
});

unmuteBtn.addEventListener('click', () => {
isMuted = false;
audio.muted = false;
muteBtn.style.display = 'inline-block';
unmuteBtn.style.display = 'none';
localStorage.setItem('isMuted', JSON.stringify(isMuted));
});

// Initial setup
updateCountDisplay();
updateRoundDisplay();
updateCircleText();

// Load mute state from localStorage
isMuted = JSON.parse(localStorage.getItem('isMuted')) || false;
audio.muted = isMuted;
muteBtn.style.display = isMuted ? 'none' : 'inline-block';
unmuteBtn.style.display = isMuted ? 'inline-block' : 'none';

// Create a date object for the current time in IST (Indian Standard Time)
const dateInIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));

// Get the current year in IST
const currentYear = dateInIST.getFullYear();

// Set the year in the footer
document.getElementById('current-year').textContent = currentYear;

// Function to show an image change menu
function showImageChangeMenu(event) {
event.preventDefault(); // Prevent the default action (context menu)

// Create the menu with options
const menu = document.createElement('div');
menu.classList.add('image-change-menu');
menu.innerHTML = `
       <p>Change Image</p>
       <input type="file" id="image-upload" accept="image/*">
       <button id="close-menu">Close</button>
   `;

// Append the menu to the body
document.body.appendChild(menu);

// Position the menu at the event's location
menu.style.left = `${event.pageX}px`;
menu.style.top = `${event.pageY}px`;

// Handle image file selection
document.getElementById('image-upload').addEventListener('change', (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = function (event) {
                const imageUrl = event.target.result;
                // Set the uploaded image as the new round image
                document.getElementById('round-image').src = imageUrl;
};
reader.readAsDataURL(file);
}
});

// Close menu
document.getElementById('close-menu').addEventListener('click', () => {
document.body.removeChild(menu);
});
}

// Event listener for right-click on round image for desktop
document.getElementById('round-image').addEventListener('contextmenu', showImageChangeMenu);

// Event listener for long press on round image for mobile
document.getElementById('round-image').addEventListener('touchstart', (e) => {
e.preventDefault();
showImageChangeMenu(e);
});

// References to the buttons and elements
const changeImageBtn = document.getElementById('change-image-btn');
const imageChangeMenu = document.getElementById('image-change-menu');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const saveImageBtn = document.getElementById('save-image-btn');
const resetImageBtn = document.getElementById('reset-image-btn');
const closeImageMenuBtn = document.getElementById('close-image-menu');

// Show the image change menu
changeImageBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'block'; // Show the menu
});

// Close the image change menu
closeImageMenuBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'none'; // Hide the menu
});

// Image upload handling
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result; // Display the selected image
            imagePreview.style.display = 'block'; // Show preview
        };
        reader.readAsDataURL(file);
    }
});

// Save the image
saveImageBtn.addEventListener('click', () => {
    const newImageSrc = imagePreview.src;
    if (newImageSrc) {
        localStorage.setItem('selectedImage', newImageSrc); // Save the image source to localStorage
        document.querySelector('.round-image').src = newImageSrc; // Update the round image in the UI
        imageChangeMenu.style.display = 'none'; // Close the menu
    }
});

// Reset the image to the default one
resetImageBtn.addEventListener('click', () => {
    localStorage.removeItem('selectedImage'); // Remove saved image from localStorage
    document.querySelector('.round-image').src = 'rkhkmc.png'; // Reset to the default image
    imagePreview.src = ''; // Clear preview
    imagePreview.style.display = 'none'; // Hide preview
});

// Check if there's a saved image in localStorage
window.onload = function() {
const savedImage = localStorage.getItem('selectedImage');
if (savedImage) {
        document.querySelector('.round-image').src = savedImage; // Set the saved image
}
};

// Image change on right-click or long press
function showImageChangeMenu(event) {
    event.preventDefault();
    const menu = document.getElementById('image-change-menu');
    menu.style.display = 'block';
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
}

// Check if the popup has been shown before
if (!localStorage.getItem('popupShown')) {
    // Show the popup if not shown before
    document.getElementById('popupnotify').style.display = 'flex';

    // Event listener to close the popup
    document.getElementById('close-popupnotify').addEventListener('click', function () {
        document.getElementById('popupnotify').style.display = 'none';
        localStorage.setItem('popupShown', 'true'); // Mark as shown
    });
}

const chantMessages = [
  "Your mantra awaits! Chant today and feel the peace unfold.",
  "Start your day with a chant to elevate your spirit and energy.",
  "Take a moment to chant and let the calmness fill your soul.",
  "Chanting today keeps the stress away—your peaceful self is calling!",
  "Set the tone for today: chant and align with your higher self.",
  "A chant a day keeps negativity at bay—let’s begin!",
  "Elevate your mind, body, and soul with today's chant.",
  "Chant today, stay grounded, and let your intentions soar.",
  "Your chant is the key to unlocking a peaceful mind today!",
  "Let the power of your chant guide you through the day!",
  "Chanting is a gift to yourself—take a moment now!",
  "Make today’s chant your moment of calm amid the chaos.",
  "Your peaceful state is just a chant away—don’t miss it!",
  "Let your inner peace shine through today with a chant.",
  "The rhythm of your chant is the heartbeat of your spirit!",
  "Chant today and align with your true, peaceful self.",
  "A peaceful mind begins with a chant—take a deep breath!",
  "Empower your day with the magic of a chant!",
  "Chant now and set your soul free for the day ahead.",
  "Let your chant be your morning meditation—stay centered.",
  "Chanting today is an act of self-love and peace.",
  "Start your day with a chant and invite calmness into your life.",
  "Your chant is waiting—don’t let the day slip by without it!",
  "Turn up your inner peace—chant now and feel the shift!",
  "Just one chant, and you’re ready to conquer the day with calmness.",
  "Breathe in, chant out, and watch your energy transform.",
  "Let your mantra be your guide today—chant and feel the flow.",
  "Step into serenity today—chant to reset your mind.",
  "A powerful day begins with a powerful chant!",
  "Pause, chant, and experience the magic within—today’s the day!"
];

function showNotification() {
  if (Notification.permission === "granted") {
    const currentMessage = chantMessages[new Date().getDate() % chantMessages.length];
    new Notification("Daily Chant Reminder", {
      body: currentMessage,
      icon: "/rkhkmclogo.jpg"
    });
  } else {
    console.log("Notification permission not granted.");
  }
}

function requestNotificationPermission() {
  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission !== "granted") {
        alert("Please allow notifications to receive daily chants!");
      }
    });
  }
}

function saveSettings() {
  const enableNotifications = document.getElementById("enableNotifications").checked;
  const notificationTime = document.getElementById("notificationTime").value;
  localStorage.setItem("enableNotifications", enableNotifications);
  localStorage.setItem("notificationTime", notificationTime);
  document.getElementById("popupSettings").style.display = "none";
  if (enableNotifications) {
    scheduleNotification(notificationTime);
  }
}

function loadSettings() {
  const enableNotifications = localStorage.getItem("enableNotifications") === "true";
  const notificationTime = localStorage.getItem("notificationTime") || "08:00";
  document.getElementById("enableNotifications").checked = enableNotifications;
  document.getElementById("notificationTime").value = notificationTime;
  if (enableNotifications) {
    scheduleNotification(notificationTime);
  }
}

function scheduleNotification(time) {
  const [hours, minutes] = time.split(":");
  const now = new Date();
  const notificationTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }
  const delay = notificationTime - now;
  setTimeout(() => {
    if (localStorage.getItem("enableNotifications") === "true") {
      showNotification();
    }
    scheduleNotification(time);
  }, delay);
}

document.getElementById("notificationButton").addEventListener("click", () => {
  const popup = document.getElementById("popupSettings");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
});

window.onload = () => {
  requestNotificationPermission();
  loadSettings();
};
