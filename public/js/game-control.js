// js/game-control.js
import { game, state, elements } from './config.js';
import { updateBoard } from './board.js';
import soundSystem from './sound-system.js';
import { recordMove, clearHistory } from './move-history.js';
import { getBestMove } from './bot.js';

export function handleBoardClick(e) {
    if (state.botThinking) return;
    if (state.botMode === 'bot-black' && game.turn() === 'b') return;
    if (state.botMode === 'bot-white' && game.turn() === 'w') return;

    const squareDiv = e.target.closest('.square');
    if (!squareDiv) return;

    const squareNotation = squareDiv.dataset.square;
    const piece = game.get(squareNotation);

    document.querySelectorAll('.square').forEach(sq => {
        sq.classList.remove('selected', 'valid-move');
    });

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

            if (!game.isGameOver()) {
                triggerBotMove();
            }
        } else {
            state.selectedSquare = null;
        }
    } catch (err) {
        state.selectedSquare = null;
    }
}

export function triggerBotMove() {
    const isBotTurn =
        (state.botMode === 'bot-black' && game.turn() === 'b') ||
        (state.botMode === 'bot-white' && game.turn() === 'w');

    if (!isBotTurn || state.botMode === 'none') return;

    state.botThinking = true;
    updateGameStatus();

    setTimeout(() => {
        const bestMove = getBestMove(state.botDepth);

        if (bestMove) {
            let fromSquare = null;

            if (typeof bestMove === 'object' && bestMove.from) {
                fromSquare = bestMove.from;
            } else if (typeof bestMove === 'string') {
                const verboseMoves = game.moves({ verbose: true });
                const matched = verboseMoves.find(m => m.san === bestMove);
                fromSquare = matched ? matched.from : null;
            }

            const movingPiece = fromSquare ? game.get(fromSquare) : null;
            const move = game.move(bestMove);

            if (move) {
                handleMoveSound(move, movingPiece || { type: move.piece });
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

    if (state.botThinking) {
        elements.gameStatus.textContent = '🤖 Bot is thinking...';
        elements.gameStatus.style.backgroundColor = '#e8f0ff';
        return;
    }

    // chess.js v1.x API — old methods renamed:
    // in_checkmate() → isCheckmate()
    // in_draw()      → isDraw()
    // in_check()     → inCheck()
    // game_over()    → isGameOver()
    if (game.isCheckmate()) {
        status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`;
        color = '#ffcccc';
        soundSystem.playCheckmate(game.turn() === 'b');
    } else if (game.isDraw()) {
        status = 'Draw!';
        color = '#ffffcc';
        soundSystem.playDraw();
    } else if (game.inCheck()) {
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

    if (state.botMode === 'bot-white') {
        triggerBotMove();
    }
}