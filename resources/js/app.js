import * as Cards from 'deckofcards';

const deck = new Cards.Deck();
deck.shuffle();

console.log(deck.cards);

// CARD IMAGES
function getCardImage(card) {
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

// GAME STATE
let playerHand = [];
let tablePile = [];

// DOM ELEMENTS
const playerHandEl = document.getElementById('player-hand');
const tableEl = document.getElementById('table');
const drawBtn = document.getElementById('draw-card');

// STARTING DEAL
function dealStartingHand() {
    for (let i = 0; i < 5; i++) {
        playerHand.push(deck.draw());
    }

    render();
}

dealStartingHand();

// RENDER CARDS
function render() {
    playerHandEl.innerHTML = '';

    playerHand.forEach((card, index) => {
        const cardEl = document.createElement('div');

        cardEl.innerHTML = `<img src="${getCardImage(card)}" width="90" />`;

        cardEl.style.display = 'inline-block';
        cardEl.style.margin = '5px';
        cardEl.style.cursor = 'pointer';

        cardEl.onclick = () => playCard(index);

        playerHandEl.appendChild(cardEl);
    });

    tableEl.innerHTML = tablePile.map(card => `<img src="${getCardImage(card)}" width="90" />`).join(' ');
}

// PLAY A CARD
function playCard(index) {
    const card = playerHand[index];

    tablePile.push(card);
    playerHand.splice(index, 1);

    render();
}

// DRAW CARD
drawBtn.onclick = () => {
    const card = deck.draw();

    if (card) {
        playerHand.push(card);
        render();
    }
};