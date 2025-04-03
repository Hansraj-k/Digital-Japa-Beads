// Initialize count and round 
let streakPopupToggle = document.getElementById('streak-popup-toggle');
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
let volumeSlider = document.getElementById('volume-slider');
let volumeValue = document.getElementById('volume-value');
let volumeControlContainer = document.getElementById('volume-control-container');

// Button size variables
let currentButtonSize = 100;
const minButtonSize = 50;
const maxButtonSize = 150;
const sizeStep = 10;

let totalLetters = 108;
let radius = 120;
let maxRadius = 180;

// Vibration settings with default values
let vibrationSettings = {
    soundEnabled: true,
    countVibrationEnabled: false,
    countVibrationDuration: 60,
    completeVibrationEnabled: true,
    completeVibrationDuration: 1000,
    volume: 210,
    buttonSize: 100,
    streakPopupEnabled: true  // Add this line
};

// Streak variables
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastActivityDate = localStorage.getItem('lastActivityDate') || '';
let chantingHistory = JSON.parse(localStorage.getItem('chantingHistory')) || {};

// Create audio element for streak sound
const streakAudio = new Audio();
streakAudio.src = 'streak-sound.mp3'; // Add this file to your project
streakAudio.volume = 0.6;

// Function to reset counts daily at midnight
function checkAndResetDaily() {
    const today = new Date().toDateString();
    const lastResetDate = localStorage.getItem('lastResetDate');

    if (lastResetDate !== today) {
        count = 0;
        round = 0;
        localStorage.setItem('count', count);
        localStorage.setItem('round', round);
        localStorage.setItem('lastResetDate', today);
        updateCountDisplay();
        updateRoundDisplay();
        updateCircleText();
    }
}

// Function to update slider fill color
function updateSliderFill(slider) {
    const value = slider.value;
    const max = slider.max;
    const min = slider.min;
    const percent = ((value - min) / (max - min)) * 100;
    
    // Update CSS variable
    slider.style.setProperty('--fill-percent', `${percent}%`);
    
    // Update the displayed value
    if (slider.id === 'volume-slider') {
        document.getElementById('volume-value').textContent = value;
    } else if (slider.id === 'count-vibration-slider') {
        document.getElementById('count-vibration-value').textContent = `${value}ms`;
    } else if (slider.id === 'complete-vibration-slider') {
        document.getElementById('complete-vibration-value').textContent = `${value}ms`;
    }
}
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
        volume: parseInt(volumeSlider.value),
        buttonSize: currentButtonSize,
        streakPopupEnabled: streakPopupToggle.checked  // Add this line
    };
    localStorage.setItem('vibrationSettings', JSON.stringify(vibrationSettings));
}

function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('vibrationSettings');
    if (savedSettings) {
        vibrationSettings = JSON.parse(savedSettings);

        soundToggle.checked = vibrationSettings.soundEnabled !== false;
        countVibrationToggle.checked = vibrationSettings.countVibrationEnabled || false;
        completeVibrationToggle.checked = vibrationSettings.completeVibrationEnabled !== false;
        countVibrationSlider.value = vibrationSettings.countVibrationDuration || 60;
        completeVibrationSlider.value = vibrationSettings.completeVibrationDuration || 1000;
        volumeSlider.value = vibrationSettings.volume !== undefined ? vibrationSettings.volume : 210;
        streakPopupToggle.checked = vibrationSettings.streakPopupEnabled !== false;  // Add this line

        if (vibrationSettings.buttonSize) {
            currentButtonSize = vibrationSettings.buttonSize;
            updateButtonSize(currentButtonSize);
        }
    }

    updateSettingsUI();
}
// Function to update button size
function updateButtonSize(newSize) {
    currentButtonSize = Math.max(minButtonSize, Math.min(maxButtonSize, newSize));
    document.getElementById('button-size-value').textContent = `${currentButtonSize}%`;
    
    const countBtn = document.getElementById('count-btn');
    const btnImg = countBtn.querySelector('img');
    
    // Scale the button
    countBtn.style.transform = `scale(${currentButtonSize / 100})`;
    
    // Adjust padding above and below the button equally
    const paddingAdjustment = (currentButtonSize - 100) * 0.5; // Adjust padding equally
    countBtn.style.paddingTop = `${paddingAdjustment}px`;
    countBtn.style.paddingBottom = `${paddingAdjustment}px`;

    // Adjust the circle container padding based on button size
    adjustCircleContainer();
    
    vibrationSettings.buttonSize = currentButtonSize;
    saveSettingsToStorage();
}

