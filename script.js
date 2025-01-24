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
