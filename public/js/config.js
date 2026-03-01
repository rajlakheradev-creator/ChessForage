// public/js/config.js
// Chess is set on window by the inline module in game.html
// before any of these modules are imported.

export const game = new Chess();

export const state = {
    uploadedImageURL: null,
    selectedSquare: null,
    useImageAssets: true,
    pieceTypeImages: {},
    botMode: 'none',   // 'none' | 'bot-black' | 'bot-white'
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