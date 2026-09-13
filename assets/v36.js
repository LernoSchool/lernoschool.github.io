(function lernoV36(){
  'use strict';
  const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const gradeNames=['اول ابتدایی','دوم ابتدایی','سوم ابتدایی','چهارم ابتدایی','پنجم ابتدایی','ششم ابتدایی','هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم'];
  const levelLabels={needs:'نیاز به تلاش بیشتر',acceptable:'قابل قبول',good:'خوب',great:'خیلی خوب'};
  const levelIcons={needs:'↻',acceptable:'○',good:'✓',great:'★'};
  const subjectIcon=subject=>/فارسی/.test(subject)?'📘':/نگارش/.test(subject)?'✏️':/ریاضی/.test(subject)?'➗':/علوم|فیزیک|شیمی|زیست/.test(subject)?'🔬':/مطالعات|تاریخ|جغرافیا/.test(subject)?'🌍':/قرآن|هدیه|پیام|دین/.test(subject)?'📖':/هنر/.test(subject)?'🎨':/تربیت|ورزش/.test(subject)?'⚽':/کار و فناوری/.test(subject)?'🧩':/تفکر/.test(subject)?'💡':'📚';
  let currentTerm='first';

  function savedProfile(){try{return JSON.parse(localStorage.getItem('lerno-open-profile')||'{}')}catch{return {}}}
  function currentGrade(){return String((typeof profile!=='undefined'&&profile.grade)||savedProfile().grade||'')}
  function gradeIndex(){return gradeNames.indexOf(currentGrade())}
  function isDescriptive(){const index=gradeIndex();return index>=0&&index<=5}
  function isEarly(){const index=gradeIndex();return index>=0&&index<=2}
  function reportStore(){try{return JSON.parse(localStorage.getItem('lerno-report-v35')||'{}')}catch{return {}}}
  function saveReportStore(data){localStorage.setItem('lerno-report-v35',JSON.stringify(data))}
  function reportKey(){return currentGrade()+'::'+currentTerm}
  function reportRecords(){return reportStore()[reportKey()]||[]}
  function setReportRecords(value){const data=reportStore();data[reportKey()]=value;saveReportStore(data)}
  function removedStore(){try{return JSON.parse(localStorage.getItem('lerno-report-removed-v36')||'{}')}catch{return {}}}
  function removedSubjects(){return removedStore()[reportKey()]||[]}
  function setRemovedSubjects(value){const data=removedStore();data[reportKey()]=value;localStorage.setItem('lerno-report-removed-v36',JSON.stringify(data))}
  function finalizedReportStore(){try{return JSON.parse(localStorage.getItem('lerno-report-finalized-v38')||'{}')}catch{return {}}}
  function reportIsFinalized(){return finalizedReportStore()[reportKey()]===true}
  function setReportFinalized(value){const data=finalizedReportStore();data[reportKey()]=value;localStorage.setItem('lerno-report-finalized-v38',JSON.stringify(data))}
  const editingReports=new Set();
  function reportIsLocked(){return reportIsFinalized()&&!editingReports.has(reportKey())}
  function subjectsForGrade(){
    if(typeof gradeBooks==='function'){const list=gradeBooks();if(Array.isArray(list)&&list.length)return [...new Set(list)]}
    return ['فارسی','نگارش','ریاضی','علوم','قرآن','هنر','تربیت بدنی'];
  }
  function fa(value){return new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(value)}

  function renderDescriptiveReport(){
    if(!isDescriptive())return;
    const card=q('.report-card'),rows=q('#reportRows'),all=subjectsForGrade(),removed=removedSubjects(),records=reportRecords(),locked=reportIsLocked();
    if(!card||!rows)return;card.classList.add('is-descriptive');card.classList.toggle('report-locked',locked);
    q('#reportHeading').textContent='کارنامهٔ '+(currentGrade()||'من');
    q('#reportSubtitle').textContent=locked?'کارنامه‌ات ثبت شده است. برای تغییر، دکمه پایین را بزن.':'جلوی هر درس، وضعیتت را انتخاب کن.';
    const selectedCount=records.filter(item=>all.includes(item.subject)&&item.value).length,greatCount=records.filter(item=>all.includes(item.subject)&&item.value==='great').length;
    q('#reportSummary').innerHTML='<article><small>درس‌های کامل‌شده</small><b>'+fa(selectedCount)+' از '+fa(all.length-removed.length)+'</b></article><article><small>خیلی خوب</small><b>'+fa(greatCount)+' درس</b></article><article><small>کارنامه</small><b>'+({first:'نوبت اول',second:'نوبت دوم',mid:'میان‌ترم'}[currentTerm])+'</b></article>';
    rows.innerHTML='';
    all.forEach((subject,index)=>{
      if(removed.includes(subject))return;
      const saved=records.find(item=>item.subject===subject),row=document.createElement('div');row.className='report-subject-row'+(locked?' report-row-locked':'');
      row.innerHTML='<div class="report-subject-name"><i aria-hidden="true"></i><b></b></div><div class="report-levels" role="group"></div><button class="report-delete" type="button" aria-label="حذف درس">×</button>';
      row.querySelector('i').textContent=subjectIcon(subject);row.querySelector('b').textContent=subject;
      const levels=row.querySelector('.report-levels');
      if(locked){const result=document.createElement('span');result.className='report-level-result '+(saved?.value||'empty');result.textContent=saved?.value?levelIcons[saved.value]+' '+levelLabels[saved.value]:'وضعیت انتخاب نشده';levels.append(result)}
      else Object.entries(levelLabels).forEach(([value,label])=>{const button=document.createElement('button');button.type='button';button.dataset.level=value;button.textContent=levelIcons[value]+' '+label;button.classList.toggle('selected',saved?.value===value);button.onclick=()=>{const next=reportRecords().filter(item=>item.subject!==subject);next.push({id:saved?.id||Date.now(),subject,value});setReportRecords(next);renderDescriptiveReport()};levels.append(button)});
      if(locked)row.querySelector('.report-delete').remove();else row.querySelector('.report-delete').onclick=()=>confirmLessonDelete(subject);rows.append(row);
    });
    q('.report-restore')?.remove();
    if(removed.length&&!locked){const restore=document.createElement('div');restore.className='report-restore';restore.innerHTML='<span></span><button type="button">برگرداندن درس‌های حذف‌شده</button>';restore.querySelector('span').textContent=fa(removed.length)+' درس از کارنامه پنهان شده است.';restore.querySelector('button').onclick=()=>{setRemovedSubjects([]);renderDescriptiveReport()};card.append(restore)}
    renderReportActions(card);
  }
  function confirmLessonDelete(subject){
    const dialog=q('#confirmDialogV35');q('#confirmV35Title').textContent='حذف درس';q('#confirmV35Text').textContent='آیا می‌خواهی درس «'+subject+'» را از کارنامه‌ات حذف کنی؟';dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');
    const close=()=>{dialog.classList.remove('open');dialog.setAttribute('aria-hidden','true')};q('#confirmV35No').onclick=close;q('#confirmV35Yes').onclick=()=>{setRemovedSubjects([...new Set([...removedSubjects(),subject])]);close();renderDescriptiveReport()};
  }
  function renderReportActions(card){
    q('.report-actions-v38')?.remove();const locked=reportIsLocked(),wasFinalized=reportIsFinalized(),bar=document.createElement('div');bar.className='report-actions-v38';const button=document.createElement('button');button.type='button';button.className=locked?'report-edit-v38':'report-save-v38';button.textContent=locked?'تغییر کارنامه':(wasFinalized?'ثبت تغییرات':'ثبت کارنامه');button.onclick=()=>{if(locked){editingReports.add(reportKey());renderReportMode();toast('حالا می‌توانی کارنامه را تغییر بدهی.')}else{setReportFinalized(true);editingReports.delete(reportKey());renderReportMode();toast(wasFinalized?'تغییرات کارنامه ثبت شد ✓':'کارنامه ثبت شد ✓')}};bar.append(button);card.append(bar);
  }
  function renderReportMode(){const card=q('.report-card');if(!card)return;if(isDescriptive())renderDescriptiveReport();else{card.classList.remove('is-descriptive');card.classList.toggle('report-locked',reportIsLocked());renderReportActions(card)}}
  qa('[data-report-term]').forEach(button=>button.addEventListener('click',()=>{currentTerm=button.dataset.reportTerm;setTimeout(renderReportMode,0)}));

  /* تقویم: کارهای شخصی در تقویم نمایش داده نمی‌شوند و روز پُر پنجرهٔ جدا دارد. */
  calendarItemsForDate=function(key){
    const own=entries.filter(item=>item.date===key).map(item=>({source:'entry',record:item,id:item.id,text:item.text,type:normalizedEntryType(item.type)}));
    const linked=tasks.filter(item=>item.date===key&&!own.some(entry=>item.calendarEntryId===entry.id||(entry.text===item.title&&entry.type===(item.kind||'task')))).map(item=>({source:'task',record:item,id:item.id,text:item.title,type:item.kind==='project'?'project':'task'}));
    return own.concat(linked);
  };
  renderEntryList=function(){
    q('#calendarEntryList')?.remove();const list=document.createElement('div');list.id='calendarEntryList';list.className='calendar-entry-list';const items=calendarItemsForDate(chosenDate),box=q('#entryModal .modal-box');box.classList.toggle('existing-day',items.length>0);box.classList.toggle('empty-day',items.length===0);box.querySelector('h2').textContent=items.length?'برنامه‌های این روز':'برای این روز چه برنامه‌ای داری؟';const note=box.querySelector('.entry-mode-note');if(note)note.textContent=items.length?'برنامه را ویرایش کن یا اگر لازم نیست حذفش کن.':'نوع برنامه را انتخاب کن و کوتاه بنویس چه کاری داری.';
    items.forEach(item=>{const row=document.createElement('div');row.className='calendar-entry-row '+item.type;row.innerHTML='<span></span><b></b><button type="button">ویرایش</button><button type="button">حذف</button>';row.querySelector('span').textContent=entryTypeLabel(item.type);row.querySelector('b').textContent=item.text;row.querySelectorAll('button')[0].onclick=()=>editCalendarItem(item);row.querySelectorAll('button')[1].onclick=()=>deleteCalendarItem(item);list.append(row)});
    box.append(list);
  };
  openEntry=function(key,date){
    chosenDate=key;const modal=q('#entryModal'),box=modal.querySelector('.modal-box'),items=calendarItemsForDate(key),title=box.querySelector('h2');q('#selectedDate').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);box.classList.toggle('existing-day',items.length>0);box.classList.toggle('empty-day',items.length===0);title.textContent=items.length?'برنامه‌های این روز':'برای این روز چه برنامه‌ای داری؟';box.querySelector('.entry-mode-note')?.remove();const note=document.createElement('p');note.className='entry-mode-note';note.textContent=items.length?'برنامه را ویرایش کن یا اگر لازم نیست حذفش کن.':'نوع برنامه را انتخاب کن و کوتاه بنویس چه کاری داری.';title.after(note);modal.classList.add('show');modal.setAttribute('aria-hidden','false');renderEntryList();if(!items.length)setTimeout(()=>q('#entryText').focus(),50);
  };

  /* انتخابگر ساعت کاملاً داخل لرنو */
  const clockSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>';
  function openTimePicker(hidden,button){
    let selected=hidden.value||'',parts=selected?selected.split(':'):['',''],hour=parts[0],minute=parts[1];const wrap=document.createElement('div');wrap.className='time-dialog';wrap.innerHTML='<div class="time-preview">--:--</div><div class="time-columns"><div class="time-column"><span>ساعت</span><div class="time-scroll hours"></div></div><div class="time-column"><span>دقیقه</span><div class="time-scroll minutes"></div></div></div><div class="time-actions"><button class="time-clear" type="button">بدون ساعت</button><button class="time-apply" type="button">تأیید ساعت</button></div>';
    const preview=wrap.querySelector('.time-preview'),hours=wrap.querySelector('.hours'),minutes=wrap.querySelector('.minutes');
    const update=()=>{preview.textContent=hour!==''&&minute!==''?hour+':'+minute:'--:--';wrap.querySelectorAll('.hours button').forEach(item=>item.classList.toggle('selected',item.dataset.value===hour));wrap.querySelectorAll('.minutes button').forEach(item=>item.classList.toggle('selected',item.dataset.value===minute))};
    for(let value=0;value<24;value++){const text=String(value).padStart(2,'0'),item=document.createElement('button');item.type='button';item.dataset.value=text;item.textContent=fa(value);item.onclick=()=>{hour=text;update()};hours.append(item)}
    for(let value=0;value<60;value+=5){const text=String(value).padStart(2,'0'),item=document.createElement('button');item.type='button';item.dataset.value=text;item.textContent=fa(value);item.onclick=()=>{minute=text;update()};minutes.append(item)}
    update();const modal=siteDialog('انتخاب ساعت',wrap);wrap.querySelector('.time-clear').onclick=()=>{hidden.value='';paintTimeButton(button,'');modal.remove()};wrap.querySelector('.time-apply').onclick=()=>{if(hour===''||minute==='')return;hidden.value=hour+':'+minute;paintTimeButton(button,hidden.value);modal.remove()};setTimeout(()=>{hours.querySelector('.selected')?.scrollIntoView({block:'center'});minutes.querySelector('.selected')?.scrollIntoView({block:'center'})},30);
  }
  function paintTimeButton(button,value){button.classList.toggle('empty',!value);button.querySelector('span').textContent=value||'انتخاب ساعت'}
  function installTodoTime(){
    const input=q('#todoTime'),label=input?.closest('.todo-time');if(!input||!label||q('#todoTimeButton'))return;input.type='hidden';const button=document.createElement('button');button.type='button';button.id='todoTimeButton';button.className='lerno-time-button empty';button.innerHTML=clockSvg+'<span>انتخاب ساعت</span>';button.onclick=()=>openTimePicker(input,button);label.append(button);paintTimeButton(button,input.value);
  }
  function installQuickNoteTime(){
    const form=q('#homeQuickNoteForm'),save=form?.querySelector('button.blue');if(!form||!save||q('#homeNoteTime'))return;const hidden=document.createElement('input');hidden.type='hidden';hidden.id='homeNoteTime';const button=document.createElement('button');button.type='button';button.id='homeNoteTimeButton';button.className='lerno-time-button home-note-time empty';button.setAttribute('aria-label','انتخاب ساعت یادداشت');button.innerHTML=clockSvg+'<span>انتخاب ساعت</span>';button.onclick=()=>openTimePicker(hidden,button);form.insertBefore(hidden,save);form.insertBefore(button,save);const showLatest=()=>{const notes=JSON.parse(localStorage.getItem('lerno-quick-notes')||'[]'),latest=notes[0];q('#homeLastNote').textContent=latest?latest.text+(latest.time?' · '+latest.time:''):'یادداشت کوتاهت را اینجا بنویس.'};showLatest();form.onsubmit=event=>{event.preventDefault();const input=q('#homeQuickNote'),text=input.value.trim();if(!text)return;const notes=JSON.parse(localStorage.getItem('lerno-quick-notes')||'[]');notes.unshift({id:Date.now(),text,time:hidden.value,date:new Date().toISOString()});localStorage.setItem('lerno-quick-notes',JSON.stringify(notes.slice(0,20)));input.value='';hidden.value='';paintTimeButton(button,'');showLatest();toast('یادداشت ذخیره شد ✓')};
  }

  /* ماشین‌حساب با ورودی قابل تایپ */
  function installCalculatorInput(){
    const calculator=q('.calculator'),keys=q('#calcKeys');if(!calculator||!keys||q('#calcInputV36'))return;const input=document.createElement('input');input.id='calcInputV36';input.className='calc-type-input';input.inputMode='decimal';input.autocomplete='off';input.placeholder='اینجا بنویس…';input.setAttribute('aria-label','عبارت ماشین حساب');calculator.insertBefore(input,keys);
    calcRender=function(){const shown=calc||'0';q('#calcDisplay').textContent=shown.replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);input.value=shown};calcRender();
    input.addEventListener('input',()=>{calc=input.value.replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/×/g,'*').replace(/÷/g,'/').replace(/[^0-9+\-*/.() ]/g,'')});
    input.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Enter'){event.preventDefault();calculate();input.focus()}else if(event.key==='Escape'){calc='';calcRender()}});
    qa('[data-calc]').forEach(button=>button.addEventListener('click',()=>setTimeout(()=>{calcRender();input.focus()},0)));
  }

  /* ورودی‌های عددی: صفحه‌کلید عددی در موبایل و جلوگیری از ورود حروف */
  function normalizeDigits(value){return String(value).replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))}
  function installNumericInputs(){
    const setup=(selector,{decimal=false,max=null,length=null}={})=>{const input=q(selector);if(!input)return;input.type='text';input.inputMode=decimal?'decimal':'numeric';input.autocomplete='off';input.classList.add('numeric-only');input.setAttribute('pattern',decimal?'[0-9۰-۹٠-٩.,٫]*':'[0-9۰-۹٠-٩]*');input.addEventListener('input',()=>{let value=normalizeDigits(input.value).replace(/[٫,]/g,'.').replace(decimal?/[^0-9.]/g:/[^0-9]/g,'');if(decimal){const parts=value.split('.');value=parts.shift()+(parts.length?'.'+parts.join(''):'')}if(length)value=value.slice(0,length);input.value=value});input.addEventListener('blur',()=>{if(input.value===''||max===null)return;const value=Number(input.value);if(Number.isFinite(value)&&value>max)input.value=String(max)});};
    setup('#reportScore',{decimal:true,max:20});setup('#gradeScore',{decimal:true,max:20});setup('#gradeWeight',{decimal:true});setup('#loginPhone',{length:11});setup('#registerPhone',{length:11});
  }

  /* برنامه هفتگی: خانه خالی برای ثبت، خانه پر فقط برای ویرایش یا حذف */
  function installScheduleEditing(){
    const openEditor=(day,period,item)=>{const wrap=document.createElement('div');wrap.className='schedule-edit-form-v39';wrap.innerHTML='<label>درس یا کتاب<select class="cell-subject-v39"></select></label><label>نام دلخواه<input class="cell-custom-v39" placeholder="اگر در فهرست نبود، اینجا بنویس"></label><button class="blue" data-yes type="button"></button>';const select=wrap.querySelector('select'),custom=wrap.querySelector('input'),save=wrap.querySelector('[data-yes]');select.innerHTML='<option value="">انتخاب درس</option>'+gradeBooks().map(subject=>'<option>'+subject+'</option>').join('');if(item){if(gradeBooks().includes(item.subject))select.value=item.subject;else custom.value=item.subject;save.textContent='ثبت تغییرات'}else save.textContent='ثبت درس';const sync=()=>{save.disabled=!(custom.value.trim()||select.value)};select.onchange=sync;custom.oninput=sync;sync();siteDialog(weekDays[day]+' — زنگ '+fa(period),wrap,()=>{const value=custom.value.trim()||select.value;schedule=schedule.filter(row=>!(row.day===day&&row.period===period));schedule.push({id:item?.id||Date.now(),day,period,subject:value});saveSchedule();toast(item?'تغییر درس ثبت شد ✓':'درس ثبت شد ✓')})};
    const openManage=(day,period,item)=>{const wrap=document.createElement('div');wrap.className='schedule-manage-v39';wrap.innerHTML='<div><small>درس ثبت‌شده</small><b></b></div><div class="schedule-manage-actions"><button class="schedule-edit-action" type="button">ویرایش</button><button class="schedule-delete-action" type="button">حذف</button></div>';wrap.querySelector('b').textContent=item.subject;const modal=siteDialog(weekDays[day]+' — زنگ '+fa(period),wrap);wrap.querySelector('.schedule-edit-action').onclick=()=>{modal.remove();openEditor(day,period,item)};wrap.querySelector('.schedule-delete-action').onclick=()=>{modal.remove();const confirm=document.createElement('div');confirm.className='schedule-delete-confirm-v39';confirm.innerHTML='<p>این درس از برنامه حذف شود؟</p><div><button class="plain cancel" type="button">نه</button><button class="danger yes" data-yes type="button">بله، حذف شود</button></div>';const confirmModal=siteDialog('حذف درس',confirm,()=>{schedule=schedule.filter(row=>!(row.day===day&&row.period===period));saveSchedule();toast('درس از برنامه حذف شد ✓')});confirm.querySelector('.cancel').onclick=()=>confirmModal.remove()}};
    schoolCell=function(day,period,item){const button=document.createElement('button');button.className='cell lesson'+(item?' has-lesson':'');button.type='button';button.textContent=item?.subject||'＋';button.setAttribute('aria-label',item?'مدیریت درس '+item.subject:'ثبت درس برای '+weekDays[day]+' زنگ '+fa(period));button.onclick=()=>item?openManage(day,period,item):openEditor(day,period,null);return button};drawSchedule();
  }

  function installFocusSubject(){
    const focus=q('#focus .focus'),options=focus?.querySelector('.options'),begin=q('#beginFocus');if(!focus||!options||!begin||q('#focusSubject'))return;const label=document.createElement('label');label.className='focus-subject';label.innerHTML='<span>امروز کدام درس را می‌خوانی؟</span><select id="focusSubject"><option value="">یک درس را انتخاب کن</option></select>';const select=label.querySelector('select');subjectsForGrade().forEach(subject=>select.add(new Option(subject,subject)));focus.insertBefore(label,options);begin.addEventListener('click',()=>{const subject=select.value;if(subject){q('#sessionLabel').textContent='مطالعهٔ '+subject;q('#sessionStatus').textContent='فقط روی '+subject+' تمرکز کن.'}});
  }

  /* تنظیمات در پنجرهٔ جدا از پروفایل */
  function installProfileSettings(){
    q('.profile-settings-card')?.remove();q('#profileSettingsV36')?.remove();if(q('#openProfileSettingsV38'))return;const launch=document.createElement('button');launch.id='openProfileSettingsV38';launch.className='profile-settings-launch';launch.type='button';launch.innerHTML='<i aria-hidden="true">⚙</i><span><b>تنظیمات برنامه</b><small>نمایش، نوشته‌ها، صدا و یادآوری‌ها</small></span><strong aria-hidden="true">‹</strong>';q('#profile').append(launch);launch.onclick=()=>openProfileSettings();
  }
  function openProfileSettings(){
    const content=document.createElement('section');content.id='profileSettingsV36';content.className='profile-settings-v36';content.innerHTML='<div class="profile-settings-grid"><label class="profile-setting"><span><b>حالت نمایش</b><small>روشن، شب یا هماهنگ با دستگاه</small></span><select id="v36Theme"><option value="light">روشن</option><option value="dark">حالت شب</option><option value="system">هماهنگ با دستگاه</option></select></label><label class="profile-setting"><span><b>اندازه نوشته‌ها</b><small>اندازه راحت‌تر برای خواندن</small></span><select id="v36Font"><option value="normal">معمولی</option><option value="comfortable">کمی بزرگ‌تر</option></select></label><label class="profile-setting"><span><b>صدای پایان مطالعه</b><small>پایان جلسه با صدا اعلام شود</small></span><input id="v36Sound" type="checkbox"></label><label class="profile-setting"><span><b>صدای دکمه‌ها</b><small>با لمس دکمه صدای کوتاهی پخش شود</small></span><input id="v36ButtonSound" type="checkbox"></label><label class="profile-setting"><span><b>یادآوری تکلیف‌ها</b><small>تکلیف‌های نزدیک روی زنگوله دیده شوند</small></span><input id="v36Reminder" type="checkbox"></label><label class="profile-setting" id="v36ReminderTimeRow"><span><b>زمان یادآوری</b><small>چند روز قبل خبر بدهد</small></span><select id="v36ReminderTime"><option value="0">همان روز</option><option value="1">یک روز قبل</option><option value="2">دو روز قبل</option></select></label></div><button class="profile-settings-save" type="button">ذخیره تنظیمات</button><div class="settings-danger-v39"><div><b>پاک‌کردن اطلاعات</b><small>همه اطلاعات این دستگاه پاک می‌شوند</small></div><button id="clearAllDataV39" type="button">پاک‌کردن اطلاعات</button></div>';
    const modal=siteDialog('تنظیمات برنامه',content);modal.classList.add('settings-dialog-v38');const theme=q('#v36Theme'),font=q('#v36Font'),sound=q('#v36Sound'),buttonSound=q('#v36ButtonSound'),reminder=q('#v36Reminder'),reminderTime=q('#v36ReminderTime'),reminderTimeRow=q('#v36ReminderTimeRow');theme.value=localStorage.getItem('lerno-theme-preference')||localStorage.getItem('lerno-theme')||'light';font.value=localStorage.getItem('lerno-font-size')||'normal';sound.checked=localStorage.getItem('lerno-timer-sound')!=='off';buttonSound.checked=localStorage.getItem('lerno-button-sound')==='on';reminder.checked=localStorage.getItem('lerno-inapp-reminders')!=='off';reminderTime.value=localStorage.getItem('lerno-reminder-days')||'1';const syncReminder=()=>{reminderTime.disabled=!reminder.checked;reminderTimeRow.classList.toggle('disabled',!reminder.checked)};reminder.onchange=syncReminder;syncReminder();content.querySelector('.profile-settings-save').onclick=()=>{localStorage.setItem('lerno-theme-preference',theme.value);const dark=theme.value==='dark'||(theme.value==='system'&&matchMedia('(prefers-color-scheme:dark)').matches);localStorage.setItem('lerno-theme',dark?'dark':'light');localStorage.setItem('lerno-font-size',font.value);localStorage.setItem('lerno-timer-sound',sound.checked?'on':'off');localStorage.setItem('lerno-button-sound',buttonSound.checked?'on':'off');localStorage.setItem('lerno-inapp-reminders',reminder.checked?'on':'off');localStorage.setItem('lerno-reminder-days',reminderTime.value);document.body.classList.toggle('dark',dark);document.body.classList.toggle('font-comfortable',font.value==='comfortable');q('#theme').textContent=dark?'☀':'☾';if(typeof updateNotificationBadge==='function')updateNotificationBadge();modal.remove();toast('تنظیمات ذخیره شد ✓')};q('#clearAllDataV39').onclick=()=>openClearDataStepOne(modal);
  }

  function openClearDataStepOne(settingsModal){const wrap=document.createElement('div');wrap.className='clear-data-v39';wrap.innerHTML='<p>می‌خواهی همه‌ی اطلاعات لرنو را پاک کنی؟</p><div><button class="plain cancel" type="button">نه، منصرف شدم</button><button class="danger continue" type="button">ادامه</button></div>';const modal=siteDialog('پاک‌کردن اطلاعات',wrap);wrap.querySelector('.cancel').onclick=()=>modal.remove();wrap.querySelector('.continue').onclick=()=>{modal.remove();openClearDataStepTwo(settingsModal)}}
  function openClearDataStepTwo(settingsModal){const wrap=document.createElement('div');wrap.className='clear-data-v39 final';wrap.innerHTML='<p><b>این کار برگشت‌پذیر نیست.</b> تکالیف، تقویم، کارنامه، برنامه هفتگی، پروفایل و تنظیمات پاک می‌شوند.</p><div><button class="plain cancel" type="button">بازگشت</button><button class="danger erase" type="button">بله، همه‌چیز پاک شود</button></div>';const modal=siteDialog('تأیید نهایی',wrap);wrap.querySelector('.cancel').onclick=()=>modal.remove();wrap.querySelector('.erase').onclick=()=>{settingsModal?.remove();localStorage.clear();location.reload()}}

  function installButtonSound(){if(document.body.dataset.buttonSoundReady)return;document.body.dataset.buttonSoundReady='true';document.addEventListener('click',event=>{if(localStorage.getItem('lerno-button-sound')!=='on'||!event.target.closest('button'))return;try{const context=new (window.AudioContext||window.webkitAudioContext)(),osc=context.createOscillator(),gain=context.createGain();osc.frequency.value=520;gain.gain.setValueAtTime(.035,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.055);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+.06)}catch{}},{capture:true})}

  function installSupportComposer(){q('.support-connection-note')?.remove();const textarea=q('#supportText');if(textarea){textarea.rows=1;textarea.setAttribute('aria-label','پیامت را بنویس')}}
  function removeCalendarWorkLegend(){q('.legend-todo')?.remove()}

  /* تکلیف فقط با انتخاب درس، نوع و مهلت ثبت می‌شود. */
  function installSimpleTaskForm(){
    const form=q('#taskForm'),input=q('#taskInput'),subject=q('#taskSubject');if(!form||!subject)return;if(input)input.remove();subject.required=true;form.classList.add('task-form-without-text');form.onsubmit=event=>{event.preventDefault();const selected=subject.value,kind=q('#taskKind').value;if(!selected){toast('اول درس را انتخاب کن.');subject.focus();return}const label=kind==='project'?'پروژه':'تکلیف',title=selected+' — '+label;tasks.push({id:Date.now(),title,subject:selected,done:false,kind,date:typeof chosenDeadline==='function'?chosenDeadline():''});saveTasks();subject.value='';toast(label+' ثبت شد ✓')};
  }

  /* راهنمای کوتاه و روشن */
  const helpText={home:['خانه','اینجا کارهای مهم، آزمون بعدی و وسایل فردا را می‌بینی.'],calendar:['تقویم','روی روز خالی بزن تا برنامه‌ای ثبت کنی. روی روز پُر بزن تا آن را ویرایش یا حذف کنی.'],schedule:['برنامه هفتگی','روی خانهٔ هر روز و زنگ بزن و نام درس را انتخاب کن.'],tasks:['تکالیف','درس، نوع و مهلت را انتخاب کن و بعد از انجام‌دادن تیک بزن.'],todo:['فهرست کارها','کارت را بنویس. از پایه چهارم به بعد می‌توانی ساعت هم انتخاب کنی.'],grades:['کارنامه','وضعیت درس‌ها را انتخاب و پایین کارنامه ثبت کن.'],focus:['زمان مطالعه','درس و زمان را انتخاب کن و جلسه را شروع کن.'],calculator:['ماشین حساب','عبارت را تایپ کن یا از دکمه‌ها استفاده کن.'],profile:['پروفایل','نام و پایه را ثبت کن. تنظیمات با دکمهٔ جدا باز می‌شود.'],support:['پشتیبانی','پرسشت را کوتاه و روشن بنویس.']};
  function installSimpleHelp(){const button=q('#v20Help');if(!button)return;button.onclick=()=>{const id=q('.page.active')?.id||'home',data=helpText[id]||helpText.home,wrap=document.createElement('div');wrap.className='help-dialog-content simple-help';wrap.innerHTML='<p class="help-purpose"></p><ol><li>بخش موردنظرت را باز کن.</li><li>اطلاعات را وارد کن و دکمه آبی را بزن.</li></ol><button class="plain help-support-link" type="button">رفتن به پشتیبانی</button>';wrap.querySelector('.help-purpose').textContent=data[1];wrap.querySelector('.help-support-link').onclick=()=>{q('.site-dialog')?.remove();if(typeof lernoNavigate==='function')lernoNavigate('support')};siteDialog('راهنمای '+data[0],wrap)};const hint=q('#helpHint');if(hint)hint.textContent='روش استفاده';}

  /* تأیید خروج از جلسهٔ مطالعه */
  function installFocusExit(){const button=q('#backFocus');if(!button)return;button.onclick=()=>{const wrap=document.createElement('div');wrap.className='focus-exit-confirm';wrap.innerHTML='<p>می‌خواهی از جلسهٔ مطالعه بیرون بروی؟</p><div><button class="plain no" type="button">نه، ادامه می‌دهم</button><button class="blue yes" type="button">بله، خارج شو</button></div>';const modal=siteDialog('خروج از جلسه',wrap);wrap.querySelector('.no').onclick=()=>modal.remove();wrap.querySelector('.yes').onclick=()=>{if(run){clearInterval(run);run=null}q('#timerScreen').classList.remove('show');modal.remove()}};}

  const friendlyCopy={
    home:['سلام! برنامهٔ امروزت اینجاست','کارهای مهم و وسایل فردا را راحت ببین.'],calendar:['تقویم من','روی هر روز بزن و برنامه‌اش را ببین.'],schedule:['برنامهٔ مدرسهٔ من','درس‌های هر روز را اینجا بچین.'],tasks:['تکلیف‌های من','درس و زمان تحویل را انتخاب کن.'],todo:['کارهای من','چیزهایی را که نباید فراموش کنی اینجا بنویس.'],grades:['کارنامهٔ من','جلوی هر درس، وضعیتت را انتخاب کن.'],focus:['وقت درس خواندن','درس و زمان را انتخاب کن و شروع کن.'],calculator:['ماشین حساب','عددها را بنویس یا دکمه‌ها را بزن.'],profile:['پروفایل من','نام، کلاس و تنظیماتت اینجاست.'],support:['پشتیبانی','اگر سؤالی داری، اینجا کوتاه بنویس.']
  };
  function applyGradeRules(){
    const index=gradeIndex(),friendly=index>=0&&index<=4,progress=q('[data-page="progress-page"]'),progressPage=q('#progress-page'),quick=q('#homeQuickNoteForm'),todoTime=q('.todo-time');
    if(progress)progress.hidden=index>=0&&index<=3;if(progressPage)progressPage.hidden=index>=0&&index<=3;if(progressPage?.classList.contains('active')&&index>=0&&index<=3)setPage('home');
    if(quick)quick.hidden=index>=0&&index<=3;if(todoTime)todoTime.hidden=isEarly();
    if(friendly)Object.entries(friendlyCopy).forEach(([id,text])=>{const page=q('#'+id),title=page?.querySelector('.page-title')||page?.querySelector('.home-dashboard-head>div');if(!title)return;const h=title.querySelector('h1'),p=title.querySelector('p');if(h)h.textContent=text[0];if(p)p.textContent=text[1]});
    const focusSubject=q('#focusSubject');if(focusSubject){const selected=focusSubject.value;focusSubject.innerHTML='<option value="">یک درس را انتخاب کن</option>';subjectsForGrade().forEach(subject=>focusSubject.add(new Option(subject,subject)));if([...focusSubject.options].some(option=>option.value===selected))focusSubject.value=selected}
    qa('.page-title>small,.home-dashboard-head>div>small').forEach(item=>item.hidden=true);renderReportMode();
  }

  installTodoTime();installQuickNoteTime();installCalculatorInput();installNumericInputs();installFocusSubject();installProfileSettings();installSimpleTaskForm();installScheduleEditing();installButtonSound();installSupportComposer();removeCalendarWorkLegend();installSimpleHelp();installFocusExit();
  drawCalendar();
  applyGradeRules();
  const gradeNode=q('#sideGrade');if(gradeNode)new MutationObserver(()=>setTimeout(applyGradeRules,0)).observe(gradeNode,{childList:true,subtree:true,characterData:true});
  q('#profileForm')?.addEventListener('submit',()=>setTimeout(applyGradeRules,50));
})();

