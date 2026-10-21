import {foods,cafes} from './catalog.js?v=1.4.0';
export const foodCategories = ['한식','중식','일식','양식','분식','동남아','패스트푸드','기타'];
export const cafeCategories = ['커피','차·티','논커피','디저트','베이커리'];
// 식사 태그는 편집 기준. 건강·영양 평가나 특정 시간대 섭취 제한을 뜻하지 않는다.
const lunchOnly = new Set(['반미','프렌치토스트']);
const dinnerOnly = new Set(['보쌈','닭갈비','오코노미야키','샤브샤브','스테이크','감바스','양꼬치','훠궈','족발','삼겹살','돼지갈비','소고기구이','곱창구이','막창구이','곱창전골','해물탕','조개구이','모둠회','닭발','무뼈닭발','치킨']);
// 이름 기반 ID: 새 메뉴 삽입/정렬로 기존 메뉴의 ID가 바뀌지 않는다.
export const menuId = (kind,name) => `${kind}-${name.normalize('NFC').replace(/\s+/g,'-')}`;
export const foodMenus = Object.entries(foods).flatMap(([category,names])=>names.map(name=>({id:menuId('food',name),name,category,mealModes:dinnerOnly.has(name)?['dinner']:lunchOnly.has(name)?['lunch']:['lunch','dinner']})));
export const cafeMenus = Object.entries(cafes).flatMap(([category,names])=>names.map(name=>({id:menuId('cafe',name),name,category})));
export const categoriesFor = mode => mode==='cafe'?cafeCategories:foodCategories;
export const icons = {'한식':'🍚','중식':'🥟','일식':'🍣','양식':'🍝','분식':'🍜','동남아':'🍲','패스트푸드':'🍔','기타':'🥙','커피':'☕','차·티':'🍵','논커피':'🥤','디저트':'🍰','베이커리':'🥐'};
