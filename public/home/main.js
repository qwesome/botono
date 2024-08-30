

let clickBox;
let gemDisplay;

let total = 0;
let totalGems = 0;

let inventory = [];

function setCorrectColor() {
    let rTotal = total;

    return (rTotal);
}

function increment() {
    total++;
    clickBox.innerText = setCorrectColor();
    gemDisplay.innerText = totalGems;
    
    clickBox.classList.remove('click');
    void clickBox.offsetWidth; 
    clickBox.classList.add('click');
}

function update() {
    clickBox.innerText = setCorrectColor();
    gemDisplay.innerText = totalGems;
    
    clickBox.classList.remove('click');
    void clickBox.offsetWidth; 
    clickBox.classList.add('click');
}

let dailyDrops = [];

const queryAccountEndpoint = 'https://botono.vercel.app/api/signIn';
const addItemToInventoryEndpoint = 'https://botono.vercel.app/api/addItemToInventory';
const reportCurrencyEndpoint = 'https://botono.vercel.app/api/reportCurrency';
const getInventoryEndpoint = 'https://botono.vercel.app/api/getInventory';
const deleteInventoryItemEndpoint = 'https://botono.vercel.app/api/deleteInventoryItem';
const getDailyDropsEndpoint = 'https://botono.vercel.app/api/getDailyDrops.js';

const userName = localStorage.getItem("username");
const passWord = localStorage.getItem("password");

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

function earn() {
    inventory.forEach(item => {
        total = total + item.coinspersecond;
        totalGems = totalGems + item.gemspersecond;
        update();
    });
}

