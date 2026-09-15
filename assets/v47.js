/* One app-owned picker; native selects retain data only. */
(()=>{
  const $=(s,r=document)=>r?.querySelector(s),all=(s,r=document)=>[...r.querySelectorAll(s)];
  const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const bindings=new Map();
  const free=s=>/subject/i.test(s.id+' '+s.className);
  function modal(title){
    const content=document.createElement('div');content.className='picker47';
    const root=siteDialog(title,content);root.classList.add('modal47');
    root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
    const previous=document.activeElement;
    const close=()=>{root.remove();previous?.focus()};
    $('.close-modal',root).onclick=close;
    root.addEventListener('keydown',e=>{if(e.key==='Escape')close();if(e.key==='Tab'){const nodes=all('button,input',root).filter(x=>!x.disabled&&!x.hidden);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
    return {root,content,close};
  }
  function choose(s){
    const b=bindings.get(s);if(s.disabled)return;
    const m=modal(s.getAttribute('aria-label')||'انتخاب گزینه');b.setAttribute('aria-expanded','true');
    const originalClose=m.close;const close=()=>{b.setAttribute('aria-expanded','false');originalClose()};$('.close-modal',m.root).onclick=close;
    const search=document.createElement('input');search.placeholder=free(s)?'جست‌وجو یا نوشتن نام دلخواه':'جست‌وجوی گزینه‌ها';search.setAttribute('aria-label',search.placeholder);
    const list=document.createElement('div');list.className='choices47';list.setAttribute('role','listbox');
    const custom=document.createElement('button');custom.type='button';custom.className='custom47';custom.textContent='ثبت نام دلخواه';custom.hidden=true;
    const select=value=>{if(![...s.options].some(o=>o.value===value))s.add(new Option(value,value));if(free(s)){try{const saved=JSON.parse(localStorage.getItem('lerno-custom-subjects47')||'[]');localStorage.setItem('lerno-custom-subjects47',JSON.stringify([...new Set([...saved,value])]))}catch{}}s.value=value;s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}));refresh();close()};
    function paint(){list.replaceChildren();const term=search.value.trim();[...s.options].filter(o=>o.value&&o.textContent.trim()&&!/یک درس را انتخاب|انتخاب درس/.test(o.textContent)&&o.textContent.includes(term)).forEach(o=>{const row=document.createElement('button');row.type='button';row.className='choice47';row.disabled=o.disabled;row.setAttribute('role','option');row.setAttribute('aria-selected',String(o.selected));const label=document.createElement('span');label.textContent=o.textContent;const check=document.createElement('i');check.setAttribute('aria-hidden','true');check.textContent=o.selected?'✓':'';row.append(label,check);row.onclick=()=>select(o.value);list.append(row)});custom.hidden=!free(s)||!term;custom.textContent='استفاده از «'+term+'»'}
    custom.onclick=()=>select(search.value.trim());search.oninput=paint;m.content.append(search,list,custom);paint();search.focus();
  }
  function setup(s){if(bindings.has(s)||s.closest('#customDate,#todoCustomDate')||['taskWhen','todoWhen'].includes(s.id))return;
    if(free(s)){try{JSON.parse(localStorage.getItem('lerno-custom-subjects47')||'[]').forEach(v=>{if(typeof v==='string'&&![...s.options].some(o=>o.value===v))s.add(new Option(v,v))})}catch{}}
    const b=document.createElement('button');b.type='button';b.className='select47';b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.innerHTML='<span></span><i>'+arrow+'</i>';b.onclick=()=>choose(s);s.after(b);s.classList.add('native47');s.tabIndex=-1;bindings.set(s,b);s.addEventListener('change',refresh);
  }
  function refresh(){bindings.forEach((b,s)=>{if(!s.isConnected){b.remove();bindings.delete(s);return}b.hidden=s.hidden;b.disabled=s.disabled;const label=s.selectedOptions[0]?.textContent?.trim();const text=label&&!/یک درس را انتخاب|انتخاب درس/.test(label)?label:(free(s)?'نام درس؛ انتخاب یا نوشتن':'انتخاب گزینه');if(b.firstElementChild.textContent!==text)b.firstElementChild.textContent=text;b.setAttribute('aria-label',(s.getAttribute('aria-label')||text)+'؛ بازکردن گزینه‌ها')})}
  function calendar(mode){
    const prefix=mode==='task'?'jalali':'todo',s=$('#'+mode+'When');
    let chosen=jalaliParts(new Date());if(s.value==='tomorrow'){let d=new Date();d.setDate(d.getDate()+1);chosen=jalaliParts(d)}else if(s.value==='custom'){chosen={year:+$('#'+prefix+'Year').value,month:+$('#'+prefix+'Month').value,day:+$('#'+prefix+'Day').value}}
    let view={...chosen};const m=modal('انتخاب مهلت');m.content.classList.add('calendar47');
    const preview=document.createElement('b');preview.className='date-preview47';const shortcuts=document.createElement('div');shortcuts.className='shortcuts47';
    ['امروز','فردا'].forEach((text,n)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{const d=new Date();d.setDate(d.getDate()+n);chosen=jalaliParts(d);view={...chosen};paint()};shortcuts.append(b)});
    const heading=document.createElement('div');heading.className='month47';const prev=document.createElement('button'),next=document.createElement('button'),label=document.createElement('b');prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','ماه قبل');next.setAttribute('aria-label','ماه بعد');heading.append(prev,label,next);
    const days=document.createElement('div');days.className='days47';const ok=document.createElement('button');ok.type='button';ok.className='apply47';ok.textContent='تأیید تاریخ';
    function move(n){view.month+=n;if(view.month===0){view.month=12;view.year--}if(view.month===13){view.month=1;view.year++}paint()}prev.onclick=()=>move(-1);next.onclick=()=>move(1);
    function paint(){preview.textContent=fa(chosen.day)+' '+jalaliMonths[chosen.month-1]+' '+fa(chosen.year);label.textContent=jalaliMonths[view.month-1]+' '+fa(view.year);days.replaceChildren();['ش','ی','د','س','چ','پ','ج'].forEach(t=>{const span=document.createElement('small');span.textContent=t;days.append(span)});const offset=(j2g(view.year,view.month,1).getDay()+1)%7;for(let k=0;k<offset;k++)days.append(document.createElement('span'));const today=jalaliParts(new Date());for(let d=1;d<=jalaliMonthLength(view.year,view.month);d++){const b=document.createElement('button');b.type='button';b.textContent=fa(d);const active=chosen.year===view.year&&chosen.month===view.month&&chosen.day===d;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));if(today.year===view.year&&today.month===view.month&&today.day===d)b.classList.add('today');b.onclick=()=>{chosen={...view,day:d};paint()};days.append(b)}}
    ok.onclick=()=>{['Year','Month','Day'].forEach(k=>{const input=$('#'+prefix+k),value=String(chosen[k.toLowerCase()]);if(![...input.options].some(o=>o.value===value))input.add(new Option(fa(value),value));input.value=value});s.value='custom';s.dispatchEvent(new Event('change',{bubbles:true}));dateLabel(mode);m.close()};m.content.append(preview,shortcuts,heading,days,ok);paint();ok.focus();
  }
  function dateLabel(mode){const s=$('#'+mode+'When'),b=$('#'+mode+'Date47');if(!s||!b)return;const prefix=mode==='task'?'jalali':'todo';b.firstElementChild.textContent=s.value==='custom'?['Day','Month','Year'].map(k=>$('#'+prefix+k).selectedOptions[0]?.textContent).join(' '):(s.value==='tomorrow'?'فردا':'امروز')}
  function dateSetup(mode){const s=$('#'+mode+'When');if(!s||$('#'+mode+'Date47'))return;s.classList.add('native47');const b=document.createElement('button');b.type='button';b.id=mode+'Date47';b.className='select47';b.innerHTML='<span></span><i>'+arrow+'</i>';b.onclick=()=>calendar(mode);s.after(b);s.onchange=()=>dateLabel(mode);dateLabel(mode)}
  function confirmations(){all('.dialog-body,.confirm-v35-card,.lerno-confirm-v44 .modal-box,.auth-confirm-box').forEach(root=>{all('div',root).forEach(group=>{const children=[...group.children];if(children.length===2&&children.every(x=>x.tagName==='BUTTON'))group.classList.add('actions47')})})}
  function scan(){all('select').forEach(setup);dateSetup('task');dateSetup('todo');refresh();confirmations()}
  scan();let queued=false;new MutationObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;scan()})}}).observe(document.body,{childList:true,subtree:true});
})();
