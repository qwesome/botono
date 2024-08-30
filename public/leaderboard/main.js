const getAllPlayersEndpoint = 'https://botono.vercel.app/api/getAllPlayers';
let leaderboardDiv;
let playerList = [];

async function getAllPlayers() {
    const response = await fetch(getAllPlayersEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    playerList = bubbleSortFun((await response.json()).players);
    setTimeout(list, 1500)
}

function list() {
    playerList.forEach(player => {
        const newE = document.createElement("p")

        newE.innerText = player.username+"   -   $"+player.coins;

        document.getElementById('Leaderboard').appendChild(newE);
    });
}

function bubbleSortFun(arr) {
    const len = arr.coins.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr.coins[j] > arr.coins[j + 1]) {
                [arr.coins[j], arr.coins[j + 1]] = 
                            [arr.coins[j + 1], arr.coins[j]];
            }
        }
    }
    return arr;
}

document.addEventListener("DOMContentLoaded", function(){
    leaderboardDiv = document.getElementById('leaderboard');
    getAllPlayers();
})