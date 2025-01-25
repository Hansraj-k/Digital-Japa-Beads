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
    const letters = 'HAREKRISHNA'.repeat(9).split(''); // Example text repeated to cover enough letters
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
            letter.style.color = letterIndex < count ? 'white' : 'grey'; // Default color

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
        showResetPopup(); // Show reset popup if 108 is reached
    }
}

// Show the reset confirmation popup
function showResetPopup() {
    popup108.style.display = 'block'; // Show the popup
}

// Event listeners for the main count button
document.getElementById('count-btn').addEventListener('click', updateCounter);

// Event listeners for the reset popups (Count, Round, and 108)
const resetPopupElements = [
    { btn: 'reset-count-btn', popup: popupCountReset, confirmBtn: 'confirm-reset-count', cancelBtn: 'cancel-reset-count', resetFunc: resetCount },
    { btn: 'reset-round-btn', popup: popupRoundReset, confirmBtn: 'confirm-reset-round', cancelBtn: 'cancel-reset-round', resetFunc: resetRound },
    { btn: 'confirm-reset-108', popup: popup108, resetFunc: reset108 }
];

resetPopupElements.forEach(({ btn, popup, confirmBtn, cancelBtn, resetFunc }) => {
    document.getElementById(btn).addEventListener('click', () => {
        popup.style.display = 'block';
    });

    document.getElementById(confirmBtn).addEventListener('click', () => {
        resetFunc();
        popup.style.display = 'none';
        saveData();
    });

    document.getElementById(cancelBtn).addEventListener('click', () => {
        popup.style.display = 'none';
    });
});

// Reset functions for count, round, and 108
function resetCount() {
    count = 0;
    updateCountDisplay();
    updateCircleText();
}

function resetRound() {
    round = 0;
    updateRoundDisplay();
}

function reset108() {
    count = 0;
    updateCountDisplay();
    updateCircleText();
    popup108.style.display = 'none';
}

// Event listeners for mute and unmute buttons
muteBtn.addEventListener('click', () => {
    toggleMute(true);
});

unmuteBtn.addEventListener('click', () => {
    toggleMute(false);
});

function toggleMute(mute) {
    isMuted = mute;
    audio.muted = mute;
    muteBtn.style.display = mute ? 'none' : 'inline-block';
    unmuteBtn.style.display = mute ? 'inline-block' : 'none';
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
}

// Initial setup
updateCountDisplay();
updateRoundDisplay();
updateCircleText();

// Load mute state from localStorage
isMuted = JSON.parse(localStorage.getItem('isMuted')) || false;
audio.muted = isMuted;
muteBtn.style.display = isMuted ? 'none' : 'inline-block';
unmuteBtn.style.display = isMuted ? 'inline-block' : 'none';

// Set current year in footer
const dateInIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
const currentYear = dateInIST.getFullYear();
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
                document.getElementById('round-image').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
        document.body.removeChild(menu); // Close the menu after selecting an image
    });

    // Close menu
    document.getElementById('close-menu').addEventListener('click', () => {
        document.body.removeChild(menu);
    });
}

// Event listener for right-click to show image change menu
document.addEventListener('contextmenu', showImageChangeMenu);

// Handle image upload and save
const changeImageBtn = document.getElementById('change-image-btn');
const imageChangeMenu = document.getElementById('image-change-menu');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const saveImageBtn = document.getElementById('save-image-btn');
const resetImageBtn = document.getElementById('reset-image-btn');
const closeImageMenuBtn = document.getElementById('close-image-menu');

changeImageBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'block'; // Show the menu
});

closeImageMenuBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'none'; // Hide the menu
});

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

saveImageBtn.addEventListener('click', () => {
    const newImageSrc = imagePreview.src;
    if (newImageSrc) {
        localStorage.setItem('selectedImage', newImageSrc); // Save the image source to localStorage
        document.querySelector('.round-image').src = newImageSrc; // Update the round image in the UI
        imageChangeMenu.style.display = 'none'; // Close the menu
    }
});

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
