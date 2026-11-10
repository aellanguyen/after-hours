import {INSTRUMENTS,rng} from './composer-core.js';
const noiseCache=new WeakMap();
function noise(context){if(noiseCache.has(context))return noiseCache.get(context);const b=context.createBuffer(1,context.sampleRate,context.sampleRate),d=b.getChannelData(0),random=rng(1208);for(let i=0;i<d.length;i++)d[i]=random()*2-1;noiseCache.set(context,b);return b;}
export function createMix(context,output,state){
 const bus=context.createGain(),dry=context.createGain(),send=context.createGain(),delay=context.createDelay(2),feedback=context.createGain(),echo=context.createGain(),reverb=context.createConvolver(),wet=context.createGain(),tone=context.createBiquadFilter(),limit=context.createDynamicsCompressor();
 bus.gain.value=1;dry.gain.value=.8;tone.type='lowpass';tone.frequency.value=9500;limit.threshold.value=-8;limit.knee.value=10;limit.ratio.value=5;limit.attack.value=.003;limit.release.value=.16;
 bus.connect(dry);dry.connect(tone);bus.connect(send);send.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(echo);echo.connect(tone);bus.connect(reverb);reverb.connect(wet);wet.connect(tone);tone.connect(limit);limit.connect(output);
 let lastSpace=-1;
 function update(fx){send.gain.value=fx.delay*.45;feedback.gain.value=.15+fx.delay*.38;echo.gain.value=.55;delay.delayTime.value=60/state.bpm*.75;wet.gain.value=fx.reverb*.5;
  if(Math.abs(lastSpace-fx.space)>.04){lastSpace=fx.space;const length=Math.ceil(context.sampleRate*(.35+fx.space*2.6)),impulse=context.createBuffer(2,length,context.sampleRate),random=rng(608);for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<length;i++)data[i]=(random()*2-1)*Math.pow(1-i/length,2.3)*.6;}reverb.buffer=impulse;}
 }
 update(state.fx);
 return {bus,update,dispose(){for(const node of [bus,dry,send,delay,feedback,echo,reverb,wet,tone,limit])try{node.disconnect();}catch{}}};
}
export function voice(context,bus,note,instrument,time,seconds,space=0){
 const sources=[],nodes=[],gain=context.createGain(),filter=context.createBiquadFilter(),pan=context.createStereoPanner();
 const start=Math.max(context.currentTime,time),duration=Math.max(.035,seconds),f=440*2**((note.pitch-69)/12),preset=INSTRUMENTS[instrument]||INSTRUMENTS[0],kind=preset[3];
 let attack=.008,release=.12,level=note.velocity*.3;
 filter.type='lowpass';filter.frequency.value=8000;filter.Q.value=.65;pan.pan.value=(note.track===1?-.2:note.track===2?.08:Math.sin(note.pitch*1.7)*.3)*space;
 filter.connect(gain);gain.connect(pan);pan.connect(bus);nodes.push(gain,filter,pan);
 function osc(type,freq,amp=1,detune=0){const o=context.createOscillator(),g=context.createGain();o.type=type;o.frequency.setValueAtTime(freq,start);o.detune.value=detune;g.gain.value=amp;o.connect(g);g.connect(filter);sources.push(o);nodes.push(g);return o;}
 function hiss(){const o=context.createBufferSource();o.buffer=noise(context);o.connect(filter);sources.push(o);}
 if(note.track===3){
  if(note.pitch===36){const o=osc('sine',145,.9);o.frequency.exponentialRampToValueAtTime(45,start+.08);release=.16;level=note.velocity*.54;}
  else{hiss();filter.type='highpass';filter.frequency.value=note.pitch===42?7000:1400;release=note.pitch===42?.035:.12;level=note.velocity*.24;if(note.pitch!==42)osc('triangle',175,.3);}
 }else{
  const soft=['piano','soft','ep','pluck','mute','wood','vibe','bell','fm','bass','timpani'].includes(kind),sustain=['strings','ensemble','tremolo','pad','glass','choir','horn'].includes(kind);
  if(sustain){attack=kind==='strings'?.1:.2;release=.3;filter.frequency.value=kind==='glass'?4500:1800;osc('sawtooth',f,.32,-5);osc('sawtooth',f,.32,5);osc('triangle',f,.28);}
  else if(['brass','reed','accordion','organ','clarinet'].includes(kind)){attack=.035;release=.09;filter.frequency.value=kind==='clarinet'?1700:2600;osc(kind==='clarinet'?'square':'sawtooth',f,.5);osc('sine',f*2,.16);if(kind==='organ')osc('sine',f*3,.18);}
  else if(['flute','triangle','sub'].includes(kind)){osc(kind==='triangle'?'triangle':'sine',f,.85);if(kind==='flute')osc('sine',f*2,.08);release=.1;}
  else if(kind==='acid'){const o=osc('sawtooth',f,.65);filter.Q.value=5;filter.frequency.setValueAtTime(Math.min(6000,f*20),start);filter.frequency.exponentialRampToValueAtTime(Math.max(120,f*2),start+duration);release=.06;}
  else if(['saw','square'].includes(kind)){osc(kind==='square'?'square':'sawtooth',f,.4,-3);osc('sawtooth',f,.22,3);filter.frequency.value=3000;release=.08;}
  else{osc(kind==='wood'||kind==='mute'?'triangle':'sine',f,.7);osc('sine',f*(kind==='bell'?2.76:kind==='fm'?3.5:2),.19);osc('sine',f*3,.07);filter.frequency.value=kind==='bass'?700:kind==='soft'?1900:5000;release=kind==='mute'?.035:kind==='bell'?.55:.17;}
  // Preset-specific brightness, attack and overtone blend keep the 50 soundbank voices distinct.
  filter.frequency.value*=.83+(instrument%7)*.055;level*=.8+(instrument%5)*.035;
  if(soft){attack=.003;gain.gain.setValueAtTime(.00001,start);gain.gain.linearRampToValueAtTime(Math.max(.0001,level),start+attack);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,level*.16),start+Math.max(.025,duration));}
  else{gain.gain.setValueAtTime(.00001,start);gain.gain.linearRampToValueAtTime(Math.max(.0001,level),start+Math.min(attack,duration*.4));gain.gain.setValueAtTime(Math.max(.0001,level*.75),start+duration);}
 }
 if(note.track===3){gain.gain.setValueAtTime(.00001,start);gain.gain.linearRampToValueAtTime(Math.max(.0001,level),start+.003);gain.gain.exponentialRampToValueAtTime(.0001,start+duration+release);}
 else gain.gain.exponentialRampToValueAtTime(.00001,start+duration+release);
 const end=start+duration+release+.02;let remaining=sources.length;
 for(const o of sources){o.start(start);o.stop(end);o.onended=()=>{if(--remaining<=0)for(const node of [...sources,...nodes])try{node.disconnect();}catch{}};}
 return ()=>{for(const o of sources)try{o.stop();}catch{};for(const node of [...sources,...nodes])try{node.disconnect();}catch{}};
}
export async function renderAudio(song,state,onProgress=()=>{}){
 const seconds=song.bars*240/state.bpm,context=new OfflineAudioContext(2,Math.ceil((seconds+3.5)*44100),44100),out=context.createGain();out.gain.value=.8;out.connect(context.destination);const mix=createMix(context,out,state);
 let i=0;for(const n of song.notes){if(!state.muted[n.track])voice(context,mix.bus,n,state.instruments[n.track]||0,.05+n.start*60/state.bpm,n.duration*60/state.bpm,state.fx.space);if(++i%200===0){onProgress(.2*i/song.notes.length);await new Promise(resolve=>setTimeout(resolve,0));}}
 onProgress(.25);const buffer=await context.startRendering();onProgress(.9);let peak=0;for(let c=0;c<2;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++)peak=Math.max(peak,Math.abs(data[i]));}const gain=peak>.9?.9/peak:1;for(let c=0;c<2;c++){const data=buffer.getChannelData(c);for(let i=0;i<data.length;i++)data[i]*=gain;}onProgress(1);return buffer;
}
export function wavFile(buffer){const n=buffer.length,bytes=new ArrayBuffer(44+n*4),v=new DataView(bytes);const text=(offset,s)=>{for(let i=0;i<s.length;i++)v.setUint8(offset+i,s.charCodeAt(i));};text(0,'RIFF');v.setUint32(4,36+n*4,true);text(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,buffer.sampleRate,true);v.setUint32(28,buffer.sampleRate*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);text(36,'data');v.setUint32(40,n*4,true);const l=buffer.getChannelData(0),r=buffer.getChannelData(1);for(let i=0;i<n;i++){v.setInt16(44+i*4,Math.max(-1,Math.min(1,l[i]))*32767,true);v.setInt16(46+i*4,Math.max(-1,Math.min(1,r[i]))*32767,true);}return new Uint8Array(bytes);}
export async function mp3File(buffer,onProgress=()=>{}){if(!globalThis.lamejs?.Mp3Encoder)throw Error('MP3 encoder did not load. Reload the page.');const encoder=new globalThis.lamejs.Mp3Encoder(2,buffer.sampleRate,192),chunks=[],left=buffer.getChannelData(0),right=buffer.getChannelData(1);for(let i=0;i<buffer.length;i+=1152){const size=Math.min(1152,buffer.length-i),l=new Int16Array(size),r=new Int16Array(size);for(let j=0;j<size;j++){l[j]=Math.max(-1,Math.min(1,left[i+j]))*32767;r[j]=Math.max(-1,Math.min(1,right[i+j]))*32767;}const bytes=encoder.encodeBuffer(l,r);if(bytes.length)chunks.push(new Uint8Array(bytes));if(i%(1152*100)===0){onProgress(i/buffer.length);await new Promise(resolve=>setTimeout(resolve,0));}}const tail=encoder.flush();if(tail.length)chunks.push(new Uint8Array(tail));return new Blob(chunks,{type:'audio/mpeg'});}
