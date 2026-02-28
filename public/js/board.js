// js/board.js
import { game, state, elements } from './config.js';
import { pieceSymbols, getPieceCode, indexToSquare } from './utilites.js';

export function createBoard() {
    elements.board.innerHTML = '';

    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        square.classList.add('square');

        const row = Math.floor(i / 8);
        const col = i % 8;

        // Checkerboard coloring
        if ((row + col) % 2 === 0) {
            square.classList.add('white');
        } else {
            square.classList.add('black');
        }

        const squareId = indexToSquare(i);
        square.dataset.square = squareId;
        square.id = `sq-${squareId}`;

        elements.board.appendChild(square);
    }

    updateBoard();
}

export function updateBoard() {
    const squares = document.querySelectorAll('.square');

    squares.forEach((square, index) => {
        const squareNotation = indexToSquare(index);

        // game.get('e4') returns something like { type: 'p', color: 'w' }
        // or null if the square is empty
        const piece = game.get(squareNotation);

        // Clear whatever was in this square before re-drawing
        square.innerHTML = '';

        if (piece) {
            // getPieceCode turns { type:'n', color:'w' } → 'wn'
            const pieceCode = getPieceCode(piece);

            // ============================================================
            // PRIORITY SYSTEM — checked top to bottom, first match wins
            // ============================================================

            // PRIORITY 1: User uploaded a custom image/GIF for this piece type
            // state.pieceTypeImages is an object like { 'wn': 'blob:...', 'bp': 'blob:...' }
            // We look up this piece's code as the KEY
            if (state.pieceTypeImages[pieceCode]) {
                const img = document.createElement('img');
                img.src = state.pieceTypeImages[pieceCode]; // grab the URL from our lookup table
                img.alt = pieceCode;
                square.appendChild(img);
                return; // stop here, don't fall through to lower priorities
            }

            // PRIORITY 2: Standard image assets (the .jpg files in /images/)
            if (state.useImageAssets) {
                const img = document.createElement('img');
                img.src = `images/${pieceCode}.jpg`;
                img.alt = pieceCode;
                square.appendChild(img);
            }

            // PRIORITY 3: Unicode text symbols (fallback, no images needed)
            else {
                const span = document.createElement('span');
                span.textContent = pieceSymbols[pieceCode]; // e.g. '♞'
                square.appendChild(span);
            }
        }
    });
}