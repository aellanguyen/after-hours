import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const core=await fs.readFile(new URL('composer-core.js',root),'utf8');
const context={TextEncoder,Uint8Array};vm.createContext(context);
vm.runInContext(core.replace(/export /g,'')+';globalThis.api={DEFAULT,SCALES,PROGRESSIONS,INSTRUMENTS,RHYTHMS,compose,midiFile,captureRhythm};',context);
const a=context.api,clone=x=>JSON.parse(JSON.stringify(x));
assert.equal(a.SCALES.length,10);assert.equal(a.PROGRESSIONS.length,40);assert.equal(new Set(a.PROGRESSIONS.map(p=>JSON.stringify(p[1]))).size,40);assert.equal(a.INSTRUMENTS.length,50);assert.equal(a.RHYTHMS.length,20);
for(let scale=0;scale<10;scale++)for(let key=0;key<12;key++)for(let progression=0;progression<40;progression++){
 const state={...clone(a.DEFAULT),scale,key,progression},song=a.compose(state);
 assert.equal(song.bars,32);assert(song.notes.every(n=>Number.isFinite(n.pitch)&&n.start>=0&&n.start+n.duration<=128&&n.velocity>0&&n.velocity<=1));
 const allowed=a.SCALES[scale][1];assert(song.notes.filter(n=>n.track===0).every(n=>allowed.includes(((n.pitch-key)%12+12)%12)));
}
const state=clone(a.DEFAULT);state.taps=[0,.09375,.3125,.65,.875];state.tapBars=1;
for(const bpm of [60,90,136,180]){const capture=a.captureRhythm([0,.31,.88,1.42],bpm);assert.equal(capture.bpm,bpm);assert(capture.ratios.every((ratio,i)=>Math.abs(ratio*capture.bars*240/bpm-[0,.31,.88,1.42][i])<1e-8));}
const song=a.compose(state);for(let bar=0;bar<32;bar++){
 const hits=song.notes.filter(n=>n.track===3&&n.pitch===36&&Math.floor(n.start/4)===bar).map(n=>n.start-bar*4);
 assert.equal(hits.length,state.taps.length);assert(hits.every((t,i)=>Math.abs(t-state.taps[i]*4)<1e-8));
}
for(const bars of [2,4,8]){const s={...state,tapBars:bars};const piece=a.compose(s);const actual=piece.notes.filter(n=>n.track===3&&n.pitch===36&&n.start<bars*4).map(n=>n.start);assert(actual.every((x,i)=>Math.abs(x-state.taps[i]*bars*4)<1e-8));assert.equal(actual.length,state.taps.length);}
assert.equal(a.compose({...state,form:'song'}).bars,56);
assert.equal(JSON.stringify(a.compose(state)),JSON.stringify(a.compose(state)));
const signatures=[0,8,24].map(bar=>song.notes.filter(n=>n.track===0&&n.start>=bar*4&&n.start<(bar+4)*4).map(n=>n.pitch).join(','));assert(new Set(signatures).size>=2);
const midi=a.midiFile(song,state);assert.equal(new TextDecoder().decode(midi.slice(0,4)),'MThd');assert.equal(new DataView(midi.buffer).getUint16(10),5);
for(const file of ['app.js','composer.js','composer-audio.js'])new vm.Script((await fs.readFile(new URL(file,root),'utf8')).replace(/^import .*;$/gm,'').replace(/export /g,''),{filename:file});
console.log('PASS: preset counts, 4,800 scale/key/progression combinations, exact tap timing across 1/2/4/8-bar phrases, section motifs, deterministic composition, MIDI header and application syntax.');
