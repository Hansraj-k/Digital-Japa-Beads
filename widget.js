// Load stored values
let count = parseInt(localStorage.getItem('count')) || 0;
let round = parseInt(localStorage.getItem('round')) || 0;

// Get elements
let countDisplay = document.getElementById('count-display');
let roundDisplay = document.getElementById('round-display');
let countBtn = document.getElementById('count-btn');
let resetCountBtn = document.getElementById('reset-count-btn');
let resetRoundBtn = document.getElementById('reset-round-btn');

// Update display
function updateDisplay() {
    countDisplay.textContent = count;
    roundDisplay.textContent = `Round: ${round}`;
}

// Increment count
countBtn.addEventListener('click', () => {
    count++;
    localStorage.setItem('count', count);
    updateDisplay();
});

// Reset count
resetCountBtn.addEventListener('click', () => {
    count = 0;
    localStorage.setItem('count', count);
    updateDisplay();
});

// Reset round
resetRoundBtn.addEventListener('click', () => {
    round = 0;
    localStorage.setItem('round', round);
    updateDisplay();
});

// Initial update
updateDisplay();
