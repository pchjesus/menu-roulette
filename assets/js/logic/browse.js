import {foodMenus,cafeMenus,foodCategories,cafeCategories} from '../data/menus.js?v=0.1.9';
const collator=new Intl.Collator('ko',{numeric:true,sensitivity:'base'});
const normalize=value=>String(value??'').normalize('NFC').replace(/\s+/g,'').toLocaleLowerCase('ko');
export function catalogSource(scope='all'){
 if(scope==='cafe')return cafeMenus;
 if(scope==='lunch'||scope==='dinner')return foodMenus.filter(menu=>menu.mealModes.includes(scope));
 return [...foodMenus,...cafeMenus];
}
export function catalogCategories(scope='all'){
 return scope==='cafe'?cafeCategories:scope==='all'?[...foodCategories,...cafeCategories]:foodCategories;
}
export function browseMenus({scope='all',view='all',category='all',query=''}={}){
 const needle=normalize(query);
 const menus=catalogSource(scope).filter(menu=>(category==='all'||menu.category===category)&&(!needle||normalize(menu.name).includes(needle)||normalize(menu.category).includes(needle)));
 if(view==='alpha'||view==='category')return [...menus].sort((a,b)=>collator.compare(a.name,b.name));
 return menus;
}
export function groupMenus(menus,scope='all'){
 return catalogCategories(scope).map(category=>({category,menus:menus.filter(menu=>menu.category===category)})).filter(group=>group.menus.length);
}
