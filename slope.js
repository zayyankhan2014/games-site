// Slope game - ball rolls down slope, avoid obstacles
const canvas = document.getElementById('slopecanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('slopeStart');
const scoreEl = document.getElementById('slopeScore');

let running = false;
let score = 0;
let frame = 0;
let ball = {x: canvas.width/2, y: 50, radius: 8, vx: 0, ax: 0};
let obstacles = [];
let walls = [];
const gravity = 0.6;
const friction = 0.92;
const spawnInterval = 40;
let keys = {};

document.addEventListener('keydown',e=>{
  if(e.key in {'ArrowLeft':1,'ArrowRight':1,'a':1,'A':1,'d':1,'D':1}) keys[e.key.toLowerCase()]='down';
  if(e.code==='Space' || e.key===' ') {if(!running) start();}
});
document.addEventListener('keyup',e=>{delete keys[e.key.toLowerCase()];});
startBtn.addEventListener('click',()=>{start();});

function start(){
  running=true; score=0; frame=0; obstacles=[]; walls=[];
  ball={x:canvas.width/2, y:50, radius:8, vx:0, ax:0};
  scoreEl.textContent='';
  animate();
}

function animate(){
  if(!running) return;
  frame++; score=frame;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  // controls
  ball.ax = 0;
  if(keys['arrowleft'] || keys['a']) ball.ax = -0.3;
  if(keys['arrowright'] || keys['d']) ball.ax = 0.3;
  
  // physics
  ball.vx += ball.ax;
  ball.vx *= friction;
  ball.x += ball.vx;
  ball.y += gravity;
  
  // walls
  if(ball.x - ball.radius < 10) ball.x = 10 + ball.radius, ball.vx = 0;
  if(ball.x + ball.radius > canvas.width-10) ball.x = canvas.width-10-ball.radius, ball.vx = 0;
  if(ball.y > canvas.height) running = false, scoreEl.textContent = 'Game Over! Score: '+score;
  
  // draw ball
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
  ctx.fill();
  
  // spawn obstacles
  if(frame % spawnInterval === 0){
    const w = 30 + Math.random()*40;
    const side = Math.random() < 0.5 ? 'left' : 'right';
    if(side==='left'){
      obstacles.push({x:10, y:-20, width:w, height:15});
    } else {
      obstacles.push({x:canvas.width-10-w, y:-20, width:w, height:15});
    }
  }
  
  // draw and move obstacles
  ctx.fillStyle = '#6BCB77';
  obstacles.forEach(o=>{
    o.y += 3;
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });
  
  // remove offscreen
  obstacles = obstacles.filter(o=>o.y < canvas.height);
  
  // collision
  obstacles.forEach(o=>{
    if(ball.x + ball.radius > o.x && ball.x - ball.radius < o.x + o.width && 
       ball.y + ball.radius > o.y && ball.y - ball.radius < o.y + o.height){
      running = false;
      scoreEl.textContent = 'Game Over! Score: '+score;
    }
  });
  
  // draw edges
  ctx.strokeStyle = '#444';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 0, canvas.width-20, canvas.height);
  
  if(running){
    scoreEl.textContent = 'Score: '+score;
    requestAnimationFrame(animate);
  }
}
