import * as Cards from 'deckofcards';

// GAME STATE
let deck;

let players = [];
let currentPlayer = 0;

let tablePile = [];
let pileValue = 0;

let gameLocked = false;

let gameMode = 1;

// CARD IMAGE
function getCardImage(card, hidden = false) {
    if (hidden || !card) return `/images/card-back.png`;

    const valueMap = {
        A: 'ace',
        K: 'king',
        Q: 'queen',
        J: 'jack',
        T: '10'
    };

    const suitMap = {
        H: 'hearts',
        S: 'spades',
        D: 'diamonds',
        C: 'clubs'
    };

    const rawValue = card.rank || card.value;
    const suit = suitMap[card.suit];
    const value = valueMap[rawValue] || rawValue;

    return `/images/${suit}/${value}_of_${suit}.png`;
}

// PLAYER
function createPlayer(isHuman = false) {
    return {
        hand: [],
        faceUp: [],
        faceDown: [],
        isHuman
    };
}

// WIN CHECK
function checkWin(player) {
    return (
        player.hand.length === 0 &&
        player.faceUp.length === 0 &&
        player.faceDown.length === 0
    );
}

// HANDLE WIN
async function handleWin(winner) {
    gameLocked = true;

    const isHuman = winner.isHuman;

    // announce
    const gameEl = document.getElementById('game');

    const msg = document.createElement('div');
    msg.className = 'win-message';
    msg.innerHTML = isHuman ? '🎉 You Win!' : '💀 You Lose!';
    gameEl.appendChild(msg);

    // save to backend
    try {
        await fetch(isHuman ? '/score/win' : '/score/loss', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Score save failed:', err);
    }
}

// START GAME
function startGame(mode = 1) {
    // remove old win message if it exists
    document.querySelectorAll('.win-message').forEach(el => el.remove());

    gameMode = mode; // store mode

    deck = new Cards.Deck();
    deck.shuffle();

    // reset pile
    tablePile = [];
    pileValue = 0;

    players = [];
    const count = mode === 1 ? 2 : 3;

    for (let i = 0; i < count; i++) {
        players.push(createPlayer(i === 0));
    }

    dealCards();
    currentPlayer = 0;

    render();
    runTurn();
}

// DEAL CARDS
function dealCards() {
    players.forEach(p => {
        for (let i = 0; i < 3; i++) p.hand.push(deck.draw());
        for (let i = 0; i < 3; i++) p.faceUp.push(deck.draw());
        for (let i = 0; i < 3; i++) p.faceDown.push(deck.draw());
    });
}

// VALUE SYSTEM
function getValue(card) {
    const map = {
        A: 14,
        K: 13,
        Q: 12,
        J: 11,
        T: 10
    };

    return map[card.rank] || Number(card.rank);
}

// RULE CHECK
function canPlay(card) {
    const v = getValue(card);

    if (v === 6 || v === 10) return true;
    if (pileValue === 0) return true;

    return v >= pileValue;
}

// SPECIAL RULES
function applySpecial(card) {
    const v = getValue(card);

    // 10 → burn + play again
    if (v === 10) {
        tablePile = [];
        pileValue = 0;
        return "play_again";
    }

    // 6 → reset
    if (v === 6) {
        pileValue = 0;
        return "normal";
    }

    // 4 vienādas
    if (tablePile.length >= 4) {
        const last4 = tablePile.slice(-4);
        const same = last4.every(c => getValue(c) === getValue(last4[0]));

        if (same) {
            tablePile = [];
            pileValue = 0;
            return "play_again";
        }
    }

    pileValue = v;
    return "normal";
}

// REFILL
function refill(player) {
    while (player.hand.length < 3 && deck.cards.length > 0) {
        player.hand.push(deck.draw());
    }
}

// PICK UP PILE
function pickupPile(player) {
    if (!tablePile.length) return;

    player.hand.push(...tablePile);
    tablePile = [];
    pileValue = 0;
}

// TURN
function nextTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
}

// ACTIVE ZONE
function getActiveZone(player) {
    if (player.hand.length > 0) return player.hand;
    if (player.faceUp.length > 0) return player.faceUp;
    return player.faceDown;
}

