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
            if (letterIndex < count) {
                letter.style.color = 'white'; // Highlighted color
            } else {
                letter.style.color = 'grey'; // Default color
            }

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
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;

    // Close menu when clicking the close button
    document.getElementById('close-menu').addEventListener('click', () => {
        document.body.removeChild(menu);
    });

    // Handle the file input to change the image
    document.getElementById('image-upload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.round-image').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        document.body.removeChild(menu); // Close the menu after selecting an image
    });
}

// Event listener for right-click on desktop
document.querySelector('.round-image').addEventListener('contextmenu', showImageChangeMenu);

// For long click on mobile (touchstart and touchend)
let touchStartTime;
const roundImage = document.querySelector('.round-image');

roundImage.addEventListener('touchstart', function(e) {
    touchStartTime = Date.now();
});

roundImage.addEventListener('touchend', function(e) {
    const touchEndTime = Date.now();
    if (touchEndTime - touchStartTime > 500) { // If touch lasts longer than 500ms
        showImageChangeMenu(e);
    }
});

// Select the image and popup elements
const image = document.getElementById('circle-image');
const popupImageClick = document.getElementById('popup-image-click');
const closePopupImage = document.getElementById('close-popup-image');

// Show the popup when the image is clicked
image.addEventListener('click', () => {
    popupImageClick.style.display = 'block';
});

// Close the popup when the close button is clicked
closePopupImage.addEventListener('click', () => {
    popupImageClick.style.display = 'none';
});

