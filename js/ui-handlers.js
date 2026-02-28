// js/ui-handlers.js
import { game, state, elements } from './config.js';
import { updateBoard } from './board.js';
import { updateGameStatus, resetGame, triggerBotMove } from './game-control.js';
import { openModal } from './asset-modal.js';
import soundSystem from './sound-system.js';

export function setupEventListeners() {

    // Board clicks
    elements.board.addEventListener('click', (e) => {
        import('./game-control.js').then(m => m.handleBoardClick(e));
    });

    // Piece customizer modal
    elements.changeImgBtn.addEventListener('click', openModal);

    // Toggle Unicode / images
    elements.toggleStyleBtn.addEventListener('click', () => {
        state.useImageAssets = !state.useImageAssets;
        elements.toggleStyleBtn.textContent = state.useImageAssets
            ? 'Switch to Unicode'
            : 'Switch to images';
        updateBoard();
    });

    // Reset
    elements.resetBtn.addEventListener('click', resetGame);

    // Sound toggle
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            const isEnabled = soundSystem.toggle();
            soundToggleBtn.textContent = isEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
        });
    }

    // Volume slider
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            soundSystem.setVolume(e.target.value / 100);
        });
    }

    // Build bot panel
    buildBotPanel();
}

// ============================================================
// buildBotPanel()
// Injects the bot mode UI below the main controls.
// ============================================================
function buildBotPanel() {
    const panel = document.createElement('div');
    panel.id = 'bot-panel';

    panel.innerHTML = `
        <label>🤖 Bot:</label>

        <!-- Mode buttons: Human vs Human / Play vs Bot (Black) / Bot vs Human -->
        <div class="bot-mode-group">
            <button class="bot-mode-btn active" data-mode="none">👥 H vs H</button>
            <button class="bot-mode-btn" data-mode="bot-black">▶ Play vs Bot</button>
            <button class="bot-mode-btn" data-mode="bot-white">◀ Bot goes first</button>
        </div>

        <label>Difficulty:</label>
        <!-- Each option value = search depth for minimax -->
        <select id="bot-difficulty">
            <option value="1">Easy (depth 1)</option>
            <option value="2">Medium (depth 2)</option>
            <option value="3" selected>Hard (depth 3)</option>
            <option value="4">Expert (depth 4 — slow!)</option>
        </select>
    `;

    // Insert after the controls div
    const controls = document.querySelector('.controls');
    controls.insertAdjacentElement('afterend', panel);

    // ============================================================
    // Wire up mode buttons using event delegation on the group
    // ============================================================
    const modeGroup = panel.querySelector('.bot-mode-group');

    modeGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.bot-mode-btn');
        if (!btn) return;

        const newMode = btn.dataset.mode;

        // Update active button styling
        panel.querySelectorAll('.bot-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update state
        state.botMode = newMode;

        // Reset the game when switching modes so the board is clean
        resetGame();
    });

    // ============================================================
    // Wire up difficulty selector
    // The value is a string "1"-"4" so parseInt converts it to number
    // ============================================================
    document.getElementById('bot-difficulty').addEventListener('change', (e) => {
        state.botDepth = parseInt(e.target.value);
    });
}