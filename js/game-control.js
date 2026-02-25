// js/game-control.js
import { game, state, elements } from './config.js';
import { updateBoard } from './board.js';
import soundSystem from './sound-system.js';
import { recordMove, clearHistory } from './move-history.js';
import { getBestMove } from './bot.js';

export function handleBoardClick(e) {

    // BLOCK INPUT while bot is thinking
    // Without this the human could move while the bot is mid-calculation
    if (state.botThinking) return;

    // BLOCK INPUT if it's the bot's turn
    // e.g. if bot plays black and it's black's turn, human can't move
    if (state.botMode === 'bot-black' && game.turn() === 'b') return;
    if (state.botMode === 'bot-white' && game.turn() === 'w') return;

    const squareDiv = e.target.closest('.square');
    if (!squareDiv) return;

    const squareNotation = squareDiv.dataset.square;
    const piece = game.get(squareNotation);

    // Reset highlights
    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'valid-move');
    });

    // Select or move
    if (!state.selectedSquare || (piece && piece.color === game.turn())) {
        if (piece && piece.color === game.turn()) {
            state.selectedSquare = squareNotation;
            squareDiv.classList.add('selected');
            highlightValidMoves(squareNotation);
        } else {
            state.selectedSquare = null;
        }
        return;
    }

    try {
        const movingPiece = game.get(state.selectedSquare);

        const move = game.move({
            from: state.selectedSquare,
            to: squareNotation,
            promotion: 'q'
        });

        if (move) {
            handleMoveSound(move, movingPiece);
            recordMove(move);
            state.selectedSquare = null;
            updateBoard();
            updateGameStatus();

            // After human moves, trigger bot if game isn't over
            if (!game.game_over()) {
                triggerBotMove();
            }
        } else {
            state.selectedSquare = null;
        }
    } catch (err) {
        state.selectedSquare = null;
    }
}

// ============================================================
// triggerBotMove()
// Runs AFTER the human makes a move.
// Uses setTimeout(..., 300) so the board visually updates first
// before the bot "thinks" — otherwise the UI freezes mid-move.
//
// Why setTimeout?
// JS is single-threaded. If we called getBestMove() directly,
// the browser can't repaint until the function returns.
// A small delay lets the browser render the human's move first.
// ============================================================
export function triggerBotMove() {
    // Check if bot should play in the current position
    const isBotTurn =
        (state.botMode === 'bot-black' && game.turn() === 'b') ||
        (state.botMode === 'bot-white' && game.turn() === 'w');

    if (!isBotTurn || state.botMode === 'none') return;

    state.botThinking = true;
    updateGameStatus(); // shows "Bot is thinking..."

    // Small delay: lets browser repaint human's move before bot calculates
    setTimeout(() => {
        const bestMove = getBestMove(state.botDepth);

        if (bestMove) {
            const movingPiece = game.get(
                typeof bestMove === 'string'
                    ? bestMove.substring(0, 2)  // SAN string like "e4"
                    : bestMove.from             // verbose move object
            );

            const move = game.move(bestMove);

            if (move) {
                handleMoveSound(move, movingPiece || { type: 'p' });
                recordMove(move);
            }
        }

        state.botThinking = false;
        updateBoard();
        updateGameStatus();
    }, 300);
}

function highlightValidMoves(square) {
    const moves = game.moves({ square, verbose: true });
    moves.forEach(move => {
        const target = document.querySelector(`[data-square="${move.to}"]`);
        if (target) target.classList.add('valid-move');
    });
}

function handleMoveSound(move, movingPiece) {
    if (!movingPiece) return;
    const pieceType = movingPiece.type;
    if (move.captured) {
        soundSystem.playCapture(pieceType, move.captured);
    } else if (move.flags.includes('e')) {
        soundSystem.playEnPassant();
    } else if (move.flags.includes('p')) {
        soundSystem.playPromotion();
    } else if (move.flags.includes('k') || move.flags.includes('q')) {
        soundSystem.playCastling();
    } else {
        const isFirstPawnMove = pieceType === 'p' &&
            ((move.from[1] === '2' && move.to[1] === '4') ||
             (move.from[1] === '7' && move.to[1] === '5'));
        soundSystem.playMove(pieceType, isFirstPawnMove);
    }
}

export function updateGameStatus() {
    let status = '';
    let color = '#dbdbdb';

    // Show "thinking" indicator while bot calculates
    if (state.botThinking) {
        elements.gameStatus.textContent = '🤖 Bot is thinking...';
        elements.gameStatus.style.backgroundColor = '#e8f0ff';
        return;
    }

    if (game.in_checkmate()) {
        status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
        color = '#ffcccc';
        soundSystem.playCheckmate(game.turn() === 'b');
    } else if (game.in_draw()) {
        status = 'Draw!';
        color = '#ffffcc';
        soundSystem.playDraw();
    } else if (game.in_check()) {
        status = `${game.turn() === 'w' ? 'White' : 'Black'} is in check!`;
        color = '#ffeeaa';
        soundSystem.playCheck();
    } else {
        const turnName = game.turn() === 'w' ? 'White' : 'Black';
        const isBot =
            (state.botMode === 'bot-black' && game.turn() === 'b') ||
            (state.botMode === 'bot-white' && game.turn() === 'w');
        status = isBot ? `🤖 ${turnName} (Bot) to move` : `${turnName} to move`;
    }

    elements.gameStatus.textContent = status;
    elements.gameStatus.style.backgroundColor = color;
}

export function resetGame() {
    game.reset();
    state.selectedSquare = null;
    state.botThinking = false;
    clearHistory();
    updateBoard();
    updateGameStatus();

    // If bot plays white, it should move first after reset
    if (state.botMode === 'bot-white') {
        triggerBotMove();
    }
}