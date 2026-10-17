import {icons} from '../data/menus.js?v=0.1.2';
const HEIGHT=74, OFFSET=20;
function item(menu){const row=document.createElement('div');row.className='reel-item';const icon=document.createElement('span');icon.className='food-icon';icon.textContent=icons[menu.category]||'🍽️';const name=document.createElement('span');name.textContent=menu.name;row.append(icon,name);return row;}
export function createReel(menus){const reel=document.createElement('div');reel.className='reel';reel.setAttribute('aria-hidden','true');const track=document.createElement('div');track.className='reel-track';menus.forEach(m=>track.append(item(m)));reel.append(track);return reel;}
export function showPreview(container,pool,count){container.replaceChildren();container.dataset.count=count;container.setAttribute('aria-label',`${count}칸 메뉴 슬롯. 메뉴를 뽑아 보세요.`);for(let i=0;i<count;i++){const choices=Array.from({length:3},(_,j)=>pool[(i+j)%pool.length]||{name:'메뉴를 골라 봐',category:'기타'});container.append(createReel(choices));}}
export async function animateSlots(container,machine,rounds,reduced,onStop){
 container.replaceChildren();container.dataset.count=rounds.length;machine.classList.remove('is-spinning');void machine.offsetWidth;machine.classList.add('is-spinning');
 const promises=rounds.map((round,index)=>{
  const sequence=reduced?[round.candidates[0],round.winner,round.candidates.at(-1)]:[...round.candidates,...round.candidates,...round.candidates,...round.candidates,round.winner,round.candidates[0]];
  const winnerIndex=reduced?1:sequence.length-2;const reel=createReel(sequence);container.append(reel);const track=reel.firstElementChild;
  if(reduced){track.style.transform=`translateY(-${OFFSET}px)`;onStop(round.winner,index);container.setAttribute('aria-label',rounds.map(r=>r.winner.name).join(', '));return Promise.resolve();}
  const end=-(OFFSET+(winnerIndex-1)*HEIGHT);const animation=track.animate([{transform:`translateY(-${OFFSET}px)`},{transform:`translateY(${end}px)`}],{duration:1800+index*400,easing:'cubic-bezier(.12,.68,.16,1)',fill:'forwards'});
  return animation.finished.then(()=>{track.style.transform=`translateY(${end}px)`;animation.cancel();onStop(round.winner,index);container.setAttribute('aria-label',`슬롯 ${index+1}: ${round.winner.name}`);});
 });
 try{await Promise.all(promises);container.setAttribute('aria-label',rounds.map(r=>r.winner.name).join(', '));}finally{machine.classList.remove('is-spinning');}
}
