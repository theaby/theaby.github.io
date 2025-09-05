const board = document.getElementById('board');
const statusText = document.getElementById('status');
let selectedPiece = null;
let currentPlayer = 'red';

const directions = {
  red: [[-1, -1], [-1, 1]],
  black: [[1, -1], [1, 1]],
  king: [[-1, -1], [-1, 1], [1, -1], [1, 1]]
};

function createBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
      board.appendChild(cell);

      if ((row + col) % 2 !== 0) {
        if (row < 3) addPiece(cell, 'black');
        if (row > 4) addPiece(cell, 'red');
      }
    }
  }
}

function addPiece(cell, color) {
  const piece = document.createElement('div');
  piece.classList.add('piece', color);
  piece.draggable = false;
  cell.appendChild(piece);
}

function resetGame() {
  selectedPiece = null;
  currentPlayer = 'red';
  statusText.textContent = "Red's turn";
  createBoard();
}

function getCell(row, col) {
  return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

function getPiece(cell) {
  return cell?.querySelector('.piece');
}

function isKing(piece) {
  return piece?.classList.contains('king');
}

function getValidMoves(piece, row, col) {
  const color = piece.classList.contains('red') ? 'red' : 'black';
  const moves = [];
  const dirs = isKing(piece) ? directions.king : directions[color];

  dirs.forEach(([dr, dc]) => {
    const r = row + dr;
    const c = col + dc;
    const target = getCell(r, c);
    if (target && !getPiece(target)) {
      moves.push(target);
    } else {
      const jumpR = row + dr * 2;
      const jumpC = col + dc * 2;
      const jumpCell = getCell(jumpR, jumpC);
      const midPiece = getPiece(getCell(r, c));
      if (
        jumpCell &&
        !getPiece(jumpCell) &&
        midPiece &&
        !midPiece.classList.contains(color)
      ) {
        moves.push(jumpCell);
      }
    }
  });

  return moves;
}

board.addEventListener('click', (e) => {
  const cell = e.target.closest('.cell');
  const piece = getPiece(cell);

  if (piece && piece.classList.contains(currentPlayer)) {
    selectedPiece = { piece, cell };
    board.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    getValidMoves(piece, row, col).forEach(c => c.classList.add('highlight'));
  } else if (selectedPiece && cell.classList.contains('highlight')) {
    const fromCell = selectedPiece.cell;
    const toCell = cell;
    const piece = selectedPiece.piece;

    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);

    const dr = toRow - fromRow;
    const dc = toCol - fromCol;

    if (Math.abs(dr) === 2 && Math.abs(dc) === 2) {
      const midRow = fromRow + dr / 2;
      const midCol = fromCol + dc / 2;
      const midCell = getCell(midRow, midCol);
      const midPiece = getPiece(midCell);
      if (midPiece) midCell.removeChild(midPiece);
    }

    toCell.appendChild(piece);
    fromCell.innerHTML = '';

    if ((currentPlayer === 'red' && toRow === 0) || (currentPlayer === 'black' && toRow === 7)) {
      piece.classList.add('king');
    }

    currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
    statusText.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
    selectedPiece = null;
    board.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
  }
});

createBoard();
