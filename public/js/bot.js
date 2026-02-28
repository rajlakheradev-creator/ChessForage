// js/bot.js
// ============================================================
// Chess Bot using Minimax + Alpha-Beta Pruning
// ============================================================

import { game } from './config.js';

// ============================================================
// PIECE VALUES
// How much each piece is worth in "points"
// Bot (black) wants a HIGH score
// Human (white) wants a LOW score
// ============================================================
const PIECE_VALUES = {
    p: 100,   // pawn
    n: 320,   // knight
    b: 330,   // bishop (slightly better than knight)
    r: 500,   // rook
    q: 900,   // queen
    k: 20000  // king — enormous so bot never "trades" it
};

// ============================================================
// POSITION BONUS TABLES
// Beyond just material, good chess means putting pieces
// on GOOD squares. A knight in the center is worth more
// than a knight stuck in the corner.
//
// Each table is 64 numbers (8x8 board) from White's perspective.
// We flip it for Black by reversing the array.
// ============================================================
const POSITION_BONUS = {

    // Pawns: reward pushing forward and controlling center
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

    // Knights: love the center, hate the edges ("a knight on the rim is dim")
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

    // Bishops: like long diagonals, avoid corners
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

    // Rooks: love open files and the 7th rank
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

    // Queen: mobile, avoid early development to edge
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

    // King: hide in the corner during midgame (castled position)
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

// ============================================================
// evaluateBoard()
// Scores the entire board from Black's perspective.
// Positive = good for bot (black)
// Negative = good for human (white)
//
// For every piece on the board:
//   +value if it's Black's piece
//   -value if it's White's piece
// Then add a position bonus based on WHERE the piece sits.
// ============================================================
function evaluateBoard() {
    let score = 0;

    // game.board() returns an 8x8 array of piece objects or null
    // Each piece: { type: 'p', color: 'w' } or null
    const board = game.board();

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (!piece) continue; // empty square

            const baseValue = PIECE_VALUES[piece.type];
            const table = POSITION_BONUS[piece.type];

            // For position bonus:
            // White pieces use the table as-is (row 0 = rank 8)
            // Black pieces use the table REVERSED (flip perspective)
            const tableIndex = piece.color === 'w'
                ? row * 8 + col
                : (7 - row) * 8 + col; // mirror vertically for black

            const posBonus = table ? table[tableIndex] : 0;// Some pieces (like king) might not have a table, so default to 0
            const totalValue = baseValue + posBonus;// Total value of the piece considering its type and position

            // Add for black, subtract for white
            if (piece.color === 'b') {
                score += totalValue;
            } else {
                score -= totalValue;
            }
        }
    }

    return score;
}

// ============================================================
// minimax(depth, alpha, beta, isMaximizing)
//
// depth      → how many more moves to look ahead
// alpha      → best score the MAXIMIZER (bot) has found so far
// beta       → best score the MINIMIZER (human) has found so far
// isMaximizing → whose turn to think: true = bot, false = human
//
// ALPHA-BETA PRUNING:
// alpha and beta act as a "window" of scores worth checking.
// If the current branch can't beat what we already found,
// we stop exploring it early (the "cutoff").
// ============================================================
function minimax(depth, alpha, beta, isMaximizing) {

    // BASE CASE: reached the bottom of our search tree
    // Just evaluate and return — no more recursion
    if (depth === 0) return evaluateBoard();

    // Also stop if the game is already over
    if (game.game_over()) return evaluateBoard();

    // Get all legal moves in the current position
    const moves = game.moves();

    if (isMaximizing) {
        // BOT'S TURN — wants the HIGHEST score
        let bestScore = -Infinity;

        for (const move of moves) {
            game.move(move);           // try the move
            const score = minimax(depth - 1, alpha, beta, false); // recurse
            game.undo();               // undo it — board is restored

            bestScore = Math.max(bestScore, score);

            // Alpha = best the maximizer has found
            alpha = Math.max(alpha, score);

            // PRUNING: if alpha >= beta, the minimizer will never
            // let us reach this position — stop checking this branch
            if (alpha >= beta) break;
        }

        return bestScore;

    } else {
        // HUMAN'S TURN — bot assumes human plays BEST (lowest score for bot)
        let bestScore = +Infinity;

        for (const move of moves) {
            game.move(move);
            const score = minimax(depth - 1, alpha, beta, true);
            game.undo();

            bestScore = Math.min(bestScore, score);

            // Beta = best the minimizer has found
            beta = Math.min(beta, score);

            // PRUNING: maximizer already has something better
            if (alpha >= beta) break;
        }

        return bestScore;
    }
}

// ============================================================
// getBestMove(depth)
// The entry point — called from game-control.js after your move.
// Tries every legal move, runs minimax on each, picks the best.
// ============================================================
export function getBestMove(depth = 3) {
    const moves = game.moves();

    // Shuffle moves so equal-score positions play differently each game
    // Without this the bot always picks the same opening
    shuffleArray(moves);

    let bestMove = null;
    let bestScore = -Infinity;

    // alpha starts at -Infinity, beta at +Infinity
    // These widen as we find better moves
    let alpha = -Infinity;
    let beta = +Infinity;

    for (const move of moves) {
        game.move(move);

        // After bot's move, it's human's turn → isMaximizing = false
        const score = minimax(depth - 1, alpha, beta, false);

        game.undo();

        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
            alpha = Math.max(alpha, score); // update alpha as we find better moves
        }
    }

    return bestMove;
}

// ============================================================
// shuffleArray(arr)
// Fisher-Yates shuffle — randomizes an array in place.
// Used to vary bot's play when multiple moves score equally.
// ============================================================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap arr[i] and arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}