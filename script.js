// References to essential elements
const countDisplay = document.getElementById('count-display');
const roundDisplay = document.getElementById('round-display');
const circleText = document.querySelector('.circle-text');
const popup108 = document.getElementById('popup-108');
const audio = document.getElementById('audio');
const muteBtn = document.getElementById('mute-btn');
const unmuteBtn = document.getElementById('unmute-btn');
const roundImage = document.getElementById('round-image');
const imageChangeMenu = document.getElementById('image-change-menu');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const saveImageBtn = document.getElementById('save-image-btn');
const resetImageBtn = document.getElementById('reset-image-btn');
const closeImageMenuBtn = document.getElementById('close-image-menu');

// Initialize count, round, and other variables
let count = parseInt(localStorage.getItem('count')) || 0;
let round = parseInt(localStorage.getItem('round')) || 0;
let isMuted = JSON.parse(localStorage.getItem('isMuted')) || false;
const totalLetters = 108;
const initialRadius = 100;
const circleDivisions = [33, 36, 39];
const radiusIncrement = 30;
const letters = 'HAREKRISHNA'.repeat(9).split('');

// Update the displayed count
function updateCountDisplay() {
    countDisplay.textContent = count;
}

// Update the displayed round
function updateRoundDisplay() {
    roundDisplay.textContent = `Round: ${round}`;
}

// Update the circle text based on the count
function updateCircleText() {
    circleText.innerHTML = '';
    let letterIndex = 0;

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

// Save count and round data to localStorage
function saveData() {
    localStorage.setItem('count', count);
    localStorage.setItem('round', round);
}

// Update the counter
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
            if (!isMuted) audio.play();
        }
    }
}

// Reset handlers
function resetCount() {
    count = 0;
    updateCountDisplay();
    updateCircleText();
    saveData();
}

function resetRound() {
    round = 0;
    updateRoundDisplay();
    saveData();
}

// Mute and unmute handlers
function toggleMute(mute) {
    isMuted = mute;
    audio.muted = mute;
    muteBtn.style.display = mute ? 'none' : 'inline-block';
    unmuteBtn.style.display = mute ? 'inline-block' : 'none';
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
}

// Image change menu handlers
function showImageChangeMenu(x, y) {
    imageChangeMenu.style.display = 'block';
    imageChangeMenu.style.left = `${x}px`;
    imageChangeMenu.style.top = `${y}px`;
}

function hideImageChangeMenu() {
    imageChangeMenu.style.display = 'none';
    imageUpload.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function saveImage() {
    const newImageSrc = imagePreview.src;
    if (newImageSrc) {
        localStorage.setItem('selectedImage', newImageSrc);
        roundImage.src = newImageSrc;
    }
    hideImageChangeMenu();
}

function resetImage() {
    localStorage.removeItem('selectedImage');
    roundImage.src = 'rkhkmc.png';
    hideImageChangeMenu();
}

// Event listeners
muteBtn.addEventListener('click', () => toggleMute(true));
unmuteBtn.addEventListener('click', () => toggleMute(false));

document.getElementById('count-btn').addEventListener('click', updateCounter);
resetImageBtn.addEventListener('click', resetImage);
closeImageMenuBtn.addEventListener('click', hideImageChangeMenu);
saveImageBtn.addEventListener('click', saveImage);
imageUpload.addEventListener('change', handleImageUpload);

roundImage.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    showImageChangeMenu(event.pageX, event.pageY);
});

// Load saved data
window.onload = function () {
    updateCountDisplay();
    updateRoundDisplay();
    updateCircleText();

    toggleMute(isMuted);

    const savedImage = localStorage.getItem('selectedImage');
    if (savedImage) {
        roundImage.src = savedImage;
    }
};
