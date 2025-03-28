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
let settingsBtn = document.getElementById('settings-btn');
let settingsPopup = document.getElementById('settings-popup');
let closeSettingsBtn = document.getElementById('close-settings');
let saveSettingsBtn = document.getElementById('save-settings');
let soundToggle = document.getElementById('sound-toggle');
let countVibrationToggle = document.getElementById('count-vibration-toggle');
let completeVibrationToggle = document.getElementById('complete-vibration-toggle');
let countVibrationSlider = document.getElementById('count-vibration-slider');
let completeVibrationSlider = document.getElementById('complete-vibration-slider');
let countVibrationValue = document.getElementById('count-vibration-value');
let completeVibrationValue = document.getElementById('complete-vibration-value');
let soundStatus = document.getElementById('sound-status');
let countVibrationStatus = document.getElementById('count-vibration-status');
let completeVibrationStatus = document.getElementById('complete-vibration-status');
let volumeSlider = document.getElementById('volume-slider');
let volumeValue = document.getElementById('volume-value');
let volumeControlContainer = document.getElementById('volume-control-container');

let totalLetters = 108;
let radius = 120;
let maxRadius = 180;

// Initialize audio with sound on by default
audio.volume = 1;
audio.muted = false;

// Vibration settings with sound enabled by default
let vibrationSettings = {
    soundEnabled: true,
    countVibrationEnabled: false,
    countVibrationDuration: 60,
    completeVibrationEnabled: true,
    completeVibrationDuration: 1000,
    volume: 210
};

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
    const circleDivisions = [33, 36, 39];
    const radiusIncrement = 30;
    const initialRadius = 100;
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

// Function to save count and round data
function saveData() {
    localStorage.setItem('count', count);
    localStorage.setItem('round', round);
}

// Function to save settings to localStorage
function saveSettingsToStorage() {
    vibrationSettings = {
        soundEnabled: soundToggle.checked,
        countVibrationEnabled: countVibrationToggle.checked,
        countVibrationDuration: parseInt(countVibrationSlider.value),
        completeVibrationEnabled: completeVibrationToggle.checked,
        completeVibrationDuration: parseInt(completeVibrationSlider.value),
        volume: parseInt(volumeSlider.value)
    };
    localStorage.setItem('vibrationSettings', JSON.stringify(vibrationSettings));
}

// Function to load settings from localStorage
function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('vibrationSettings');
    if (savedSettings) {
        vibrationSettings = JSON.parse(savedSettings);
    } else {
        // Default settings with sound ON
        vibrationSettings = {
            soundEnabled: true,
            countVibrationEnabled: false,
            countVibrationDuration: 60,
            completeVibrationEnabled: true,
            completeVibrationDuration: 1000,
            volume: 210
        };
    }
    
    // Update UI with loaded settings
    soundToggle.checked = vibrationSettings.soundEnabled !== false;
    countVibrationToggle.checked = vibrationSettings.countVibrationEnabled || false;
    completeVibrationToggle.checked = vibrationSettings.completeVibrationEnabled !== false;
    countVibrationSlider.value = vibrationSettings.countVibrationDuration || 60;
    completeVibrationSlider.value = vibrationSettings.completeVibrationDuration || 1000;
    volumeSlider.value = vibrationSettings.volume !== undefined ? vibrationSettings.volume : 210;
    
    updateSettingsUI();
}

// Function to update settings UI
function updateSettingsUI() {
    volumeControlContainer.style.display = soundToggle.checked ? 'block' : 'none';
    audio.volume = volumeSlider.value / 210;
    audio.muted = !soundToggle.checked;
}

// Function to update the counter
function updateCounter() {
    if (count < totalLetters) {
        count++;
        updateCountDisplay();
        updateCircleText();
        saveData();

        if (countVibrationToggle.checked && navigator.vibrate) {
            navigator.vibrate(parseInt(countVibrationSlider.value));
        }

        if (count === totalLetters) {
            round++;
            updateRoundDisplay();
            popup108.style.display = 'block';
            
            if (soundToggle.checked) {
                audio.play();
            }
            
            if (completeVibrationToggle.checked && navigator.vibrate) {
                navigator.vibrate(parseInt(completeVibrationSlider.value));
            }
        }
    } else {
        popup108.style.display = 'block';
    }
}

