import {foodMenus,cafeMenus,categoriesFor} from '../data/menus.js?v=1.4.0';
export function getPool(settings) {
 const source=settings.mode==='cafe'?cafeMenus:foodMenus.filter(m=>m.mealModes.includes(settings.mode));
 return [...new Map(source.filter(m=>settings.method==='all'||settings.categoriesByMode[settings.mode].includes(m.category)).map(m=>[m.id,m])).values()];
}
export function sample(items,count,rng=Math.random){
 if(!Number.isInteger(count)||count<0||count>items.length) throw new RangeError('후보 메뉴가 부족해요. 추천 개수를 줄여 주세요.');
 const copy=[...items];
 for(let i=0;i<count;i++){const r=rng();if(r<0||r>=1||!Number.isFinite(r))throw new RangeError('잘못된 난수');const j=i+Math.floor(r*(copy.length-i));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy.slice(0,count);
}
export function draw(pool,count,rng=Math.random,displayRng=Math.random){
 if(!Number.isInteger(count)||count<1||count>3)throw new RangeError('추천 개수는 1~3개예요.');
 if(pool.length<count)throw new RangeError(`후보가 ${pool.length}개예요. 추천 개수를 줄여 주세요.`);
 // The only winning draw: sample directly from the ENTIRE eligible menu pool.
 // No display list exists when the winners are selected.
 const winners=sample(pool,count,rng);
 return winners.map(winner=>{
  // Cosmetic reel contents are assembled AFTER the complete winning draw.
  // A separate random source prevents visuals from affecting results.
  const others=sample(pool.filter(menu=>menu.id!==winner.id),Math.min(7,pool.length-1),displayRng);
  const displayMenus=sample([...others,winner],others.length+1,displayRng);
  return {winner,displayMenus};
 });
}
export const defaults=()=>({mode:'lunch',method:'all',count:1,categoriesByMode:{lunch:[],dinner:[],cafe:[]},reduceMotion:false});
export function sanitize(raw){
 const d=defaults();if(!raw||typeof raw!=='object')return d;
 if(['lunch','dinner','cafe'].includes(raw.mode))d.mode=raw.mode;
 if(['all','category'].includes(raw.method))d.method=raw.method;
 if([1,2,3].includes(raw.count))d.count=raw.count;
 d.reduceMotion=raw.reduceMotion===true;
 for(const mode of ['lunch','dinner','cafe']){const list=raw.categoriesByMode?.[mode];if(Array.isArray(list))d.categoriesByMode[mode]=[...new Set(list.filter(c=>categoriesFor(mode).includes(c)))].slice(0,3);}
 return d;
}
