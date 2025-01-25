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

// Event listener for right-click on desktop
document.addEventListener('contextmenu', showImageChangeMenu);

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

let cropCanvas = document.getElementById('crop-canvas');
let cropContext = cropCanvas.getContext('2d');
let cropContainer = document.getElementById('crop-container');
let imageUpload = document.getElementById('image-upload');
let applyCropBtn = document.getElementById('apply-crop');
let uploadedImage = null;

// Handle image upload and crop
imageUpload.addEventListener('change', function (event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                // Set canvas dimensions to match the crop area
                cropCanvas.width = 300;
                cropCanvas.height = 300;

                // Show crop container
                cropContainer.style.display = 'block';

                // Draw the image on the canvas
                cropContext.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
                cropContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, cropCanvas.width, cropCanvas.height);
                uploadedImage = img; // Store the image for later cropping
            };
        };
        reader.readAsDataURL(file);
    }
});

// Apply the crop to the canvas and save it
applyCropBtn.addEventListener('click', function () {
    if (uploadedImage) {
        // Get the image data inside the circular area
        let imageData = cropContext.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
        
        // Create a new canvas for cropped image
        let finalCanvas = document.createElement('canvas');
        let finalContext = finalCanvas.getContext('2d');
        finalCanvas.width = 300;
        finalCanvas.height = 300;

        // Draw the circular crop (masking the rest of the image)
        finalContext.beginPath();
        finalContext.arc(150, 150, 150, 0, 2 * Math.PI);
        finalContext.clip();

        // Draw the image data onto the final canvas (with the circle mask)
        finalContext.putImageData(imageData, 0, 0);

        // Save the cropped image as a data URL and update the image source
        let croppedImageURL = finalCanvas.toDataURL();
        document.querySelector('.round-image').src = croppedImageURL; // Update the image source with the cropped image

        // Hide crop container and reset upload
        cropContainer.style.display = 'none';
        imageUpload.value = ''; // Reset the input
    }
});