/* v42: پیام‌های اعتبارسنجی از خود برنامه، نه پنجرهٔ انگلیسی مرورگر */
(()=>{
  const messageFor=input=>{
    const label=input.getAttribute('aria-label')||input.closest('label')?.querySelector('span')?.textContent||'';
    if(input.tagName==='SELECT')return label.includes('درس')?'لطفاً یک درس انتخاب کن.':'لطفاً یکی از گزینه‌ها را انتخاب کن.';
    if(input.type==='number')return 'لطفاً یک عدد درست وارد کن.';
    if(input.type==='time')return 'لطفاً ساعت را انتخاب کن.';
    return label?'لطفاً «'+label.trim()+'» را کامل کن.':'لطفاً این قسمت را کامل کن.';
  };
  document.addEventListener('invalid',event=>{
    const input=event.target;
    if(!input.matches('input,select,textarea'))return;
    event.preventDefault();
    input.classList.add('lerno-invalid-v42');
    if(typeof toast==='function')toast(messageFor(input));
    else{
      const box=document.querySelector('#alertToast');
      if(box){box.textContent=messageFor(input);box.classList.add('show');setTimeout(()=>box.classList.remove('show'),2600)}
    }
    input.focus({preventScroll:true});
    input.scrollIntoView({behavior:'smooth',block:'center'});
  },true);
  document.addEventListener('input',event=>event.target.classList?.remove('lerno-invalid-v42'),true);
  document.addEventListener('change',event=>event.target.classList?.remove('lerno-invalid-v42'),true);
})();
