// js/asset-modal.js
// ============================================================
// This file handles the "Swap Assets" modal.
// It lets users upload a custom image or GIF for each piece type.
// ============================================================

import { state } from './config.js';
import { updateBoard } from './board.js';

// ============================================================
// PIECE DEFINITIONS
// This array defines every piece slot shown in the modal.
// Each entry has:
//   code  → the key we use in state.pieceTypeImages
//   label → what the user sees
//   symbol→ the unicode chess symbol for display
// ============================================================
const PIECES = [
    // White pieces
    { code: 'wp', label: 'White Pawn',   symbol: '♙', color: 'white' },
    { code: 'wn', label: 'White Knight', symbol: '♘', color: 'white' },
    { code: 'wb', label: 'White Bishop', symbol: '♗', color: 'white' },
    { code: 'wr', label: 'White Rook',   symbol: '♖', color: 'white' },
    { code: 'wq', label: 'White Queen',  symbol: '♕', color: 'white' },
    { code: 'wk', label: 'White King',   symbol: '♔', color: 'white' },
    // Black pieces
    { code: 'bp', label: 'Black Pawn',   symbol: '♟', color: 'black' },
    { code: 'bn', label: 'Black Knight', symbol: '♞', color: 'black' },
    { code: 'bb', label: 'Black Bishop', symbol: '♝', color: 'black' },
    { code: 'br', label: 'Black Rook',   symbol: '♜', color: 'black' },
    { code: 'bq', label: 'Black Queen',  symbol: '♛', color: 'black' },
    { code: 'bk', label: 'Black King',   symbol: '♚', color: 'black' },
];

// ============================================================
// buildModal()
// Creates the modal HTML and injects it into the page.
// We only call this ONCE when the app starts.
// ============================================================
export function buildModal() {

    // --- Overlay (the dark background behind the modal) ---
    const overlay = document.createElement('div');
    overlay.id = 'asset-overlay';

    // Clicking the dark area outside the modal closes it
    overlay.addEventListener('click', (e) => {
        // e.target is the element that was actually clicked
        // We only close if they clicked the overlay itself, not the modal box
        if (e.target === overlay) closeModal();
    });

    // --- Modal box ---
    const modal = document.createElement('div');
    modal.id = 'asset-modal';

    // --- Header row ---
    const header = document.createElement('div');
    header.className = 'modal-header';
    header.innerHTML = `
        <h3>🎨 Customize Pieces</h3>
        <p>Upload an image or GIF for any piece. Supports .jpg .png .gif .webp</p>
        <button id="modal-close-btn">✕</button>
    `;

    // --- Grid of piece slots ---
    const grid = document.createElement('div');
    grid.className = 'modal-grid';

    // ============================================================
    // LOOP — build one "slot" card for each of the 12 piece types
    // ============================================================
    PIECES.forEach(piece => {
        const slot = document.createElement('div');
        slot.className = `piece-slot ${piece.color}-slot`;

        // data-piece stores the piece code on the HTML element
        // so when the user uploads we know WHICH piece to update
        slot.dataset.piece = piece.code;

        slot.innerHTML = `
            <div class="slot-preview" data-piece="${piece.code}">
                <span class="slot-symbol">${piece.symbol}</span>
                <!-- img tag hidden until user uploads something -->
                <img class="slot-img" data-piece="${piece.code}" style="display:none" alt="${piece.label}">
            </div>
            <div class="slot-label">${piece.label}</div>
            <div class="slot-actions">
                <!-- hidden file input, triggered by the Upload button -->
                <input 
                    type="file" 
                    class="slot-file-input" 
                    data-piece="${piece.code}"
                    accept="image/*,.gif"
                    style="display:none"
                >
                <button class="slot-upload-btn" data-piece="${piece.code}">Upload</button>
                <button class="slot-clear-btn" data-piece="${piece.code}" style="display:none">Clear</button>
            </div>
        `;

        grid.appendChild(slot);
    });

    // --- Footer with Reset All button ---
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    footer.innerHTML = `<button id="reset-all-btn">🗑 Reset All Custom Pieces</button>`;

    // --- Assemble modal ---
    modal.appendChild(header);
    modal.appendChild(grid);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // --- Wire up all the events inside the modal ---
    attachModalEvents(overlay);
}

