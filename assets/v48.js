/* Mobile schedule, signed-in header and focus visibility. */
(()=>{
  const q=s=>document.querySelector(s);
  function sync(){
    const signedIn=Boolean(window.LERNO_AUTH?.session);
    document.body.classList.toggle('signed-in48',signedIn);
    const auth=q('#topAuthButtonV43');if(auth&&auth.hidden!==signedIn)auth.hidden=signedIn;
    document.body.classList.toggle('studying48',Boolean(q('#timerScreen')?.classList.contains('show')));
  }
  sync();
  new MutationObserver(sync).observe(q('#timerScreen'),{attributes:true,attributeFilter:['class']});
  window.addEventListener('pageshow',sync);window.addEventListener('storage',sync);
  document.addEventListener('submit',()=>setTimeout(sync,0));
  document.addEventListener('click',()=>setTimeout(sync,0));
  const back=q('#backFocus');
  if(back){back.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 3 11l6 6M3 11h12a5 5 0 0 1 0 10"/></svg><span>بازگشت</span>';back.setAttribute('aria-label','بازگشت و خروج از جلسه مطالعه');}
  const mobile=matchMedia('(max-width:860px)');
  const desktopDraw=drawSchedule;
  let selected=Math.max(0,Math.min(weekDays.length-1,(new Date().getDay()+1)%7));
  drawSchedule=function(){
    if(!mobile.matches){desktopDraw();return}
    q('.schedule-editor').hidden=true;
    const box=q('#weeklySchedule');box.className='weekly-schedule mobile-week48';box.replaceChildren();
    const tabs=document.createElement('div');tabs.className='week-tabs48';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','روزهای برنامه هفتگی');
    weekDays.forEach((name,day)=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.id='week-day48-'+day;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(day===selected));b.setAttribute('aria-controls','week-panel48');b.onclick=()=>{selected=day;drawSchedule();q('#week-day48-'+day)?.focus()};tabs.append(b)});
    const panel=document.createElement('section');panel.id='week-panel48';panel.className='week-panel48';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','week-day48-'+selected);
    const heading=document.createElement('h2');heading.textContent='برنامه '+weekDays[selected];panel.append(heading);
    for(let period=1;period<=6;period++){
      const item=schedule.find(x=>x.day===selected&&x.period===period);
      const row=document.createElement('div');row.className='week-row48';
      const label=document.createElement('span');label.textContent='زنگ '+fa(period);
      const lesson=schoolCell(selected,period,item);lesson.classList.add('week-lesson48');
      if(!item)lesson.textContent='＋ افزودن درس';
      row.append(label,lesson);panel.append(row);
    }
    box.append(tabs,panel);
  };
  mobile.addEventListener('change',()=>drawSchedule());drawSchedule();
})();