// Function to adjust circle container padding
function adjustCircleContainer() {
    const circleContainer = document.querySelector('.circle-container');
    if (!circleContainer) return;

    const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent);
    const isPWAInstalled = isMobile && (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

    let basePadding;
    if (isMobile) {
        basePadding = isPWAInstalled ? 375 : 465;
    } else {
        basePadding = window.innerWidth <= 768 ? 480 : 423;
    }

    const sizeAdjustment = (currentButtonSize - 100) * 3; // 3px per 10%
    const newPadding = basePadding + sizeAdjustment;

    circleContainer.style.setProperty("padding-top", `${newPadding}px`, "important");
}

// Function to update settings UI
function updateSettingsUI() {
    updateSliderFill(volumeSlider);
    updateSliderFill(countVibrationSlider);
    updateSliderFill(completeVibrationSlider);

    volumeValue.textContent = volumeSlider.value;
    countVibrationValue.textContent = `${countVibrationSlider.value}ms`;
    completeVibrationValue.textContent = `${completeVibrationSlider.value}ms`;

    audio.volume = volumeSlider.value / 210;
    audio.muted = !soundToggle.checked;

    volumeControlContainer.style.display = soundToggle.checked ? 'block' : 'none';

    const vibrationSettings = document.querySelectorAll('.vibration-setting');
    vibrationSettings.forEach(setting => {
        if (isMobileDevice()) {
            setting.style.display = 'block';
            const sliderContainer = setting.querySelector('.slider-container');
            if (sliderContainer) {
                const toggle = setting.querySelector('.checkbox');
                sliderContainer.style.display = toggle.checked ? 'block' : 'none';
            }
        } else {
            setting.style.display = 'none';
        }
    });
}

// Function to check if device is mobile
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Function to close all popups
function closeAllPopups() {
    const popups = document.querySelectorAll('.popup, .popupnotify, #image-change-menu');
    popups.forEach(popup => {
        popup.style.display = 'none';
    });
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Initialize streak on app load
function initializeStreak() {
    const today = new Date();
    const todayStr = formatDate(today);

    // If we have last activity date, check if we need to reset streak
    if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // If last activity was before yesterday, reset streak
        if (lastDate < yesterday && !isSameDay(lastDate, yesterday)) {
            streak = 0;
            localStorage.setItem('streak', streak);
        }

        // If last activity was today, ensure chanting history exists
        if (lastActivityDate === todayStr && !chantingHistory[todayStr]) {
            chantingHistory[todayStr] = { count: 0, rounds: 0 };
        }
    }

    updateStreakDisplay();
}

// Function to update streak
function updateStreak() {
    const today = new Date();
    const todayStr = formatDate(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDate(yesterday);

    // Check if we already counted today
    if (lastActivityDate === todayStr) {
        return;
    }

    // If first time or no last activity date, start new streak
    if (!lastActivityDate) {
        streak = 1;
        showStreakPopup("Today, you planted the seed of devotion. With consistency, it will blossom beautifully! 🌸");
    }
    // If last activity was yesterday, increment streak
    else if (lastActivityDate === yesterdayStr) {
        streak++;
        showStreakPopup(`Incredible dedication! 🙌\n\nYou've been chanting consistently for ${streak} days${streak > 1 ? 's' : ''}!`);
    }
    // If last activity was more than 1 day ago, reset streak
    else {
        const lastDate = new Date(lastActivityDate);
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff > 1) {
            streak = 1;
            showStreakPopup("A small pause doesn't define your journey. Start fresh today! 🌿");
        }
    }

    // Update last activity date
    lastActivityDate = todayStr;

    // Update chanting history
    if (!chantingHistory[todayStr]) {
        chantingHistory[todayStr] = { count: 0, rounds: 0 };
    }
    chantingHistory[todayStr].count++;

    // Save to localStorage
    localStorage.setItem('streak', streak);
    localStorage.setItem('lastActivityDate', lastActivityDate);
    localStorage.setItem('chantingHistory', JSON.stringify(chantingHistory));

    // Update display
    updateStreakDisplay();
}

