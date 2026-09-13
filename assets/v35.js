(function lernoV35(){
  'use strict';
  const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const gradeNames=['اول ابتدایی','دوم ابتدایی','سوم ابتدایی','چهارم ابتدایی','پنجم ابتدایی','ششم ابتدایی','هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم'];
  const books={
    'اول ابتدایی':['فارسی','نگارش','ریاضی','علوم','قرآن','هدیه‌های آسمانی','هنر','تربیت بدنی'],
    'دوم ابتدایی':['فارسی','نگارش','ریاضی','علوم','قرآن','هدیه‌های آسمانی','هنر','تربیت بدنی'],
    'سوم ابتدایی':['فارسی','نگارش','ریاضی','علوم','مطالعات اجتماعی','قرآن','هدیه‌های آسمانی','هنر','تربیت بدنی'],
    'چهارم ابتدایی':['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','قرآن','هدیه‌های آسمانی','هنر','تربیت بدنی'],
    'پنجم ابتدایی':['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','قرآن','هدیه‌های آسمانی','هنر','تربیت بدنی'],
    'ششم ابتدایی':['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','قرآن','هدیه‌های آسمانی','تفکر و پژوهش','کار و فناوری','هنر','تربیت بدنی'],
    'هفتم':['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','پیام‌های آسمان','قرآن','عربی','زبان انگلیسی','تفکر و سبک زندگی','کار و فناوری','فرهنگ و هنر','تربیت بدنی'],
    'هشتم':['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','پیام‌های آسمان','قرآن','عربی','زبان انگلیسی','تفکر و سبک زندگی','کار و فناوری','فرهنگ و هنر','تربیت بدنی'],
    'نهم':['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','پیام‌های آسمان','قرآن','عربی','زبان انگلیسی','آمادگی دفاعی','کار و فناوری','فرهنگ و هنر','تربیت بدنی']
  };
  const levelLabels={needs:'نیاز به تلاش بیشتر',acceptable:'قابل قبول',good:'خوب',great:'خیلی خوب'};
  let term='first';
  let reportData=readReport();
  const originalDeadline=typeof chosenDeadline==='function'?chosenDeadline:null;
  if(originalDeadline)chosenDeadline=function(){return isEarly()?'':originalDeadline()};

  function currentGrade(){
    const saved=JSON.parse(localStorage.getItem('lerno-open-profile')||'{}');
    return String((typeof profile!=='undefined'&&profile.grade)||saved.grade||'');
  }
  function gradeIndex(){return gradeNames.indexOf(currentGrade())}
  function isDescriptive(){const i=gradeIndex();return i>=0&&i<=5}
  function isEarly(){const i=gradeIndex();return i>=0&&i<=2}
  function readReport(){try{return JSON.parse(localStorage.getItem('lerno-report-v35')||'{}')}catch{return {}}}
  function saveReport(){localStorage.setItem('lerno-report-v35',JSON.stringify(reportData))}
  function termKey(){return currentGrade()+'::'+term}
  function records(){return reportData[termKey()]||[]}
  function setRecords(value){reportData[termKey()]=value;saveReport()}
  function fa(value){return new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(value)}

  function iconBack(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M26 9v7a9 9 0 0 1-9 9H7"></path><path d="m12 20-5 5 5 5"></path><path d="M26 9h-7"></path></svg>'}
  function fixBackButtons(){
    qa('.page-back,.support-back,.back-focus').forEach(button=>{button.innerHTML=iconBack();button.title='بازگشت';button.setAttribute('aria-label','بازگشت')});
  }

  const copy={
    early:{
      home:['خانهٔ من','سلام! امروز چه کارهایی داری؟','کارهای امروز، آزمون بعدی و چیزهایی که باید در کیف بگذاری اینجاست.'],
      calendar:['تقویم من','روزهای مدرسه','روی یک روز بزن و بنویس آن روز چه کاری داری.'],
      schedule:['برنامهٔ کلاس‌ها','برنامهٔ هفتگی من','ببین هر روز چه درس‌هایی داری و چه کتاب‌هایی باید ببری.'],
      tasks:['کارهای مدرسه','تکلیف‌های من','تکلیف‌هایت را بنویس و بعد از انجام‌دادن تیک بزن.'],
      todo:['کارهای من','فهرست کارها','هر کاری که می‌خواهی یادت بماند اینجا بنویس.'],
      grades:['کارنامهٔ مدرسه','کارنامهٔ من','برای هر درس یکی از وضعیت‌های کارنامه را انتخاب کن.'],
      focus:['وقت درس خواندن','مطالعه برای درس','درست را انتخاب کن و برای چند دقیقه با تمرکز بخوان.'],
      calculator:['حساب کنیم','ماشین حساب','عددها را وارد کن و جواب را ببین.'],
      account:['حساب من','حساب کاربری','اطلاعات این برنامه روی همین دستگاه نگه داشته می‌شود.'],
      profile:['دربارهٔ من','پروفایل من','نام، کلاس و عکس خودت را اینجا انتخاب کن.']
    },
    upper:{
      home:['خانهٔ من','برنامهٔ امروزت را ببین','کارهای مهم، آزمون بعدی و وسایل فردا را یک‌جا بررسی کن.'],
      calendar:['تقویم مدرسه','تقویم برنامه‌ها','برای هر روز تکلیف، آزمون یا پروژه ثبت کن.'],
      schedule:['کلاس‌های هفته','برنامهٔ هفتگی','درس‌های هر روز را بچین تا برای فردا آماده باشی.'],
      tasks:['کارهای مدرسه','تکالیف و پروژه‌ها','کار درسی را ثبت کن، انجام بده و تیک بزن.'],
      todo:['یادآوری‌ها','فهرست کارها','کارهای شخصی و یادآوری‌هایت را مرتب نگه دار.'],
      grades:['کارنامهٔ مدرسه','کارنامهٔ من','وضعیت هر درس را برای نوبت اول، نوبت دوم یا میان‌ترم ثبت کن.'],
      focus:['تمرکز روی درس','زمان مطالعه','یک درس و زمان مناسب انتخاب کن و جلسه را شروع کن.'],
      calculator:['ابزار محاسبه','ماشین حساب','محاسبه‌های درسی را سریع و راحت انجام بده.'],
      account:['حساب من','حساب کاربری','اطلاعات و وضعیت نصب برنامه را مدیریت کن.'],
      profile:['اطلاعات من','پروفایل من','پایه و مشخصاتت را تنظیم کن تا درس‌ها درست پیشنهاد شوند.']
    },
    teen:{
      home:['داشبورد','مرکز برنامه‌ریزی امروز','اولویت‌ها، آزمون نزدیک و برنامهٔ فردا را دقیق بررسی کن.'],
      calendar:['برنامه‌ریزی زمانی','تقویم تحصیلی','تکلیف‌ها، آزمون‌ها و پروژه‌ها را در مسیر زمانی خودت مدیریت کن.'],
      schedule:['نقشهٔ هفته','برنامهٔ هفتگی','کلاس‌ها و درس‌های هفته را منظم و قابل پیگیری بچین.'],
      tasks:['مدیریت اجرا','تکالیف و پروژه‌ها','مهلت‌ها را ثبت کن و کارهای انجام‌شده را از برنامه خارج کن.'],
      todo:['اولویت‌های شخصی','فهرست کارها','یادآوری‌ها و کارهای غیردرسی را بر اساس اهمیت مرتب کن.'],
      grades:['ارزیابی تحصیلی','نمره‌ها و معدل','نمره‌ها را ثبت کن تا میانگین و وضعیت عملکردت مشخص شود.'],
      focus:['جلسهٔ تمرکز','زمان مطالعه','درس و بازهٔ تمرکز را انتخاب کن و بدون حواس‌پرتی شروع کن.'],
      calculator:['ابزار محاسبه','ماشین حساب','محاسبه‌های روزمره و درسی را سریع انجام بده.'],
      account:['مدیریت حساب','حساب کاربری','داده‌های محلی، نصب و اعلان‌های برنامه را مدیریت کن.'],
      profile:['هویت تحصیلی','پروفایل من','اطلاعات تحصیلی را تنظیم کن تا پیشنهادها دقیق‌تر شوند.']
    }
  };

  function applyExperience(){
    const index=gradeIndex(),band=index>=0&&index<=2?'early':index>=3&&index<=5?'upper':'teen';
    document.body.classList.remove('grade-early','grade-upper','grade-middle','grade-high','grade-primary');
    if(band==='early')document.body.classList.add('grade-early','grade-primary');
    else if(band==='upper')document.body.classList.add('grade-upper','grade-primary');
    else document.body.classList.add(index>=9?'grade-high':'grade-middle');
    document.body.classList.toggle('grade-four',index===3);
    const selected=copy[band];
    Object.entries(selected).forEach(([id,values])=>{
      const page=q('#'+id),title=page?.querySelector('.page-title')||page?.querySelector('.home-dashboard-head>div');
      if(!title)return;
      const small=title.querySelector('small'),h=title.querySelector('h1'),p=title.querySelector('p');
      if(small)small.textContent=values[0];if(h)h.textContent=values[1];if(p)p.textContent=values[2];
    });
    const navGrade=q('[data-page="grades"] span');if(navGrade)navGrade.textContent=isDescriptive()?'کارنامهٔ من':'نمره‌ها و معدل';
    const progressButton=q('[data-page="progress-page"]');if(progressButton)progressButton.hidden=index>=0&&index<=3;
    const quickNote=q('#homeQuickNoteForm');if(quickNote)quickNote.hidden=index>=0&&index<=3;
    const taskTime=q('#scheduleTime');
    if(taskTime){taskTime.required=!isEarly();taskTime.hidden=isEarly();taskTime.closest('form')?.classList.toggle('no-time',isEarly())}
    const taskWhen=q('#taskWhen'),customDate=q('#customDate'),deadlineHelp=q('.deadline-help'),taskSubmit=q('#taskForm .blue');
    if(taskWhen)taskWhen.hidden=isEarly();if(customDate&&isEarly())customDate.hidden=true;if(deadlineHelp)deadlineHelp.hidden=isEarly();if(taskSubmit)taskSubmit.textContent=isEarly()?'افزودن تکلیف':'ثبت با مهلت';
    populateReportSubjects();renderReport();fixBackButtons();
  }

  function subjectList(){
    const grade=currentGrade();
    if(books[grade])return books[grade];
    if(typeof gradeBooks==='function'){const found=gradeBooks();if(Array.isArray(found)&&found.length)return found}
    return ['فارسی','ریاضی','علوم','زبان انگلیسی'];
  }
  function populateReportSubjects(){
    const select=q('#reportSubject');if(!select)return;
    const old=select.value;select.innerHTML='<option value="">یک درس را انتخاب کن</option>';
    subjectList().forEach(subject=>select.add(new Option(subject,subject)));
    if([...select.options].some(option=>option.value===old))select.value=old;
  }
  function summaryMarkup(list){
    if(isDescriptive()){
      const great=list.filter(item=>item.value==='great').length,done=list.length,total=subjectList().length;
      return '<article><small>درس‌های ثبت‌شده</small><b>'+fa(done)+' از '+fa(total)+'</b></article><article><small>خیلی خوب</small><b>'+fa(great)+' درس</b></article><article><small>نوبت کارنامه</small><b>'+({first:'نوبت اول',second:'نوبت دوم',mid:'میان‌ترم'}[term])+'</b></article>';
    }
    const scores=list.map(item=>Number(item.value)).filter(Number.isFinite),average=scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:null,best=list.slice().sort((a,b)=>Number(b.value)-Number(a.value))[0];
    return '<article><small>معدل فعلی</small><b>'+(average===null?'—':fa(average))+'</b></article><article><small>بهترین درس</small><b>'+(best?best.subject:'—')+'</b></article><article><small>درس‌های ثبت‌شده</small><b>'+fa(list.length)+'</b></article>';
  }
  function renderReport(){
    const list=records(),descriptive=isDescriptive(),grade=currentGrade()||'پایهٔ انتخاب‌شده';
    q('#reportGradeLabel').textContent='کارنامهٔ '+grade;
    q('#reportHeading').textContent=descriptive?'وضعیت درس‌های من':'ارزیابی نمره‌ها';
    q('#reportSubtitle').textContent=descriptive?'برای هر درس، همان عبارت‌های کارنامهٔ مدرسه را انتخاب کن.':'نمرهٔ هر درس را ثبت کن تا معدل فعلی محاسبه شود.';
    q('#reportValueLabel').textContent=descriptive?'وضعیت کارنامه':'نمره از ۲۰';
    q('#reportColumnLabel').textContent=descriptive?'وضعیت من':'نمره';
    q('#reportLevel').hidden=!descriptive;q('#reportScore').hidden=descriptive;
    q('#reportSummary').innerHTML=summaryMarkup(list);
    const rows=q('#reportRows');rows.innerHTML='';
    if(!list.length){rows.innerHTML='<div class="report-empty">هنوز درسی برای این نوبت ثبت نشده است.</div>';return}
    list.forEach(item=>{
      const row=document.createElement('div');row.className='report-row';row.setAttribute('role','row');
      const label=descriptive?levelLabels[item.value]:(fa(Number(item.value))+' از ۲۰');
      row.innerHTML='<b></b><span class="report-level"></span><button class="report-delete" type="button" aria-label="حذف درس">×</button>';
      row.querySelector('b').textContent=item.subject;const level=row.querySelector('.report-level');level.textContent=label;if(descriptive)level.classList.add(item.value);
      row.querySelector('button').onclick=()=>askDelete(item);rows.append(row);
    });
  }
  function askDelete(item){
    const dialog=q('#confirmDialogV35');q('#confirmV35Text').textContent='آیا می‌خواهی درس «'+item.subject+'» را از کارنامه‌ات حذف کنی؟';dialog.classList.add('open');dialog.setAttribute('aria-hidden','false');
    const close=()=>{dialog.classList.remove('open');dialog.setAttribute('aria-hidden','true')};
    q('#confirmV35No').onclick=close;q('#confirmV35Yes').onclick=()=>{setRecords(records().filter(record=>record.id!==item.id));close();renderReport()};
  }

  qa('[data-report-term]').forEach(button=>button.onclick=()=>{term=button.dataset.reportTerm;qa('[data-report-term]').forEach(item=>item.classList.toggle('active',item===button));renderReport()});
  if(q('#taskForm'))q('#taskForm').onsubmit=event=>{
    event.preventDefault();const text=q('#taskInput').value.trim();if(!text)return;
    const subject=q('#taskSubject')?.value||'',title=subject?subject+' — '+text:text;
    tasks.push({id:Date.now(),title,subject,done:false,kind:q('#taskKind').value,date:isEarly()?'':(originalDeadline?originalDeadline():'')});
    q('#taskInput').value='';saveTasks();toast(isEarly()?'تکلیف اضافه شد ✓':'تکلیف با مهلت ثبت شد ✓');
  };
  q('#reportForm')?.addEventListener('submit',event=>{
    event.preventDefault();const subject=q('#reportSubject').value;if(!subject)return;
    const value=isDescriptive()?q('#reportLevel').value:q('#reportScore').value;
    if(!isDescriptive()&&(value===''||Number(value)<0||Number(value)>20))return;
    const list=records().filter(item=>item.subject!==subject);list.push({id:Date.now(),subject,value});setRecords(list);q('#reportSubject').value='';q('#reportScore').value='';renderReport();
  });
  q('#confirmDialogV35')?.addEventListener('click',event=>{if(event.target===event.currentTarget)q('#confirmV35No').click()});

  q('#profileForm')?.addEventListener('submit',()=>setTimeout(applyExperience,30));
  q('#editProfile')?.addEventListener('click',()=>setTimeout(applyExperience,30));
  const sideGrade=q('#sideGrade');if(sideGrade)new MutationObserver(()=>applyExperience()).observe(sideGrade,{childList:true,subtree:true,characterData:true});
  qa('.profile-settings-card').forEach(card=>card.remove());
  fixBackButtons();applyExperience();
})();
