// public/js/config.js
// Chess() comes from the CDN script tag in game.html as a global variable.
// We cannot use require() in the browser — that's Node.js only.

if (typeof Chess === 'undefined') {
    throw new Error('chess.js failed to load. Check the CDN script tag in game.html.');
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