const getAllPlayersEndpoint = 'https://botono.vercel.app/api/getAllPlayers';
let leaderboardDiv;
let playerList = [];

function sortPlayersByCoins(players) {
    return players.slice().sort((a, b) => b.coins - a.coins);
}

async function getAllPlayers() {
    const response = await fetch(getAllPlayersEndpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    playerList = sortPlayersByCoins((await response.json()).players);
    setTimeout(list, 1500)
}

function list() {
    playerList.forEach(player => {
        const newE = document.createElement("p")

        newE.innerText = player.username+"   -   $"+player.coins;

        document.getElementById('Leaderboard').appendChild(newE);
    });
}

document.addEventListener("DOMContentLoaded", function(){
    leaderboardDiv = document.getElementById('leaderboard');
    getAllPlayers();
})