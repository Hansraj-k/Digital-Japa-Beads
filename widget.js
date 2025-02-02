let count = 0;

document.getElementById("count-btn").addEventListener("click", () => {
    count++;
    document.getElementById("counter").textContent = count;
});

document.getElementById("reset-count").addEventListener("click", () => {
    count = 0;
    document.getElementById("counter").textContent = count;
});



document.getElementById("reset-round").addEventListener("click", () => {
    count = 0;
    document.getElementById("counter").textContent = count;
});
