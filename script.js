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

// Circle text edit elements
let editCircleTextBtn = document.getElementById('edit-circle-text-btn');
let circleTextEditModal = document.getElementById('circle-text-edit-modal');
let circleTextInput = document.getElementById('circle-text-input');
let clearCircleTextBtn = document.getElementById('clear-circle-text');
let saveCircleTextBtn = document.getElementById('save-circle-text');
let cancelCircleTextBtn = document.getElementById('cancel-circle-text');

// Button size variables
let currentButtonSize = 100;
const minButtonSize = 50;
const maxButtonSize = 150;
const sizeStep = 10;

let totalLetters = 108;
let radius = 120;
let maxRadius = 180;

// Load saved circle text or use default (with space handling)
let circleTextContent = (localStorage.getItem('circleText') || 'HAREKRISHNAHAREKRISHNAKRISHNAKRISHNAHAREHAREHARERAMAHARERAMARAMARAMAHAREHARE').replace(/\s+/g, '');

// Vibration settings with default values
let vibrationSettings = {
    soundEnabled: true,
    countVibrationEnabled: false,
    countVibrationDuration: 60,
    completeVibrationEnabled: true,
    completeVibrationDuration: 1000,
    volume: 210,
    buttonSize: 100,
    streakPopupEnabled: true
};

// Streak variables
let streak = parseInt(localStorage.getItem('streak')) || 0;
let lastActivityDate = localStorage.getItem('lastActivityDate') || '';
let chantingHistory = JSON.parse(localStorage.getItem('chantingHistory')) || {};

// Create audio element for streak sound
const streakAudio = new Audio();
streakAudio.src = 'streak-sound.mp3';
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
    slider.style.setProperty('--fill-percent', `${percent}%`);

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
    // Ensure no spaces in the circle text content
    circleTextContent = circleTextContent.replace(/\s+/g, '');
    
    const letters = circleTextContent.repeat(Math.ceil(108 / circleTextContent.length)).split('');
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
        streakPopupEnabled: streakPopupToggle.checked
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
        streakPopupToggle.checked = vibrationSettings.streakPopupEnabled !== false;

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

    countBtn.style.transform = `scale(${currentButtonSize / 100})`;
    const paddingAdjustment = (currentButtonSize - 100) * 0.5;
    countBtn.style.paddingTop = `${paddingAdjustment}px`;
    countBtn.style.paddingBottom = `${paddingAdjustment}px`;

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
        basePadding = isPWAInstalled ? 321 : 460;
    } else {
        basePadding = window.innerWidth <= 768 ? 381 : 423;
    }

    const sizeAdjustment = (currentButtonSize - 100) * 3;
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
    const popups = document.querySelectorAll('.popup, .popupnotify, #image-change-menu, #circle-text-edit-modal');
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

    if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate < yesterday && !isSameDay(lastDate, yesterday)) {
            streak = 0;
            localStorage.setItem('streak', streak);
        }

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

    if (lastActivityDate === todayStr) {
        return;
    }

    if (!lastActivityDate) {
        streak = 1;
        showStreakPopup("Today, you planted the seed of devotion. With consistency, it will blossom beautifully! 🌸");
    }
    else if (lastActivityDate === yesterdayStr) {
        streak++;
        showStreakPopup(`Incredible dedication! 🙌\n\nYou've been chanting consistently for ${streak} days${streak > 1 ? 's' : ''}!`);
    }
    else {
        const lastDate = new Date(lastActivityDate);
        const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (daysDiff > 1) {
            streak = 1;
            showStreakPopup("A small pause doesn't define your journey. Start fresh today! 🌿");
        }
    }

    lastActivityDate = todayStr;

    if (!chantingHistory[todayStr]) {
        chantingHistory[todayStr] = { count: 0, rounds: 0 };
    }
    chantingHistory[todayStr].count++;

    localStorage.setItem('streak', streak);
    localStorage.setItem('lastActivityDate', lastActivityDate);
    localStorage.setItem('chantingHistory', JSON.stringify(chantingHistory));

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

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = formatDate(date);

        const dayElement = document.createElement('div');
        dayElement.className = 'streak-day';

        if (chantingHistory[dateStr] && chantingHistory[dateStr].count > 0) {
            dayElement.classList.add('active');
        }

        if (i === 0) {
            dayElement.classList.add('today');
        }

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayElement.setAttribute('data-day', dayNames[date.getDay()]);
        dayElement.textContent = date.getDate();

        streakCalendar.appendChild(dayElement);
    }
}

