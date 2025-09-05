const board = document.getElementById('board');
const cells = [];
const pieces = {};
let selected = null;
let turn = 'black';

function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', (row + col) % 2 === 0 ? 'light' : 'dark');
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
      cells.push(cell);
    }
  }
}

function placePieces() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) addPiece(row, col, 'red');
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) addPiece(row, col, 'black');
    }
  }
}

function addPiece(row, col, color) {
  const piece = document.createElement('div');
  piece.classList.add('piece', color);
  piece.dataset.row = row;
  piece.dataset.col = col;
  piece.dataset.color = color;
  piece.dataset.king = 'false';
  piece.addEventListener('click', () => selectPiece(piece));
  getCell(row, col).appendChild(piece);
  pieces[`${row}-${col}`] = piece;
}

function getCell(row, col) {
  return cells.find(c => c.dataset.row == row && c.dataset.col == col);
}

function selectPiece(piece) {
  if (piece.dataset.color !== turn) return;
  if (selected) selected.classList.remove('selected');
  selected = piece;
  selected.classList.add('selected');
}

function movePiece(toRow, toCol) {
  const fromRow = parseInt(selected.dataset.row);
  const fromCol = parseInt(selected.dataset.col);
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (absDx === 1 && absDy === 1 && !pieces[`${toRow}-${toCol}`]) {
    updatePosition(toRow, toCol);
    switchTurn();
  } else if (absDx === 2 && absDy === 2) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;
    const midPiece = pieces[`${midRow}-${midCol}`];
    if (midPiece && midPiece.dataset.color !== selected.dataset.color) {
      getCell(midRow, midCol).removeChild(midPiece);
      delete pieces[`${midRow}-${midCol}`];
      updatePosition(toRow, toCol);
      switchTurn();
    }
  }
}

function updatePosition(row, col) {
  getCell(selected.dataset.row, selected.dataset.col).removeChild(selected);
  selected.dataset.row = row;
  selected.dataset.col = col;
  if ((selected.dataset.color === 'black' && row === 0) ||
      (selected.dataset.color === 'red' && row === 7)) {
    selected.classList.add('king');
    selected.dataset.king = 'true';
  }
  getCell(row, col).appendChild(selected);
  pieces[`${row}-${col}`] = selected;
  delete pieces[`${selected.dataset.row}-${selected.dataset.col}`];
  selected.classList.remove('selected');
  selected = null;
}

function switchTurn() {
  turn = turn === 'black' ? 'red' : 'black';
  if (turn === 'red') setTimeout(computerMove, 500);
}

function computerMove() {
  const redPieces = Object.values(pieces).filter(p => p.dataset.color === 'red');
  for (let piece of redPieces) {
    const row = parseInt(piece.dataset.row);
    const col = parseInt(piece.dataset.col);
    const directions = [[1, -1], [1, 1]];
    for (let [dy, dx] of directions) {
      const newRow = row + dy;
      const newCol = col + dx;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !pieces[`${newRow}-${newCol}`]) {
        selected = piece;
        movePiece(newRow, newCol);
        return;
      }
    }
  }
  switchTurn();
}

board.addEventListener('click', e => {
  if (!selected || !e.target.classList.contains('cell')) return;
  const row = parseInt(e.target.dataset.row);
  const col = parseInt(e.target.dataset.col);
  movePiece(row, col);
});

createBoard();
placePieces();