// ============================================================
// attachModalEvents()
// Sets up all click/change listeners inside the modal.
// Uses EVENT DELEGATION on the modal itself — one listener
// handles clicks on ALL buttons by checking e.target.
// ============================================================
function attachModalEvents(overlay) {

    // Close button
    document.getElementById('modal-close-btn')
        .addEventListener('click', closeModal);

    // Reset All button — clears every custom image
    document.getElementById('reset-all-btn')
        .addEventListener('click', resetAllPieces);

    // ============================================================
    // EVENT DELEGATION for Upload / Clear buttons and file inputs
    // Instead of 12 listeners for 12 Upload buttons,
    // we attach ONE listener to the whole modal grid.
    // When anything is clicked, we check what it was.
    // ============================================================
    const grid = overlay.querySelector('.modal-grid');

    grid.addEventListener('click', (e) => {

        // Was it an Upload button?
        if (e.target.classList.contains('slot-upload-btn')) {
            const pieceCode = e.target.dataset.piece;

            // Find the hidden file input for this piece and trigger it
            // querySelector finds the first match inside the grid
            const fileInput = grid.querySelector(`.slot-file-input[data-piece="${pieceCode}"]`);
            fileInput.click(); // programmatically open file picker
        }

        // Was it a Clear button?
        if (e.target.classList.contains('slot-clear-btn')) {
            const pieceCode = e.target.dataset.piece;
            clearPiece(pieceCode);
        }
    });

    // ============================================================
    // File input change — fires when user picks a file
    // We use delegation again: one listener on the grid catches
    // change events from ALL 12 hidden file inputs.
    // ============================================================
    grid.addEventListener('change', (e) => {
        if (e.target.classList.contains('slot-file-input')) {
            const pieceCode = e.target.dataset.piece;
            const file = e.target.files[0];

            if (!file) return; // user cancelled the picker

            handleFileUpload(pieceCode, file, grid);
        }
    });
}

// ============================================================
// handleFileUpload()
// Called when a user picks a file for a piece slot.
// URL.createObjectURL() turns the File object into a URL
// the browser can use as an image src — instantly, no server needed.
// ============================================================
function handleFileUpload(pieceCode, file, grid) {
    // createObjectURL makes a temporary local URL like:
    // "blob:http://localhost:3000/a1b2c3d4-..."
    // This URL only lives in this browser tab session
    const url = URL.createObjectURL(file);

    // ---- 1. Save to state (our central lookup table) ----
    // Now whenever board.js checks state.pieceTypeImages['wn'],
    // it will find this URL and use it
    state.pieceTypeImages[pieceCode] = url;

    // ---- 2. Update the preview in the modal slot ----
    const previewImg = grid.querySelector(`.slot-img[data-piece="${pieceCode}"]`);
    const previewSymbol = grid.querySelector(`.slot-preview[data-piece="${pieceCode}"] .slot-symbol`);
    const clearBtn = grid.querySelector(`.slot-clear-btn[data-piece="${pieceCode}"]`);

    previewImg.src = url;
    previewImg.style.display = 'block';   // show the image
    previewSymbol.style.display = 'none'; // hide the symbol
    clearBtn.style.display = 'inline-block'; // show the Clear button

    // ---- 3. Re-render the board so the change shows immediately ----
    updateBoard();
}

// ============================================================
// clearPiece()
// Removes the custom image for one piece type.
// ============================================================
function clearPiece(pieceCode) {
    // Delete the key from our lookup table
    // The 'delete' keyword removes a property from an object entirely
    delete state.pieceTypeImages[pieceCode];

    // Reset the modal slot preview back to the symbol
    const modal = document.getElementById('asset-modal');
    const previewImg = modal.querySelector(`.slot-img[data-piece="${pieceCode}"]`);
    const previewSymbol = modal.querySelector(`.slot-preview[data-piece="${pieceCode}"] .slot-symbol`);
    const clearBtn = modal.querySelector(`.slot-clear-btn[data-piece="${pieceCode}"]`);
    const fileInput = modal.querySelector(`.slot-file-input[data-piece="${pieceCode}"]`);

    previewImg.style.display = 'none';
    previewImg.src = '';
    previewSymbol.style.display = 'block';
    clearBtn.style.display = 'none';
    fileInput.value = ''; // reset file input so same file can be re-uploaded

    updateBoard();
}

// ============================================================
// resetAllPieces()
// Clears every custom piece image at once.
// ============================================================
function resetAllPieces() {
    // Set the object back to empty — wipes all 12 possible entries
    // We use Object.keys() to get all the keys currently in the object
    Object.keys(state.pieceTypeImages).forEach(code => {
        clearPiece(code);
    });
}

// ============================================================
// openModal() / closeModal()
// Show and hide the overlay by toggling a CSS class.
// The actual show/hide is handled in CSS with display:flex/none.
// ============================================================
export function openModal() {
    document.getElementById('asset-overlay').classList.add('open');
}

export function closeModal() {
    document.getElementById('asset-overlay').classList.remove('open');
}