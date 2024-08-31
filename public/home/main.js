
const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';
const getInventoryEndpoint = 'https://botono.vercel.app/api/getInventory';
const getDailyDropsEndpoint = 'https://botono.vercel.app/api/getDailyDrops.js';
const verifyEarningsEndpoint = 'https://botono.vercel.app/api/verifyProfit.js';

const userName = localStorage.getItem("username");
const passWord = localStorage.getItem("password");

//elements
let clickBox;
let gemDisplay;

//currencys
let total = 0;
let clicks = 0;
let totalGems = 0;

//item arrays
let inventory = [];
let dailyDrops = [];


//counter manipulation

function update() {
    clickBox.innerText = total;
    gemDisplay.innerText = totalGems;
    
    clickBox.classList.remove('click');
    void clickBox.offsetWidth; 
    clickBox.classList.add('click');
}

function incrementClicks() {
    clicks++;
    total = total + clicks;
    update();
}

function clientSideEarn() {
    inventory.forEach(item => {
        total = total + item.coinspersecond;
        totalGems = totalGems + item.gemspersecond;
    });
}

//redirect to login page if not logged in
if (userName == null) {
    window.location.href = "https://botono.vercel.app/";    
}

async function getInventory() {
    const data = {  
        userName: userName,
    };

    const response = await fetch(getInventoryEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = (await response.json()).userInventory;
    console.log(result);
    inventory = result;

    document.getElementById("itemList").innerHTML = '';
    let index = 0;
    inventory.forEach(item => {
        addOwnedItem(item.itemname, item.coinspersecond, item.value, index, item.gemspersecond)
        index++;
    });
}

async function earn() {
    let totalCoinsToSend = clicks;
    let totalGemsToSend = 0;

    clicks = 0;

    inventory.forEach(item => {
        totalCoinsToSend = totalCoinsToSend + (item.coinspersecond * 5);
        totalGemsToSend = totalGemsToSend + (item.gemspersecond * 5);
    });

    const data = {  
        userName: userName,
        passWord: passWord,
        coinsEarned: totalCoinsToSend,
        gemsEarned: totalGemsToSend
    };

    await fetch(verifyEarningsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function getDailyDrops() {
    const response = await fetch(getDailyDropsEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = (await response.json()).drops;
    console.log(result);

    dailyDrops = result;

    document.getElementById("buyList").innerHTML = '';
    let index = 0;
    dailyDrops.forEach(item => {
        addShopItem(item.itemname, item.coinspersecond, item.price, index, true, item.gemspersecond)
        index++;
    });
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

    setInterval(getInventory, 2000);
    setInterval(getDailyDrops, 5000);
    setInterval(earn, 5000);
    setInterval(clientSideEarn, 1000);
    update();
}

document.addEventListener("DOMContentLoaded", function() {
    clickBox = document.getElementById("clickbox");
    gemDisplay = document.getElementById("gemDisplay");

    clickBox.addEventListener('animationend', () => {
        clickBox.classList.remove('click');
        clickBox.style.backgroundColor = "#151726";
    });

    getUserData();

    clickBox.addEventListener("click", increment);
});