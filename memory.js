const memEl = document.getElementById('memory');
const memStatus = document.getElementById('mem-status');
const shuffleBtn = document.getElementById('shuffle');
let cards = [];
let open = [];
function makeCards(){
  const base = ['🍎','🍋','🍇','🍊','🍓','🍉'];
  cards = base.concat(base).map((v,i)=>({id:i, val:v, matched:false}));
  shuffle(cards);
}
function shuffle(a){
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
}
function render(){
  memEl.innerHTML='';
  cards.forEach(c=>{
    const d = document.createElement('div');
    d.className = 'card-back';
    d.textContent = c.matched || open.includes(c.id) ? c.val : '❓';
    d.addEventListener('click',()=>flip(c.id));
    memEl.appendChild(d);
  });
  memStatus.textContent = `Matches: ${cards.filter(c=>c.matched).length/2}`;
}
function flip(id){
  if(open.includes(id) || cards.find(c=>c.id===id).matched) return;
  open.push(id);
  if(open.length===2){
    const a=cards.find(c=>c.id===open[0]);
    const b=cards.find(c=>c.id===open[1]);
    if(a.val===b.val){a.matched=true;b.matched=true;open=[];render();checkWin();return}
    render();
    setTimeout(()=>{open=[];render();},700);
  }
  render();
}
function checkWin(){if(cards.every(c=>c.matched))memStatus.textContent='You matched all pairs!'}
shuffleBtn.addEventListener('click',()=>{makeCards();open=[];render();});
makeCards();render();
