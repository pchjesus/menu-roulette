import {icons} from '../data/menus.js?v=0.1.4';
export const SLOT_HEIGHT=74;
export const SLOT_OFFSET=21;
const OFFSET=SLOT_OFFSET;
export const stopDuration=index=>2400+index*600;
function item(menu){
 const row=document.createElement('div');row.className='reel-item';
 const icon=document.createElement('span');icon.className='food-icon';icon.textContent=icons[menu.category]||'🍽️';
 const name=document.createElement('span');name.textContent=menu.name;row.append(icon,name);return row;
}
export function createReel(menus){
 const reel=document.createElement('div');reel.className='reel';reel.setAttribute('aria-hidden','true');
 const track=document.createElement('div');track.className='reel-track';menus.forEach(menu=>track.append(item(menu)));reel.append(track);return reel;
}
export function showPreview(container,_pool,count){
 container.replaceChildren();container.dataset.count=count;
 container.setAttribute('aria-label',`${count}칸의 빈 메뉴 슬롯. 메뉴 뽑기를 눌러 주세요.`);
 for(let i=0;i<count;i++)container.append(createReel([]));
}
export function buildSequence(round,reduced=false){
 const candidates=round.candidates;
 if(reduced)return {menus:[candidates[0],round.winner,candidates.at(-1)],winnerIndex:1};
 const menus=[...candidates,...candidates,...candidates,...candidates,...candidates,round.winner,candidates[0]];
 return {menus,winnerIndex:menus.length-2};
}
export async function animateSlots(container,machine,rounds,reduced,onStop){
 container.replaceChildren();container.dataset.count=rounds.length;
 container.setAttribute('aria-label','메뉴 슬롯이 돌아가고 있어요.');
 machine.classList.remove('is-spinning');if(!reduced){void machine.offsetWidth;machine.classList.add('is-spinning');}
 const runs=rounds.map((round,index)=>{
  const {menus,winnerIndex}=buildSequence(round,reduced);const reel=createReel(menus);container.append(reel);
  const track=reel.firstElementChild;const end=-(OFFSET+(winnerIndex-1)*SLOT_HEIGHT);
  const animation=reduced?null:track.animate([{transform:`translateY(-${OFFSET}px)`},{transform:`translateY(${end}px)`}],{duration:stopDuration(index),easing:'cubic-bezier(.15,.65,.25,1)',fill:'forwards'});
  return {track,end,animation,reel};
 });
 try{
  // All reels start together. Commit stops and bubbles strictly from left to right.
  for(let index=0;index<runs.length;index++){
   const run=runs[index];if(run.animation)await run.animation.finished;
   run.track.style.transform=`translateY(${run.end}px)`;run.animation?.cancel();run.reel.classList.add('is-stopped');
   onStop(rounds[index].winner,index);container.setAttribute('aria-label',rounds.slice(0,index+1).map(r=>r.winner.name).join(', '));
  }
 }finally{runs.forEach(run=>run.animation?.cancel());machine.classList.remove('is-spinning');}
}