// Function to update streak display
function updateStreakDisplay() {
    const streakDisplay = document.getElementById('streak-display');
    if (streakDisplay) {
        streakDisplay.textContent = `🔥 Streak: ${streak} day${streak !== 1 ? 's' : ''}`;
    }
    renderStreakCalendar();
}

// Function to render streak calendar (shows last 7 days)
function renderStreakCalendar() {
    const streakCalendar = document.getElementById('streak-calendar');
    if (!streakCalendar) return;

    streakCalendar.innerHTML = '';
    const today = new Date();

    // Create calendar for the past 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDate(date);

        const dayElement = document.createElement('div');
        dayElement.className = 'streak-day';

        // Check if this day had activity
        if (chantingHistory[dateStr] && chantingHistory[dateStr].count > 0) {
            dayElement.classList.add('active');
        }

        // Mark today
        if (i === 0) {
            dayElement.classList.add('today');
        }

        // Add day abbreviation
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayElement.setAttribute('data-day', dayNames[date.getDay()]);

        // Add date number
        dayElement.textContent = date.getDate();

        streakCalendar.appendChild(dayElement);
    }
}

// Function to show streak popup with sound
function showStreakPopup(message) {
    const streakPopup = document.getElementById('streak-popup');
    const streakMessage = document.getElementById('streak-message');

    if (streakPopup && streakMessage) {
        streakMessage.textContent = message;
        streakPopup.style.display = 'block';

        // Play streak sound if sound is enabled
        if (soundToggle.checked) {
            streakAudio.currentTime = 0;
            streakAudio.play().catch(e => console.log("Audio play failed:", e));
        }

        setTimeout(() => {
            streakPopup.style.display = 'none';
        }, 3000);
    }
}
function showStreakPopup(message) {
    if (!streakPopupToggle.checked) return;

    const streakPopup = document.getElementById('streak-popup');
    const streakMessage = document.getElementById('streak-message');

    if (streakPopup && streakMessage) {
        streakMessage.textContent = message;
        streakPopup.style.display = 'block';

// Play streak sound if sound is enabled
        if (soundToggle.checked) {
            streakAudio.currentTime = 0;
            streakAudio.play().catch(e => console.log("Audio play failed:", e));
        }

        setTimeout(() => {
            streakPopup.style.display = 'none';
        }, 3000);
    }
}

// Function to update the counter with daily reset check
function updateCounter() {
    checkAndResetDaily(); // Check if we need to reset first

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
document.getElementById('count-btn').addEventListener('click', function() {
    if (count === 0) {
        updateStreak();
    }
    updateCounter();
});

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
    closeAllPopups();
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
    closeAllPopups();
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
    closeAllPopups();
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

countVibrationToggle.addEventListener('change', updateSettingsUI);
completeVibrationToggle.addEventListener('change', updateSettingsUI);

countVibrationSlider.addEventListener('input', function() {
    updateSliderFill(this);
    countVibrationValue.textContent = `${this.value}ms`;
});

completeVibrationSlider.addEventListener('input', function() {
    updateSliderFill(this);
    completeVibrationValue.textContent = `${this.value}ms`;
});

volumeSlider.addEventListener('input', function() {
    updateSliderFill(this);
    volumeValue.textContent = this.value;
    audio.volume = this.value / 210;
});

// Button size controls
document.getElementById('decrease-btn-size').addEventListener('click', () => {
    updateButtonSize(currentButtonSize - sizeStep);
});

document.getElementById('increase-btn-size').addEventListener('click', () => {
    updateButtonSize(currentButtonSize + sizeStep);
});

// Initialize the app
updateCountDisplay();
updateRoundDisplay();
updateCircleText();
loadSettingsFromStorage();
initializeStreak();
checkAndResetDaily(); // Initial daily check

// Set up a daily check (every hour to be safe)
setInterval(checkAndResetDaily, 60 * 60 * 1000);

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
    closeAllPopups();
    imageChangeMenu.style.display = 'block';
});

