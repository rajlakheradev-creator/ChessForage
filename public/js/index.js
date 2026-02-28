// public/js/index.js
import { Chess } from 'https://cdn.jsdelivr.net/npm/chess.js@1.4.0/+esm';
import { createBoard } from './board.js';
import { updateGameStatus } from './game-control.js';
import { setupEventListeners } from './ui-handlers.js';
import { buildModal } from './asset-modal.js';
import { buildSidebar } from './move-history.js';

// ── Auth guard ───────────────────────────────────────────────
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

const userName = localStorage.getItem("userName") || "Player";
const welcomeSpan = document.getElementById("welcome-message");
if (welcomeSpan) {
    welcomeSpan.textContent = `Welcome, ${userName}!`;
}

const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        window.location.href = "login.html";
    });
}

// ── Export Chess instance for other modules ──────────────────
// We attach it to window so config.js can pick it up as a global,
// keeping all other files unchanged.
window.Chess = Chess;

// ── Boot order matters ───────────────────────────────────────
buildSidebar();   // 1. sidebar (must exist before board)
buildModal();     // 2. piece customizer modal
createBoard();    // 3. render the chess board
updateGameStatus(); // 4. set initial status text
setupEventListeners(); // 5. attach all click/input handlers