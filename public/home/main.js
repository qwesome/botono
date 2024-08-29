
let total = 0;
let totalGems = 0;

const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';
const reportCurrencyEndpoint = 'https://botono.vercel.app/api/reportCurrency';

const userName = localStorage.getItem("username");
const passWord = localStorage.getItem("password");


async function reportCurrency() {
    const data = {  
        userName: userName,
        passWord: passWord,
        coins: total,
        gems: totalGems,
    };

    const response = await fetch(reportCurrencyEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = (await response.json()).user;
    console.log(result);
    total = result.coins;
}

async function getUserData() {
    const data = {  
        userName: userName,
        passWord: passWord
    };

    const response = await fetch(queryAccountEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = (await response.json()).user;
    console.log(result);
    total = result.coins;
    totalGems = result.gems;

    setInterval(reportCurrency, 5000)
}

const colors = ["#ffffff", "#73eb93", "#73cfeb", "#cccf46", "#cf6f46"];
const letters = ["", "K", "M", "B", "T", "Q", "P", "S", "Se", "O", "N", "D"];

let ownedItems = []



function buy(title, cost, msp) {
    total = total-cost;
    
}

function addShopItem(name, ps, cost) {
    const newE = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('p');
    const buyButton = document.createElement('button');
    
    // Style the container
    newE.style.border = "solid white 1px";
    newE.style.height = "40px"; // Adjust height as needed
    newE.style.padding = "5px";
    newE.style.display = "grid";
    newE.style.margin = "5px";
    newE.style.borderRadius = "5%";
    newE.style.gridTemplateColumns = "1fr 40px"; // Two equal columns
    newE.style.gridTemplateRows = "auto auto"; // Two rows with automatic height

    // Style the title
    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1"; // Span both columns

    // Style the price
    price.innerText = `$${cost} | ${ps}/sec`;
    price.style.margin = "0";
    price.style.fontSize = "12px";
    price.style.gridColumn = "1"; // First column

    // Style the buy button
    buyButton.innerText = "Buy";
    buyButton.style.backgroundColor = "#70f04d";
    buyButton.style.border = "solid white 1px"
    buyButton.style.borderRadius = "5%";
    buyButton.style.gridColumn = "2"; // Second column
    buyButton.style.gridRow = "1/3"; // Second row

    // Append elements to container
    newE.appendChild(title);
    newE.appendChild(price);
    newE.appendChild(buyButton);

    // Append container to the document
    document.getElementById("buyList").appendChild(newE);
}


function addOwnedItem(name, ps, cost) {
    const newE = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('p');
    const buyButton = document.createElement('button');
    
    // Style the container
    newE.style.border = "solid white 1px";
    newE.style.height = "40px"; // Adjust height as needed
    newE.style.padding = "5px";
    newE.style.display = "grid";
    newE.style.margin = "5px";
    newE.style.borderRadius = "5%";
    newE.style.gridTemplateColumns = "1fr 40px"; // Two equal columns
    newE.style.gridTemplateRows = "auto auto"; // Two rows with automatic height

    // Style the title
    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1"; // Span both columns

    // Style the price
    price.innerText = `$${cost} | ${ps}/sec`;
    price.style.margin = "0";
    price.style.fontSize = "12px";
    price.style.gridColumn = "1"; // First column

    // Style the sell button
    buyButton.innerText = "Sell";
    buyButton.style.backgroundColor = "#ff2929";
    buyButton.style.border = "solid white 1px"
    buyButton.style.borderRadius = "5%";
    buyButton.style.gridColumn = "2"; // Second column
    buyButton.style.gridRow = "1/3"; // Second row

    // Append elements to container
    newE.appendChild(title);
    newE.appendChild(price);
    newE.appendChild(buyButton);

    // Append container to the document
    document.getElementById("itemList").appendChild(newE);
}


document.addEventListener("DOMContentLoaded", function() {
    const clickBox = document.getElementById("clickbox");
    const buyBox = document.getElementById("buyList");
    
    function updateCounter() {
        clickBox.innerText = setCorrectColor();
    }
    
    clickBox.innerText = setCorrectColor();

    function increment() {
        total++;
        clickBox.innerText = setCorrectColor();
        
        clickBox.classList.remove('click');
        void clickBox.offsetWidth; 
        clickBox.classList.add('click');
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

    getUserData();
});