closeImageMenuBtn.addEventListener('click', () => {
    imageChangeMenu.style.display = 'none';
});

let isDragging = false;
let currentImage = null;
let cropPosition = { x: 0, y: 0 };

// Image upload handler
// Add these variables
let cropSize = 150;
let isDragging = false;
let startX, startY;
let imgX = 0, imgY = 0;
let currentImage = null;

// Image upload handler
imageUpload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = document.getElementById('source-image');
      img.src = event.target.result;
      
      img.onload = function() {
        currentImage = img;
        // Center image initially
        centerImage();
        updateCropCircle();
      };
    };
    reader.readAsDataURL(file);
  }
});

function centerImage() {
  if (!currentImage) return;
  
  const container = document.querySelector('.crop-area');
  imgX = (currentImage.width - container.offsetWidth) / 2;
  imgY = (currentImage.height - container.offsetHeight) / 2;
  updateImagePosition();
}

function updateImagePosition() {
  if (!currentImage) return;
  
  const img = document.getElementById('source-image');
  img.style.transform = `translate(${-imgX}px, ${-imgY}px)`;
  updateCropCircle();
}

function updateCropCircle() {
  const circle = document.getElementById('crop-circle');
  circle.style.width = `${cropSize}px`;
  circle.style.height = `${cropSize}px`;
  document.getElementById('size-value').textContent = `${cropSize}px`;
  
  // Keep circle centered
  const container = document.querySelector('.crop-area');
  circle.style.left = `${container.offsetWidth / 2}px`;
  circle.style.top = `${container.offsetHeight / 2}px`;
}

// Drag image to position
document.querySelector('.crop-area').addEventListener('mousedown', function(e) {
  if (!currentImage) return;
  
  isDragging = true;
  startX = e.clientX - imgX;
  startY = e.clientY - imgY;
  this.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', function(e) {
  if (!isDragging || !currentImage) return;
  
  imgX = e.clientX - startX;
  imgY = e.clientY - startY;
  updateImagePosition();
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  document.querySelector('.crop-area').style.cursor = 'move';
});

// Crop size controls
document.getElementById('size-up').addEventListener('click', function() {
  cropSize = Math.min(250, cropSize + 10);
  updateCropCircle();
});

document.getElementById('size-down').addEventListener('click', function() {
  cropSize = Math.max(50, cropSize - 10);
  updateCropCircle();
});

document.getElementById('reset-crop').addEventListener('click', function() {
  cropSize = 150;
  centerImage();
});

// Save cropped image (use your existing save-image-btn)
saveImageBtn.addEventListener('click', function() {
  if (!currentImage) return;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = cropSize;
  canvas.height = cropSize;
  
  // Create circular path
  ctx.beginPath();
  ctx.arc(cropSize/2, cropSize/2, cropSize/2, 0, Math.PI*2);
  ctx.closePath();
  ctx.clip();
  
  // Calculate source dimensions
  const container = document.querySelector('.crop-area');
  const scaleX = currentImage.naturalWidth / currentImage.offsetWidth;
  const scaleY = currentImage.naturalHeight / currentImage.offsetHeight;
  
  // Draw cropped portion
  ctx.drawImage(
    currentImage,
    imgX * scaleX,
    imgY * scaleY,
    cropSize * scaleX,
    cropSize * scaleY,
    0,
    0,
    cropSize,
    cropSize
  );
  
  // Save to localStorage
  localStorage.setItem('selectedImage', canvas.toDataURL());
  document.querySelector('.round-image').src = localStorage.getItem('selectedImage');
  imageChangeMenu.style.display = 'none';
});

