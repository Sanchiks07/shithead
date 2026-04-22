async function loadLeaderboard() {
    const res = await fetch('/leaderboard-data');
    const data = await res.json();

    const body = document.getElementById('leaderboard-body');

    body.innerHTML = data.map(p => `
        <tr>
            <td>${p.rank}</td>
            <td>${p.user}</td>
            <td>${p.games_played}</td>
            <td>${p.wins}</td>
            <td>${p.losses}</td>
        </tr>
    `).join('');
}

async function loadMyRank() {
    const res = await fetch('/my-rank');
    const data = await res.json();

    const el = document.getElementById('my-rank');

    el.innerHTML = `
        <h3>Your Rank</h3>
        <p><strong>#${data.rank ?? '-'}</strong></p>
        <p>Wins: ${data.score.wins}</p>
        <p>Losses: ${data.score.losses}</p>
        <p>Games: ${data.score.games_played}</p>
    `;
}

loadLeaderboard();
loadMyRank();