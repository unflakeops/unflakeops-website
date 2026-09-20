const dial = document.querySelector('#workflow-dial');
const board = document.querySelector('.flow-board');
const wires = document.querySelector('.flow-wires');
const ns = 'http://www.w3.org/2000/svg';
let routes = [];
function drawWires() {
  const bounds = board.getBoundingClientRect();
  const box = selector => {
    const r = selector.getBoundingClientRect();
    return {x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height};
  };
  const hub = box(board.querySelector('.hub-disc'));
  const report = box(board.querySelector('.flow-report'));
  const vertical = window.matchMedia('(max-width: 760px)').matches;
  const pathBetween = (a,b) => {
    if(vertical){const x=a.x+a.w/2,y=a.y+a.h,xx=b.x+b.w/2,yy=b.y,m=(y+yy)/2;return `M ${x} ${y} C ${x} ${m}, ${xx} ${m}, ${xx} ${yy}`;}
    const x=a.x+a.w,y=a.y+a.h/2,xx=b.x,yy=b.y+b.h/2,m=(x+xx)/2;
    return `M ${x} ${y} C ${m} ${y}, ${m} ${yy}, ${xx} ${yy}`;
  };
  const paths=[...board.querySelectorAll('.flow-card')].map(el=>pathBetween(box(el),hub));
  paths.push(pathBetween(hub,report));
  wires.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
  wires.querySelectorAll('g').forEach(g=>g.replaceChildren());
  routes=paths.map(d=>{
    const track=document.createElementNS(ns,'path');track.setAttribute('d',d);
    wires.querySelector('.wire-tracks').append(track);
    const active=track.cloneNode();active.setAttribute('pathLength','1');active.setAttribute('stroke-dasharray','1');
    wires.querySelector('.wire-active').append(active);return active;
  });
  updateFlow();
}
function updateFlow(){
  const value=Number(dial.value),p=value/100;
  routes.forEach((path,i)=>path.setAttribute('stroke-dashoffset',String(1-Math.max(0,Math.min(1,i===4?(p-.55)/.45:p/.65)))));
  document.querySelector('#flow-progress').textContent=`${value}%`;
  const status=value===0?'Manual: separate files, repeated copying and chasing.':value<65?'Connecting: bringing the source information into one workflow.':value<100?'Checking: validating the information and preparing the report.':'Repeatable: connected inputs, visible checks, one governed report.';
  document.querySelector('#flow-status').textContent=status;
  dial.setAttribute('aria-valuetext',status);
  const ready=value===100;
  board.classList.toggle('is-ready',ready);
  document.querySelector('.report-badge').textContent=ready?'READY TO REVIEW':value===0?'WAITING FOR INPUTS':'IN PREPARATION';
  document.querySelector('.report-note').textContent=ready?'Prepared for your team to review.':'Connect the sources to prepare the report.';
  document.querySelector('.hub-disc').style.borderColor=value>0?'#a68aff':'#53525f';
  document.querySelectorAll('.report-bars i').forEach((bar,i)=>{bar.style.transform=`scaleX(${Math.max(0,Math.min(1,(p-.55-i*.07)/.3))})`;});
}
dial.addEventListener('input',updateFlow);
dial.addEventListener('change',updateFlow);
new ResizeObserver(drawWires).observe(board);
window.addEventListener('load',drawWires);
drawWires();
document.querySelector("#year").textContent=new Date().getFullYear();
document.querySelector("#contact-form").addEventListener("submit",event=>{event.preventDefault();const data=new FormData(event.currentTarget),subject=`Reporting workflow conversation — ${data.get("organisation")}`,body=[`Name: ${data.get("name")}`,`Organisation: ${data.get("organisation")}`,`Email: ${data.get("email")}`,"","Recurring report or process:",data.get("workflow")].join("\n");window.location.href=`mailto:hello@unflakeops.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