// Reset to default image (use your existing reset-image-btn)
resetImageBtn.addEventListener('click', function() {
  localStorage.removeItem('selectedImage');
  document.querySelector('.round-image').src = 'rkhkmc.png';
  imageChangeMenu.style.display = 'none';
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

// Initialize slider fill colors on load
// Initialize slider fill on load
document.addEventListener('DOMContentLoaded', function() {
    updateSliderFill(document.getElementById('volume-slider'));
    updateSliderFill(document.getElementById('count-vibration-slider'));
    updateSliderFill(document.getElementById('complete-vibration-slider'));
});

// Add event listeners for slider input
document.getElementById('volume-slider').addEventListener('input', function() {
    updateSliderFill(this);
    audio.volume = this.value / 210;
});

document.getElementById('count-vibration-slider').addEventListener('input', function() {
    updateSliderFill(this);
});

document.getElementById('complete-vibration-slider').addEventListener('input', function() {
    updateSliderFill(this);
});

// Adjust circle container padding on load and resize
window.addEventListener('load', function() {
    adjustCircleContainer();
    updateButtonSize(currentButtonSize);
});

window.addEventListener('resize', function() {
    adjustCircleContainer();
    updateButtonSize(currentButtonSize);
});

// Adjust padding when app is installed
window.addEventListener('appinstalled', () => {
    setTimeout(() => {
        adjustCircleContainer();
        updateButtonSize(currentButtonSize);
    }, 500);
});

// Default settings values
const defaultSettings = {
    soundEnabled: true,
    countVibrationEnabled: false,
    countVibrationDuration: 60,
    completeVibrationEnabled: true,
    completeVibrationDuration: 1000,
    volume: 210,
    buttonSize: 100,
    streakPopupEnabled: true  // Add this line
};

// Function to reset all settings to default
function resetToDefaultSettings() {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
        soundToggle.checked = defaultSettings.soundEnabled;
        countVibrationToggle.checked = defaultSettings.countVibrationEnabled;
        completeVibrationToggle.checked = defaultSettings.completeVibrationEnabled;
        countVibrationSlider.value = defaultSettings.countVibrationDuration;
        completeVibrationSlider.value = defaultSettings.completeVibrationDuration;
        volumeSlider.value = defaultSettings.volume;

        currentButtonSize = defaultSettings.buttonSize;
        updateButtonSize(currentButtonSize);

        updateSettingsUI();
        vibrationSettings = {...defaultSettings};
        saveSettingsToStorage();
    }
}

document.getElementById('reset-default-settings').addEventListener('click', resetToDefaultSettings);

// Close streak popup
document.getElementById('close-streak-popup')?.addEventListener('click', () => {
    document.getElementById('streak-popup').style.display = 'none';
});

// Add streak calendar CSS
const streakStyle = document.createElement('style');
streakStyle.textContent = `
.streak-day {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    transition: all 0.3s ease;
}

.streak-day.active {
    background-color: #ff9900;
    color: black;
}

.streak-day.today {
    box-shadow: 0 0 0 2px #ff9900;
}

.streak-day::after {
    content: attr(data-day);
    position: absolute;
    bottom: -20px;
    font-size: 10px;
    color: #aaa;
}

.streak-calendar {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
}

@media (max-width: 480px) {
    .streak-day {
        width: 25px;
        height: 25px;
        font-size: 10px;
    }
    
    .streak-day::after {
        font-size: 8px;
        bottom: -15px;
    }
}
`;

document.head.appendChild(streakStyle);
streakPopupToggle.addEventListener('change', updateSettingsUI);

// Add this to your existing JavaScript code
document.querySelector('.round-image').addEventListener('click', function() {
    closeAllPopups();
    document.getElementById('image-change-menu').style.display = 'block';
});
