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
    playerList = (await response.json());
}

document.addEventListener("DOMContentLoaded", function(){
    leaderboardDiv = document.getElementById('leaderboard');
    getAllPlayers();
})