function buyDailyShopItem(id) {
    const itemToAdd = dailyDrops[id]
    if (itemToAdd.price <= total) {        
        total = total - itemToAdd.price;
        addItemToInventory(itemToAdd.itemname, itemToAdd.coinspersecond, itemToAdd.price, itemToAdd.rarity, itemToAdd.gemspersecond);
        getInventory();
        update();
    }
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

async function deleteInventoryItem(inventoryArrayId) {
    const data = {  
        userName: userName,
        passWord: passWord,
        itemID: inventory[inventoryArrayId].itemid
    };

    const response = await fetch(deleteInventoryItemEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    getInventory();
}


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
}

async function addItemToInventory(itemname, coinspersecond, value, rarity, gemspersecond) {
    const data = {  
        userName: userName,
        passWord: passWord,
        itemname: itemname,
        coinspersecond: coinspersecond, 
        value: value, 
        rarity: rarity, 
        gemspersecond: gemspersecond
    };

    const response = await fetch(addItemToInventoryEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = (await response.json()).user;
    console.log(result);
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

    setInterval(reportCurrency, 500);
    setInterval(getInventory, 500);
    setInterval(getDailyDrops, 500);
    setInterval(earn, 1000);
    update();
}

const colors = ["#ffffff", "#73eb93", "#73cfeb", "#cccf46", "#cf6f46"];


function addShopItem(name, ps, cost, arrayIndex, isDaily, gemspersecond) {
    const newE = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('p');
    const buyButton = document.createElement('button');
    
    // Style the container
    newE.style.border = isDaily ? "solid purple 1px" : "solid white 1px";
    newE.style.height = "40px";
    newE.style.padding = "5px";
    newE.style.display = "grid";
    newE.style.margin = "5px";
    newE.style.borderRadius = "5%";
    newE.style.gridTemplateColumns = "1fr 40px";
    newE.style.gridTemplateRows = "auto auto";

    // Style the title
    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1";

    // Style the price
    price.innerText = `$${cost} | $${ps}/sec | ${gemspersecond}/sec`;
    price.style.margin = "0";
    price.style.fontSize = "12px";
    price.style.gridColumn = "1/3";

    // Style the buy button
    buyButton.innerText = "Buy";
    buyButton.style.backgroundColor = "#70f04d";
    buyButton.style.border = "solid white 1px";
    buyButton.style.borderRadius = "5%";
    buyButton.style.gridColumn = "2";
    buyButton.style.gridRow = "1";
    buyButton.classList.add('shop-button'); // Add a class for styling
    buyButton.setAttribute("onclick", `buyDailyShopItem(${arrayIndex})`);

    // Append elements to container
    newE.appendChild(title);
    newE.appendChild(price);
    newE.appendChild(buyButton);

    // Append container to the document
    document.getElementById("buyList").appendChild(newE);

    // Add event listener for animation effect
    buyButton.addEventListener('click', function() {
        this.classList.add('button-animation');
        setTimeout(() => {
            this.classList.remove('button-animation');
        }, 200); // Match the duration of the CSS animation
    });
}


function addOwnedItem(name, ps, cost, arrayIndex, gemspersecond) {
    const itemList = document.getElementById("itemList");
    let itemDiv = null;

    // Iterate over existing items to find a match
    for (const child of itemList.children) {
        const titleElem = child.querySelector('p:first-of-type');
        if (titleElem && titleElem.innerText.includes(name)) {
            itemDiv = child;
            break;
        }
    }

    if (!itemDiv) {
        // Create a new item if it doesn't exist
        itemDiv = document.createElement('div');
        const title = document.createElement('p');
        const price = document.createElement('p');
        const buyButton = document.createElement('button');

        // Style the container
        itemDiv.style.border = "solid white 1px";
        itemDiv.style.height = "40px";
        itemDiv.style.padding = "5px";
        itemDiv.style.display = "grid";
        itemDiv.style.margin = "5px";
        itemDiv.style.borderRadius = "5%";
        itemDiv.style.gridTemplateColumns = "1fr 80px";
        itemDiv.style.gridTemplateRows = "auto auto";

        // Style the title
        title.style.margin = "0";
        title.style.fontSize = "20px";
        title.style.gridColumn = "1";

        // Style the price
        price.style.margin = "0";
        price.style.fontSize = "12px";
        price.style.gridColumn = "1/3";

        // Style the remove button
        buyButton.innerText = "Remove";
        buyButton.style.backgroundColor = "#ff2929";
        buyButton.style.border = "solid white 1px";
        buyButton.style.borderRadius = "5%";
        buyButton.style.gridColumn = "2";
        buyButton.style.gridRow = "1";
        buyButton.classList.add('owned-button'); // Add a class for styling
        buyButton.setAttribute("onclick", `deleteInventoryItem(${arrayIndex})`);

        // Append elements to container
        itemDiv.appendChild(title);
        itemDiv.appendChild(price);
        itemDiv.appendChild(buyButton);

        // Add the container to the document
        itemList.appendChild(itemDiv);
    }

    // Update the item details and count
    const titleElem = itemDiv.querySelector('p:first-of-type');
    const priceElem = itemDiv.querySelector('p:nth-of-type(2)');

    // Extract and update count in the price element
    const existingCountMatch = priceElem.innerText.match(/x(\d+)/);
    const existingCount = existingCountMatch ? parseInt(existingCountMatch[1]) : 0;

    titleElem.innerText = name;
    priceElem.innerText = `$${cost} | $${ps}/sec | ${gemspersecond}/sec | x${existingCount + 1}`;

    // Add event listener for animation effect
    buyButton.addEventListener('click', function() {
        this.classList.add('button-animation');
        setTimeout(() => {
            this.classList.remove('button-animation');
        }, 200); // Match the duration of the CSS animation
    });
}




document.addEventListener("DOMContentLoaded", function() {
    clickBox = document.getElementById("clickbox");
    gemDisplay = document.getElementById("gemDisplay");
    
    clickBox.innerText = setCorrectColor();

    clickBox.addEventListener('animationend', () => {
        clickBox.classList.remove('click');
        clickBox.style.backgroundColor = "#151726";
    });

    update();
    getUserData();

    clickBox.addEventListener("click", increment);
});