// Event listeners
document.getElementById('count-btn').addEventListener('click', updateCounter);

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

settingsBtn.addEventListener('click', () => {
    settingsPopup.style.display = 'block';
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPopup.style.display = 'none';
});

saveSettingsBtn.addEventListener('click', () => {
    saveSettingsToStorage();
    updateSettingsUI();
    settingsPopup.style.display = 'none';
});

soundToggle.addEventListener('change', function() {
    volumeControlContainer.style.display = this.checked ? 'block' : 'none';
    updateSettingsUI();
});

countVibrationToggle.addEventListener('change', function() {
    // No additional action needed for UI
});

completeVibrationToggle.addEventListener('change', function() {
    // No additional action needed for UI
});

countVibrationSlider.addEventListener('input', function() {
    countVibrationValue.textContent = `${this.value}ms`;
});

completeVibrationSlider.addEventListener('input', function() {
    completeVibrationValue.textContent = `${this.value}ms`;
});

volumeSlider.addEventListener('input', function() {
    volumeValue.textContent = this.value;
    audio.volume = this.value / 210;
});

// Initialize the app
updateCountDisplay();
updateRoundDisplay();
updateCircleText();
loadSettingsFromStorage();

// Set current year in footer
const dateInIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
const currentYear = dateInIST.getFullYear();
document.getElementById('current-year').textContent = currentYear;

// Image change functionality
const changeImageBtn = document.getElementById('change-image-btn');
const imageChangeMenu = document.getElementById('image-change-menu');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const saveImageBtn = document.getElementById('save-image-btn');
const resetImageBtn = document.getElementById('reset-image-btn');
const closeImageMenuBtn = document.getElementById('close-image-menu');

changeImageBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'block';
});

closeImageMenuBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'none';
});

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

saveImageBtn.addEventListener('click', () => {
    const newImageSrc = imagePreview.src;
    if (newImageSrc) {
        localStorage.setItem('selectedImage', newImageSrc);
        document.querySelector('.round-image').src = newImageSrc;
        imageChangeMenu.style.display = 'none';
    }
});

resetImageBtn.addEventListener('click', () => {
    localStorage.removeItem('selectedImage');
    document.querySelector('.round-image').src = 'rkhkmc.png';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
});

// Check for saved image
window.onload = function() {
    const savedImage = localStorage.getItem('selectedImage');
    if (savedImage) {
        document.querySelector('.round-image').src = savedImage;
    }
};

// Show popup notification if first visit
if (!localStorage.getItem('popupShown')) {
    document.getElementById('popupnotify').style.display = 'flex';
    document.getElementById('close-popupnotify').addEventListener('click', function() {
        document.getElementById('popupnotify').style.display = 'none';
        localStorage.setItem('popupShown', 'true');
    });
}

// PWA installation handling
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(error) {
        console.log('ServiceWorker registration failed: ', error);
    });
}

// Install button handling
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

if (installBtn) {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'block';
        
        installBtn.addEventListener('click', async () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User ${outcome} the install prompt`);
            deferredPrompt = null;
        });
    });

    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
    });
}

// Responsive padding adjustment
function adjustCircleContainer() {
    const circleContainer = document.querySelector('.circle-container');
    if (!circleContainer) return;

    const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    const isPWAInstalled = isMobile && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

    let newPadding;
    if (isMobile) {
        newPadding = isPWAInstalled ? '495px' : '630px';
    } else {
        newPadding = window.innerWidth <= 768 ? '480px' : '399px';
    }

    circleContainer.style.setProperty("padding-top", newPadding, "important");
}

setTimeout(() => {
    adjustCircleContainer();
    window.addEventListener('resize', adjustCircleContainer);
}, 200);

window.addEventListener('appinstalled', () => {
    setTimeout(adjustCircleContainer, 500);
});
