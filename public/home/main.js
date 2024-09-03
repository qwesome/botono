
const rarityColors = {
    common: '#ffffff', // White
    uncommon: '#00ff00', // Green
    rare: '#0000ff', // Blue
    epic: '#a020f0', // Purple
    legendary: '#ffcc00', // Gold
};
  
function getColorByRarity(rarity) {
    return rarityColors[rarity] || '#cccccc';
}

const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';
const getInventoryEndpoint = 'https://botono.vercel.app/api/getInventory';
const buyEndpoint = 'https://botono.vercel.app/api/buy';
const getShopEndpoint = 'https://botono.vercel.app/api/getShop';
const verifyEarningsEndpoint = 'https://botono.vercel.app/api/verifyProfit';

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
let shop = [];



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

function logOut() {

    localStorage.clear();

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

    let i = 0;
    let itemNames = [];

    inventory = [];

    while (i < result.length) {

        const itemIndex = itemNames.indexOf(result[i].itemname);

        if (itemIndex === -1) {
            itemNames.push(result[i].itemname);
            inventory.push(result[i]);
            inventory[inventory.length - 1].amount = 1;
        } else {
            inventory[itemIndex].amount += 1;
        }

        i++;
    }

    document.getElementById("itemList").innerHTML = '';
    let index = 0;
    inventory.forEach(item => {
        addOwnedItem(item.itemname, item.coinspersecond, item.value, index, item.gemspersecond, item.rarity, item.amount);
        index++;
    });
}

async function earn() {

    const data = {  
        userName: userName,
        passWord: passWord,
        coinsEarned: earnedCoins,
        gemsEarned: earnedGems,
        clicks: clicks
    };

    const verifyResponse = await fetch(verifyEarningsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = (await verifyResponse.json());

    if (result.v === 1) {
        
        earnedCoins = earnedCoins - result.addedcoins;
        earnedGems = earnedGems - result.addedgems;

        clicks = clicks - result.clicks;
    }else {
        earnedCoins = 0;
        earnedGems = 0;
        clicks = 0;
    }

    if (earnedGems < 0) {
        earnedGems = 0;
    }

    if (earnedCoins < 0) {
        earnedCoins = 0;
    }

    total = total + result.addedcoins + result.clicks;
    totalGems = totalGems + result.addedgems;

    update();

}

async function buyItem(location, itemid, cost, name, ps, cost, gemspersecond, rarity) {

    console.log("buy item");
    if (total < cost) {
        alert("Your Broke")
    }else {

        console.log("not broke");
        const data = {
            userName: userName,
            passWord: passWord,
            itemid: itemid,
            location: location
        }

        addOwnedItem(name, ps, cost, 0, gemspersecond, rarity); 

        console.log("past add owned item");

        const response = await fetch(buyEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        total = total - cost;

    }
}

async function getShop() {
    const response = await fetch(getShopEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = (await response.json());
    
    dailyDrops = result.dailydrops;
    shop = result.shop;


    document.getElementById("buyList").innerHTML = '';
    let index = 0;
    shop.forEach(item => {
        addShopItem(item.itemname, item.coinspersecond, item.price, item.itemid, true, item.gemspersecond, 0, item.rarity)
        index++;
    });
    dailyDrops.forEach(item => {
        addShopItem(item.itemname, item.coinspersecond, item.price, item.itemid, true, item.gemspersecond, 1, item.rarity)
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
    total = parseInt(result.coins);
    totalGems = parseInt(result.gems);

    getInventory();
    getShop();

    setInterval(getInventory, 10000);
    setInterval(getShop, 10000);
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