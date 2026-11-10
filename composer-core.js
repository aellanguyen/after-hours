// Tap-led composition model. Time is stored in quarter-note beats, never seconds.
export const SCALES=[
 ['Major',[0,2,4,5,7,9,11]],['Natural minor',[0,2,3,5,7,8,10]],['Dorian',[0,2,3,5,7,9,10]],['Phrygian',[0,1,3,5,7,8,10]],['Lydian',[0,2,4,6,7,9,11]],['Mixolydian',[0,2,4,5,7,9,10]],['Harmonic minor',[0,2,3,5,7,8,11]],['Major pentatonic',[0,2,4,7,9]],['Minor pentatonic',[0,3,5,7,10]],['Blues',[0,3,5,6,7,10]],
];
export const PROGRESSIONS=[
 ['Ballad · I–V–vi–IV',[0,4,5,3]],['Ballad · vi–IV–I–V',[5,3,0,4]],['Ballad · I–vi–IV–V',[0,5,3,4]],['Ballad · I–IV–vi–V',[0,3,5,4]],['Ballad · IV–I–V–vi',[3,0,4,5]],
 ['Horror · i–II–i–vii',[0,1,0,6]],['Horror · i–vi–II–v',[0,5,1,4]],['Horror · i–iv–II–i',[0,3,1,0]],['Horror · i–vii–vi–v',[0,6,5,4]],['Horror · i pedal',[0,0,1,0]],
 ['Epic · i–VI–III–VII',[0,5,2,6]],['Epic · i–VII–VI–VII',[0,6,5,6]],['Epic · VI–VII–i–i',[5,6,0,0]],['Epic · i–iv–VI–V extended',[0,3,5,4,0,6,3,4]],['Epic · i–III–VII–iv',[0,2,6,3]],
 ['Cinematic · i–VI–iv–V arc',[0,5,3,4,0,2,5,4]],['Cinematic · I–iii–IV–iv',[0,2,3,3]],['Cinematic · vi–IV–ii–V',[5,3,1,4]],['Cinematic · i–VII–iv–VI',[0,6,3,5]],['Cinematic · I–II–IV–I',[0,1,3,0]],
 ['Techno · i pedal',[0,0,0,0]],['Techno · i–VII ostinato',[0,6,0,6]],['Techno · i–II tension',[0,1,0,1]],['Techno · i–iv pulse',[0,0,3,0]],['Techno · i–VI cycle',[0,5,0,5]],
 ['Pop · I–V–IV–IV',[0,4,3,3]],['Pop · I–IV–V–I',[0,3,4,0]],['Pop · vi–V–IV–V',[5,4,3,4]],['Jazz · ii–V–I–vi',[1,4,0,5]],['Jazz · I–vi–ii–V turnaround',[0,5,1,4,2,5,1,4]],
 ['Soul · I–iii–vi–IV',[0,2,5,3]],['Soul · ii–IV–I–V',[1,3,0,4]],['Ambient · I–IV',[0,3,0,3]],['Ambient · i–VI slow cycle',[0,0,5,5]],['Dream · I–II–vi–IV',[0,1,5,3]],
 ['Suspense · i–II–iv tension',[0,1,3,0,0,1,4,0]],['Adventure · I–V–ii–IV',[0,4,1,3]],['Hope · IV–V–I–I',[3,4,0,0]],['Melancholy · vi–iii–IV–I',[5,2,3,0]],['Resolve · ii–V–vi–I',[1,4,5,0]],
];
// All voices are synthesized. GM program numbers are used for portable MIDI export.
export const INSTRUMENTS=[
 ['Grand piano','Keys',0,'piano'],['Soft piano','Keys',1,'soft'],['Electric piano','Keys',4,'ep'],['FM piano','Keys',5,'fm'],['Clavinet','Keys',7,'pluck'],['Celesta','Keys',8,'bell'],['Music box','Keys',10,'bell'],['Vibraphone','Keys',11,'vibe'],['Marimba','Keys',12,'wood'],['Xylophone','Keys',13,'wood'],
 ['Nylon guitar','Acoustic',24,'pluck'],['Steel guitar','Acoustic',25,'pluck'],['Jazz guitar','Acoustic',26,'soft'],['Muted guitar','Acoustic',28,'mute'],['Harmonics','Acoustic',31,'bell'],['Acoustic bass','Acoustic',32,'bass'],['Finger bass','Acoustic',33,'bass'],['Picked bass','Acoustic',34,'pluck'],['Harp','Acoustic',46,'pluck'],['Dulcimer','Acoustic',15,'wood'],
 ['Violin','Orchestral',40,'strings'],['Viola','Orchestral',41,'strings'],['Cello','Orchestral',42,'strings'],['Double bass','Orchestral',43,'strings'],['Tremolo strings','Orchestral',44,'tremolo'],['Pizzicato strings','Orchestral',45,'pluck'],['String ensemble','Orchestral',48,'ensemble'],['Trumpet','Orchestral',56,'brass'],['French horn','Orchestral',60,'horn'],['Trombone','Orchestral',57,'brass'],['Flute','Orchestral',73,'flute'],['Oboe','Orchestral',68,'reed'],['Clarinet','Orchestral',71,'clarinet'],['Bassoon','Orchestral',70,'reed'],['Timpani','Orchestral',47,'timpani'],
 ['Analog saw','Synth',81,'saw'],['Square lead','Synth',80,'square'],['Triangle lead','Synth',80,'triangle'],['Sub bass','Synth',38,'sub'],['Acid 303','Synth',38,'acid'],['Warm pad','Synth',89,'pad'],['Glass pad','Synth',92,'glass'],['Choir pad','Synth',91,'choir'],['FM bell','Synth',98,'fm'],['Pluck synth','Synth',81,'pluck'],['Resonant bass','Synth',39,'acid'],['Organ','Keys',16,'organ'],['Reed organ','Keys',20,'reed'],['Accordion','Keys',21,'accordion'],['Glockenspiel','Orchestral',9,'bell'],
];
export const RHYTHMS=[
 ['Four on floor',[0,1,2,3]],['Offbeats',[.5,1.5,2.5,3.5]],['Eighth drive',[0,.5,1,1.5,2,2.5,3,3.5]],['Half time',[0,2]],['Tresillo',[0,1.5,3]],['Son clave',[0,1.5,3,5,6]],['Rumba clave',[0,1.5,3.5,5,6]],['Bossa',[0,.75,1.5,2.5,3.25]],['Samba',[0,.5,1.25,2,2.5,3.25]],['Reggaeton',[0,.75,1.5,2,2.75,3.5]],['Funk sixteenth',[0,.75,1.5,1.75,2.5,3.25]],['Garage skip',[0,.75,1.5,2,2.75,3.5]],['Breakbeat',[0,1.5,2.75]],['Dub half-time',[0,1.75,2.5]],['Afro sync',[0,.75,1.5,2.25,3]],['Dotted pulse',[0,.75,1.5,2.25,3,3.75]],['Triplets',[0,2/3,4/3,2,8/3,10/3]],['Sparse sync',[0,1.75,3.5]],['Anticipation',[0,.75,1.75,2.75,3.75]],['Hardgroove',[0,.5,1,1.75,2,2.5,3,3.75]],
];
export const TRACKS=['Melody','Chords','Bass','Drums'];
export const DEFAULT={bpm:136,key:0,scale:1,progression:20,form:'opus',instruments:[44,39,38],rhythm:0,seed:42,taps:null,tapBars:1,fx:{reverb:.18,delay:.12,space:.35},muted:[false,false,false,false]};
export function rng(seed){let n=seed>>>0;return()=>{n+=0x6D2B79F5;let t=Math.imul(n^n>>>15,1|n);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
export function sections(form){let labels=form==='song'?[['Intro',4],['Verse 1',8],['Chorus 1',8],['Verse 2',8],['Chorus 2',8],['Bridge',8],['Final chorus',8],['Outro',4]]:[['A · Main motif',8],['B · Response',8],["A′ · Development",8],['C · Resolution',8]];let start=0;return labels.map(([name,bars])=>{const s={name,bars,start};start+=bars;return s;});}
// Harmony uses a seven-degree parent scale; melodies stay inside the selected scale.
export function harmonyScale(index){if(index===7)return SCALES[0][1];if(index===8||index===9)return SCALES[1][1];return SCALES[index][1];}
export function scalePitch(degree,scale,root){const n=scale.length;return root+12*Math.floor(degree/n)+scale[((degree%n)+n)%n];}
export function captureRhythm(raw,bpm){
 if(!Number.isFinite(bpm)||bpm<40||bpm>200)throw Error('Choose a tempo between 40 and 200 BPM.');
 const sorted=raw.filter(Number.isFinite).sort((a,b)=>a-b);if(sorted.length<2)throw Error('Tap at least two hits.');
 const zero=sorted[0],hits=[];for(const t of sorted){const value=t-zero;if(value>=0&&value<=8&&(!hits.length||value-hits[hits.length-1]>=.045))hits.push(value);}
 if(hits.length<2)throw Error('Tap at least two separate hits.');
 const gaps=hits.slice(1).map((t,i)=>t-hits[i]).sort((a,b)=>a-b),tail=Math.max(.08,Math.min(60/bpm,gaps[Math.floor(gaps.length/2)])),span=hits[hits.length-1]+tail;
 const bars=[1,2,4,8].find(n=>n*240/bpm>=span-.001)||8,duration=bars*240/bpm;
 return {bpm,bars,duration,hits,ratios:hits.map(t=>t/duration)};
}
export function rhythmHits(state){if(state.taps?.length)return state.taps.map(x=>x*state.tapBars*4);return RHYTHMS[state.rhythm][1];}
export function compose(state){
 const random=rng(state.seed),map=sections(state.form),notes=[],scale=SCALES[state.scale][1],harmony=harmonyScale(state.scale),prog=PROGRESSIONS[state.progression][1],root=48+state.key;
 const rhythm=rhythmHits(state),cycle=state.taps?.length?state.tapBars*4:Math.max(...rhythm)>=4?8:4;
 const contours=[[0,1,2,1,0,-1,0,2],[0,2,4,3,2,1,0,-1],[0,-1,-2,0,1,0,2,1],[0,0,2,1,-1,0,1,0]];const motifs=Array.from({length:3},(_,i)=>{const contour=contours[(Math.floor(random()*contours.length)+i)%contours.length];return contour.map((step,j)=>step+(j===7&&random()>.6?1:0));});let previousVoicing=null;
 function add(track,start,duration,pitch,velocity=.65){if(track===0){while(pitch<60)pitch+=12;while(pitch>95)pitch-=12;}if(start>=0&&duration>0)notes.push({id:notes.length,track,start,duration,pitch:Math.max(24,Math.min(96,Math.round(pitch))),velocity});}
 for(let bar=0;bar<map.reduce((n,s)=>n+s.bars,0);bar++){
  const section=map.find(s=>bar>=s.start&&bar<s.start+s.bars),si=map.indexOf(section),intro=/Intro|Outro/.test(section.name),chorus=/Chorus|chorus|Response|Resolution/.test(section.name),bridge=/Bridge/.test(section.name);
  const motif=motifs[bridge||(state.form==='opus'&&si===3)?2:chorus?1:0],degree=prog[Math.floor(bar/2)%prog.length],chord=[0,2,4].map(x=>scalePitch(degree+x,harmony,root));
  // Smooth voicing: constrain chords to a compact middle register.
  const voiced=chord.map((n,i)=>{const candidates=[n-24,n-12,n,n+12].filter(x=>x>=45&&x<=78);return candidates.sort((a,b)=>Math.abs(a-(previousVoicing?.[i]??(52+i*4)))-Math.abs(b-(previousVoicing?.[i]??(52+i*4))))[0]??n;});previousVoicing=voiced;
  for(const n of voiced)add(1,bar*4,3.7,n,intro?.23:.29);
  const localHits=rhythm.filter(hit=>Math.floor(hit/4)===bar%(cycle/4)).map(hit=>hit%4);
  localHits.forEach((hit,j)=>{
   const next=localHits[j+1]??4,gap=Math.max(.08,next-hit);
   // The tap timings are copied exactly into drums, bass and the motif attacks.
   if(!intro||bar%2===0){add(3,bar*4+hit,.16,36,chorus?.78:.65);add(2,bar*4+hit,Math.min(.65,gap*.7),scalePitch(degree,harmony,root-12),.45);}
   if(!intro||j%2===0){const pos=(j+bar%4*2)%8;const anchor=scale.reduce((best,v,i)=>Math.abs(v-harmony[degree])<Math.abs(scale[best]-harmony[degree])?i:best,0);const n=anchor+motif[(pos+(si===2?2:0))%8]+(chorus?scale.length:0);add(0,bar*4+hit,Math.min(gap*.78,bridge?.9:.55),scalePitch(n,scale,root+12),chorus?.52:.42);}
  });
  if(!intro){for(let beat=.5;beat<4;beat+=.5)add(3,bar*4+beat,.07,42,beat%1?.2:.12);add(3,bar*4+1,.13,38,.29);add(3,bar*4+3,.13,38,.32);}
 }
 notes.sort((a,b)=>a.start-b.start||a.track-b.track);return {notes,sections:map,bars:map.reduce((n,s)=>n+s.bars,0),seed:state.seed};
}
export function midiFile(song,state){
 const ppq=480,enc=new TextEncoder(),u32=n=>[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255],u16=n=>[(n>>>8)&255,n&255];
 const variable=n=>{n=Math.max(0,Math.round(n));let a=[n&127];while(n>>=7)a.unshift((n&127)|128);return a;};
 const chunk=(name,data)=>[...enc.encode(name),...u32(data.length),...data];
 const meta=(type,text)=>{const b=[...enc.encode(text)];return [255,type,...variable(b.length),...b];};
 const tempo=Math.round(60000000/state.bpm),conductor=[0,255,81,3,(tempo>>>16)&255,(tempo>>>8)&255,tempo&255,0,255,88,4,4,2,24,8];let prev=0;
 for(const section of song.sections){const tick=section.start*4*ppq;conductor.push(...variable(tick-prev),...meta(6,section.name));prev=tick;}
 conductor.push(...variable(song.bars*4*ppq-prev),255,47,0);const tracks=[chunk('MTrk',conductor)];
 for(let track=0;track<4;track++){
  const channel=track===3?9:track,events=[];const bytes=[0,...meta(3,TRACKS[track])];
  if(track<3)bytes.push(0,192|channel,INSTRUMENTS[state.instruments[track]][2]);
  for(const n of song.notes.filter(n=>n.track===track&&!state.muted[track])){events.push([Math.round(n.start*ppq),1,[144|channel,n.pitch,Math.max(1,Math.round(n.velocity*127))]]);events.push([Math.round((n.start+n.duration)*ppq),0,[128|channel,n.pitch,0]]);}
  events.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);let last=0;for(const [tick,,event]of events){bytes.push(...variable(tick-last),...event);last=tick;}bytes.push(...variable(Math.max(0,song.bars*4*ppq-last)),255,47,0);tracks.push(chunk('MTrk',bytes));
 }
 return new Uint8Array([...chunk('MThd',[...u16(1),...u16(5),...u16(ppq)]),...tracks.flat()]);
}
