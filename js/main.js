// js/main.js
import { createBoard } from './board.js';
import { updateGameStatus } from './game-control.js';
import { setupEventListeners } from './ui-handlers.js';
import { buildModal } from './asset-modal.js';
import { buildSidebar } from './move-history.js';

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}
// Order matters:
// 1. Build sidebar first (inserts into DOM before game container)
buildSidebar();

// 2. Build piece customizer modal
buildModal();

// 3. Render the chess board
createBoard();

// 4. Set initial status
updateGameStatus();

// 5. Attach all event listeners
setupEventListeners();