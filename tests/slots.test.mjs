import test from 'node:test';
import assert from 'node:assert/strict';
import {buildSequence,stopDuration,SLOT_HEIGHT,SLOT_OFFSET} from '../assets/js/ui/slots.js';
import {foodMenus} from '../assets/js/data/menus.js';
test('normal and reduced sequences land exactly on the chosen menu',()=>{for(const size of [1,2,8])for(let i=0;i<size;i++){const candidates=foodMenus.slice(0,size),winner=candidates[i];for(const reduced of [false,true]){const s=buildSequence({candidates,winner},reduced);assert.equal(s.menus[s.winnerIndex].id,winner.id);assert.ok(s.winnerIndex>=1);assert.ok(s.winnerIndex<s.menus.length-1);const transform=-SLOT_OFFSET-(s.winnerIndex-1)*SLOT_HEIGHT;const center=s.winnerIndex*SLOT_HEIGHT+SLOT_HEIGHT/2+transform;assert.equal(center,90);}}});
test('reels stop left-to-right and finish within four seconds',()=>{const times=[0,1,2].map(stopDuration);assert.ok(times[0]<times[1]&&times[1]<times[2]);assert.ok(times[2]<=4000);});
