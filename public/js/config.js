// public/js/config.js
// Chess is imported as ESM in index.js and set on window.Chess so all
// modules can access it. We cannot use require() — that's Node.js only.

if (typeof Chess === 'undefined') {
    throw new Error('Chess is not defined — index.js must import chess.js before this runs.');
}

export const game = new Chess();

export const state = {
    uploadedImageURL: null,
    selectedSquare: null,
    useImageAssets: true,
    pieceTypeImages: {},

    // Bot settings
    // botMode: 'none' | 'bot-black' | 'bot-white'
    botMode: 'none',
    botDepth: 3,
    botThinking: false,
};

export const elements = {
    board: document.getElementById('board'),
    gameStatus: document.getElementById('gameStatus'),
    resetBtn: document.getElementById('reset-btn'),
    changeImgBtn: document.getElementById('change-img'),
    toggleStyleBtn: document.getElementById('toggle-style-btn'),
};