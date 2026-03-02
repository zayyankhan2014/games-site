const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
let board = Array(9).fill(null);
let turn = 'X';
const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function render(){
  boardEl.innerHTML = '';
  board.forEach((v,i)=>{
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = v || '';
    cell.addEventListener('click',()=>onCell(i));
    boardEl.appendChild(cell);
  });
  const winner = getWinner();
  if(winner) statusEl.textContent = winner === 'tie' ? 'Tie game' : `${winner} wins!`;
  else statusEl.textContent = `Turn: ${turn}`;
}
function onCell(i){
  if(board[i] || getWinner()) return;
  board[i] = turn;
  turn = turn === 'X' ? 'O' : 'X';
  render();
}
function getWinner(){
  for(const [a,b,c] of wins){
    if(board[a] && board[a]===board[b] && board[b]===board[c]) return board[a];
  }
  return board.every(Boolean) ? 'tie' : null;
}
resetBtn.addEventListener('click',()=>{board = Array(9).fill(null); turn='X'; render();});
render();
