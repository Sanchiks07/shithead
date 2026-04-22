<x-layout>
    <div class="home-container">
        <h1>Shithead</h1>

        <p class="intro">
            A chaotic card game where strategy, luck, and a bit of spite decide who gets stuck being the "shithead".
        </p>

        <div class="rules">
            <h2>How to Play</h2>

            <p>
                Each player starts with three cards in hand and six cards on the table (3 face-up and 3 face-down). 
                The goal is simple: get rid of all your cards before everyone else.
            </p>

            <ul>
                <li>You can only play cards equal to or higher than the one on the current pile.</li>
                <li>If you can't play, you pick up the entire pile.</li>
                <li>Once your hand is empty, you play your face-up cards.</li>
                <li>After that, you're stuck guessing your face-down cards.</li>
            </ul>

            <p>Special cards</p>
            <ul>
                <li><strong>6</strong> resets the pile (you can play anything after it)</li>
                <li><strong>10</strong> burns the pile completely</li>
                <li><strong>4 of the same card</strong> also burns the pile completely (placed on top of each other not randomly scattered between the pile)</li>
            </ul>

            <p class="goal">
                The last player left with cards loses and earns the title no one wants.
            </p>
        </div>

        <a href="{{ route('game') }}" class="play-btn">Play Now</a>
    </div>
</x-layout>