import {browseMenus,catalogSource,catalogCategories,groupMenus} from '../logic/browse.js?v=0.1.9';
import {icons} from '../data/menus.js?v=0.1.9';
export function setupCatalog(getCurrentMode){
 const dialog=document.querySelector('#menu-catalog');const trigger=document.querySelector('#catalog-open');
 const search=dialog.querySelector('#catalog-search'),clear=dialog.querySelector('#catalog-clear'),categorySelect=dialog.querySelector('#catalog-category');
 const content=dialog.querySelector('#catalog-content'),counter=dialog.querySelector('#catalog-status');
 trigger.querySelector('small').textContent=`${catalogSource('all').length}개`;
 dialog.querySelector('[data-catalog-scope="all"] small').textContent=String(catalogSource('all').length);
 const state={scope:'all',view:'all',category:'all',query:''};let previousOverflow='';
 function menuList(menus){
  const list=document.createElement('ul');list.className='catalog-menu-list';
  for(const menu of menus){const li=document.createElement('li');const icon=document.createElement('span');icon.className='catalog-menu-icon';icon.setAttribute('aria-hidden','true');icon.textContent=icons[menu.category];const text=document.createElement('div');const name=document.createElement('span');name.className='catalog-menu-name';name.textContent=menu.name;const category=document.createElement('small');category.textContent=menu.category;text.append(name,category);li.append(icon,text);list.append(li);}
  return list;
 }
 function updateCategories(){
  categorySelect.replaceChildren();for(const category of ['all',...catalogCategories(state.scope)]){const option=document.createElement('option');option.value=category;option.textContent=category==='all'?'전체 카테고리':category;categorySelect.append(option);}categorySelect.value=state.category;
 }
 function render(){
  dialog.querySelectorAll('[data-catalog-scope]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.catalogScope===state.scope)));
  dialog.querySelectorAll('[data-catalog-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.catalogView===state.view)));
  dialog.querySelector('#catalog-category-field').hidden=state.view!=='category';clear.hidden=!state.query;
  const menus=browseMenus(state),total=catalogSource(state.scope).length;counter.textContent=`${menus.length}개 표시 · 전체 ${total}개`;
  content.replaceChildren();content.scrollTop=0;
  if(!menus.length){const empty=document.createElement('div');empty.className='catalog-empty';const strong=document.createElement('strong');strong.textContent='찾는 메뉴가 없어요';const hint=document.createElement('p');hint.textContent='검색어를 바꾸거나 다른 모드·카테고리를 선택해 보세요.';empty.append(strong,hint);content.append(empty);return;}
  if(state.view==='category'){
   for(const [index,group] of groupMenus(menus,state.scope).entries()){const section=document.createElement('section');section.className='catalog-group';const title=document.createElement('h3');title.id=`catalog-group-${index}`;title.textContent=`${group.category} · ${group.menus.length}개`;section.setAttribute('aria-labelledby',title.id);section.append(title,menuList(group.menus));content.append(section);}
  }else content.append(menuList(menus));
 }
 trigger.addEventListener('click',()=>{
  if(dialog.open)return;state.scope=getCurrentMode();state.query='';state.category='all';search.value='';updateCategories();render();
  previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';trigger.setAttribute('aria-expanded','true');search.focus();
 });
 dialog.addEventListener('keydown',event=>{
  if(event.key!=='Tab')return;
  const stops=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(element=>!element.closest('[hidden]')&&element.getClientRects().length);
  const first=stops[0],last=stops.at(-1);if(!first)return;
  if(event.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){event.preventDefault();first.focus();}
 });
 dialog.querySelector('#catalog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;trigger.setAttribute('aria-expanded','false');if(!trigger.disabled)trigger.focus();});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.querySelectorAll('[data-catalog-scope]').forEach(button=>button.addEventListener('click',()=>{state.scope=button.dataset.catalogScope;state.category='all';updateCategories();render();}));
 dialog.querySelectorAll('[data-catalog-view]').forEach(button=>button.addEventListener('click',()=>{state.view=button.dataset.catalogView;state.category='all';categorySelect.value='all';render();}));
 categorySelect.addEventListener('change',()=>{state.category=categorySelect.value;render();});
 search.addEventListener('input',()=>{state.query=search.value;render();});
 clear.addEventListener('click',()=>{state.query='';search.value='';render();search.focus();});
}
