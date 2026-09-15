/* LERNO v43 — کنترل‌های یکپارچه، ساعت چرخشی، پشتیبان و ورود اختیاری */
(()=>{
  const q=(selector,root=document)=>root.querySelector(selector);
  const qa=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const fa=value=>String(value).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
  const showDialog=(title,content)=>typeof siteDialog==='function'?siteDialog(title,content):null;

  function confirmInside(title,message,yesText,onYes){
    const body=document.createElement('div');body.className='v43-confirm';
    body.innerHTML='<p></p><div><button class="plain v43-no" type="button">نه، نگه دار</button><button class="danger v43-yes" type="button"></button></div>';
    q('p',body).textContent=message;q('.v43-yes',body).textContent=yesText;
    const modal=showDialog(title,body);q('.v43-no',body).onclick=()=>modal?.remove();q('.v43-yes',body).onclick=()=>{modal?.remove();onYes()};
  }

  /* حذف تکلیف و کار فقط پس از تأیید داخلی */
  if(typeof row==='function'){
    const baseTaskRow=row;
    row=function(item){const element=baseTaskRow(item),remove=q('.remove',element);if(remove)remove.onclick=()=>confirmInside('حذف تکلیف','این تکلیف حذف شود؟','بله، حذف شود',()=>{tasks=tasks.filter(value=>value.id!==item.id);saveTasks()});return element};
    if(typeof draw==='function')draw();
  }
  if(typeof todoRow==='function'){
    const baseTodoRow=todoRow;
    todoRow=function(item){const element=baseTodoRow(item),remove=q('.remove',element);if(remove)remove.onclick=()=>confirmInside('حذف کار','این کار از فهرست حذف شود؟','بله، حذف شود',()=>{todos=todos.filter(value=>value.id!==item.id);saveTodos()});return element};
    if(typeof drawTodos==='function')drawTodos();
  }

  /* بازگشت از جلسه مطالعه با هشدار داخلی */
  const focusBack=q('#backFocus');
  if(focusBack)focusBack.onclick=()=>confirmInside('خروج از جلسه','می‌خواهی از جلسهٔ مطالعه خارج شوی؟ زمان این جلسه ثبت نمی‌شود.','بله، خارج شوم',()=>{if(typeof run!=='undefined'&&run){clearInterval(run);run=null}q('#timerScreen')?.classList.remove('show')});

  /* انتخاب ساعت به شکل چرخ‌های ساعت گوشی */
  function paintTimeButton(button,value){
    if(!button)return;button.classList.toggle('empty',!value);const label=q('span',button);if(label)label.textContent=value?fa(value):'انتخاب ساعت';
  }
  function openWheelClock(hidden,button){
    const now=new Date(),saved=(hidden.value||'').split(':'),initialHour=Number(saved[0]||now.getHours()),initialMinute=saved[1]!==undefined?Math.round(Number(saved[1])/5)*5:Math.round(now.getMinutes()/5)*5;
    let hour=Math.min(23,initialHour),minute=initialMinute===60?55:Math.min(55,initialMinute);
    const body=document.createElement('div');body.className='clock-wheel-v43';
    body.innerHTML='<div class="clock-preview-v43"><span class="preview-hour"></span><i>:</i><span class="preview-minute"></span></div><div class="clock-wheels-v43"><section><b>ساعت</b><div class="clock-wheel-list hours" role="listbox"></div></section><section><b>دقیقه</b><div class="clock-wheel-list minutes" role="listbox"></div></section></div><div class="clock-actions-v43"><button class="plain no-time" type="button">بدون ساعت</button><button class="blue accept-time" type="button">تأیید ساعت</button></div>';
    const hours=q('.hours',body),minutes=q('.minutes',body),rowHeight=54;
    const build=(container,values,current,setter)=>values.forEach(value=>{const item=document.createElement('button');item.type='button';item.dataset.value=value;item.setAttribute('role','option');item.textContent=fa(String(value).padStart(2,'0'));item.onclick=()=>{setter(value);container.scrollTo({top:valueIndex(values,value)*rowHeight,behavior:'smooth'})};container.append(item)});
    const valueIndex=(values,value)=>Math.max(0,values.indexOf(value));
    const hourValues=Array.from({length:24},(_,index)=>index),minuteValues=Array.from({length:12},(_,index)=>index*5);
    const render=()=>{q('.preview-hour',body).textContent=fa(String(hour).padStart(2,'0'));q('.preview-minute',body).textContent=fa(String(minute).padStart(2,'0'));qa('.hours button',body).forEach(item=>{const active=Number(item.dataset.value)===hour;item.classList.toggle('selected',active);item.setAttribute('aria-selected',active)});qa('.minutes button',body).forEach(item=>{const active=Number(item.dataset.value)===minute;item.classList.toggle('selected',active);item.setAttribute('aria-selected',active)})};
    build(hours,hourValues,hour,value=>{hour=value;render()});build(minutes,minuteValues,minute,value=>{minute=value;render()});
    const bindScroll=(container,values,setter)=>{container.addEventListener('scroll',()=>{const index=Math.max(0,Math.min(values.length-1,Math.round(container.scrollTop/rowHeight)));setter(values[index]);render()},{passive:true})};
    bindScroll(hours,hourValues,value=>hour=value);bindScroll(minutes,minuteValues,value=>minute=value);render();
    const modal=showDialog('انتخاب ساعت',body);modal?.classList.add('clock-modal-v43');
    q('.no-time',body).onclick=()=>{hidden.value='';paintTimeButton(button,'');modal?.remove()};
    q('.accept-time',body).onclick=()=>{hidden.value=String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');paintTimeButton(button,hidden.value);modal?.remove()};
    requestAnimationFrame(()=>{hours.scrollTop=valueIndex(hourValues,hour)*rowHeight;minutes.scrollTop=valueIndex(minuteValues,minute)*rowHeight});
  }
  function connectClockButtons(){
    qa('.lerno-time-button').forEach(button=>{if(button.dataset.v43Clock)return;button.dataset.v43Clock='true';button.onclick=()=>{const hidden=button.id==='homeNoteTimeButton'?q('#homeNoteTime'):q('#todoTime');if(hidden)openWheelClock(hidden,button)}});
  }
  connectClockButtons();new MutationObserver(connectClockButtons).observe(document.body,{childList:true,subtree:true});

  /* دریافت و برگرداندن نسخه پشتیبان */
  function rawKeys(){return Array.from({length:localStorage.length},(_,index)=>localStorage.key(index)).filter(Boolean)}
  function storageScope(){const phone=window.LERNO_AUTH?.session?.phone;return phone?'lerno-v26-user-'+phone+'-':''}
  function backupEntries(){
    const scope=storageScope(),result={};
    rawKeys().forEach(key=>{if(scope){if(key.startsWith(scope))result[key.slice(scope.length)]=window.LERNO_AUTH.rawGet(key)}else if(key.startsWith('lerno-')&&!key.startsWith('lerno-v26-auth-')&&!key.startsWith('lerno-v26-user-')&&!key.startsWith('lerno-v43-welcome'))result[key]=window.LERNO_AUTH?.rawGet(key)??localStorage.getItem(key)});return result;
  }
  function downloadBackup(){
    const payload={app:'LERNO',version:43,createdAt:new Date().toISOString(),data:backupEntries()},blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='lerno-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);if(typeof toast==='function')toast('فایل پشتیبان آماده شد ✓');
  }
  function restoreBackup(payload){
    const data=payload?.data;if(payload?.app!=='LERNO'||!data||typeof data!=='object')throw new Error('invalid');const scope=storageScope(),rawSet=window.LERNO_AUTH?.rawSet,rawRemove=window.LERNO_AUTH?.rawRemove;
    rawKeys().forEach(key=>{if(scope?key.startsWith(scope):(key.startsWith('lerno-')&&!key.startsWith('lerno-v26-auth-')&&!key.startsWith('lerno-v26-user-')&&!key.startsWith('lerno-v43-welcome')))rawRemove?rawRemove(key):localStorage.removeItem(key)});
    Object.entries(data).forEach(([key,value])=>{const target=scope+key;(rawSet||localStorage.setItem.bind(localStorage))(target,String(value))});location.reload();
  }
  function installBackupCard(){
    if(q('#profileBackupV43'))return;const card=document.createElement('section');card.id='profileBackupV43';card.className='profile-backup-v43';card.innerHTML='<div><i aria-hidden="true">⇩</i><span><b>نسخهٔ پشتیبان</b><small>اطلاعاتت را ذخیره کن یا دوباره برگردان.</small></span></div><div class="backup-actions-v43"><button class="plain download-backup" type="button">گرفتن پشتیبان</button><button class="plain restore-backup" type="button">برگرداندن اطلاعات</button><input class="backup-file" type="file" accept="application/json,.json" hidden></div>';
    q('#profile')?.append(card);q('.download-backup',card).onclick=downloadBackup;const file=q('.backup-file',card);q('.restore-backup',card).onclick=()=>file.click();file.onchange=async()=>{const selected=file.files[0];if(!selected)return;try{const payload=JSON.parse(await selected.text());const first=document.createElement('div');first.className='v43-confirm';first.innerHTML='<p>اطلاعات فعلی با فایل پشتیبان جایگزین شود؟</p><div><button class="plain cancel" type="button">انصراف</button><button class="danger continue" type="button">ادامه</button></div>';const modal=showDialog('برگرداندن اطلاعات',first);q('.cancel',first).onclick=()=>modal?.remove();q('.continue',first).onclick=()=>{modal?.remove();confirmInside('تأیید نهایی','بعد از تأیید، برنامه با اطلاعات فایل دوباره باز می‌شود.','بله، برگردان',()=>{try{restoreBackup(payload)}catch{if(typeof toast==='function')toast('فایل پشتیبان معتبر نیست.') }})}}catch{if(typeof toast==='function')toast('فایل پشتیبان معتبر نیست.')}finally{file.value=''}};
  }
  installBackupCard();
})();
