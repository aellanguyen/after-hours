const targets={techno:[126,150,138],acid:[128,154,140],trance:[128,150,138],groove:[112,132,124],dubstep:[130,150,140]};
export function inferGroove(raw,genre='techno'){
 const clean=raw.filter(Number.isFinite).sort((a,b)=>a-b).slice(0,96);if(!clean.length)throw Error('Tap at least one hit.');const zero=clean[0],hits=[];for(const t of clean){const x=t-zero;if(x>=0&&x<=8&&(!hits.length||x-hits.at(-1)>=.045))hits.push(x)}
 const gaps=hits.slice(1).map((x,i)=>x-hits[i]).filter(x=>x>.045),[low,high,target]=targets[genre]||targets.techno,candidates=[target];for(const gap of gaps)for(const division of [.125,.25,.5,1,2]){const tempo=60/gap*division;if(tempo>=low&&tempo<=high)candidates.push(tempo)}
 function score(b){let fit=0;for(const gap of gaps){const n=gap*b/60*8;fit+=Math.pow(n-Math.round(n),2)}return fit/Math.max(1,gaps.length)+Math.pow(Math.log(b/target),2)*.55;}
 candidates.sort((a,b)=>score(a)-score(b));const bpm=Math.round(candidates[0]),sorted=[...gaps].sort((a,b)=>a-b),tail=sorted.length?Math.max(.08,Math.min(1,sorted[Math.floor(sorted.length/2)])):.5,bar=240/bpm,span=hits.at(-1)+tail;
 const bars=[1,2,4,8].find(x=>x*bar>=span-.025)||8,duration=bars*bar;return {bpm,bars,duration,hits,ratios:hits.map(t=>t/duration),fastTaps:gaps.length>0&&60/(sorted[Math.floor(sorted.length/2)])>high*1.4};
}
