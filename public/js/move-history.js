// js/move-history.js
// ============================================================
// Manages the move history sidebar.
// Responsibilities:
//   - Store every move as an object in an array
//   - Render the sidebar list
//   - Handle clicking a move to replay to that point
// ============================================================

import { game } from './config.js';
import { updateBoard } from './board.js';
import { updateGameStatus } from './game-control.js';

// ============================================================
// THE HISTORY ARRAY
// This is our single source of truth for all moves played.
// Each entry is a plain object — easy to read, easy to loop over.
// ============================================================
let history = [];

// Track which move is currently "active" for replay highlighting
let activeIndex = -1; // -1 means we're at the live game end

// Piece symbols for display in the sidebar
const SYMBOLS = {
    wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♔',
    bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚'
};

const PIECE_NAMES = {
    p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King'
};

// ============================================================
// buildSidebar()
// Creates the sidebar HTML and injects it into the page.
// Called once on startup from main.js.
// ============================================================
export function buildSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'move-sidebar';

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <span>📜 Move History</span>
            <span id="move-count">0 moves</span>
        </div>
        <div id="move-list">
            <div class="move-list-empty">No moves yet</div>
        </div>
        <div class="sidebar-footer">
            <button id="sidebar-start-btn" title="Jump to start">⏮</button>
            <button id="sidebar-prev-btn" title="Previous move">◀</button>
            <button id="sidebar-live-btn" title="Back to live game">▶ Live</button>
            <button id="sidebar-next-btn" title="Next move">▶</button>
            <button id="sidebar-end-btn" title="Jump to end">⏭</button>
        </div>
    `;

    // Insert sidebar BEFORE the game container so it sits to the left
    const gameContainer = document.querySelector('.game-container');
    gameContainer.parentNode.insertBefore(sidebar, gameContainer);

    // Wrap board + sidebar in a flex row container
    const wrapper = document.createElement('div');
    wrapper.id = 'game-wrapper';
    gameContainer.parentNode.insertBefore(wrapper, gameContainer);
    wrapper.appendChild(sidebar);
    wrapper.appendChild(gameContainer);

    // Wire up navigation buttons
    document.getElementById('sidebar-start-btn').addEventListener('click', () => replayTo(0));
    document.getElementById('sidebar-prev-btn').addEventListener('click', () => {
        const target = activeIndex === -1 ? history.length - 1 : Math.max(0, activeIndex - 1);
        replayTo(target);
    });
    document.getElementById('sidebar-next-btn').addEventListener('click', () => {
        if (activeIndex === -1) return; // already at live
        const next = activeIndex + 1;
        if (next >= history.length) returnToLive();
        else replayTo(next);
    });
    document.getElementById('sidebar-end-btn').addEventListener('click', returnToLive);
    document.getElementById('sidebar-live-btn').addEventListener('click', returnToLive);
}

// ============================================================
// recordMove()
// Called from game-control.js right after a successful move.
// 'moveObj' is what chess.js returns from game.move() —
// it has .san, .piece, .from, .to, .captured, .color, .flags
// ============================================================
export function recordMove(moveObj) {
    // game.fen() returns the board state AS A STRING after the move.
    // Example: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    // We snapshot it NOW so we can restore it during replay later.
    const fen = game.fen();

    // Build the move number: moves 0,1 = move 1, moves 2,3 = move 2, etc.
    // Math.floor(history.length / 2) + 1 gives us the chess move number
    const moveNumber = Math.floor(history.length / 2) + 1;

    // Push a new object into our history array
    history.push({
        number: moveNumber,
        color: moveObj.color,       // 'w' or 'b'
        san: moveObj.san,           // e.g. 'Nf3', 'O-O', 'exd5'
        piece: moveObj.piece,       // 'p','n','b','r','q','k'
        from: moveObj.from,         // e.g. 'e2'
        to: moveObj.to,             // e.g. 'e4'
        captured: moveObj.captured || null, // 'p','n', etc. or null
        flags: moveObj.flags,       // 'n','c','e','p','k','q'
        fen: fen                    // full board snapshot
    });

    // When a new move is played we always jump to live end
    activeIndex = -1;

    renderSidebar();
}

// ============================================================
// renderSidebar()
// Rebuilds the move list HTML from the history array.
// Called after every move or replay jump.
// ============================================================
function renderSidebar() {
    const list = document.getElementById('move-list');
    const countEl = document.getElementById('move-count');

    countEl.textContent = `${history.length} move${history.length !== 1 ? 's' : ''}`;

    if (history.length === 0) {
        list.innerHTML = '<div class="move-list-empty">No moves yet</div>';
        return;
    }

    list.innerHTML = '';

    // ============================================================
    // PAIR UP MOVES: chess shows White + Black on the same row
    // We loop by 2s, grabbing history[0]+history[1], history[2]+history[3]...
    // ============================================================
    for (let i = 0; i < history.length; i += 2) {
        const whiteMove = history[i];       // always exists
        const blackMove = history[i + 1];   // might be undefined if game ended on white's turn

        const row = document.createElement('div');
        row.className = 'move-row';

        // Move number label (1, 2, 3...)
        const numCell = document.createElement('div');
        numCell.className = 'move-num';
        numCell.textContent = whiteMove.number + '.';

        // White's move cell
        const whiteCell = buildMoveCell(whiteMove, i);

        // Black's move cell (or empty if game ended)
        const blackCell = blackMove
            ? buildMoveCell(blackMove, i + 1)
            : document.createElement('div');
        blackCell.className = blackCell.className || 'move-cell empty';

        row.appendChild(numCell);
        row.appendChild(whiteCell);
        row.appendChild(blackCell);
        list.appendChild(row);
    }

    // Auto-scroll to the bottom so latest move is always visible
    list.scrollTop = list.scrollHeight;
}

// ============================================================
// buildMoveCell()
// Creates one clickable move entry showing:
//   - piece symbol
//   - SAN notation
//   - from → to squares
//   - captured piece (if any)
// ============================================================
function buildMoveCell(move, index) {
    const cell = document.createElement('div');
    cell.className = `move-cell ${move.color === 'w' ? 'white-move' : 'black-move'}`;

    // Highlight the active replay move
    if (index === activeIndex) {
        cell.classList.add('active-move');
    }

    // Piece symbol — combine color + piece type to get the right unicode
    const pieceCode = move.color + move.piece;
    const symbol = SYMBOLS[pieceCode] || '?';

    // Captured piece display
    const captureHtml = move.captured
        ? `<span class="captured-piece" title="Captured ${PIECE_NAMES[move.captured]}">
               ✕${SYMBOLS[move.color === 'w' ? 'b' + move.captured : 'w' + move.captured] || ''}
           </span>`
        : '';

    // Special move badges
    let badge = '';
    if (move.flags.includes('k') || move.flags.includes('q')) badge = '<span class="move-badge castle">O-O</span>';
    if (move.flags.includes('e')) badge = '<span class="move-badge ep">e.p.</span>';
    if (move.flags.includes('p')) badge = '<span class="move-badge promo">♛</span>';

    cell.innerHTML = `
        <span class="move-symbol">${symbol}</span>
        <span class="move-san">${move.san}</span>
        <span class="move-squares">${move.from}→${move.to}</span>
        ${captureHtml}
        ${badge}
    `;

    // Click to replay — jump the board back to this moment
    cell.addEventListener('click', () => replayTo(index));

    return cell;
}

// ============================================================
// replayTo(index)
// Loads the board state saved at history[index].
// This is why we stored the FEN snapshot on every move!
// game.load(fen) restores the complete board instantly.
// ============================================================
function replayTo(index) {
    if (index < 0 || index >= history.length) return;

    activeIndex = index;

    // game.load() accepts a FEN string and sets the board to that exact state
    game.load(history[index].fen);

    // Re-render everything
    updateBoard();
    updateGameStatus();
    renderSidebar(); // re-render to update the active highlight
}

// ============================================================
// returnToLive()
// Jumps back to the actual current game state (end of history).
// ============================================================
function returnToLive() {
    if (history.length === 0) return;

    activeIndex = -1;

    // Load the last FEN in history — that's the real current state
    game.load(history[history.length - 1].fen);

    updateBoard();
    updateGameStatus();
    renderSidebar();
}

// ============================================================
// clearHistory()
// Called when the game is reset.
// ============================================================
export function clearHistory() {
    history = [];
    activeIndex = -1;
    renderSidebar();
}