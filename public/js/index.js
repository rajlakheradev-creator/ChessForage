// public/js/index.js
// Chess() is loaded as a global from the <script> tag in game.html
// which points to our locally-served chess.js copy.
// We do NOT import it here — browser globals don't need importing.

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

// ── Boot ─────────────────────────────────────────────────────
buildSidebar();
buildModal();
createBoard();
updateGameStatus();
setupEventListeners();