async function loadLeaderboard() {
    const res = await fetch('/leaderboard-data');
    const data = await res.json();

    const body = document.getElementById('leaderboard-body');

    if (!data || data.length === 0) {
        body.innerHTML = `
            <tr>
                <td colspan="5" style="padding:20px; color:#ccc;">
                    No leaderboard data yet. Be the first to create history.
                </td>
            </tr>
        `;
        return;
    }

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

    if (!data || !data.score) {
        el.innerHTML = `
            <h3>Your Rank</h3>
            <p>No stats yet. Play some games to see your rank here!</p>
        `;
        return;
    }

    el.innerHTML = `
        <h3>Your Rank</h3>
        <p><strong>#${data.rank ?? '-'}</strong></p>
        <p>Wins: ${data.score.wins ?? 0}</p>
        <p>Losses: ${data.score.losses ?? 0}</p>
        <p>Games: ${data.score.games_played ?? 0}</p>
    `;
}

loadLeaderboard();
loadMyRank();