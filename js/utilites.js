// js/utilites.js
export const pieceSymbols = {
    'wp': '♙', 'wn': '♘', 'wb': '♗', 'wr': '♖', 'wq': '♕', 'wk': '♔',
    'bp': '♟', 'bn': '♞', 'bb': '♝', 'br': '♜', 'bq': '♛', 'bk': '♚'
};

export function getPieceCode(piece) {
    if (!piece) return null;
    return piece.color + piece.type;
}

export function indexToSquare(index) {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const file = String.fromCharCode(97 + col);
    const rank = 8 - row;
    return file + rank;
}