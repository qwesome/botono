document.addEventListener("DOMContentLoaded", function() {
    const clickBox = document.getElementById("clickbox");

    let total = 0;

    function increment() {
        total++;
        clickBox.innerText = total; // Updates the displayed number
    }

    clickBox.addEventListener("click", increment);
});
