import * as Cards from 'deckofcards';

// =====================
// CARD IMAGE
// =====================
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

// =====================
// GAME STATE
// =====================
let deck;

let players = [];
let currentPlayer = 0;

let tablePile = [];
let pileValue = 0;

let gameLocked = false;

// =====================
// PLAYER
// =====================
function createPlayer(isHuman = false) {
    return {
        hand: [],
        faceUp: [],
        faceDown: [],
        isHuman
    };
}

// =====================
// START GAME
// =====================
function startGame(mode = 1) {
    deck = new Cards.Deck();
    deck.shuffle();

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

// =====================
// DEAL CARDS
// =====================
function dealCards() {
    players.forEach(p => {
        for (let i = 0; i < 3; i++) p.hand.push(deck.draw());
        for (let i = 0; i < 3; i++) p.faceUp.push(deck.draw());
        for (let i = 0; i < 3; i++) p.faceDown.push(deck.draw());
    });
}

// =====================
// VALUE SYSTEM
// =====================
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

// =====================
// RULE CHECK
// =====================
function canPlay(card) {
    const v = getValue(card);

    if (v === 6 || v === 10) return true;
    if (pileValue === 0) return true;

    return v >= pileValue;
}

// =====================
// SPECIAL RULES
// =====================
function applySpecial(card) {
    const v = getValue(card);

    if (v === 6) {
        pileValue = 0;
        return;
    }

    if (v === 10) {
        tablePile = [];
        pileValue = 0;
        return;
    }

    pileValue = v;
}

// =====================
// REFILL
// =====================
function refill(player) {
    while (player.hand.length < 3 && deck.cards.length > 0) {
        player.hand.push(deck.draw());
    }
}

// =====================
// PICK UP PILE
// =====================
function pickupPile(player) {
    if (!tablePile.length) return;

    player.hand.push(...tablePile);
    tablePile = [];
    pileValue = 0;
}

// =====================
// TURN
// =====================
function nextTurn() {
    currentPlayer = (currentPlayer + 1) % players.length;
}

// =====================
// ACTIVE ZONE SYSTEM (IMPORTANT FIX)
// =====================
function getActiveZone(player) {
    if (player.hand.length > 0) return player.hand;
    if (player.faceUp.length > 0) return player.faceUp;
    return player.faceDown;
}

// =====================
// HUMAN PLAY
// =====================
function playCard(index) {
    if (gameLocked) return;

    const player = players[currentPlayer];
    if (!player.isHuman) return;

    const source = getActiveZone(player);
    const card = source[index];

    if (!card) return;

    // INVALID MOVE
    if (!canPlay(card)) {
        pickupPile(player);
        refill(player);

        nextTurn();
        render();
        runTurn();
        return;
    }

    // VALID MOVE
    tablePile.push(card);
    source.splice(index, 1);

    applySpecial(card);
    refill(player);

    nextTurn();
    render();
    runTurn();
}

window.playCard = playCard;

// =====================
// BOT PLAY
// =====================
function botPlay(player) {
    const source = getActiveZone(player);

    const index = source.findIndex(canPlay);

    if (index === -1) {
        pickupPile(player);
        refill(player);
        return;
    }

    const card = source[index];

    tablePile.push(card);
    source.splice(index, 1);

    applySpecial(card);
    refill(player);
}

// =====================
// TURN ENGINE
// =====================
function runTurn() {
    const player = players[currentPlayer];

    render();

    if (player.isHuman) return;

    gameLocked = true;

    setTimeout(() => {
        botPlay(player);

        nextTurn();

        gameLocked = false;

        render();
        runTurn();
    }, 700);
}

// =====================
// RENDER (SAFE)
// =====================
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
        (me.faceUp || []).map(c =>
            `<img class="card small" src="${getCardImage(c)}">`
        ).join('');

    faceDownEl.innerHTML =
        (me.faceDown || []).map(() =>
            `<img class="card small" src="${getCardImage(null, true)}">`
        ).join('');

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

                <div class="row">
                    ${(p.hand || []).map(() =>
                        `<img class="card small" src="/images/card-back.png">`
                    ).join('')}
                </div>

                <div class="row">
                    ${(p.faceUp || []).map(c =>
                        `<img class="card small" src="${getCardImage(c)}">`
                    ).join('')}
                </div>

                <div class="row">
                    ${(p.faceDown || []).map(() =>
                        `<img class="card small" src="/images/card-back.png">`
                    ).join('')}
                </div>
            </div>
        `).join('');
}

// =====================
// START
// =====================
startGame(1);