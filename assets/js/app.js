import {categoriesFor,icons} from './data/menus.js';
import {getPool,draw} from './logic/recommend.js';
import {loadSettings,saveSettings} from './state/storage.js';
import {showPreview,animateSlots} from './ui/slots.js?v=0.1.1';
const $=s=>document.querySelector(s);let storage;try{storage=window.localStorage;}catch{}
const state=loadSettings(storage);let spinning=false;let results=[];
const labels={lunch:['오늘 점심,','뭐 먹지?','고민은 짧게, 한 끼는 맛있게. 오늘의 메뉴를 뽑아 봐.'],dinner:['오늘 저녁,','뭐 먹지?','하루의 끝, 맛있는 선택. 오늘 저녁은 운에 맡겨 봐.'],cafe:['잠깐 쉬어 갈까,','카페 갈래?','커피 한 잔부터 달콤한 한 입까지. 오늘의 취향을 뽑아 봐.']};
function message(text){$('#message').textContent=text;}
function clearResults(){results=[];$('#results').replaceChildren();$('#result-section').hidden=true;}
function render(){
 const [title,accent,subtitle]=labels[state.mode];$('#question').replaceChildren(document.createTextNode(title+' '));const span=document.createElement('span');span.textContent=accent;$('#question').append(span);$('#subtitle').textContent=subtitle;
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
 document.querySelectorAll('[data-method]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.method===state.method)));
 document.querySelectorAll('[data-count]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.count===state.count)));
 $('#category-panel').hidden=state.method!=='category';$('#category-count').textContent=state.categoriesByMode[state.mode].length+' / 3';$('#categories').replaceChildren();
 for(const category of categoriesFor(state.mode)){const b=document.createElement('button');b.textContent=category;b.dataset.category=category;b.setAttribute('aria-pressed',String(state.categoriesByMode[state.mode].includes(category)));$('#categories').append(b);}
 const pool=getPool(state);const empty=state.method==='category'&&!state.categoriesByMode[state.mode].length;
 $('#pool-label').textContent=`후보 ${pool.length}개 중 ${state.count}개 추천`;
 $('#spin').disabled=empty||pool.length<state.count;$('#spin').replaceChildren(document.createTextNode(results.length?'다시 뽑기':'메뉴 뽑기'));const arrow=document.createElement('span');arrow.textContent='↗';$('#spin').append(arrow);
 message(empty?'카테고리를 1~3개 선택해 주세요.':pool.length<state.count?`후보가 ${pool.length}개예요. 추천 개수를 줄여 주세요.`:'');
 $('#reduce-motion').checked=state.reduceMotion;showPreview($('#reels'),pool,state.count);
}
function changed(){clearResults();$('#stage-label').textContent='오늘의 맛있는 우연';$('#stage-caption').textContent='한 번의 우연이, 맛있는 하루가 되도록.';render();if(!saveSettings(storage,state))message('설정을 저장할 수 없지만 메뉴 추천은 이용할 수 있어요.');}
function lock(value){spinning=value;document.querySelectorAll('main button, #reduce-motion').forEach(b=>b.disabled=value);$('#machine').setAttribute('aria-busy',String(value));}
function addResult(menu,index){results[index]=menu;$('#result-section').hidden=false;$('#results').style.setProperty('--count',state.count);const card=document.createElement('article');card.className='result-card';const icon=document.createElement('span');icon.className='food-icon';icon.textContent=icons[menu.category];const content=document.createElement('div');const category=document.createElement('small');category.textContent=menu.category;const name=document.createElement('h3');name.textContent=menu.name;const n=document.createElement('span');n.className='result-number';n.textContent=String(index+1).padStart(2,'0');content.append(category,name);card.append(icon,content,n);$('#results').append(card);}
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{if(spinning)return;state.mode=b.dataset.mode;changed();}));
document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>{if(spinning)return;state.method=b.dataset.method;changed();}));
document.querySelectorAll('[data-count]').forEach(b=>b.addEventListener('click',()=>{if(spinning)return;state.count=+b.dataset.count;changed();}));
$('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b||spinning)return;const list=state.categoriesByMode[state.mode];const i=list.indexOf(b.dataset.category);if(i>=0)list.splice(i,1);else if(list.length<3)list.push(b.dataset.category);else{message('카테고리는 최대 3개까지 선택할 수 있어요.');return;}changed();$('#categories').querySelector(`[data-category="${b.dataset.category}"]`)?.focus();});
$('#reduce-motion').addEventListener('change',e=>{if(spinning)return;state.reduceMotion=e.target.checked;if(!saveSettings(storage,state))message('설정을 저장할 수 없지만 메뉴 추천은 이용할 수 있어요.');});
$('#spin').addEventListener('click',async()=>{
 if(spinning)return;const pool=getPool(state);if(state.method==='category'&&!state.categoriesByMode[state.mode].length){message('카테고리를 1~3개 선택해 주세요.');return;}
 try{const rounds=draw(pool,state.count);clearResults();lock(true);message('맛있는 메뉴를 고르는 중이에요…');$('#stage-label').textContent='오늘의 메뉴를 고르는 중';
 await animateSlots($('#reels'),$('#machine'),rounds,state.reduceMotion||window.matchMedia('(prefers-reduced-motion: reduce)').matches,addResult);
 message('메뉴가 나왔어요! 마음에 들면 오늘은 이걸로.');$('#stage-label').textContent='맛있는 선택이 도착했어요';$('#stage-caption').textContent=results.map(m=>m.name).join(' · ');
 }catch(error){message(error instanceof Error?error.message:'다시 시도해 주세요.');}finally{lock(false);$('#spin').replaceChildren(document.createTextNode('다시 뽑기'));const arrow=document.createElement('span');arrow.textContent='↻';$('#spin').append(arrow);}
});
render();
