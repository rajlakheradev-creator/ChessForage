// js/main.js
import { createBoard } from './board.js';
import { updateGameStatus } from './game-control.js';
import { setupEventListeners } from './ui-handlers.js';
import { buildModal } from './asset-modal.js';
import { buildSidebar } from './move-history.js';
import { game } from './config.js';

const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName") || "Player"; // Get the saved name
if (!token) {
    window.location.href = "login.html";
}

// 1. Display the logged-in user's name
const welcomeSpan = document.getElementById("welcome-message");
if (welcomeSpan) {
    welcomeSpan.textContent = `Welcome, ${userName}!`;
}

// 2. Handle Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // Clear the saved data
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        
        // Redirect back to login
        window.location.href = "login.html";
    });
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