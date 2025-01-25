// Initialize count, round, and audio
let count = parseInt(localStorage.getItem('count')) || 0;
let round = parseInt(localStorage.getItem('round')) || 0;
let audio = document.getElementById('audio');
let isMuted = JSON.parse(localStorage.getItem('isMuted')) || false;

// Elements for displaying count, round, and circle text
let countDisplay = document.getElementById('count-display');
let roundDisplay = document.getElementById('round-display');
let circleText = document.querySelector('.circle-text');
let popup108 = document.getElementById('popup-108');

// Reset Popup Elements
let popupCountReset = document.getElementById('popup-count-reset');
let popupRoundReset = document.getElementById('popup-round-reset');

// Reset buttons
let resetCountBtn = document.getElementById('reset-count-btn');
let resetRoundBtn = document.getElementById('reset-round-btn');
let confirmResetCountBtn = document.getElementById('confirm-reset-count');
let confirmResetRoundBtn = document.getElementById('confirm-reset-round');
let cancelResetCountBtn = document.getElementById('cancel-reset-count');
let cancelResetRoundBtn = document.getElementById('cancel-reset-round');

// Mute buttons
let muteBtn = document.getElementById('mute-btn');
let unmuteBtn = document.getElementById('unmute-btn');

// Constants
const totalLetters = 108;
const radiusIncrement = 30;
const initialRadius = 100;
const circleDivisions = [33, 36, 39]; // Divisions for circle
const letters = 'HAREKRISHNA'.repeat(9).split(''); // Text for circle

// Functions to update the display
function updateCountDisplay() {
    countDisplay.textContent = count;
}

function updateRoundDisplay() {
    roundDisplay.textContent = `Round: ${round}`;
}

function updateCircleText() {
    let letterIndex = 0;
    circleText.innerHTML = '';
    circleDivisions.forEach((lettersInCircle, circleIndex) => {
        const currentRadius = initialRadius + circleIndex * radiusIncrement;
        const angleStep = 360 / lettersInCircle;

        for (let i = 0; i < lettersInCircle; i++) {
            const angle = angleStep * i;
            const x = Math.cos((angle * Math.PI) / 180) * currentRadius;
            const y = Math.sin((angle * Math.PI) / 180) * currentRadius;
            const letter = document.createElement('span');
            letter.className = 'letter';
            letter.textContent = letters[letterIndex % letters.length];
            letter.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;
            letter.style.color = letterIndex < count ? 'white' : 'grey';
            circleText.appendChild(letter);
            letterIndex++;
        }
    });
}

function saveData() {
    localStorage.setItem('count', count);
    localStorage.setItem('round', round);
}

// Update counter logic
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
        showResetPopup();
    }
}

// Show reset popup
function showResetPopup() {
    popup108.style.display = 'block';
}

// Reset events
confirmResetCountBtn.addEventListener('click', () => {
    count = 0;
    updateCountDisplay();
    updateCircleText();
    popupCountReset.style.display = 'none';
    saveData();
});

confirmResetRoundBtn.addEventListener('click', () => {
    round = 0;
    updateRoundDisplay();
    popupRoundReset.style.display = 'none';
    saveData();
});

cancelResetCountBtn.addEventListener('click', () => {
    popupCountReset.style.display = 'none';
});

cancelResetRoundBtn.addEventListener('click', () => {
    popupRoundReset.style.display = 'none';
});

// Mute/unmute events
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

// Image change menu logic
function showImageChangeMenu(event) {
    event.preventDefault();
    const menu = document.createElement('div');
    menu.classList.add('image-change-menu');
    menu.innerHTML = `
        <p>Change Image</p>
        <input type="file" id="image-upload" accept="image/*">
        <button id="close-menu">Close</button>
    `;
    document.body.appendChild(menu);
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    // Handle file input to change the image
    document.getElementById('image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById('round-image').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
        document.body.removeChild(menu);
    });

    // Close the menu
    document.getElementById('close-menu').addEventListener('click', () => {
        document.body.removeChild(menu);
    });
}

document.addEventListener('contextmenu', showImageChangeMenu);

// Set the year in the footer
const dateInIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
const currentYear = dateInIST.getFullYear();
document.getElementById('current-year').textContent = currentYear;

// Initial setup
updateCountDisplay();
updateRoundDisplay();
updateCircleText();
audio.muted = isMuted;
muteBtn.style.display = isMuted ? 'none' : 'inline-block';
unmuteBtn.style.display = isMuted ? 'inline-block' : 'none';

// Image load on page load
window.onload = function () {
    const savedImage = localStorage.getItem('selectedImage');
    if (savedImage) {
        document.querySelector('.round-image').src = savedImage;
    }
};
