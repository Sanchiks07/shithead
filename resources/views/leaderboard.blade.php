<x-layout>
    <div class="leaderboard-container">

        <h1>
            <span class="emoji">🏆</span>
            <span class="text">Leaderboard</span>
        </h1>

        <!-- YOUR PERSONAL RANK -->
        <div id="my-rank" class="my-rank-box">
            Loading your rank...
        </div>

        <!-- LEADERBOARD TABLE -->
        <div class="table-wrapper">
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Games</th>
                        <th>Wins</th>
                        <th>Losses</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body">
                    <tr>
                        <td colspan="5">Loading leaderboard...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <a href="/" class="back-btn" style="margin-right: 20px;">Back to Home</a>
        <a href="/game" class="back-btn">Back to Game</a>

    </div>

    @vite('resources/js/leaderboard.js')
</x-layout>