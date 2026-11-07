/* Values transcribed from the current paper; full-benchmark and Test remain separate. */
'use strict';
const benchmarkMethods = [
  ['Full context',24.94,34.80,13.36,19.54,59.04],
  ['BM25',19.20,26.79,9.85,15.46,58.83],
  ['Contriever',18.71,27.14,8.17,14.68,59.74],
  ['DRAGON+',18.45,26.01,8.83,15.02,58.51],
  ['Mem0',14.48,21.15,7.03,10.46,60.29],
  ['A-MEM',19.28,27.40,9.12,15.41,64.02],
  ['HippoRAG 2',18.23,27.40,7.44,13.22,60.56],
  ['Hindsight',31.95,44.69,16.72,25.23,64.83],
  ['ReadAgent-S',26.91,40.46,11.39,19.13,62.45],
  ['GroupBrief',32.54,45.25,16.57,26.57,62.21]
];
const benchmarkWriters = [
  ['gpt-5.4-mini',32.54,45.25,16.57,26.57,62.21],
  ['gpt-5.5',52.83,67.81,33.95,45.84,65.77],
  ['gpt-5.6-luna',38.82,53.25,20.51,32.19,65.00],
  ['gpt-5.6-sol',53.24,67.48,34.94,46.92,67.71],
  ['gpt-6-luna',36.53,50.48,20.53,28.56,65.61],
  ['gpt-6-sol',35.19,46.26,23.39,28.02,60.62],
  ['gpt-6-astra',52.13,67.73,34.72,42.76,66.68],
  ['qwen3.5-9b',14.56,22.63,6.93,8.43,58.52],
  ['qwen3.8-27b',50.89,63.55,35.17,44.75,63.19]
];
const testResults = {
  mini: {model:'gpt-5.4-mini', coverage:[32.82,35.36], gain:2.54, simulation:[62.18,64.46], n:[238,242]},
  luna: {model:'gpt-5.6-luna', coverage:[38.41,51.30], gain:12.88, simulation:[65.55,68.42], n:[254,247]}
};
const categories = {overall:{index:1,label:'Overall'},past:{index:2,label:'Past state'},friction:{index:3,label:'Friction'},opportunities:{index:4,label:'Opportunities'}};
let comparison='methods', category='overall', writer='luna', metric='coverage';
const byId = id => document.getElementById(id);
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function pressed(container,dataKey,current){container.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset[dataKey]===current)));}

