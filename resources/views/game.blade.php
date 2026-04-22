<x-layout>
    <div id="game">

        <h1 class="title">Shithead</h1>

        <!-- MODE -->
        <div class="mode-select">
            <button data-mode="1">1 vs 1</button>
            <button data-mode="2">1 vs 2</button>
            <button id="shuffle-btn">Shuffle / Restart</button>
        </div>

        <!-- TOP AREA -->
        <div class="top-row">

            <div id="deck" class="deck"></div>

            <div id="table" class="pile"></div>

        </div>

        <!-- OPPONENTS -->
        <div id="opponents" class="opponents"></div>

        <!-- PLAYER ZONE -->
        <div class="player-zone">

            <div class="section">
                <h3>Your Hand</h3>
                <div id="player-hand" class="hand"></div>
            </div>

            <div class="section">
                <h3>Face Up</h3>
                <div id="face-up" class="row"></div>
            </div>

            <div class="section">
                <h3>Face Down</h3>
                <div id="face-down" class="row"></div>
            </div>

        </div>
    </div>

    @vite('resources/js/app.js')
</x-layout>