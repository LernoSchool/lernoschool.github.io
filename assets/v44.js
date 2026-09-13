/* LERNO v44 — همهٔ انتخاب‌گرها و هشدارها متعلق به خود برنامه */
(()=>{
  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];

  function appConfirm({title='تأیید',message,yes='بله، انجام شود',no='نه، نگه دار',danger=true,onYes,onNo}){
    q('.lerno-confirm-v44')?.remove();
    const modal=document.createElement('section');modal.className='modal show site-dialog lerno-confirm-v44';modal.setAttribute('role','presentation');
    modal.innerHTML='<div class="modal-box" role="alertdialog" aria-modal="true"><button class="close-modal" type="button" aria-label="بستن">×</button><span class="confirm-icon-v44" aria-hidden="true">!</span><h2></h2><p></p><div class="confirm-actions-v44"><button class="confirm-no-v44 plain" type="button"></button><button class="confirm-yes-v44" type="button"></button></div></div>';
    q('h2',modal).textContent=title;q('p',modal).textContent=message;q('.confirm-no-v44',modal).textContent=no;q('.confirm-yes-v44',modal).textContent=yes;q('.confirm-yes-v44',modal).classList.add(danger?'danger':'blue');
    let closed=false;const cancel=()=>{if(closed)return;closed=true;modal.remove();onNo?.()};const accept=()=>{if(closed)return;closed=true;modal.remove();onYes?.()};
    q('.close-modal',modal).onclick=cancel;q('.confirm-no-v44',modal).onclick=cancel;q('.confirm-yes-v44',modal).onclick=accept;modal.onclick=event=>{if(event.target===modal)cancel()};document.body.append(modal);q('.confirm-no-v44',modal).focus();return modal;
  }
  window.lernoConfirm=appConfirm;

  /* خروج مطمئن از تایمر؛ رویداد capture مانع بازنویسی آن توسط فایل‌های قدیمی می‌شود. */
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('#backFocus');if(!button)return;event.preventDefault();event.stopImmediatePropagation();
    const wasRunning=typeof run!=='undefined'&&Boolean(run);if(wasRunning){clearInterval(run);run=null}const pause=q('#pauseFocus');if(pause)pause.textContent='ادامه';
    appConfirm({title:'خروج از جلسه',message:'می‌خواهی از جلسهٔ مطالعه خارج شوی؟ زمان این جلسه ثبت نمی‌شود.',yes:'بله، خارج شوم',no:'ادامهٔ مطالعه',onNo:()=>{if(wasRunning&&typeof toggleTimer==='function')toggleTimer()},onYes:()=>{if(typeof run!=='undefined'&&run){clearInterval(run);run=null}const screen=q('#timerScreen');screen?.classList.remove('show');screen?.setAttribute('aria-hidden','true')}});
  },true);

  /* پنجرهٔ انتخاب اختصاصی؛ منوی سیستم‌عامل و مرورگر هرگز باز نمی‌شود. */
  let activeSelect=null,suppressClickUntil=0;
  function selectTitle(select){return select.getAttribute('aria-label')||q(':scope > span',select.closest('label')||document)?.textContent?.trim()||'انتخاب گزینه'}
  function openSelect(select){
    if(select.disabled||activeSelect===select)return;activeSelect=select;q('.lerno-select-modal-v44')?.remove();
    const options=[...select.options],modal=document.createElement('section');modal.className='modal show site-dialog lerno-select-modal-v44';modal.setAttribute('role','presentation');
    modal.innerHTML='<div class="modal-box" role="dialog" aria-modal="true"><button class="close-modal" type="button" aria-label="بستن">×</button><small>انتخاب از فهرست</small><h2></h2><div class="select-search-wrap-v44" hidden><span aria-hidden="true">⌕</span><input type="search" autocomplete="off" placeholder="جست‌وجو…" aria-label="جست‌وجوی گزینه‌ها"></div><div class="select-options-v44" role="listbox"></div></div>';
    q('h2',modal).textContent=selectTitle(select);const list=q('.select-options-v44',modal),close=()=>{modal.remove();activeSelect=null;select.focus({preventScroll:true})};
    options.forEach(option=>{const button=document.createElement('button');button.type='button';button.className='select-option-v44';button.disabled=option.disabled;button.dataset.search=option.textContent.trim().toLowerCase();button.setAttribute('role','option');button.setAttribute('aria-selected',option.selected?'true':'false');button.innerHTML='<span></span><i aria-hidden="true">✓</i>';q('span',button).textContent=option.textContent;button.classList.toggle('selected',option.selected);button.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));close()};list.append(button)});
    const searchWrap=q('.select-search-wrap-v44',modal),search=q('input',searchWrap);if(options.length>8){searchWrap.hidden=false;search.oninput=()=>{const term=search.value.trim().toLowerCase();qa('.select-option-v44',list).forEach(button=>button.hidden=!button.dataset.search.includes(term))}}
    q('.close-modal',modal).onclick=close;modal.onclick=event=>{if(event.target===modal)close()};document.body.append(modal);requestAnimationFrame(()=>{q('.select-option-v44.selected',list)?.scrollIntoView({block:'center'});(options.length>12?search:q('.select-option-v44.selected',list)||q('.select-option-v44',list))?.focus()});
  }
  document.addEventListener('pointerdown',event=>{const select=event.target.closest?.('select');if(!select)return;event.preventDefault();event.stopImmediatePropagation();suppressClickUntil=Date.now()+700;openSelect(select)},true);
  document.addEventListener('click',event=>{const select=event.target.closest?.('select');if(!select)return;event.preventDefault();event.stopImmediatePropagation();if(Date.now()>suppressClickUntil)openSelect(select)},true);
  document.addEventListener('keydown',event=>{const select=event.target.closest?.('select');if(!select||!['Enter',' ','ArrowDown','ArrowUp'].includes(event.key))return;event.preventDefault();event.stopImmediatePropagation();openSelect(select)},true);

  /* حذف از تقویم نیز دقیقاً از همان هشدار واحد استفاده می‌کند. */
  if(typeof deleteCalendarItem==='function')deleteCalendarItem=function(item){appConfirm({title:'حذف '+entryTypeLabel(item.type),message:'این مورد حذف شود؟',yes:'بله، حذف شود',onYes:()=>{if(item.source==='entry'){entries=entries.filter(value=>value.id!==item.id);tasks=tasks.filter(value=>value.calendarEntryId!==item.id);saveCalendarEntries();saveTasks()}else if(item.source==='todo'){todos=todos.filter(value=>value.id!==item.id);saveTodos()}else{tasks=tasks.filter(value=>value.id!==item.id);saveTasks()}renderEntryList()}})};
})();
