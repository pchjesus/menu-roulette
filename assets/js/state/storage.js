import {defaults,sanitize} from '../logic/recommend.js?v=0.1.6';
export const KEY='menu-roulette.settings.v1';
export function loadSettings(storage){try{return sanitize(JSON.parse(storage.getItem(KEY)));}catch{return defaults();}}
export function saveSettings(storage,settings){try{storage.setItem(KEY,JSON.stringify(sanitize(settings)));return true;}catch{return false;}}
