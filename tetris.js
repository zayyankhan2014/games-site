// Basic Tetris implementation for beginners
// The code is intentionally simple, with comments explaining each part.
// You can expand or refactor it as you learn more.

const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const ROWS = 20;
const COLS = 10;
const BLOCK = 20; // size of a block in pixels

// create empty grid
function createGrid() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

let grid = createGrid();

// shapes (tetrominoes) and their rotations
const SHAPES = {
  I: [
    [[1,1,1,1]],
    [[1],[1],[1],[1]]
  ],
  O: [
    [[1,1],[1,1]]
  ],
  T: [
    [[0,1,0],[1,1,1]],
    [[1,0],[1,1],[1,0]],
    [[1,1,1],[0,1,0]],
    [[0,1],[1,1],[0,1]]
  ],
  L: [
    [[1,0],[1,0],[1,1]],
    [[0,0,1],[1,1,1]],
    [[1,1],[0,1],[0,1]],
    [[1,1,1],[1,0,0]]
  ],
  J: [
    [[0,1],[0,1],[1,1]],
    [[1,0,0],[1,1,1]],
    [[1,1],[1,0],[1,0]],
    [[1,1,1],[0,0,1]]
  ],
  S: [
    [[0,1,1],[1,1,0]],
    [[1,0],[1,1],[0,1]]
  ],
  Z: [
    [[1,1,0],[0,1,1]],
    [[0,1],[1,1],[1,0]]
  ]
};

// colors for each type
const COLORS = {
  I: 'cyan',
  O: 'yellow',
  T: 'purple',
  L: 'orange',
  J: 'blue',
  S: 'green',
  Z: 'red'
};

// piece object
class Piece {
  constructor(type) {
    this.type = type;
    this.rot = 0;
    this.shape = SHAPES[type][this.rot];
    this.x = Math.floor((COLS - this.shape[0].length) / 2);
    this.y = 0;
  }
  rotate() {
    this.rot = (this.rot + 1) % SHAPES[this.type].length;
    this.shape = SHAPES[this.type][this.rot];
  }
}

let current = randomPiece();
let dropInterval = 1000; // ms
let lastDrop = 0;

function randomPiece() {
  const types = Object.keys(SHAPES);
  const type = types[Math.floor(Math.random() * types.length)];
  return new Piece(type);
}

function drawGrid() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // always draw a border so cells are visible
      ctx.strokeStyle = '#333';
      ctx.strokeRect(c*BLOCK, r*BLOCK, BLOCK, BLOCK);
      if (grid[r][c]) {
        ctx.fillStyle = grid[r][c];
        ctx.fillRect(c*BLOCK, r*BLOCK, BLOCK, BLOCK);
      }
    }
  }
}

function drawPiece(piece) {
  ctx.fillStyle = COLORS[piece.type];
  piece.shape.forEach((row,y) => {
    row.forEach((v,x) => {
      if (v) ctx.fillRect((piece.x+x)*BLOCK, (piece.y+y)*BLOCK, BLOCK, BLOCK);
    });
  });
}

function valid(posX, posY, shape) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const nx = posX + x;
        const ny = posY + y;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
        if (ny >= 0 && grid[ny][nx]) return false;
      }
    }
  }
  return true;
}

function place(piece) {
  piece.shape.forEach((row,y) => {
    row.forEach((v,x) => {
      if (v && piece.y+y >= 0) {
        grid[piece.y+y][piece.x+x] = COLORS[piece.type];
      }
    });
  });
}

function clearLines() {
  for (let r = ROWS-1; r>=0; r--) {
    if (grid[r].every(cell=>cell)) {
      grid.splice(r,1);
      grid.unshift(Array(COLS).fill(0));
      r++;
    }
  }
}

function update(time=0) {
  if (time - lastDrop > dropInterval) {
    if (valid(current.x, current.y+1, current.shape)) {
      current.y++;
    } else {
      place(current);
      clearLines();
      current = randomPiece();
      if (!valid(current.x, current.y, current.shape)) {
        // game over: reset grid
        grid = createGrid();
      }
    }
    lastDrop = time;
  }
  drawGrid();
  drawPiece(current);
  requestAnimationFrame(update);
}

// handle keyboard
// prevent the arrow keys from scrolling the page when the game is focused
window.addEventListener('keydown', e => {
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }
  switch (e.key) {
    case 'ArrowLeft':
      if (valid(current.x-1, current.y, current.shape)) current.x--;
      break;
    case 'ArrowRight':
      if (valid(current.x+1, current.y, current.shape)) current.x++;
      break;
    case 'ArrowDown':
      if (valid(current.x, current.y+1, current.shape)) current.y++;
      break;
    case 'ArrowUp':
      const oldRot = current.rot;
      current.rotate();
      if (!valid(current.x, current.y, current.shape)) {
        current.rot = oldRot;
        current.shape = SHAPES[current.type][oldRot];
      }
      break;
  }
});

// start the loop
update();
