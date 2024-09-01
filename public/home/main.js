
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

let earnedCoins = 0;
let earnedGems = 0;

//item arrays
let inventory = [];
let dailyDrops = [];


//counter manipulation

function update() {
    clickBox.innerText = total + clicks + earnedCoins;
    gemDisplay.innerText = totalGems + earnedGems;
    
    //clickBox.classList.remove('click');
    //void clickBox.offsetWidth; 
    //clickBox.classList.add('click');
}

function incrementClicks() {
    clicks++;
    update();
    
    clickBox.classList.remove('click');
    void clickBox.offsetWidth; 
    clickBox.classList.add('click');
}

function clientSideEarn() {
    inventory.forEach(item => {
        earnedCoins = earnedCoins + item.coinspersecond;
        earnedGems = earnedGems + item.gemspersecond;
    });
    update();
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

    const data = {  
        userName: userName,
        passWord: passWord,
        coinsEarned: earnedCoins + clicks,
        gemsEarned: earnedGems
    };

    clicks = 0;

    earnedCoins = 0;
    earnedGems = 0;

    const verifyResponse = await fetch(verifyEarningsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = (await verifyResponse.json());

    total = result.newcoins;
    totalGems = result.newgems;

    update();

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

    setInterval(getInventory, 10000);
    setInterval(getDailyDrops, 10000);
    setInterval(earn, 10000);
    setInterval(clientSideEarn, 1000);
    setInterval(update, 200);
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

    clickBox.addEventListener("click", incrementClicks);
});