// Function to show streak popup with sound
function showStreakPopup(message) {
    if (!streakPopupToggle.checked) return;

    const streakPopup = document.getElementById('streak-popup');
    const streakMessage = document.getElementById('streak-message');

    if (streakPopup && streakMessage) {
        streakMessage.textContent = message;
        streakPopup.style.display = 'block';

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
    checkAndResetDaily();

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

// Default settings values
const defaultSettings = {
    soundEnabled: true,
    countVibrationEnabled: false,
    countVibrationDuration: 60,
    completeVibrationEnabled: true,
    completeVibrationDuration: 1000,
    volume: 210,
    buttonSize: 100,
    streakPopupEnabled: true
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

        // Reset circle text (with space handling)
        circleTextContent = 'HAREKRISHNAHAREKRISHNAKRISHNAKRISHNAHAREHAREHARERAMAHARERAMARAMARAMAHAREHARE';
        localStorage.setItem('circleText', circleTextContent);
        updateCircleText();

        updateSettingsUI();
        vibrationSettings = {...defaultSettings};
        saveSettingsToStorage();
    }
}

// Nuclear Reset Function
async function performFactoryReset() {
    const dialog = document.querySelector('.reset-dialog');
    if (dialog) {
        dialog.innerHTML = `<div class="loading-reset">
            <i class="fas fa-circle-notch fa-spin"></i>
            <p>Resetting everything...</p>
        </div>`;
    }

    try {
        localStorage.clear();
        
        if (window.indexedDB) {
            const dbs = await window.indexedDB.databases();
            dbs.forEach(db => {
                if (db.name) {
                    window.indexedDB.deleteDatabase(db.name);
                }
            });
        }
        
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
        }
        
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
        }
        
        sessionStorage.clear();
        
        setTimeout(() => {
            window.location.href = window.location.origin + window.location.pathname + '?reset=' + Date.now();
        }, 1000);
        
    } catch (error) {
        console.error('Reset failed:', error);
        if (dialog) {
            dialog.innerHTML = `<p style="color:#ff4444">Reset failed. Please manually refresh the page.</p>`;
        }
    }
}

// Event Listeners
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

// Circle text edit functionality with space handling
editCircleTextBtn.addEventListener('click', () => {
    closeAllPopups();
    circleTextInput.value = circleTextContent;
    circleTextEditModal.style.display = 'flex';
});

// Clear text button functionality
clearCircleTextBtn.addEventListener('click', function() {
    circleTextInput.value = '';
    circleTextInput.classList.add('warning');
    document.querySelector('.space-warning').style.display = 'block';
});

saveCircleTextBtn.addEventListener('click', () => {
    // Remove all spaces (start, end, and between) when saving
    circleTextContent = circleTextInput.value.replace(/\s+/g, '') || 'HAREKRISHNAHAREKRISHNAKRISHNAKRISHNAHAREHAREHARERAMAHARERAMARAMARAMAHAREHARE';
    localStorage.setItem('circleText', circleTextContent);
    circleTextEditModal.style.display = 'none';
    updateCircleText();
});

cancelCircleTextBtn.addEventListener('click', () => {
    circleTextEditModal.style.display = 'none';
});

// Show warning when spaces are entered in circle text
circleTextInput.addEventListener('input', function() {
    const warningElement = document.querySelector('.space-warning');
    if (this.value.includes(' ')) {
        this.classList.add('warning');
        warningElement.style.display = 'block';
    } else {
        this.classList.remove('warning');
        warningElement.style.display = 'none';
    }
});

// Initialize the app
updateCountDisplay();
updateRoundDisplay();
updateCircleText();
loadSettingsFromStorage();
initializeStreak();
checkAndResetDaily();

// Set up a daily check (every hour to be safe)
setInterval(checkAndResetDaily, 60 * 60 * 1000);

// Set current year in footer
const dateInIST = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
const currentYear = dateInIST.getFullYear();
document.getElementById('current-year').textContent = currentYear;

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
    function isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }

    function isMobileDevice() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }

    if (isPWAInstalled() || !isMobileDevice()) {
        installBtn.style.display = 'none';
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (!isPWAInstalled() && isMobileDevice()) {
            installBtn.style.display = 'block';
        }

        installBtn.addEventListener('click', async () => {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User ${outcome} the install prompt`);
            deferredPrompt = null;
        });
    });

    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        installBtn.style.display = 'none';
        
        setTimeout(() => {
            if (isPWAInstalled()) {
                installBtn.style.display = 'none';
            }
        }, 1000);
    });

    window.addEventListener('load', () => {
        if (isPWAInstalled()) {
            installBtn.style.display = 'none';
        }
    });
}

// Close streak popup
document.getElementById('close-streak-popup')?.addEventListener('click', () => {
    document.getElementById('streak-popup').style.display = 'none';
});

// Reset to default settings
document.getElementById('reset-default-settings').addEventListener('click', resetToDefaultSettings);

// Factory Reset Button Handler
document.getElementById('factory-reset')?.addEventListener('click', function() {
    const dialog = document.createElement('div');
    dialog.className = 'reset-dialog';
    dialog.innerHTML = `
        <h3>⚠️ Factory Reset ⚠️</h3>
        <p>This will <strong>permanently delete</strong>:</p>
        <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
            <li>All counter data</li>
            <li>All round progress</li>
            <li>All settings</li>
            <li>All cached files</li>
            <li>All offline data</li>
        </ul>
        <p>The app will restart completely fresh.</p>
        <div class="reset-dialog-buttons">
            <button id="confirm-reset">Reset Everything</button>
            <button id="cancel-reset">Cancel</button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    document.getElementById('confirm-reset').addEventListener('click', performFactoryReset);
    
    document.getElementById('cancel-reset').addEventListener('click', function() {
        document.body.removeChild(dialog);
    });
});

// Initialize slider fill on load
document.addEventListener('DOMContentLoaded', function() {
    updateSliderFill(document.getElementById('volume-slider'));
    updateSliderFill(document.getElementById('count-vibration-slider'));
    updateSliderFill(document.getElementById('complete-vibration-slider'));
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
// Show popup notification if first visit
if (!localStorage.getItem('popupShown')) {
    document.getElementById('popupnotify').style.display = 'flex';
    document.getElementById('close-popupnotify').addEventListener('click', function() {
        document.getElementById('popupnotify').style.display = 'none';
        localStorage.setItem('popupShown', 'true');
    });
}
