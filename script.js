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
        <div id="crop-container">
            <canvas id="image-canvas"></canvas>
            <div id="crop-overlay"></div>
        </div>
        <button id="save-image">Save</button>
        <button id="close-menu">Close</button>
    `;

    // Append the menu to the body
    document.body.appendChild(menu);

    // Position the menu at the event's location
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;

    const imageCanvas = document.getElementById('image-canvas');
    const cropOverlay = document.getElementById('crop-overlay');
    const context = imageCanvas.getContext('2d');
    let uploadedImage = null;
    let cropX = 50, cropY = 50, cropSize = 150;

    // Update the crop overlay position
    function updateCropOverlay() {
        cropOverlay.style.left = `${cropX}px`;
        cropOverlay.style.top = `${cropY}px`;
        cropOverlay.style.width = `${cropSize}px`;
        cropOverlay.style.height = `${cropSize}px`;
    }

    // Handle image upload
    document.getElementById('image-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageUrl = event.target.result;
                const img = new Image();
                img.onload = function () {
                    uploadedImage = img;
                    imageCanvas.width = img.width;
                    imageCanvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    cropX = (img.width - cropSize) / 2;
                    cropY = (img.height - cropSize) / 2;
                    updateCropOverlay();
                };
                img.src = imageUrl;
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag to adjust the crop overlay
    let isDragging = false;
    cropOverlay.addEventListener('mousedown', (e) => {
        isDragging = true;
        const startX = e.clientX;
        const startY = e.clientY;

        const initialX = cropX;
        const initialY = cropY;

        function onMouseMove(e) {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                cropX = Math.max(0, Math.min(initialX + deltaX, imageCanvas.width - cropSize));
                cropY = Math.max(0, Math.min(initialY + deltaY, imageCanvas.height - cropSize));
                updateCropOverlay();
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // Save the cropped image
    document.getElementById('save-image').addEventListener('click', () => {
        if (uploadedImage) {
            const croppedCanvas = document.createElement('canvas');
            const croppedContext = croppedCanvas.getContext('2d');
            croppedCanvas.width = cropSize;
            croppedCanvas.height = cropSize;

            croppedContext.beginPath();
            croppedContext.arc(cropSize / 2, cropSize / 2, cropSize / 2, 0, Math.PI * 2);
            croppedContext.closePath();
            croppedContext.clip();

            croppedContext.drawImage(
                uploadedImage,
                cropX, cropY, cropSize, cropSize,
                0, 0, cropSize, cropSize
            );

            const croppedImageUrl = croppedCanvas.toDataURL();
            document.getElementById('round-image').src = croppedImageUrl;
            localStorage.setItem('selectedImage', croppedImageUrl);
            document.body.removeChild(menu);
        }
    });

    // Close menu
    document.getElementById('close-menu').addEventListener('click', () => {
        document.body.removeChild(menu);
    });

    // Style the crop overlay
    cropOverlay.style.position = 'absolute';
    cropOverlay.style.border = '2px dashed #fff';
    cropOverlay.style.borderRadius = '50%';
    cropOverlay.style.cursor = 'move';
    updateCropOverlay();
}

// Event listener for right-click on round image for desktop
document.getElementById('round-image').addEventListener('contextmenu', showImageChangeMenu);

// Event listener for long press on round image for mobile
document.getElementById('round-image').addEventListener('touchstart', (e) => {
    e.preventDefault();
    showImageChangeMenu(e);
});

// Check if there's a saved image in localStorage
window.onload = function() {
    const savedImage = localStorage.getItem('selectedImage');
    if (savedImage) {
        document.getElementById('round-image').src = savedImage;
    }
};
