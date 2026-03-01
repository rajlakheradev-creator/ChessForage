// js/bot.js
import { game } from './config.js';

const PIECE_VALUES = {
    p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000
};

const POSITION_BONUS = {
    p: [
         0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
         5,  5, 10, 25, 25, 10,  5,  5,
         0,  0,  0, 20, 20,  0,  0,  0,
         5, -5,-10,  0,  0,-10, -5,  5,
         5, 10, 10,-20,-20, 10, 10,  5,
         0,  0,  0,  0,  0,  0,  0,  0
    ],
    n: [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50
    ],
    b: [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20
    ],
    r: [
         0,  0,  0,  0,  0,  0,  0,  0,
         5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
         0,  0,  0,  5,  5,  0,  0,  0
    ],
    q: [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
         -5,  0,  5,  5,  5,  5,  0, -5,
          0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
    ],
    k: [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
         20, 20,  0,  0,  0,  0, 20, 20,
         20, 30, 10,  0,  0, 10, 30, 20
    ]
};

function evaluateBoard() {
    let score = 0;
    const board = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!piece) continue;

            const baseValue = PIECE_VALUES[piece.type];
            const table = POSITION_BONUS[piece.type];
            const tableIndex = piece.color === 'w'
                ? row * 8 + col
                : (7 - row) * 8 + col;

            const posBonus = table ? table[tableIndex] : 0;
            const totalValue = baseValue + posBonus;

            if (piece.color === 'b') score += totalValue;
            else score -= totalValue;
        }
    }
    return score;
}

function minimax(depth, alpha, beta, isMaximizing) {
    if (depth === 0) return evaluateBoard();

    // chess.js v1.x: game_over() → isGameOver()
    if (game.isGameOver()) return evaluateBoard();

    const moves = game.moves();

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (const move of moves) {
            game.move(move);
            const score = minimax(depth - 1, alpha, beta, false);
            game.undo();
            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, score);
            if (alpha >= beta) break;
        }
        return bestScore;
    } else {
        let bestScore = +Infinity;
        for (const move of moves) {
            game.move(move);
            const score = minimax(depth - 1, alpha, beta, true);
            game.undo();
            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, score);
            if (alpha >= beta) break;
        }
        return bestScore;
    }
}

export function getBestMove(depth = 3) {
    const moves = game.moves();
    shuffleArray(moves);

    let bestMove = null;
    let bestScore = -Infinity;
    let alpha = -Infinity;
    let beta = +Infinity;

    for (const move of moves) {
        game.move(move);
        const score = minimax(depth - 1, alpha, beta, false);
        game.undo();

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
            alpha = Math.max(alpha, score);
        }
    }
    return bestMove;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}