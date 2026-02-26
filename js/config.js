// js/config.js

export const game = new Chess();


export const state = {
    uploadedImageURL: null,
    selectedSquare: null,
    useImageAssets: true,
    pieceTypeImages: {},

    // Bot settings
    // botMode: 'none' | 'bot-black' | 'bot-white'
    botMode: 'none',
    botDepth: 3,         // how many moves ahead (1=easy, 2=medium, 3=hard)
    botThinking: false,  // true while bot is calculating — blocks human input
};

export const elements = {
    board: document.getElementById('board'),
    gameStatus: document.getElementById('gameStatus'),
    resetBtn: document.getElementById('reset-btn'),
    changeImgBtn: document.getElementById('change-img'),
    toggleStyleBtn: document.getElementById('toggle-style-btn'),
};