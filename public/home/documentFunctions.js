function addShopItem(name, ps, cost, itemid, gemspersecond, location, rarity) {
    const newE = document.createElement('div');
    const title = document.createElement('p');
    const price = document.createElement('p');
    const buyButton = document.createElement('button');
    
    newE.style.border = "solid white 1px";
    newE.style.height = "40px";
    newE.style.padding = "5px";
    newE.style.display = "grid";
    newE.style.margin = "5px";
    newE.style.borderRadius = "5%";
    newE.style.gridTemplateColumns = "1fr 40px";
    newE.style.gridTemplateRows = "auto auto";

    title.innerText = name;
    title.style.margin = "0";
    title.style.fontSize = "20px";
    title.style.gridColumn = "1"; 

    price.innerText = `$${cost} | $${ps}/sec | ${gemspersecond}/sec`;
    price.style.margin = "0";
    price.style.fontSize = "12px";
    price.style.gridColumn = "1/3"; 

    buyButton.innerText = "Buy";
    buyButton.style.backgroundColor = "#70f04d";
    buyButton.style.border = "solid white 1px"
    buyButton.style.borderRadius = "5%";
    buyButton.style.gridColumn = "2"; 
    buyButton.style.gridRow = "1"; 
    buyButton.setAttribute("onclick", " buyItem("+location+", "+itemid+", "+cost+", "+name+", "+ps+", "+gemspersecond+", "+rarity+")");

    
    newE.appendChild(title);
    newE.appendChild(price);
    newE.appendChild(buyButton);

    // Append container to the document
    document.getElementById("buyList").appendChild(newE);
}



function addOwnedItem(name, ps, cost, arrayIndex, gemspersecond, rarity) {
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

        // Style the container
        itemDiv.style.border = "solid "+rarity+" 1px";
        itemDiv.style.height = "40px"; // Adjust height as needed
        itemDiv.style.padding = "5px";
        itemDiv.style.display = "grid";
        itemDiv.style.margin = "5px";
        itemDiv.style.borderRadius = "5%";
        itemDiv.style.gridTemplateColumns = "1fr 80px"; // Two equal columns
        itemDiv.style.gridTemplateRows = "auto auto"; // Two rows with automatic height

        // Style the title
        title.style.margin = "0";
        title.style.fontSize = "20px";
        title.style.gridColumn = "1"; // Span both columns

        // Style the price
        price.style.margin = "0";
        price.style.fontSize = "12px";
        price.style.gridColumn = "1/3"; // First column

        itemDiv.appendChild(title);
        itemDiv.appendChild(price);

    
        itemList.appendChild(itemDiv);
    }

    
    const titleElem = itemDiv.querySelector('p:first-of-type');
    const priceElem = itemDiv.querySelector('p:nth-of-type(2)');

    
    const existingCountMatch = priceElem.innerText.match(/x(\d+)/);
    const existingCount = existingCountMatch ? parseInt(existingCountMatch[1]) : 0;

    titleElem.innerText = name;
    priceElem.innerText = `$${cost} | $${ps}/sec | ${gemspersecond}/sec | x${existingCount + 1}`;
}