function renderBenchmark(){
  const rows=comparison==='methods'?benchmarkMethods:benchmarkWriters;
  const cat=categories[category];
  const chart=byId('benchmark-bars');chart.replaceChildren();
  rows.forEach(row=>{
    const ours=row[0]==='GroupBrief';
    const item=element('div','bar-row');
    item.append(element('div','bar-label'+(comparison==='writers'?' model':'')+(ours?' ours':''),row[0]));
    const track=element('div','bar-track');
    const fill=element('div','bar-fill'+(ours?' ours':''));fill.style.width=`${row[cat.index]/80*100}%`;
    const value=element('span','bar-value',row[cat.index].toFixed(2));value.style.left=fill.style.width;
    track.append(fill,value);item.append(track);chart.append(item);
  });
  chart.setAttribute('aria-label',`${cat.label} coverage on the full benchmark: ${rows.map(row=>`${row[0]} ${row[cat.index].toFixed(2)} percent`).join('; ')}`);
  byId('benchmark-chart-title').textContent=`${comparison==='methods'?'Method':'Writer'} comparison · ${cat.label.toLowerCase()}`;
  const context=byId('benchmark-chart-context');context.replaceChildren();
  if(comparison==='methods'){context.append('Writer fixed to ',element('code','', 'gpt-5.4-mini'),' · 1,351 requests · 9,975 reference points');}
  else{context.textContent='GroupBrief fixed across writers · 1,351 requests · 9,975 reference points';}
  byId('benchmark-table-caption').textContent=`Full-benchmark ${comparison==='methods'?'method':'writer'} comparison`;
  byId('benchmark-label-heading').textContent=comparison==='methods'?'Method':'Writer';
  const body=byId('benchmark-table');body.replaceChildren();
  rows.forEach(row=>{const tr=element('tr',row[0]==='GroupBrief'?'highlight':'');const label=element('th','');label.scope='row';if(comparison==='writers')label.append(element('code','',row[0]));else label.textContent=row[0];tr.append(label);row.slice(1).forEach(value=>tr.append(element('td','',value.toFixed(2))));body.append(tr);});
}
function renderOptimization(){
  const data=testResults[writer], simulation=metric==='simulation';
  const minimum=simulation?57:0, maximum=simulation?71:60;
  const values=data[metric];const chart=byId('optimization-chart');chart.replaceChildren();
  values.forEach((value,index)=>{
    const row=element('div','opt-row');const label=element('div','opt-label',index?'GroupBrief (optimized)':'GroupBrief');
    if(simulation)label.append(element('small','',`N = ${data.n[index]} valid comparisons`));
    const track=element('div','opt-track');
    const mark=element('div',(simulation?'opt-dot':'opt-fill')+(index?' optimized':''));
    const pos=`${(value-minimum)/(maximum-minimum)*100}%`;
    mark.style[simulation?'left':'width']=pos;
    const score=element('span','opt-value',`${value.toFixed(2)}%`);score.style.left=pos;
    track.append(mark,score);row.append(label,track);chart.append(row);
  });
  chart.setAttribute('aria-label',`${data.model}, Test ${simulation?'simulation preference against no brief':'coverage'}: GroupBrief ${values[0].toFixed(2)} percent${simulation?`, N ${data.n[0]}`:''}; GroupBrief optimized ${values[1].toFixed(2)} percent${simulation?`, N ${data.n[1]}`:''}.`);
  byId('optimization-chart-title').replaceChildren(element('code','',data.model),simulation?' · Simulation preference':' · Reference-point coverage');
  const ticks=simulation?[57,60.5,64,67.5,71]:[0,15,30,45,60];
  byId('optimization-axis').replaceChildren(...ticks.map(value=>element('span','',String(value))));
  byId('optimization-callout').textContent=simulation?`${values[1].toFixed(2)}% preference with GroupBrief (optimized)`:`+${data.gain.toFixed(2)} percentage points in Test coverage`;
  byId('optimization-note').textContent=simulation?'Preference is measured against no brief; ties receive half credit. Each variant uses its own valid, order-consistent comparisons. The axis is zoomed to 57–71%; 50% parity is outside the view. These are not direct variant-to-variant judgments.':'Both variants are evaluated on the same 2,162 reference points. The gain is calculated from unrounded scores.';
}
function wireControls(id,dataKey,update){byId(id).addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;const value=button.dataset[dataKey];if(!value)return;pressed(byId(id),dataKey,value);update(value);});}
wireControls('comparison-controls','comparison',value=>{comparison=value;renderBenchmark();});
wireControls('category-controls','category',value=>{category=value;renderBenchmark();});
wireControls('writer-controls','writer',value=>{writer=value;renderOptimization();});
wireControls('metric-controls','metric',value=>{metric=value;renderOptimization();});
renderBenchmark();renderOptimization();

const themeButton=byId('theme-toggle');
function setTheme(theme){document.documentElement.dataset.theme=theme;themeButton.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} mode`);themeButton.setAttribute('aria-pressed',String(theme==='dark'));}
let savedTheme;try{savedTheme=localStorage.getItem('groupbrief-theme');}catch(error){/* Storage may be disabled. */}
setTheme(savedTheme==='dark'||savedTheme==='light'?savedTheme:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));
themeButton.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('groupbrief-theme',theme);}catch(error){/* Keep the session choice. */}});

const dialog=byId('figure-dialog');
document.querySelectorAll('.figure-zoom').forEach(button=>button.addEventListener('click',()=>{const source=button.querySelector('img');byId('expanded-figure').src=button.dataset.zoom;byId('expanded-figure').alt=source.alt;byId('dialog-title').textContent=button.getAttribute('aria-label').replace(/^Enlarge /,'');dialog.showModal();document.body.classList.add('no-scroll');}));
byId('close-figure').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>document.body.classList.remove('no-scroll'));

byId('copy-citation').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(byId('bibtex').textContent);byId('copy-status').textContent='BibTeX copied to clipboard.';byId('copy-citation').textContent='Copied';setTimeout(()=>byId('copy-citation').textContent='Copy BibTeX',2200);}
  catch(error){const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(byId('bibtex'));selection.removeAllRanges();selection.addRange(range);byId('copy-status').textContent='Citation selected. Press Ctrl+C or ⌘C to copy.';}
});
