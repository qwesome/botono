let total = localStorage.getItem("total");

const colors = ["#ffffff", "#73eb93", "#73cfeb", "#cccf46", "#cf6f46"];
const letters = ["", "K", "M", "B", "T", "Q", "P", "S", "Se", "O", "N", "D"];

document.addEventListener("DOMContentLoaded", function() {
    const clickBox = document.getElementById("clickbox");
    clickBox.innerText = setCorrectColor();

    function increment() {
        total++;
        clickBox.innerText = setCorrectColor();
        
        clickBox.classList.remove('click');
        void clickBox.offsetWidth; 
        clickBox.classList.add('click');

        localStorage.setItem("total", total)
    }

    clickBox.addEventListener('animationend', () => {
        clickBox.classList.remove('click');
        clickBox.style.backgroundColor = "#151726";
    });

    function setCorrectColor() {
        let rTotal = total;
        let timesDiv = 0;

        while (rTotal >= 1000) {
            rTotal = rTotal/1000;
            timesDiv++;
        }

        clickBox.style.borderColor = colors[timesDiv];
        return (Math.round(rTotal)+letters[timesDiv]);
    }

    clickBox.addEventListener("click", increment);
});