// HUMAN PLAY
function playCard(index) {
    if (gameLocked) return;

    const player = players[currentPlayer];
    if (!player.isHuman) return;

    const source = getActiveZone(player);
    let card = source[index];

    if (!card) return;

    // face down
    if (source === player.faceDown) {
        card = source.splice(index, 1)[0];
        tablePile.push(card);

        if (!canPlay(card)) {
            pickupPile(player);
            refill(player);
            nextTurn();
        } else {
            const result = applySpecial(card);
            refill(player);

            if (result !== "play_again") nextTurn();
        }

        // win check after face down play
        if (checkWin(player)) {
            handleWin(player);
            render();
            return;
        }

        render();
        runTurn();
        return;
    }

    // invalid
    if (!canPlay(card)) {
        pickupPile(player);
        refill(player);

        nextTurn();

        render();
        runTurn();
        return;
    }

    // valid
    tablePile.push(card);
    source.splice(index, 1);

    const result = applySpecial(card);
    refill(player);

    if (result !== "play_again") {
        nextTurn();
    }

    // win check after normal play
    if (checkWin(player)) {
        handleWin(player);
        render();
        return;
    }

    render();
    runTurn();
}

window.playCard = playCard;

// BOT PLAY
function botPlay(player) {
    const source = getActiveZone(player);

    const index = source.findIndex(canPlay);

    if (index === -1) {
        pickupPile(player);
        refill(player);
        return "next";
    }

    const card = source[index];

    tablePile.push(card);
    source.splice(index, 1);

    const result = applySpecial(card);
    refill(player);

    return result;
}

// TURN ENGINE
function runTurn() {
    const player = players[currentPlayer];

    render();

    if (player.isHuman) return;

    gameLocked = true;

    setTimeout(() => {
        const result = botPlay(player);

        // win check after bot play
        if (checkWin(player)) {
            handleWin(player);
            render();
            return;
        }

        if (result !== "play_again") {
            nextTurn();
        }

        gameLocked = false;

        render();
        runTurn();
    }, 700);
}

// RENDER
function render() {
    const me = players[0];

    const handEl = document.getElementById('player-hand');
    const faceUpEl = document.getElementById('face-up');
    const faceDownEl = document.getElementById('face-down');
    const tableEl = document.getElementById('table');
    const deckEl = document.getElementById('deck');
    const oppEl = document.getElementById('opponents');

    if (!handEl || !faceUpEl || !faceDownEl || !tableEl || !deckEl || !oppEl) return;

    handEl.innerHTML =
        (me.hand || []).map((c, i) =>
            `<img class="card" src="${getCardImage(c)}" onclick="window.playCard(${i})">`
        ).join('');

    faceUpEl.innerHTML =
        (me.faceUp || []).map((c, i) => {
            const disabled = me.hand.length > 0;

            return `<img class="card small ${disabled ? 'disabled' : ''}" 
                src="${getCardImage(c)}" 
                ${disabled ? '' : `onclick="window.playCard(${i})"`}>
            `;
        }).join('');

    faceDownEl.innerHTML =
        (me.faceDown || []).map((_, i) => {
            const disabled = me.hand.length > 0 || me.faceUp.length > 0;

            return `<img class="card small ${disabled ? 'disabled' : ''}" 
                src="${getCardImage(null, true)}" 
                ${disabled ? '' : `onclick="window.playCard(${i})"`}>
            `;
        }).join('');

    tableEl.innerHTML =
        tablePile.length
            ? `<img class="pile-card" src="${getCardImage(tablePile.at(-1))}">`
            : '';

    deckEl.innerHTML =
        `<img src="/images/card-back.png"> x ${deck?.cards?.length ?? 0}`;

    oppEl.innerHTML =
        players.slice(1).map((p, i) => `
            <div class="opponent">
                <h4>Player ${i + 2}</h4>

                <h5>Their Hand</h5>
                <div class="row">
                    ${(p.hand || []).map(() =>
                        `<img class="card small" src="/images/card-back.png">`
                    ).join('')}
                </div>

                <h5>Face Up</h5>
                <div class="row">
                    ${(p.faceUp || []).map(c =>
                        `<img class="card small" src="${getCardImage(c)}">`
                    ).join('')}
                </div>

                <h5>Face Down</h5>
                <div class="row">
                    ${(p.faceDown || []).map(() =>
                        `<img class="card small" src="/images/card-back.png">`
                    ).join('')}
                </div>
            </div>
        `).join('');
}

// MODE BUTTONS
document.querySelectorAll('.mode-select button[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
        startGame(Number(btn.dataset.mode));
    });
});

// SHUFFLE BUTTON
document.getElementById('shuffle-btn').addEventListener('click', () => {
    startGame(gameMode); // keeps selected mode
});

// START DEFAULT
startGame(1);