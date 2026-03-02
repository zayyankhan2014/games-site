// Simple geometry dash clone
const canvas = document.getElementById('gdcanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
let running=false,score=0;let cube={x:50,y:100,size:20,vy:0,jump: -8};
let obstacles=[];const gravity=0.4;
const spawnInterval=90;let frame=0;

document.addEventListener('keydown',e=>{if(e.code==='Space'){if(!running)start();else if(cube.y+cube.size>=canvas.height) cube.vy=cube.jump;}});
startBtn.addEventListener('click',()=>{start();});

function start(){running=true;score=0;frame=0;obstacles=[];cube.y=100;cube.vy=0;scoreEl.textContent='';animate();}

function animate(){if(!running)return;
  frame++;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // cube
  cube.vy+=gravity; cube.y+=cube.vy;
  if(cube.y+cube.size>canvas.height) cube.y=canvas.height-cube.size, cube.vy=0;
  ctx.fillStyle='#0af';ctx.fillRect(cube.x,cube.y,cube.size,cube.size);
  // spawn
  if(frame%spawnInterval===0){
    const h=20+Math.random()*60; obstacles.push({x:canvas.width,y:canvas.height-h,width:20,height:h});
  }
  // obs
  ctx.fillStyle='#fa0';
  obstacles.forEach(o=>{o.x-=4;ctx.fillRect(o.x,o.y,o.width,o.height);});
  // remove
  obstacles=obstacles.filter(o=>o.x+o.width>0);
  // collision
  obstacles.forEach(o=>{if(cube.x<o.x+o.width && cube.x+cube.size>o.x && cube.y<o.y+o.height && cube.y+cube.size>o.y){running=false;scoreEl.textContent='Game over. Score: '+score;}});
  if(running){score=frame;scoreEl.textContent='Score: '+score;requestAnimationFrame(animate);} }
