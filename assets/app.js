const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s),fa=n=>new Intl.NumberFormat('fa-IR').format(n);
let tasks=JSON.parse(localStorage.getItem('lerno-open-tasks')||'[]'), entries=JSON.parse(localStorage.getItem('lerno-calendar-entries')||'[]'), todos=JSON.parse(localStorage.getItem('lerno-todos')||'[]'), schedule=JSON.parse(localStorage.getItem('lerno-weekly-schedule')||'[]'), grades=JSON.parse(localStorage.getItem('lerno-grades')||'[]');
let profile=JSON.parse(localStorage.getItem('lerno-open-profile')||'{"name":"","grade":"","school":"","year":"","image":"","avatar":"","locked":false}');
let cursor={...jalaliParts(new Date())},chosenDate='',mins=25,rest=5,left=1500,phase='study',run=null;
const ymd=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
function setPage(id){$$('.page').forEach(x=>x.classList.toggle('active',x.id===id));$$('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===id&&x.parentElement.tagName==='NAV'));$('#sidebar').classList.remove('open');scrollTo(0,0)}
$$('[data-page]').forEach(x=>x.onclick=()=>setPage(x.dataset.page));$('#menu').onclick=()=>$('#sidebar').classList.toggle('open');
function clock(){const d=new Date(),v=new Intl.DateTimeFormat('fa-IR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);if($('#date'))$('#date').textContent=v;if($('#heroDate'))$('#heroDate').textContent=v;if($('#time'))$('#time').textContent=new Intl.DateTimeFormat('fa-IR',{hour:'2-digit',minute:'2-digit'}).format(d)}clock();setInterval(clock,1000);
$('#theme').onclick=()=>{document.body.classList.toggle('dark');$('#theme').textContent=document.body.classList.contains('dark')?'☀':'☾';localStorage.setItem('lerno-theme',document.body.classList.contains('dark')?'dark':'light')};if(localStorage.getItem('lerno-theme')==='dark')$('#theme').click();
function saveTasks(){localStorage.setItem('lerno-open-tasks',JSON.stringify(tasks));draw();drawCalendar()}
function taskDueText(t){if(!t.date)return '';let due=new Date(t.date+'T12:00:00'),today=ymd(new Date()),tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);let label=t.date===today?'امروز':t.date===ymd(tomorrow)?'فردا':new Intl.DateTimeFormat('fa-IR',{day:'numeric',month:'long'}).format(due);return 'مهلت: '+label}
function checkDeadlines(){let today=ymd(new Date()),tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);let due=tasks.filter(t=>!t.done&&(t.date===today||t.date===ymd(tomorrow)));if(!due.length)return;let text=due[0].title+(due.length>1?' و '+fa(due.length-1)+' مورد دیگر':'');toast('یادآوری: '+text);if(typeof Notification!=='undefined'&&Notification.permission==='granted')new Notification('LERNO | یادآوری مهلت',{body:text})}
function row(t){let x=document.createElement('div');x.className='task '+(t.done?'done':'')+(t.kind==='project'?' project':'');x.innerHTML='<button class="check">'+(t.done?'✓':'')+'</button><div class="task-copy"><b></b><small></small></div><button class="remove">×</button>';x.querySelector('b').textContent=t.title;x.querySelector('small').textContent=(t.kind==='project'?'پروژه':'تکلیف')+(t.date?' · '+taskDueText(t):'');x.querySelector('.check').onclick=()=>{t.done=!t.done;saveTasks()};x.querySelector('.remove').onclick=()=>{tasks=tasks.filter(y=>y.id!==t.id);saveTasks()};return x}
function draw(){let a=tasks.filter(x=>!x.done),b=tasks.filter(x=>x.done);$('#openCount').textContent=fa(a.length);$('#doneCount').textContent=fa(b.length);[['#openTasks',a,'فعلاً تکلیفی برای انجام نداری.'],['#doneTasks',b,'هیچ تکلیف انجام‌شده‌ای نداری.']].forEach(([id,list,empty])=>{let box=$(id);box.innerHTML='';list.length?list.forEach(t=>box.append(row(t))):box.innerHTML='<div class="empty">'+empty+'</div>'});if($('#taskState'))$('#taskState').textContent=tasks.length?`${fa(b.length)} از ${fa(tasks.length)} تکلیف انجام شده`:'فهرست امروزت هنوز خالی است';if($('#taskHint'))$('#taskHint').textContent=tasks.length?'با هر تیک، مسیر امروزت روشن‌تر می‌شود.':'اولین تکلیف یا کار درسی‌ات را اضافه کن.';if($('#progress'))$('#progress').style.width=(tasks.length?b.length/tasks.length*100:0)+'%';drawProgress();if(typeof window.lernoDrawHome==='function')window.lernoDrawHome()}
function j2g(jy,jm,jd){jy+=1595;let days=-355668+365*jy+Math.floor(jy/33)*8+Math.floor((jy%33+3)/4)+jd+(jm<7?(jm-1)*31:(jm-7)*30+186),gy=400*Math.floor(days/146097);days%=146097;if(days>36524){gy+=100*Math.floor(--days/36524);days%=36524;if(days>=365)days++}gy+=4*Math.floor(days/1461);days%=1461;if(days>365){gy+=Math.floor((days-1)/365);days=(days-1)%365}let gd=days+1,months=[31,(gy%4===0&&gy%100!==0)||gy%400===0?29:28,31,30,31,30,31,31,30,31,30,31],gm=0;while(gd>months[gm])gd-=months[gm++];return new Date(gy,gm,gd)}
function jalaliParts(date){let p=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'numeric',day:'numeric'}).formatToParts(date),o={};p.forEach(x=>{if(x.type!=='literal')o[x.type]=Number(x.value.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))});return o}
function setupDeadlinePicker(){let now=jalaliParts(new Date()),day=$('#jalaliDay'),year=$('#jalaliYear');for(let i=1;i<=31;i++)day.add(new Option(fa(i),i));for(let i=1405;i<=1407;i++)year.add(new Option(fa(i),i));day.value=now.day;$('#jalaliMonth').value=now.year===1405&&now.month<6?6:now.month;year.value=Math.min(1407,Math.max(1405,now.year));$('#taskWhen').onchange=()=>$('#customDate').hidden=$('#taskWhen').value!=='custom'}
function chosenDeadline(){let mode=$('#taskWhen').value;if(mode==='today')return ymd(new Date());if(mode==='tomorrow'){let d=new Date();d.setDate(d.getDate()+1);return ymd(d)}let d=j2g(Number($('#jalaliYear').value),Number($('#jalaliMonth').value),Number($('#jalaliDay').value));return ymd(d)}
setupDeadlinePicker();$('#taskForm').onsubmit=e=>{e.preventDefault();let v=$('#taskInput').value.trim();if(v){tasks.push({id:Date.now(),title:v,done:false,kind:$('#taskKind').value,date:chosenDeadline()});$('#taskInput').value='';saveTasks();toast('با مهلت در تقویم ثبت شد ✓')}};draw();
const jalaliMonths=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
function jalaliMonthLength(year,month){if(month<=6)return 31;if(month<=11)return 30;return (j2g(year+1,1,1)-j2g(year,1,1))/86400000===366?30:29}
function shiftJalaliMonth(amount){cursor.month+=amount;if(cursor.month<1){cursor.month=12;cursor.year--}if(cursor.month>12){cursor.month=1;cursor.year++}}
function drawCalendar(){let first=j2g(cursor.year,cursor.month,1),start=new Date(first);start.setDate(first.getDate()-((first.getDay()+1)%7));$('#month').textContent=jalaliMonths[cursor.month-1]+' '+fa(cursor.year);let box=$('#days');box.innerHTML='';for(let i=0;i<42;i++){let d=new Date(start);d.setDate(start.getDate()+i);let parts=jalaliParts(d),key=ymd(d),own=parts.year===cursor.year&&parts.month===cursor.month,item=entries.filter(x=>x.date===key),linked=tasks.filter(t=>t.date===key);let b=document.createElement('button');b.className=(ymd(d)===ymd(new Date())?'today ':'')+(own?'':'outside');b.innerHTML='<b>'+fa(parts.day)+'</b><span class="entry-preview">'+(item[0]?.text||linked[0]?.title||'')+'</span>'+(item.length||linked.length?'<i class="event-dot '+(item[0]?.type||'task')+'"></i>':'');b.onclick=()=>openEntry(key,d);box.append(b)}}
$('#prevMonth').onclick=()=>{shiftJalaliMonth(-1);drawCalendar()};$('#nextMonth').onclick=()=>{shiftJalaliMonth(1);drawCalendar()};
function openEntry(key,d){chosenDate=key;$('#selectedDate').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);$('#entryModal').classList.add('show');setTimeout(()=>$('#entryText').focus(),50)}function closeEntry(){$('#entryModal').classList.remove('show');$('#entryText').value=''}$('.close-modal').onclick=closeEntry;$('#entryModal').onclick=e=>{if(e.target===$('#entryModal'))closeEntry()};
$('#entryForm').onsubmit=e=>{e.preventDefault();let text=$('#entryText').value.trim(),type=$('#entryType').value;if(!text)return;entries.push({id:Date.now(),date:chosenDate,text,type});if(type==='task')tasks.push({id:Date.now()+1,title:text,done:false,date:chosenDate});localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));saveTasks();closeEntry();toast('برای این روز ثبت شد ✓')};drawCalendar();
function renderTimer(){let m=String(Math.floor(left/60)).padStart(2,'0'),s=String(left%60).padStart(2,'0');$('#bigTimer').textContent=m+':'+s}function beep(){try{let c=new (window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=660;g.gain.setValueAtTime(.15,c.currentTime);o.start();o.stop(c.currentTime+.35)}catch(e){}}function toast(t){let x=$('#alertToast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),5000)}
function recordStudyDay(){let day=ymd(new Date()),days=JSON.parse(localStorage.getItem('lerno-study-days')||'[]');if(!days.includes(day)){days.push(day);days=days.sort().slice(-20);localStorage.setItem('lerno-study-days',JSON.stringify(days));paint()}let total=Number(localStorage.getItem('lerno-study-minutes')||0)+mins;localStorage.setItem('lerno-study-minutes',total);drawProgress()}function unlockReady(){let days=JSON.parse(localStorage.getItem('lerno-study-days')||'[]').sort();if(days.length<5)return false;let recent=days.slice(-5);return recent.every((v,i)=>i===0||((new Date(v)-new Date(recent[i-1]))===86400000))}
function toggleTimer(){if(run){clearInterval(run);run=null;$('#pauseFocus').textContent='ادامه';return}$('#pauseFocus').textContent='توقف موقت';run=setInterval(()=>{if(left>0){left--;renderTimer();return}clearInterval(run);run=null;beep();if(phase==='study'){recordStudyDay();phase='rest';left=rest*60;$('#sessionLabel').textContent='وقت استراحته';$('#sessionStatus').textContent=`${fa(rest)} دقیقه استراحت کن؛ بعد برمی‌گردیم.`;toast('وقت استراحته!')}else{phase='study';left=mins*60;$('#sessionLabel').textContent='وقت درس خواندنه';$('#sessionStatus').textContent='یک جلسه تازه را شروع کن.';toast('وقت درس خواندنه!')}renderTimer();$('#pauseFocus').textContent='شروع'},1000)}
$$('[data-min]').forEach(b=>b.onclick=()=>{$$('[data-min]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');mins=+b.dataset.min;rest=+b.dataset.rest;left=mins*60;phase='study'});$('#beginFocus').onclick=()=>{phase='study';left=mins*60;renderTimer();$('#sessionLabel').textContent='جلسه مطالعه';$('#sessionStatus').textContent='تمرکز کن؛ فقط همین لحظه.';$('#timerScreen').classList.add('show');toggleTimer()};$('#pauseFocus').onclick=toggleTimer;$('#backFocus').onclick=()=>{$('#timerScreen').classList.remove('show');if(run){clearInterval(run);run=null}};
function paint(){let img=profile.image||'',pick=profile.avatar||'',avatarFile=pick?`assets/avatars-v4/avatar-${Number(pick.slice(1))-1}.png`:'',src=img||avatarFile;[['#profilePhoto'],['#avatar'],['#sideAvatar']].forEach(([id])=>{let x=$(id);x.style.backgroundImage='';x.innerHTML=src?`<img class="avatar-image" src="${src}" alt="آواتار پروفایل">`:'✦'});let unlocked=unlockReady();$$('.locked-avatar').forEach(x=>{x.disabled=!unlocked;x.classList.toggle('is-unlocked',unlocked)});$('#profileName').textContent=profile.name||'پروفایل دانش‌آموز';$('#sideName').textContent=profile.name||'پروفایل من';$('#sideGrade').textContent=profile.grade||'اطلاعاتت را کامل کن';['name','grade','school','year'].forEach(k=>$('#'+k).value=profile[k]||'');setProfileLocked(profile.locked)}function setProfileLocked(locked){$('#profileForm').querySelectorAll('input:not(#upload),.student-avatar').forEach(x=>x.disabled=locked||x.classList.contains('locked-avatar')&&!unlockReady());$('#upload').disabled=false;$('#saveProfile').hidden=locked;$('#editProfile').hidden=!locked;$('#profileMessage').textContent=locked?'اطلاعات با موفقیت ثبت شد ✓':''}function persistProfile(){localStorage.setItem('lerno-open-profile',JSON.stringify(profile));paint()}
$('#profileForm').onsubmit=e=>{e.preventDefault();['name','grade','school','year'].forEach(k=>profile[k]=$('#'+k).value.trim());profile.locked=true;persistProfile();toast('اطلاعات با موفقیت ثبت شد ✓')};$('#editProfile').onclick=()=>{profile.locked=false;persistProfile();toast('حالا می‌توانی اطلاعاتت را تغییر بدهی.')};$('#upload').onchange=e=>{let f=e.target.files[0];if(f){let r=new FileReader();r.onload=()=>{profile.image=r.result;profile.avatar='';persistProfile()};r.readAsDataURL(f)}};$$('[data-avatar]').forEach(b=>b.onclick=()=>{profile.avatar=b.dataset.avatar;profile.image='';persistProfile()});paint();

function saveTodos(){localStorage.setItem('lerno-todos',JSON.stringify(todos));drawTodos()}
function todoRow(item){let el=document.createElement('div');el.className='task '+(item.done?'done':'')+(item.priority==='important'?' important':'');el.innerHTML='<button class="check">'+(item.done?'✓':'')+'</button><b></b><small></small><button class="remove">×</button>';el.querySelector('b').textContent=item.title;el.querySelector('small').textContent=item.priority==='important'?'مهم':'';el.querySelector('.check').onclick=()=>{item.done=!item.done;saveTodos()};el.querySelector('.remove').onclick=()=>{todos=todos.filter(x=>x.id!==item.id);saveTodos()};return el}
function drawTodos(){let open=todos.filter(x=>!x.done),done=todos.filter(x=>x.done);$('#todoOpenCount').textContent=fa(open.length);$('#todoDoneCount').textContent=fa(done.length);[['#todoOpen',open,'فعلاً کاری برای انجام نداری.'],['#todoDone',done,'هنوز کاری را تیک نزده‌ای.']].forEach(([id,list,empty])=>{let box=$(id);box.innerHTML='';list.length?list.forEach(x=>box.append(todoRow(x))):box.innerHTML='<div class="empty">'+empty+'</div>'})}
$('#todoForm').onsubmit=e=>{e.preventDefault();let title=$('#todoInput').value.trim();if(!title)return;todos.unshift({id:Date.now(),title,done:false,priority:$('#todoPriority').value});$('#todoInput').value='';saveTodos()};drawTodos();

const weekDays=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه'];
function schoolDayIndex(date=new Date()){return (date.getDay()+1)%7}
function saveSchedule(){localStorage.setItem('lerno-weekly-schedule',JSON.stringify(schedule));drawSchedule()}
function drawSchedule(){let today=schoolDayIndex();let todayItems=schedule.filter(x=>x.day===today).sort((a,b)=>a.time.localeCompare(b.time));$('#todaySchedule').innerHTML='<small>برنامه امروز</small>'+(todayItems.length?'<b>'+todayItems.map(x=>x.time+' · '+x.subject).join('، ')+'</b>':'<b>برای امروز هنوز کلاسی ثبت نکرده‌ای.</b><span>از فرم بالا برنامه‌ات را اضافه کن.</span>');let box=$('#weeklySchedule');box.innerHTML='';weekDays.forEach((name,day)=>{let card=document.createElement('article');card.className='schedule-day '+(day===today?'today':'');let items=schedule.filter(x=>x.day===day).sort((a,b)=>a.time.localeCompare(b.time));card.innerHTML='<h2>'+name+(day===today?'<small>امروز</small>':'')+'</h2>';if(!items.length){card.innerHTML+='<p class="schedule-empty">هنوز درسی ثبت نشده.</p>'}else{items.forEach(item=>{let row=document.createElement('div');row.className='schedule-item';row.innerHTML='<time></time><div><b></b><span></span></div><button type="button" aria-label="حذف از برنامه">×</button>';row.querySelector('time').textContent=item.time;row.querySelector('b').textContent=item.subject;row.querySelector('span').textContent=item.details||'کلاس یا مطالعه';row.querySelector('button').onclick=()=>{schedule=schedule.filter(x=>x.id!==item.id);saveSchedule()};card.append(row)})}box.append(card)})}
$('#scheduleForm').onsubmit=e=>{e.preventDefault();let subject=$('#scheduleSubject').value.trim(),time=$('#scheduleTime').value;if(!subject||!time)return;schedule.push({id:Date.now(),day:Number($('#scheduleDay').value),time,subject,details:$('#scheduleDetails').value.trim()});$('#scheduleSubject').value='';$('#scheduleDetails').value='';saveSchedule();toast('به برنامه هفتگی اضافه شد ✓')};drawSchedule();

function saveGrades(){localStorage.setItem('lerno-grades',JSON.stringify(grades));drawGrades()}
function drawGrades(){let totalWeight=grades.reduce((sum,x)=>sum+x.weight,0),gpa=totalWeight?grades.reduce((sum,x)=>sum+x.score*x.weight,0)/totalWeight:null,best=grades.slice().sort((a,b)=>b.score-a.score)[0];$('#gpaValue').textContent=gpa===null?'—':fa(gpa.toFixed(2));$('#bestSubject').textContent=best?best.subject:'—';$('#bestScore').textContent=best?fa(best.score)+' از ۲۰':'هنوز نمره‌ای نداری';let list=$('#gradeList');list.innerHTML='';if(!grades.length){list.innerHTML='<p class="schedule-empty">اولین نمره‌ات را ثبت کن.</p>';return}grades.slice().sort((a,b)=>b.id-a.id).forEach(item=>{let row=document.createElement('div');row.className='grade-row';row.innerHTML='<b></b><span></span><small></small><button type="button" aria-label="حذف نمره">×</button>';row.querySelector('b').textContent=item.subject;row.querySelector('span').textContent=fa(item.score)+' / ۲۰';row.querySelector('small').textContent='ضریب '+fa(item.weight);row.querySelector('button').onclick=()=>{grades=grades.filter(x=>x.id!==item.id);saveGrades()};list.append(row)})}
$('#gradeForm').onsubmit=e=>{e.preventDefault();let subject=$('#gradeSubject').value.trim(),score=Number($('#gradeScore').value),weight=Number($('#gradeWeight').value);if(!subject||score<0||score>20||weight<1)return;grades.push({id:Date.now(),subject,score,weight});$('#gradeSubject').value='';$('#gradeScore').value='';$('#gradeWeight').value='1';saveGrades();toast('نمره ثبت شد ✓')};drawGrades();

let installPrompt=null;
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
function updateInstallButton(){let b=$('#installApp');if(!b)return;b.hidden=isStandalone();b.textContent=isIOS()?'نصب LERNO روی آیفون':'نصب LERNO روی دستگاه'}
function installHelp(){let wrap=document.createElement('div');wrap.className='install-guide';if(isIOS()){wrap.innerHTML='<div class="install-device"> آیفون و آیپد</div><ol><li>پایین مرورگر روی دکمه <b>اشتراک‌گذاری</b> <span class="share-symbol">⇧</span> بزن.</li><li>گزینه <b>Add to Home Screen</b> یا <b>افزودن به صفحه اصلی</b> را انتخاب کن.</li><li>بالای صفحه روی <b>Add / افزودن</b> بزن.</li></ol><p>بعد از آن، آیکون LERNO مثل یک برنامه روی صفحه اصلی قرار می‌گیرد.</p>'}else{wrap.innerHTML='<div class="install-device">اندروید</div><ol><li>منوی سه‌نقطه مرورگر را باز کن.</li><li><b>Install app</b> یا <b>افزودن به صفحه اصلی</b> را بزن.</li><li>نصب را تأیید کن.</li></ol>'}siteDialog('نصب LERNO',wrap)}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;updateInstallButton()});
window.addEventListener('appinstalled',()=>{installPrompt=null;updateInstallButton();toast('LERNO نصب شد ✓')});
$('#installApp').onclick=async()=>{if(isStandalone()){updateInstallButton();return}if(installPrompt){installPrompt.prompt();let choice=await installPrompt.userChoice;if(choice.outcome==='accepted')installPrompt=null;updateInstallButton();return}installHelp()};
function notificationText(){let p=typeof Notification==='undefined'?'unsupported':Notification.permission;$('#notificationStatus').textContent=p==='granted'?'اعلان مهلت‌ها فعال است ✓':p==='denied'?'اعلان‌ها در تنظیمات مرورگر بسته شده‌اند.':'اعلان‌ها هنوز فعال نشده‌اند.'}$('#enableNotifications').onclick=async()=>{if(typeof Notification==='undefined'){toast('این مرورگر از اعلان پشتیبانی نمی‌کند.');return}let p=await Notification.requestPermission();notificationText();if(p==='granted'){toast('اعلان مهلت‌ها فعال شد ✓');checkDeadlines()}};$('#syncInfo').onclick=()=>toast('اتصال آنلاین هنوز تنظیم نشده است.');notificationText();setTimeout(checkDeadlines,1200);
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

function consecutiveDays(){let days=JSON.parse(localStorage.getItem('lerno-study-days')||'[]').sort().reverse(),count=0,expect=new Date();expect.setHours(0,0,0,0);for(let day of days){let d=new Date(day+'T00:00:00');if(d.getTime()===expect.getTime()){count++;expect.setDate(expect.getDate()-1)}else if(d.getTime()<expect.getTime())break}return count}
function drawProgress(){let done=tasks.filter(x=>x.done).length,pct=tasks.length?Math.round(done/tasks.length*100):0,total=Number(localStorage.getItem('lerno-study-minutes')||0),streak=consecutiveDays();$('#progressTasks').textContent=fa(pct)+'٪';$('#progressTasksBar').style.width=pct+'%';$('#progressTasksText').textContent=tasks.length?`${fa(done)} از ${fa(tasks.length)} تکلیف انجام شده`:'هنوز تکلیفی ثبت نشده';$('#progressMinutes').textContent=fa(total);$('#progressMinutesBar').style.width=Math.min(100,total/300*100)+'%';$('#progressStreak').textContent=fa(streak)+' روز';$('#progressStreakBar').style.width=Math.min(100,streak/5*100)+'%';$('#progressMessage').textContent=streak>=5?'عالیه! استمرار تو آواتارهای ویژه را باز کرده است.':pct>=70?'تکالیف را خیلی خوب پیش برده‌ای. همین ریتم را نگه دار.':'از یک کار کوچک شروع کن.'}drawProgress();

let calc='';function calcRender(){let shown=calc||'0';$('#calcDisplay').textContent=shown.replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])}function calculate(){try{if(!calc||!/^[0-9+\-*/.() ]+$/.test(calc))return;let result=Function('return ('+calc+')')();calc=Number.isFinite(result)?String(Math.round((result+Number.EPSILON)*1000000)/1000000):''}catch(e){calc=''}calcRender()}$$('[data-calc]').forEach(b=>b.onclick=()=>{let key=b.dataset.calc;if(key==='clear')calc='';else if(key==='back')calc=calc.slice(0,-1);else if(key==='equals')calculate();else calc+=key;calcRender()});document.addEventListener('keydown',e=>{if(!$('#calculator').classList.contains('active'))return;if(/^[0-9+\-*/.]$/.test(e.key)){calc+=e.key;calcRender()}else if(e.key==='Enter'){e.preventDefault();calculate()}else if(e.key==='Backspace'){calc=calc.slice(0,-1);calcRender()}});calcRender();

/* امکانات مدرسه */
const holidays1405=new Set(['1-1','1-2','1-3','1-4','1-12','1-13','2-14','3-14','3-15','4-14','4-15','5-13','5-21','5-22','5-30','6-11','6-19','6-20','6-28','7-13','8-3','8-13','9-3','9-13','9-14','9-15','10-27','11-15','11-22','12-19','12-29','12-30']);
function isHoliday(p,d){const h=new Set(['1-1','1-2','1-3','1-4','1-12','1-13','2-14','3-14','3-15','4-14','4-15','5-13','5-21','5-22','5-30','6-11','6-19','6-20','6-28','7-13','8-3','8-13','9-3','9-13','9-14','9-15','10-27','11-15','11-22','12-19','12-29','12-30']);return d.getDay()===5||(p.year===1405&&h.has(p.month+'-'+p.day))}
function subjects(){let g=String(profile.grade||'');let base=['فارسی','ریاضی','علوم','مطالعات اجتماعی','هدیه‌های آسمانی','قرآن','نگارش','کار و فناوری','هنر','ورزش','انگلیسی'];if(/دهم|یازدهم|دوازدهم/.test(g))base=['فارسی','عربی','دین و زندگی','زبان انگلیسی','ریاضی','فیزیک','شیمی','زیست‌شناسی','تاریخ','جغرافیا','جامعه‌شناسی','هنر','ورزش'];return base}
function addSubjectSuggestions(){let list=document.createElement('datalist');list.id='schoolSubjects';subjects().forEach(s=>list.insertAdjacentHTML('beforeend','<option value="'+s+'">'));document.body.append(list);['#scheduleSubject','#gradeSubject','#taskInput'].forEach(x=>{let e=$(x);if(e)e.setAttribute('list','schoolSubjects')});$('#scheduleSubject').placeholder='درس را انتخاب یا خودت بنویس';$('#gradeSubject').placeholder='درس را انتخاب یا خودت بنویس'}
function renderEntryList(){let old=$('#calendarEntryList');if(old)old.remove();let list=document.createElement('div');list.id='calendarEntryList';list.className='calendar-entry-list';entries.filter(x=>x.date===chosenDate).forEach(e=>{let r=document.createElement('div');r.innerHTML='<b></b><button>ویرایش</button><button>حذف</button>';r.querySelector('b').textContent=e.text;r.querySelectorAll('button')[0].onclick=()=>{let v=prompt('متن جدید برنامه را بنویس',e.text);if(v&&v.trim()){e.text=v.trim();localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));drawCalendar();renderEntryList()}};r.querySelectorAll('button')[1].onclick=()=>{if(confirm('آیا از حذف این مورد مطمئنید؟')){entries=entries.filter(x=>x.id!==e.id);localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));drawCalendar();renderEntryList()}};list.append(r)});$('#entryModal .modal-box').append(list)}
function drawCalendar(){let first=j2g(cursor.year,cursor.month,1),start=new Date(first);start.setDate(first.getDate()-((first.getDay()+1)%7));$('#month').textContent=jalaliMonths[cursor.month-1]+' '+fa(cursor.year);let box=$('#days');box.innerHTML='';for(let i=0;i<42;i++){let d=new Date(start);d.setDate(start.getDate()+i);let p=jalaliParts(d),key=ymd(d),own=p.year===cursor.year&&p.month===cursor.month,item=entries.filter(x=>x.date===key),linked=tasks.filter(t=>t.date===key),holiday=isHoliday(p,d);let b=document.createElement('button');b.className=(ymd(d)===ymd(new Date())?'today ':'')+(own?'':'outside')+(holiday?' holiday':'');b.innerHTML='<b>'+fa(p.day)+'</b><span class="entry-preview">'+(item[0]?.text||linked[0]?.title||'')+'</span>'+(holiday?'<i class="holiday-dot"></i>':'')+(item.length||linked.length?'<i class="event-dot '+(item[0]?.type||'task')+'"></i>':'');b.onclick=()=>openEntry(key,d);box.append(b)}}
function openEntry(key,d){chosenDate=key;$('#selectedDate').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);$('#entryModal').classList.add('show');renderEntryList();setTimeout(()=>$('#entryText').focus(),50)}
function drawSchedule(){let title=$('#schedule .page-title h1');title.textContent='برنامه هفتگی مخصوص '+(profile.school||profile.name||'تو');let box=$('#weeklySchedule');box.className='weekly-schedule school-table';box.innerHTML='<div class="cell head">روز / زنگ</div>'+[1,2,3,4,5,6].map(n=>'<div class="cell head">زنگ '+fa(n)+'</div>').join('');weekDays.forEach((day,di)=>{box.insertAdjacentHTML('beforeend','<div class="cell day">'+day+'</div>');for(let p=1;p<=6;p++){let it=schedule.find(x=>x.day===di&&x.period===p);let cell=document.createElement('button');cell.className='cell lesson';cell.textContent=it?it.subject:'+';cell.onclick=()=>{let v=prompt(day+'، زنگ '+p+' — درس را انتخاب یا بنویس',it?.subject||'');if(v!==null){schedule=schedule.filter(x=>!(x.day===di&&x.period===p));if(v.trim())schedule.push({id:Date.now(),day:di,period:p,subject:v.trim(),time:'',details:''});saveSchedule()}};box.append(cell)}})}
$('#scheduleForm').onsubmit=e=>{e.preventDefault();let v=$('#scheduleSubject').value.trim(),day=Number($('#scheduleDay').value),period=Math.max(1,Math.min(6,Math.round((Number($('#scheduleTime').value.split(':')[0]||8)-7)||1)));if(v){schedule=schedule.filter(x=>!(x.day===day&&x.period===period));schedule.push({id:Date.now(),day,period,subject:v,time:'',details:''});$('#scheduleSubject').value='';saveSchedule()}};
addSubjectSuggestions();drawSchedule();drawCalendar();

/* بازطراحی مدرسه‌محور */
cursor={year:1405,month:6};
const gradeOptions=['اول ابتدایی','دوم ابتدایی','سوم ابتدایی','چهارم ابتدایی','پنجم ابتدایی','ششم ابتدایی','هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم'];
function gradeBooks(){let g=String(profile.grade||'');let p=['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','قرآن','هدیه‌های آسمانی','انگلیسی','عربی','کار و فناوری','تفکر و پژوهش','هنر'];if(/اول|دوم|سوم/.test(g))p=['فارسی','نگارش','ریاضی','علوم','هدیه‌های آسمانی','قرآن'];if(/دهم|یازدهم|دوازدهم/.test(g))p=['فارسی','نگارش','عربی','دین و زندگی','زبان انگلیسی','ریاضی','فیزیک','شیمی','زیست‌شناسی','تاریخ','جغرافیا','جامعه‌شناسی','منطق'];return p}
function refreshBooks(){let l=$('#schoolSubjects');if(!l)return;l.innerHTML='';gradeBooks().forEach(x=>l.insertAdjacentHTML('beforeend','<option value="'+x+'">'));}
function siteDialog(title,body,yes){let m=document.createElement('section');m.className='modal show site-dialog';m.innerHTML='<div class="modal-box"><button class="close-modal">×</button><h2></h2><div class="dialog-body"></div></div>';m.querySelector('h2').textContent=title;m.querySelector('.dialog-body').append(body);m.querySelector('.close-modal').onclick=()=>m.remove();document.body.append(m);if(yes)m.querySelector('[data-yes]').onclick=()=>{yes();m.remove()};return m}
function editEntry(e){let wrap=document.createElement('div');wrap.innerHTML='<textarea></textarea><button class="blue" data-yes>ذخیره تغییرات</button>';wrap.querySelector('textarea').value=e.text;siteDialog('ویرایش برنامه',wrap,()=>{let v=wrap.querySelector('textarea').value.trim();if(v){e.text=v;localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));drawCalendar();renderEntryList()}})}
function deleteEntry(e){let wrap=document.createElement('div');wrap.innerHTML='<p>آیا از حذف این مورد مطمئنید؟</p><button class="blue" data-yes>بله، حذف شود</button>';siteDialog('حذف برنامه',wrap,()=>{entries=entries.filter(x=>x.id!==e.id);localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));drawCalendar();renderEntryList()})}
function renderEntryList(){let old=$('#calendarEntryList');if(old)old.remove();let list=document.createElement('div');list.id='calendarEntryList';list.className='calendar-entry-list';entries.filter(x=>x.date===chosenDate).forEach(e=>{let r=document.createElement('div');r.innerHTML='<b></b><button>ویرایش</button><button>حذف</button>';r.querySelector('b').textContent=e.text;r.querySelectorAll('button')[0].onclick=()=>editEntry(e);r.querySelectorAll('button')[1].onclick=()=>deleteEntry(e);list.append(r)});$('#entryModal .modal-box').append(list)}
function schoolCell(day,period,item){let b=document.createElement('button');b.className='cell lesson';b.textContent=item?.subject||'＋';b.onclick=()=>{let w=document.createElement('div');w.innerHTML='<label>درس یا کتاب<select id="cellSubject"></select></label><input id="customSubject" placeholder="یا نام دلخواه را بنویس"><button class="blue" data-yes>ثبت</button>';let s=w.querySelector('select');s.innerHTML='<option value="">انتخاب درس</option>'+gradeBooks().map(x=>'<option>'+x+'</option>').join('');if(item)s.value=item.subject;siteDialog(weekDays[day]+' — زنگ '+fa(period),w,()=>{let v=w.querySelector('#customSubject').value.trim()||s.value;schedule=schedule.filter(x=>!(x.day===day&&x.period===period));if(v)schedule.push({id:Date.now(),day,period,subject:v});saveSchedule()})};return b}
function drawSchedule(){let title=$('#schedule .page-title h1');title.textContent='برنامه مدرسه '+(profile.school||profile.name||'تو');$('#schedule .page-title p').textContent='روی هر زنگ بزن و درس همان زنگ را ثبت کن تا بدانی چه کتاب‌هایی باید ببری.';$('.schedule-editor').hidden=true;let box=$('#weeklySchedule');box.className='weekly-schedule school-table';box.innerHTML='<div class="cell head">روز / زنگ</div>'+[1,2,3,4,5,6].map(n=>'<div class="cell head">زنگ '+fa(n)+'</div>').join('');weekDays.forEach((d,day)=>{box.insertAdjacentHTML('beforeend','<div class="cell day">'+d+'</div>');for(let p=1;p<=6;p++)box.append(schoolCell(day,p,schedule.find(x=>x.day===day&&x.period===p)))})}
function profileControls(){let g=$('#grade'),y=$('#year');if(g.tagName==='INPUT'){let s=document.createElement('select');s.id='grade';s.innerHTML=gradeOptions.map(x=>'<option>'+x+'</option>').join('');s.value=profile.grade||gradeOptions[0];g.replaceWith(s)}if(y.tagName==='INPUT'){let s=document.createElement('select');s.id='year';s.innerHTML='<option>۱۴۰۵/۱۴۰۶</option><option>۱۴۰۶/۱۴۰۷</option>';s.value=profile.year||'۱۴۰۵/۱۴۰۶';y.replaceWith(s)}$('#avatar').onclick=()=>setPage('profile');let account=$('#account'),card=account?.querySelector('.account-card');if(card){card.querySelector('h2')?.remove();card.querySelector('#syncInfo')?.remove();card.querySelector('.account-divider')?.remove();$('#profile').append(card)}document.querySelector('[data-page="account"]')?.remove();account?.remove();updateInstallButton()}
profileControls();refreshBooks();drawSchedule();drawCalendar();
const requestedPage=new URLSearchParams(location.search).get('page');if(requestedPage&&document.getElementById(requestedPage))setPage(requestedPage);

/* اصلاح تقویم موبایل، بازهٔ مدرسه و پروفایل نسخه ۱۴ */
function calendarMin(){return {year:1405,month:6}}
function calendarMax(){return {year:1407,month:12}}
function compareJalaliMonth(a,b){return a.year===b.year?a.month-b.month:a.year-b.year}
function clampCalendarCursor(value){let next={year:Number(value.year),month:Number(value.month)};if(compareJalaliMonth(next,calendarMin())<0)return calendarMin();if(compareJalaliMonth(next,calendarMax())>0)return calendarMax();return next}
function shiftJalaliMonth(amount){let next={...cursor,month:cursor.month+amount};if(next.month<1){next.month=12;next.year--}if(next.month>12){next.month=1;next.year++}cursor=clampCalendarCursor(next)}
function normalizedEntryType(type){return type==='program'?'project':type}
function entryTypeLabel(type){return type==='exam'?'امتحان':type==='project'?'پروژه':'تکلیف'}
function calendarItemsForDate(key){
  let ownEntries=entries.filter(x=>x.date===key).map(x=>({source:'entry',record:x,id:x.id,text:x.text,type:normalizedEntryType(x.type)}));
  let linkedTasks=tasks.filter(x=>x.date===key&&!ownEntries.some(e=>x.calendarEntryId===e.id||(e.text===x.title&&e.type===(x.kind||'task')))).map(x=>({source:'task',record:x,id:x.id,text:x.title,type:x.kind==='project'?'project':'task'}));
  return ownEntries.concat(linkedTasks);
}
function drawCalendar(){
  cursor=clampCalendarCursor(cursor);
  let first=j2g(cursor.year,cursor.month,1),start=new Date(first);start.setDate(first.getDate()-((first.getDay()+1)%7));
  $('#month').textContent=jalaliMonths[cursor.month-1]+' '+fa(cursor.year);
  $('#prevMonth').disabled=compareJalaliMonth(cursor,calendarMin())===0;
  $('#nextMonth').disabled=compareJalaliMonth(cursor,calendarMax())===0;
  let box=$('#days');box.innerHTML='';
  for(let i=0;i<42;i++){
    let d=new Date(start);d.setDate(start.getDate()+i);let p=jalaliParts(d),key=ymd(d),own=p.year===cursor.year&&p.month===cursor.month,b=document.createElement('button');
    if(!own){b.className='outside blank-day';b.disabled=true;b.setAttribute('aria-hidden','true');box.append(b);continue}
    let items=calendarItemsForDate(key),holiday=isHoliday(p,d);b.className=(key===ymd(new Date())?'today ':'')+(holiday?'holiday ':'')+(items.length?'has-events':'');
    let number=document.createElement('b');number.textContent=fa(p.day);b.append(number);
    if(items.length){let events=document.createElement('span');events.className='day-events';items.slice(0,2).forEach(item=>{let chip=document.createElement('em');chip.className='day-event '+item.type;chip.textContent=item.text;events.append(chip)});if(items.length>2){let more=document.createElement('small');more.textContent='+'+fa(items.length-2);events.append(more)}b.append(events)}
    if(holiday){let dot=document.createElement('i');dot.className='holiday-dot';b.append(dot)}
    b.setAttribute('aria-label',fa(p.day)+' '+jalaliMonths[p.month-1]+(items.length?'، '+items.map(x=>entryTypeLabel(x.type)+' '+x.text).join('، '):''));b.onclick=()=>openEntry(key,d);box.append(b)
  }
}
function openEntry(key,d){chosenDate=key;$('#selectedDate').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d);$('#entryModal').classList.add('show');$('#entryModal').setAttribute('aria-hidden','false');renderEntryList();setTimeout(()=>$('#entryText').focus(),50)}
function closeEntry(){$('#entryModal').classList.remove('show');$('#entryModal').setAttribute('aria-hidden','true');$('#entryText').value=''}
function saveCalendarEntries(){localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));drawCalendar()}
function editCalendarItem(item){let wrap=document.createElement('div');wrap.innerHTML='<textarea></textarea><button class="blue" data-yes>ذخیره تغییرات</button>';wrap.querySelector('textarea').value=item.text;siteDialog('ویرایش '+entryTypeLabel(item.type),wrap,()=>{let value=wrap.querySelector('textarea').value.trim();if(!value)return;if(item.source==='entry'){item.record.text=value;let linked=tasks.find(x=>x.calendarEntryId===item.id);if(linked)linked.title=value;saveCalendarEntries();saveTasks()}else{item.record.title=value;saveTasks()}renderEntryList()})}
function deleteCalendarItem(item){let wrap=document.createElement('div');wrap.innerHTML='<p>آیا از حذف این مورد مطمئنی؟</p><button class="blue" data-yes>بله، حذف شود</button>';siteDialog('حذف '+entryTypeLabel(item.type),wrap,()=>{if(item.source==='entry'){entries=entries.filter(x=>x.id!==item.id);tasks=tasks.filter(x=>x.calendarEntryId!==item.id);saveCalendarEntries();saveTasks()}else{tasks=tasks.filter(x=>x.id!==item.id);saveTasks()}renderEntryList()})}
function renderEntryList(){let old=$('#calendarEntryList');if(old)old.remove();let list=document.createElement('div');list.id='calendarEntryList';list.className='calendar-entry-list';let items=calendarItemsForDate(chosenDate);if(!items.length){let empty=document.createElement('p');empty.className='calendar-entry-empty';empty.textContent='برای این روز هنوز چیزی ثبت نشده.';list.append(empty)}items.forEach(item=>{let row=document.createElement('div');row.className='calendar-entry-row '+item.type;let tag=document.createElement('span');tag.textContent=entryTypeLabel(item.type);let title=document.createElement('b');title.textContent=item.text;let edit=document.createElement('button');edit.type='button';edit.textContent='ویرایش';edit.onclick=()=>editCalendarItem(item);let remove=document.createElement('button');remove.type='button';remove.textContent='حذف';remove.onclick=()=>deleteCalendarItem(item);row.append(tag,title,edit,remove);list.append(row)});$('#entryModal .modal-box').append(list)}
$('#entryForm').onsubmit=e=>{e.preventDefault();let text=$('#entryText').value.trim(),type=$('#entryType').value;if(!text)return;let id=Date.now();entries.push({id,date:chosenDate,text,type});if(type==='task'||type==='project')tasks.push({id:id+1,title:text,done:false,date:chosenDate,kind:type,calendarEntryId:id});saveCalendarEntries();saveTasks();closeEntry();toast(entryTypeLabel(type)+' در تقویم ثبت شد ✓')};
let changedEntryType=false;entries.forEach(item=>{if(item.type==='program'){item.type='project';changedEntryType=true}});if(changedEntryType)saveCalendarEntries();

function setupRestrictedDeadlinePicker(){let year=$('#jalaliYear'),day=$('#jalaliDay'),month=$('#jalaliMonth');year.innerHTML='';for(let y=1405;y<=1407;y++)year.add(new Option(fa(y),y));let now=jalaliParts(new Date()),initial=clampCalendarCursor(now);year.value=initial.year;month.value=initial.month;day.value=Math.min(now.day,jalaliMonthLength(initial.year,initial.month));function refresh(){let y=Number(year.value);[...month.options].forEach(o=>o.disabled=y===1405&&Number(o.value)<6);if(y===1405&&Number(month.value)<6)month.value=6;let max=jalaliMonthLength(y,Number(month.value));[...day.options].forEach(o=>o.disabled=Number(o.value)>max);if(Number(day.value)>max)day.value=max}year.onchange=refresh;month.onchange=refresh;refresh()}
function chosenDeadline(){let mode=$('#taskWhen').value;if(mode==='today'||mode==='tomorrow'){let d=new Date();if(mode==='tomorrow')d.setDate(d.getDate()+1);let p=jalaliParts(d),clamped=clampCalendarCursor(p);if(p.year!==clamped.year||p.month!==clamped.month)d=j2g(clamped.year,clamped.month,1);return ymd(d)}return ymd(j2g(Number($('#jalaliYear').value),Number($('#jalaliMonth').value),Number($('#jalaliDay').value)))}

function setProfileLocked(locked){let form=$('#profileForm'),view=$('#profileView');form.hidden=locked;view.hidden=!locked;$('#profileCaption').textContent=locked?'برای تغییر پروفایل، دکمهٔ تغییر اطلاعات را بزن.':'یک آواتار انتخاب کن یا عکس دلخواهت را برش بده و بگذار.';if(locked){$('#viewName').textContent=profile.name||'—';$('#viewGrade').textContent=profile.grade||'—';$('#viewSchool').textContent=profile.school||'—';$('#viewYear').textContent=profile.year||'—'}}
function paint(){let pick=profile.avatar||'',avatarFile=pick?`assets/avatars-v4/avatar-${Number(pick.slice(1))-1}.png`:'',src=profile.image||avatarFile;['#profilePhoto','#avatar','#sideAvatar'].forEach(id=>{let x=$(id);x.innerHTML='';if(src){let img=document.createElement('img');img.className='avatar-image';img.src=src;img.alt='آواتار پروفایل';x.append(img)}else x.textContent='✦'});let unlocked=unlockReady();$$('.locked-avatar').forEach(x=>{x.disabled=!unlocked;x.classList.toggle('is-unlocked',unlocked)});$('#profileName').textContent=profile.name||'پروفایل دانش‌آموز';$('#sideName').textContent=profile.name||'پروفایل من';$('#sideGrade').textContent=profile.grade||'اطلاعاتت را کامل کن';['name','grade','school','year'].forEach(k=>{let field=$('#'+k);if(field)field.value=profile[k]||''});setProfileLocked(Boolean(profile.locked))}
$('#profileForm').onsubmit=e=>{e.preventDefault();['name','grade','school','year'].forEach(k=>profile[k]=$('#'+k).value.trim());if(!profile.name){toast('نام و نام خانوادگی را وارد کن.');return}profile.locked=true;persistProfile();drawSchedule();toast('اطلاعات پروفایل ثبت شد ✓')};
$('#editProfile').onclick=()=>{profile.locked=false;persistProfile();setTimeout(()=>$('#name').focus(),60)};

let cropState={source:null,naturalWidth:0,naturalHeight:0,baseScale:1,zoom:1,x:0,y:0,dragging:false,lastX:0,lastY:0};
function clampCrop(){let stage=$('#cropStage').getBoundingClientRect(),w=cropState.naturalWidth*cropState.baseScale*cropState.zoom,h=cropState.naturalHeight*cropState.baseScale*cropState.zoom;cropState.x=Math.min(0,Math.max(stage.width-w,cropState.x));cropState.y=Math.min(0,Math.max(stage.height-h,cropState.y))}
function renderCrop(){clampCrop();let img=$('#cropImage');img.style.width=(cropState.naturalWidth*cropState.baseScale*cropState.zoom)+'px';img.style.height=(cropState.naturalHeight*cropState.baseScale*cropState.zoom)+'px';img.style.transform=`translate(${cropState.x}px,${cropState.y}px)`}
function openCrop(source){let modal=$('#cropModal'),img=$('#cropImage');modal.classList.add('show');modal.setAttribute('aria-hidden','false');img.onload=()=>{let stage=$('#cropStage').getBoundingClientRect();cropState.source=source;cropState.naturalWidth=img.naturalWidth;cropState.naturalHeight=img.naturalHeight;cropState.baseScale=Math.max(stage.width/img.naturalWidth,stage.height/img.naturalHeight);cropState.zoom=1;cropState.x=(stage.width-img.naturalWidth*cropState.baseScale)/2;cropState.y=(stage.height-img.naturalHeight*cropState.baseScale)/2;$('#cropZoom').value=1;renderCrop()};img.src=source}
function closeCrop(){let modal=$('#cropModal');modal.classList.remove('show');modal.setAttribute('aria-hidden','true');$('#upload').value=''}
$('#upload').onchange=e=>{let file=e.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){toast('لطفاً یک فایل تصویری انتخاب کن.');return}let reader=new FileReader();reader.onload=()=>openCrop(reader.result);reader.readAsDataURL(file)};
$('#cropStage').onpointerdown=e=>{cropState.dragging=true;cropState.lastX=e.clientX;cropState.lastY=e.clientY;$('#cropStage').setPointerCapture(e.pointerId)};
$('#cropStage').onpointermove=e=>{if(!cropState.dragging)return;cropState.x+=e.clientX-cropState.lastX;cropState.y+=e.clientY-cropState.lastY;cropState.lastX=e.clientX;cropState.lastY=e.clientY;renderCrop()};
$('#cropStage').onpointerup=$('#cropStage').onpointercancel=()=>cropState.dragging=false;
$('#cropZoom').oninput=e=>{let stage=$('#cropStage').getBoundingClientRect(),oldW=cropState.naturalWidth*cropState.baseScale*cropState.zoom,oldH=cropState.naturalHeight*cropState.baseScale*cropState.zoom,newZoom=Number(e.target.value),newW=cropState.naturalWidth*cropState.baseScale*newZoom,newH=cropState.naturalHeight*cropState.baseScale*newZoom;cropState.x=stage.width/2-(stage.width/2-cropState.x)*(newW/oldW);cropState.y=stage.height/2-(stage.height/2-cropState.y)*(newH/oldH);cropState.zoom=newZoom;renderCrop()};
$('#applyCrop').onclick=()=>{let stage=$('#cropStage').getBoundingClientRect(),scale=cropState.baseScale*cropState.zoom,canvas=document.createElement('canvas');canvas.width=600;canvas.height=600;let context=canvas.getContext('2d'),source=new Image();source.onload=()=>{context.drawImage(source,-cropState.x/scale,-cropState.y/scale,stage.width/scale,stage.height/scale,0,0,600,600);profile.image=canvas.toDataURL('image/jpeg',.9);profile.avatar='';persistProfile();closeCrop();toast('عکس پروفایل آماده شد ✓')};source.src=cropState.source};
$('#closeCrop').onclick=$('#cancelCrop').onclick=closeCrop;

setupRestrictedDeadlinePicker();cursor=calendarMin();paint();drawCalendar();

/* نسخه ۱۶: ناوبری، درس‌های وابسته به پایه و پروفایل پیش‌نویس */
const LERNO_BOOKS_BY_GRADE={
  'اول ابتدایی':['آموزش قرآن','فارسی','نگارش فارسی','ریاضی','علوم تجربی','هنر','تربیت بدنی'],
  'دوم ابتدایی':['آموزش قرآن','هدیه‌های آسمان','فارسی','نگارش فارسی','ریاضی','علوم تجربی','هنر','تربیت بدنی'],
  'سوم ابتدایی':['آموزش قرآن','هدیه‌های آسمان','فارسی','نگارش فارسی','ریاضی','علوم تجربی','مطالعات اجتماعی','هنر','تربیت بدنی'],
  'چهارم ابتدایی':['آموزش قرآن','هدیه‌های آسمان','فارسی','نگارش فارسی','ریاضی','علوم تجربی','مطالعات اجتماعی','هنر','تربیت بدنی'],
  'پنجم ابتدایی':['آموزش قرآن','هدیه‌های آسمان','فارسی','نگارش فارسی','ریاضی','علوم تجربی','مطالعات اجتماعی','هنر','تربیت بدنی'],
  'ششم ابتدایی':['آموزش قرآن','هدیه‌های آسمان','فارسی','نگارش فارسی','ریاضی','علوم تجربی','مطالعات اجتماعی','تفکر و پژوهش','کار و فناوری','هنر','تربیت بدنی'],
  'هفتم':['آموزش قرآن','پیام‌های آسمان','فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','فرهنگ و هنر','عربی','انگلیسی ۱','کتاب کار انگلیسی ۱','کار و فناوری','تفکر و سبک زندگی','تربیت بدنی'],
  'هشتم':['آموزش قرآن','پیام‌های آسمان','فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','فرهنگ و هنر','عربی','انگلیسی ۲','کتاب کار انگلیسی ۲','کار و فناوری','تفکر و سبک زندگی','تربیت بدنی'],
  'نهم':['آموزش قرآن','پیام‌های آسمان','فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','فرهنگ و هنر','عربی','انگلیسی ۳','کتاب کار انگلیسی ۳','کار و فناوری','آمادگی دفاعی','تربیت بدنی']
};
const LERNO_HIGH_COMMON={
  'دهم':['فارسی ۱','نگارش ۱','دین و زندگی ۱','عربی، زبان قرآن ۱','زبان انگلیسی ۱','کتاب کار زبان انگلیسی ۱','جغرافیای ایران','آمادگی دفاعی','تفکر و سواد رسانه‌ای','کارگاه کارآفرینی و تولید','هنر','تربیت بدنی ۱'],
  'یازدهم':['فارسی ۲','نگارش ۲','دین و زندگی ۲','عربی، زبان قرآن ۲','زبان انگلیسی ۲','کتاب کار زبان انگلیسی ۲','انسان و محیط زیست','تاریخ معاصر ایران','تربیت بدنی ۲'],
  'دوازدهم':['فارسی ۳','نگارش ۳','دین و زندگی ۳','عربی، زبان قرآن ۳','زبان انگلیسی ۳','کتاب کار زبان انگلیسی ۳','سلامت و بهداشت','مدیریت خانواده و سبک زندگی','تربیت بدنی ۳']
};
const LERNO_HIGH_TRACKS={
  math:{
    'دهم':['ریاضی ۱','هندسه ۱','فیزیک ۱','شیمی ۱','آزمایشگاه علوم تجربی ۱'],
    'یازدهم':['حسابان ۱','هندسه ۲','آمار و احتمال','فیزیک ۲','شیمی ۲','آزمایشگاه علوم تجربی ۲'],
    'دوازدهم':['حسابان ۲','هندسه ۳','ریاضیات گسسته','فیزیک ۳','شیمی ۳','هویت اجتماعی']
  },
  experimental:{
    'دهم':['ریاضی ۱','فیزیک ۱','شیمی ۱','زیست‌شناسی ۱','آزمایشگاه علوم تجربی ۱'],
    'یازدهم':['ریاضی ۲','فیزیک ۲','شیمی ۲','زیست‌شناسی ۲','آزمایشگاه علوم تجربی ۲'],
    'دوازدهم':['ریاضی ۳','فیزیک ۳','شیمی ۳','زیست‌شناسی ۳','هویت اجتماعی']
  },
  humanities:{
    'دهم':['علوم و فنون ادبی ۱','ریاضی و آمار ۱','اقتصاد','منطق','تاریخ ۱','جامعه‌شناسی ۱'],
    'یازدهم':['علوم و فنون ادبی ۲','ریاضی و آمار ۲','تاریخ ۲','جغرافیا ۲','جامعه‌شناسی ۲','روان‌شناسی','فلسفه ۱'],
    'دوازدهم':['علوم و فنون ادبی ۳','ریاضی و آمار ۳','تاریخ ۳','جغرافیا ۳','جامعه‌شناسی ۳','فلسفه ۲','تحلیل فرهنگی']
  },
  islamic:{
    'دهم':['علوم و فنون ادبی ۱','ریاضی و آمار ۱','تاریخ اسلام ۱','اصول عقاید ۱','اخلاق اسلامی ۱','علوم و معارف قرآنی ۱'],
    'یازدهم':['علوم و فنون ادبی ۲','ریاضی و آمار ۲','تاریخ اسلام ۲','اصول عقاید ۲','اخلاق اسلامی ۲','علوم و معارف قرآنی ۲','فلسفه ۱'],
    'دوازدهم':['علوم و فنون ادبی ۳','ریاضی و آمار ۳','تاریخ اسلام ۳','اصول عقاید ۳','اخلاق اسلامی ۳','علوم و معارف قرآنی ۳','فلسفه ۲']
  }
};
const LERNO_TRACK_LABELS={math:'ریاضی فیزیک',experimental:'علوم تجربی',humanities:'ادبیات و علوم انسانی',islamic:'علوم و معارف اسلامی'};
function isHighSchoolGrade(value=profile.grade){return ['دهم','یازدهم','دوازدهم'].includes(String(value||''))}
gradeBooks=function(){
  let grade=String(profile.grade||'');
  if(LERNO_BOOKS_BY_GRADE[grade])return [...LERNO_BOOKS_BY_GRADE[grade]];
  if(isHighSchoolGrade(grade)){let track=profile.track||'experimental';return [...(LERNO_HIGH_COMMON[grade]||[]),...((LERNO_HIGH_TRACKS[track]||{})[grade]||[])];}
  return ['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','آموزش قرآن','هنر','تربیت بدنی'];
};

function ensureProfileFields(){
  profile.track=profile.track||'';
  let yearLabel=$('#year')?.closest('label'),form=$('#profileForm');
  if(form&&!$('#track')){let label=document.createElement('label');label.id='trackField';label.hidden=true;label.innerHTML='رشته تحصیلی<select id="track"><option value="">انتخاب رشته</option><option value="math">ریاضی فیزیک</option><option value="experimental">علوم تجربی</option><option value="humanities">ادبیات و علوم انسانی</option><option value="islamic">علوم و معارف اسلامی</option></select>';form.insertBefore(label,yearLabel||$('#saveProfile'))}
  if(!$('#viewTrack')){let row=document.createElement('div');row.id='viewTrackRow';row.hidden=true;row.innerHTML='<dt>رشته تحصیلی</dt><dd id="viewTrack">—</dd>';let gradeRow=$('#viewGrade')?.closest('div');gradeRow?.after(row)}
  if(!$('#taskSubject')){let select=document.createElement('select');select.id='taskSubject';select.setAttribute('aria-label','درس');$('#taskInput')?.before(select)}
}
function updateTrackField(){let show=isHighSchoolGrade($('#grade')?.value),field=$('#trackField');if(field)field.hidden=!show;if(!show&&$('#track'))$('#track').value=''}
function populateSubjectControls(){
  let books=gradeBooks(),list=$('#schoolSubjects');if(list){list.innerHTML='';books.forEach(book=>list.append(new Option('',book)))}
  let taskSubject=$('#taskSubject');if(taskSubject){let selected=taskSubject.value;taskSubject.innerHTML='<option value="">انتخاب درس</option>';books.forEach(book=>taskSubject.add(new Option(book,book)));if(books.includes(selected))taskSubject.value=selected}
  $('#scheduleSubject')?.setAttribute('placeholder','درس پایه‌ات را انتخاب کن');
  $('#gradeSubject')?.setAttribute('placeholder','درس پایه‌ات را انتخاب کن');
}

const LERNO_SUBTITLES={calendar:'برنامه‌هایت را اینجا ثبت کن.',schedule:'درس‌های هر روزت را تنظیم کن.',tasks:'تکلیف‌ها و مهلت انجامشان را ثبت کن.',todo:'کارهایت را بنویس و انجام‌شده‌ها را علامت بزن.',grades:'نمره هر درس را ثبت کن تا LERNO میانگین و بهترین درس‌هایت را نشان دهد.',focus:'یک بازه را انتخاب کن؛ بعد فقط ساعت را می‌بینی.', 'progress-page':'آمارها فقط برای دیدن مسیر خودت‌اند.',calculator:'برای محاسبه‌های مدرسه و کارهای روزانه.',profile:'اطلاعات تحصیلی و تصویر پروفایلت را مدیریت کن.'};
Object.entries(LERNO_SUBTITLES).forEach(([id,text])=>{let p=$('#'+id+' .page-title p');if(p)p.textContent=text});

let lernoPageTrail=[];
function lernoNavigate(id,remember=true){let current=$('.page.active')?.id||'home';if(remember&&current!==id)lernoPageTrail.push(current);setPage(id)}
$$('[data-page]').forEach(button=>button.onclick=()=>lernoNavigate(button.dataset.page));
$('#avatar').onclick=()=>lernoNavigate('profile');
$$('.page:not(#home) .page-title').forEach(title=>{if(title.querySelector('.page-back'))return;let button=document.createElement('button');button.type='button';button.className='page-back';button.setAttribute('aria-label','بازگشت به صفحه قبل');button.innerHTML='<span aria-hidden="true">←</span> بازگشت';button.onclick=()=>{let target=lernoPageTrail.pop()||'home';lernoNavigate(target,false)};title.prepend(button)});

ensureProfileFields();
if($('#grade'))$('#grade').onchange=()=>{updateTrackField();let selected=$('#grade').value;let draft={...profile,grade:selected,track:isHighSchoolGrade(selected)?$('#track').value:''};let original=profile;profile=draft;populateSubjectControls();profile=original};
if($('#track'))$('#track').onchange=()=>{let original=profile;profile={...profile,grade:$('#grade').value,track:$('#track').value};populateSubjectControls();profile=original};

const avatarGrid=$('.avatar-grid'),avatarInsertPoint=$('.avatar-grid .add-photo');
if(avatarGrid&&avatarInsertPoint&&!avatarGrid.querySelector('[data-avatar="a11"]')){
  for(let number=11;number<=18;number++){
    let button=document.createElement('button');button.type='button';button.className='student-avatar a'+number;button.dataset.avatar='a'+number;button.setAttribute('aria-label','آواتار مدرسه‌ای '+fa(number));button.style.backgroundImage=`url('assets/avatars-v4/avatar-${number-1}.png')`;avatarGrid.insertBefore(button,avatarInsertPoint);
  }
}
let editingProfile=!profile.locked,pendingProfileImage='',pendingProfileAvatar='';
function avatarFileFor(key){return key?`assets/avatars-v4/avatar-${Number(key.slice(1))-1}.png`:''}
function committedAvatarSource(){return profile.image||avatarFileFor(profile.avatar)}
function putAvatar(element,source){if(!element)return;element.innerHTML='';if(source){let image=document.createElement('img');image.className='avatar-image';image.src=source;image.alt='آواتار پروفایل';element.append(image)}else element.textContent='✦'}
function resetProfileDraft(){pendingProfileImage=profile.image||'';pendingProfileAvatar=profile.avatar||'';['name','grade','school','year'].forEach(key=>{let field=$('#'+key);if(field)field.value=profile[key]||''});if($('#track'))$('#track').value=profile.track||'';updateTrackField();putAvatar($('#profilePhoto'),pendingProfileImage||avatarFileFor(pendingProfileAvatar))}
function showDraftAvatar(){putAvatar($('#profilePhoto'),pendingProfileImage||avatarFileFor(pendingProfileAvatar));$$('.student-avatar').forEach(button=>button.classList.toggle('selected-avatar',!pendingProfileImage&&button.dataset.avatar===pendingProfileAvatar))}
setProfileLocked=function(locked){let form=$('#profileForm'),view=$('#profileView');form.hidden=locked;view.hidden=!locked;$('#profileCaption').textContent=locked?'برای تغییر پروفایل، دکمهٔ تغییر اطلاعات را بزن.':'عکس را انتخاب کن، جابه‌جا کن و بعد اطلاعات را ثبت کن.';if(locked){$('#viewName').textContent=profile.name||'—';$('#viewGrade').textContent=profile.grade||'—';$('#viewSchool').textContent=profile.school||'—';$('#viewYear').textContent=profile.year||'—';let row=$('#viewTrackRow');if(row)row.hidden=!isHighSchoolGrade();if($('#viewTrack'))$('#viewTrack').textContent=LERNO_TRACK_LABELS[profile.track]||'—'}};
paint=function(){
  let source=committedAvatarSource();putAvatar($('#avatar'),source);putAvatar($('#sideAvatar'),source);if(editingProfile)showDraftAvatar();else putAvatar($('#profilePhoto'),source);
  let unlocked=unlockReady();$$('.locked-avatar').forEach(button=>{button.disabled=!unlocked;button.classList.toggle('is-unlocked',unlocked)});
  $('#profileName').textContent=profile.name||'پروفایل دانش‌آموز';$('#sideName').textContent=profile.name||'پروفایل من';$('#sideGrade').textContent=profile.grade||'اطلاعاتت را کامل کن';setProfileLocked(!editingProfile)
};
$('#editProfile').onclick=()=>{editingProfile=true;resetProfileDraft();paint();setTimeout(()=>$('#name').focus(),60)};
$$('[data-avatar]').forEach(button=>button.onclick=()=>{if(button.disabled)return;openCrop(avatarFileFor(button.dataset.avatar))});
$('#upload').onchange=event=>{let file=event.target.files[0];if(!file)return;if(!file.type.startsWith('image/')){toast('لطفاً یک فایل تصویری انتخاب کن.');return}let reader=new FileReader();reader.onload=()=>openCrop(reader.result);reader.readAsDataURL(file)};
$('#applyCrop').onclick=()=>{let stage=$('#cropStage').getBoundingClientRect(),scale=cropState.baseScale*cropState.zoom,canvas=document.createElement('canvas');canvas.width=600;canvas.height=600;let context=canvas.getContext('2d'),source=new Image();source.onload=()=>{context.drawImage(source,-cropState.x/scale,-cropState.y/scale,stage.width/scale,stage.height/scale,0,0,600,600);pendingProfileImage=canvas.toDataURL('image/jpeg',.9);pendingProfileAvatar='';showDraftAvatar();closeCrop();toast('پیش‌نمایش عکس آماده شد؛ برای ثبت، دکمه پایین را بزن.')};source.src=cropState.source};
$('#profileForm').onsubmit=event=>{event.preventDefault();let name=$('#name').value.trim(),grade=$('#grade').value,track=isHighSchoolGrade(grade)?$('#track').value:'';if(!name)return toast('نام و نام خانوادگی را وارد کن.');if(!grade)return toast('پایه تحصیلی را انتخاب کن.');if(isHighSchoolGrade(grade)&&!track)return toast('رشته تحصیلی را انتخاب کن.');profile={...profile,name,grade,track,school:$('#school').value.trim(),year:$('#year').value,image:pendingProfileImage,avatar:pendingProfileAvatar,locked:true};editingProfile=false;localStorage.setItem('lerno-open-profile',JSON.stringify(profile));populateSubjectControls();drawSchedule();paint();toast('اطلاعات پروفایل ثبت شد ✓')};

drawSchedule=function(){let title=$('#schedule .page-title h1');title.textContent='برنامه هفتگی';$('#schedule .page-title p').textContent=LERNO_SUBTITLES.schedule;$('.schedule-editor').hidden=true;let box=$('#weeklySchedule');box.className='weekly-schedule school-table';box.innerHTML='<div class="cell head">روز / زنگ</div>'+[1,2,3,4,5,6].map(number=>'<div class="cell head">زنگ '+fa(number)+'</div>').join('');weekDays.forEach((dayName,day)=>{box.insertAdjacentHTML('beforeend','<div class="cell day">'+dayName+'</div>');for(let period=1;period<=6;period++)box.append(schoolCell(day,period,schedule.find(item=>item.day===day&&item.period===period)))})};
$('#taskForm').onsubmit=event=>{event.preventDefault();let text=$('#taskInput').value.trim(),subject=$('#taskSubject')?.value||'';if(!text)return;let title=subject?subject+' — '+text:text;tasks.push({id:Date.now(),title,subject,done:false,kind:$('#taskKind').value,date:chosenDeadline()});$('#taskInput').value='';saveTasks();toast('با مهلت در تقویم ثبت شد ✓')};

resetProfileDraft();populateSubjectControls();drawSchedule();paint();

/* نسخه ۱۷: شاخه و رشته کامل‌تر، ظاهر متناسب با پایه و اتصال کارها به تقویم */
const LERNO_V17_BRANCH_LABELS={theory:'نظری',technical:'فنی‌وحرفه‌ای',kardanesh:'کاردانش'};
const LERNO_V17_FIELDS={
  theory:{'رشته‌های نظری':[
    ['math','ریاضی فیزیک'],['experimental','علوم تجربی'],['humanities','ادبیات و علوم انسانی'],['islamic','علوم و معارف اسلامی']
  ]},
  technical:{
    'صنعت':[['technical-electronics','الکترونیک'],['technical-electrotechnics','الکتروتکنیک'],['technical-network','شبکه و نرم‌افزار رایانه'],['technical-auto','مکانیک خودرو'],['technical-machine-tools','ماشین ابزار'],['technical-metal','صنایع فلزی'],['technical-installations','تأسیسات مکانیکی'],['technical-building','ساختمان'],['technical-wood','صنایع چوب و مبلمان'],['technical-print','چاپ'],['technical-mechatronics','مکاترونیک'],['technical-metallurgy','متالورژی'],['technical-chemistry','صنایع شیمیایی'],['technical-ceramic','سرامیک'],['technical-mining','معدن'],['technical-textile','صنایع نساجی']],
    'خدمات':[['technical-accounting','حسابداری'],['technical-sport','تربیت بدنی'],['technical-transport','حمل‌ونقل'],['technical-navigation','ناوبری']],
    'کشاورزی':[['technical-farming','امور زراعی'],['technical-gardening','امور باغی'],['technical-livestock','امور دامی'],['technical-agriculture-machines','ماشین‌های کشاورزی'],['technical-food','صنایع غذایی'],['technical-fisheries','شیلات']],
    'هنر':[['technical-graphic','گرافیک'],['technical-photographic','فتوگرافیک'],['technical-painting','نقاشی'],['technical-interior','معماری داخلی'],['technical-architecture','نقشه‌کشی معماری'],['technical-handicraft','صنایع دستی'],['technical-fashion','طراحی و دوخت'],['technical-theater','نمایش'],['technical-cinema','سینما'],['technical-animation','پویانمایی'],['technical-iranian-music','نوازندگی ساز ایرانی'],['technical-world-music','نوازندگی ساز جهانی'],['technical-restoration','مرمت آثار فرهنگی']]
  },
  kardanesh:{
    'برق و رایانه':[['kd-building-electricity','برق ساختمان'],['kd-industrial-electricity','برق صنعتی'],['kd-electric-panels','تابلوسازی برق صنعتی'],['kd-home-appliances','تعمیر لوازم خانگی'],['kd-mobile','تعمیر تلفن همراه'],['kd-cctv','نصب دوربین‌های مداربسته'],['kd-network-hardware','شبکه و سخت‌افزار رایانه'],['kd-digital-content','تولید محتوای الکترونیکی'],['kd-web','طراحی صفحات وب'],['kd-database','برنامه‌نویسی پایگاه داده']],
    'مکانیک و صنعت':[['kd-car-repair','تعمیر خودرو'],['kd-motorcycle','مکانیک موتورسیکلت'],['kd-welding','جوشکاری'],['kd-turning','تراشکاری'],['kd-milling','فرزکاری'],['kd-cnc','ماشین‌کاری CNC'],['kd-gas-piping','لوله‌کشی گاز'],['kd-heating','تأسیسات حرارتی'],['kd-cabinet','کابینت‌سازی'],['kd-wood','صنایع چوب']],
    'خدمات':[['kd-financial-accounting','حسابداری مالی'],['kd-payroll','حسابداری حقوق و دستمزد'],['kd-office','امور اداری'],['kd-hotel','هتلداری'],['kd-tourism','راهنمای گردشگری'],['kd-cooking','آشپزی'],['kd-pastry','شیرینی‌پزی'],['kd-child-care','کودک‌یاری'],['kd-child-education','تربیت کودک'],['kd-rescue','امداد و نجات'],['kd-retail','خدمات فروشگاهی']],
    'کشاورزی':[['kd-livestock','پرورش دام'],['kd-poultry','پرورش طیور'],['kd-beekeeping','زنبورداری'],['kd-aquaculture','پرورش آبزیان'],['kd-herbs','گیاهان دارویی'],['kd-ornamental-plants','گل و گیاه زینتی'],['kd-seedling','تولید نهال'],['kd-agriculture-machines','مکانیزاسیون کشاورزی']],
    'هنر':[['kd-womens-tailoring','خیاطی لباس زنانه'],['kd-mens-tailoring','خیاطی لباس مردانه'],['kd-fashion','طراحی و دوخت'],['kd-computer-graphics','گرافیک رایانه‌ای'],['kd-digital-photography','عکاسی دیجیتال'],['kd-illustration','تصویرسازی'],['kd-animation','پویانمایی'],['kd-makeup','چهره‌سازی'],['kd-jewelry','طراحی طلا و جواهر'],['kd-handicraft','صنایع دستی'],['kd-pottery','سفالگری'],['kd-carpet','فرش'],['kd-music','موسیقی'],['kd-theater','نمایش'],['kd-cinema','سینما']]
  }
};
const LERNO_V17_FIELD_LABELS={};
Object.values(LERNO_V17_FIELDS).forEach(groups=>Object.values(groups).forEach(items=>items.forEach(([value,label])=>LERNO_V17_FIELD_LABELS[value]=label)));
const LERNO_V17_VOCATIONAL_COMMON={
  'دهم':['فارسی ۱','نگارش ۱','دین و زندگی ۱','عربی، زبان قرآن ۱','زبان انگلیسی ۱','ریاضی ۱','الزامات محیط کار','کارگاه نوآوری و کارآفرینی','دانش فنی پایه','تربیت بدنی ۱'],
  'یازدهم':['فارسی ۲','نگارش ۲','دین و زندگی ۲','عربی، زبان قرآن ۲','زبان انگلیسی ۲','ریاضی ۲','انسان و محیط زیست','کاربرد فناوری‌های نوین','اخلاق حرفه‌ای','تربیت بدنی ۲'],
  'دوازدهم':['فارسی ۳','نگارش ۳','دین و زندگی ۳','عربی، زبان قرآن ۳','زبان انگلیسی ۳','ریاضی ۳','سلامت و بهداشت','مدیریت خانواده و سبک زندگی','دانش فنی تخصصی','تربیت بدنی ۳']
};

function lernoV17FieldLabel(track=profile.track,custom=profile.customTrack){return track==='other'?(custom||'رشته دیگر'):(LERNO_V17_FIELD_LABELS[track]||LERNO_TRACK_LABELS[track]||'')}
function lernoV17ApplyGradeBand(){
  document.body.classList.remove('grade-primary','grade-early','grade-upper','grade-middle','grade-high');
  let index=gradeOptions.indexOf(profile.grade),band=index<0?'middle':index<3?'early':index<6?'upper':index<9?'middle':'high';
  document.body.classList.add('grade-'+band);if(band==='early'||band==='upper')document.body.classList.add('grade-primary');
  profile.experienceMode=band;
  let hero=$('#home .hero>div:first-child>small');if(hero)hero.textContent=profile.grade?'فضای برنامه‌ریزی '+profile.grade:'فضای شخصی دانش‌آموز';
}
function lernoV17PopulateTracks(branch,selected=''){
  let select=$('#track');if(!select)return;select.innerHTML='<option value="">انتخاب رشته</option>';
  Object.entries(LERNO_V17_FIELDS[branch]||{}).forEach(([group,items])=>{let optgroup=document.createElement('optgroup');optgroup.label=group;items.forEach(([value,label])=>optgroup.append(new Option(label,value)));select.append(optgroup)});
  select.add(new Option('رشته دیگر','other'));select.value=selected;
  if(selected&&!select.value){select.value='other';$('#customTrack').value=profile.customTrack||selected}
  lernoV17ToggleCustomTrack();
}
function lernoV17ToggleCustomTrack(){let field=$('#customTrackField');if(field)field.hidden=$('#track')?.value!=='other'}
function lernoV17InstallProfileFields(){
  $('#trackField')?.remove();
  let form=$('#profileForm'),yearLabel=$('#year')?.closest('label');
  if(form&&!$('#studyPathFields')){let wrap=document.createElement('div');wrap.id='studyPathFields';wrap.className='study-path-fields';wrap.hidden=true;wrap.innerHTML='<label>شاخه تحصیلی<select id="branch"><option value="">انتخاب شاخه</option><option value="theory">نظری</option><option value="technical">فنی‌وحرفه‌ای</option><option value="kardanesh">کاردانش</option></select></label><label>رشته تحصیلی<select id="track"><option value="">ابتدا شاخه را انتخاب کن</option></select></label><label id="customTrackField" hidden>نام رشته<input id="customTrack" placeholder="نام دقیق رشته را بنویس"></label>';form.insertBefore(wrap,yearLabel||$('#saveProfile'))}
  let viewRow=$('#viewTrackRow');if(viewRow){viewRow.querySelector('dt').textContent='شاخه و رشته'}
  let gradeSelect=$('#grade');if(gradeSelect){gradeSelect.querySelector('option[value=""]')?.remove();if(!gradeSelect.value)gradeSelect.value=profile.grade||gradeOptions[0]}
  if(profile.track&&['math','experimental','humanities','islamic'].includes(profile.track)&&!profile.branch)profile.branch='theory';
}
function lernoV17UpdateStudyPathFields(){
  let high=isHighSchoolGrade($('#grade')?.value),wrap=$('#studyPathFields');if(wrap)wrap.hidden=!high;
  if(high){let branch=$('#branch').value||profile.branch||'';$('#branch').value=branch;lernoV17PopulateTracks(branch,$('#track').value||profile.track||'')}
}

lernoV17InstallProfileFields();
gradeBooks=function(){
  let grade=String(profile.grade||'');if(LERNO_BOOKS_BY_GRADE[grade])return [...LERNO_BOOKS_BY_GRADE[grade]];
  if(isHighSchoolGrade(grade)){
    let branch=profile.branch||(['math','experimental','humanities','islamic'].includes(profile.track)?'theory':'');
    if(branch==='theory')return [...(LERNO_HIGH_COMMON[grade]||[]),...((LERNO_HIGH_TRACKS[profile.track]||{})[grade]||[])];
    let field=lernoV17FieldLabel(),workshop=field?['کارگاه تخصصی '+field,'شایستگی فنی '+field]:[];
    return [...(LERNO_V17_VOCATIONAL_COMMON[grade]||[]),...workshop];
  }
  return ['فارسی','نگارش','ریاضی','علوم تجربی','مطالعات اجتماعی','آموزش قرآن','هنر','تربیت بدنی'];
};
function lernoV17PopulateDraftSubjects(){let original=profile;profile={...profile,grade:$('#grade').value,branch:$('#branch')?.value||'',track:$('#track')?.value||'',customTrack:$('#customTrack')?.value.trim()||''};populateSubjectControls();profile=original}

resetProfileDraft=function(){
  pendingProfileImage=profile.image||'';pendingProfileAvatar=profile.avatar||'';
  ['name','school','year'].forEach(key=>{let field=$('#'+key);if(field)field.value=profile[key]||''});
  $('#grade').value=profile.grade||gradeOptions[0];$('#branch').value=profile.branch||'';lernoV17PopulateTracks($('#branch').value,profile.track||'');$('#customTrack').value=profile.customTrack||'';lernoV17ToggleCustomTrack();lernoV17SafePathVisibility();showDraftAvatar();
};
function lernoV17SafePathVisibility(){let wrap=$('#studyPathFields');if(wrap)wrap.hidden=!isHighSchoolGrade($('#grade')?.value)}
$('#grade').onchange=()=>{lernoV17SafePathVisibility();if(isHighSchoolGrade($('#grade').value))lernoV17PopulateTracks($('#branch').value,$('#track').value);lernoV17PopulateDraftSubjects()};
$('#branch').onchange=()=>{lernoV17PopulateTracks($('#branch').value,'');lernoV17PopulateDraftSubjects()};
$('#track').onchange=()=>{lernoV17ToggleCustomTrack();lernoV17PopulateDraftSubjects()};
$('#customTrack').oninput=lernoV17PopulateDraftSubjects;

setProfileLocked=function(locked){
  let form=$('#profileForm'),view=$('#profileView');form.hidden=locked;view.hidden=!locked;
  $('#profileCaption').textContent=locked?'برای تغییر پروفایل، دکمهٔ تغییر اطلاعات را بزن.':'عکس را انتخاب و تنظیم کن؛ سپس اطلاعات را ثبت کن.';
  if(locked){
    $('#viewName').textContent=profile.name||'—';$('#viewGrade').textContent=profile.grade||'—';$('#viewSchool').textContent=profile.school||'—';$('#viewYear').textContent=profile.year||'—';
    let row=$('#viewTrackRow');if(row)row.hidden=!isHighSchoolGrade();if($('#viewTrack'))$('#viewTrack').textContent=isHighSchoolGrade()?((LERNO_V17_BRANCH_LABELS[profile.branch]||'')+(profile.branch?' · ':'')+(lernoV17FieldLabel()||'—')):'—';
  }
};
const lernoV17PaintBase=paint;
paint=function(){lernoV17PaintBase();lernoV17ApplyGradeBand()};
$('#profileForm').onsubmit=event=>{
  event.preventDefault();let name=$('#name').value.trim(),grade=$('#grade').value,high=isHighSchoolGrade(grade),branch=high?$('#branch').value:'',track=high?$('#track').value:'',customTrack=track==='other'?$('#customTrack').value.trim():'';
  if(!name)return toast('نام و نام خانوادگی را وارد کن.');if(!grade)return toast('پایه تحصیلی را انتخاب کن.');if(high&&!branch)return toast('شاخه تحصیلی را انتخاب کن.');if(high&&!track)return toast('رشته تحصیلی را انتخاب کن.');if(track==='other'&&!customTrack)return toast('نام رشته تحصیلی را بنویس.');
  profile={...profile,name,grade,branch,track,customTrack,school:$('#school').value.trim(),year:$('#year').value,image:pendingProfileImage,avatar:pendingProfileAvatar,locked:true};editingProfile=false;localStorage.setItem('lerno-open-profile',JSON.stringify(profile));populateSubjectControls();drawSchedule();paint();toast('اطلاعات پروفایل ثبت شد ✓');
};

function lernoV17ClampDate(date){let parts=jalaliParts(date),clamped=clampCalendarCursor(parts);if(parts.year===clamped.year&&parts.month===clamped.month)return date;return j2g(clamped.year,clamped.month,parts.year<clamped.year?1:jalaliMonthLength(clamped.year,clamped.month))}
function lernoV17InstallTodoFields(){
  let form=$('#todoForm'),button=form?.querySelector('button.blue');if(!form||$('#todoWhen'))return;
  let details=document.createElement('div');details.className='todo-details';details.innerHTML='<select id="todoWhen" aria-label="تاریخ انجام"><option value="today">امروز</option><option value="tomorrow">فردا</option><option value="custom">تاریخ مشخص</option></select><div id="todoCustomDate" class="jalali-picker" hidden><select id="todoDay" aria-label="روز"></select><select id="todoMonth" aria-label="ماه"></select><select id="todoYear" aria-label="سال"></select></div><label class="todo-time"><span>ساعت (اختیاری)</span><input id="todoTime" type="time" aria-label="ساعت انجام"></label>';
  form.insertBefore(details,button);let day=$('#todoDay'),month=$('#todoMonth'),year=$('#todoYear');for(let d=1;d<=31;d++)day.add(new Option(fa(d),d));jalaliMonths.forEach((name,index)=>month.add(new Option(name,index+1)));for(let y=1405;y<=1407;y++)year.add(new Option(fa(y),y));
  let initial=jalaliParts(lernoV17ClampDate(new Date()));year.value=initial.year;month.value=initial.month;day.value=initial.day;
  function refresh(){let y=Number(year.value),m=Number(month.value);[...month.options].forEach(option=>option.disabled=y===1405&&Number(option.value)<6);if(y===1405&&m<6){month.value=6;m=6}let max=jalaliMonthLength(y,m);[...day.options].forEach(option=>option.disabled=Number(option.value)>max);if(Number(day.value)>max)day.value=max}
  year.onchange=refresh;month.onchange=refresh;refresh();$('#todoWhen').onchange=()=>{$('#todoCustomDate').hidden=$('#todoWhen').value!=='custom'};
}
function lernoV17TodoDate(){let mode=$('#todoWhen').value;if(mode!=='custom'){let date=new Date();if(mode==='tomorrow')date.setDate(date.getDate()+1);return ymd(lernoV17ClampDate(date))}return ymd(j2g(Number($('#todoYear').value),Number($('#todoMonth').value),Number($('#todoDay').value)))}
function lernoV17TodoDateText(item){let date=new Date(item.date+'T12:00:00'),today=ymd(new Date()),tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);let label=item.date===today?'امروز':item.date===ymd(tomorrow)?'فردا':new Intl.DateTimeFormat('fa-IR-u-ca-persian',{day:'numeric',month:'long',year:'numeric'}).format(date);return label+(item.time?' · ساعت '+item.time:'')}
lernoV17InstallTodoFields();
let migratedTodos=false;todos.forEach(item=>{if(!item.date){item.date=ymd(lernoV17ClampDate(new Date()));migratedTodos=true}if(typeof item.time!=='string'){item.time='';migratedTodos=true}});if(migratedTodos)localStorage.setItem('lerno-todos',JSON.stringify(todos));
saveTodos=function(){localStorage.setItem('lerno-todos',JSON.stringify(todos));drawTodos();drawCalendar();if($('#entryModal').classList.contains('show'))renderEntryList()};
todoRow=function(item){
  let element=document.createElement('div');element.className='task todo-row '+(item.done?'done ':'')+(item.priority==='important'?'important':'');element.innerHTML='<button class="check" aria-label="تغییر وضعیت"></button><div class="task-copy"><b></b><small></small></div><button class="todo-edit" type="button">ویرایش</button><button class="remove" aria-label="حذف">×</button>';
  element.querySelector('.check').textContent=item.done?'✓':'';element.querySelector('b').textContent=item.title;element.querySelector('small').textContent=(item.priority==='important'?'مهم · ':'')+lernoV17TodoDateText(item);
  element.querySelector('.check').onclick=()=>{item.done=!item.done;saveTodos()};element.querySelector('.todo-edit').onclick=()=>editCalendarItem({source:'todo',record:item,id:item.id,text:item.title,type:item.priority==='important'?'todo-important':'todo'});element.querySelector('.remove').onclick=()=>{todos=todos.filter(todo=>todo.id!==item.id);saveTodos()};return element;
};
drawTodos=function(){let open=todos.filter(item=>!item.done),done=todos.filter(item=>item.done);$('#todoOpenCount').textContent=fa(open.length);$('#todoDoneCount').textContent=fa(done.length);[['#todoOpen',open,'فعلاً کاری برای انجام نداری.'],['#todoDone',done,'هنوز کاری را تیک نزده‌ای.']].forEach(([id,list,empty])=>{let box=$(id);box.innerHTML='';list.length?list.forEach(item=>box.append(todoRow(item))):box.innerHTML='<div class="empty">'+empty+'</div>'})};
$('#todoForm').onsubmit=event=>{event.preventDefault();let title=$('#todoInput').value.trim();if(!title)return;todos.unshift({id:Date.now(),title,done:false,priority:$('#todoPriority').value,date:lernoV17TodoDate(),time:$('#todoTime').value||''});$('#todoInput').value='';$('#todoTime').value='';saveTodos();toast('کار در فهرست و تقویم ثبت شد ✓')};

calendarItemsForDate=function(key){
  let ownEntries=entries.filter(item=>item.date===key).map(item=>({source:'entry',record:item,id:item.id,text:item.text,type:normalizedEntryType(item.type)}));
  let linkedTasks=tasks.filter(item=>item.date===key&&!ownEntries.some(entry=>item.calendarEntryId===entry.id||(entry.text===item.title&&entry.type===(item.kind||'task')))).map(item=>({source:'task',record:item,id:item.id,text:item.title,type:item.kind==='project'?'project':'task'}));
  let linkedTodos=todos.filter(item=>item.date===key).map(item=>({source:'todo',record:item,id:item.id,text:(item.done?'✓ ':'')+item.title+(item.time?' · '+item.time:''),type:item.priority==='important'?'todo-important':'todo'}));
  return ownEntries.concat(linkedTasks,linkedTodos);
};
entryTypeLabel=function(type){return type==='exam'?'امتحان':type==='project'?'پروژه':type==='todo-important'?'کار مهم':type==='todo'?'کار':'تکلیف'};
editCalendarItem=function(item){
  if(item.source==='todo'){
    let wrap=document.createElement('div');wrap.innerHTML='<label>عنوان کار<textarea id="editTodoTitle"></textarea></label><label>وضعیت<select id="editTodoDone"><option value="open">در حال انجام</option><option value="done">انجام‌شده</option></select></label><label>اهمیت<select id="editTodoPriority"><option value="normal">معمولی</option><option value="important">مهم</option></select></label><label>ساعت (اختیاری)<input id="editTodoTime" type="time"></label><button class="blue" data-yes>ذخیره تغییرات</button>';wrap.querySelector('#editTodoTitle').value=item.record.title;wrap.querySelector('#editTodoDone').value=item.record.done?'done':'open';wrap.querySelector('#editTodoPriority').value=item.record.priority;wrap.querySelector('#editTodoTime').value=item.record.time||'';
    siteDialog('ویرایش کار',wrap,()=>{let value=wrap.querySelector('#editTodoTitle').value.trim();if(!value)return;item.record.title=value;item.record.done=wrap.querySelector('#editTodoDone').value==='done';item.record.priority=wrap.querySelector('#editTodoPriority').value;item.record.time=wrap.querySelector('#editTodoTime').value;saveTodos()});return;
  }
  let wrap=document.createElement('div');wrap.innerHTML='<textarea></textarea><button class="blue" data-yes>ذخیره تغییرات</button>';wrap.querySelector('textarea').value=item.text;siteDialog('ویرایش '+entryTypeLabel(item.type),wrap,()=>{let value=wrap.querySelector('textarea').value.trim();if(!value)return;if(item.source==='entry'){item.record.text=value;let linked=tasks.find(task=>task.calendarEntryId===item.id);if(linked)linked.title=value;saveCalendarEntries();saveTasks()}else{item.record.title=value;saveTasks()}renderEntryList()});
};
deleteCalendarItem=function(item){let wrap=document.createElement('div');wrap.innerHTML='<p>آیا از حذف این مورد مطمئنی؟</p><button class="blue" data-yes>بله، حذف شود</button>';siteDialog('حذف '+entryTypeLabel(item.type),wrap,()=>{if(item.source==='entry'){entries=entries.filter(entry=>entry.id!==item.id);tasks=tasks.filter(task=>task.calendarEntryId!==item.id);saveCalendarEntries();saveTasks()}else if(item.source==='todo'){todos=todos.filter(todo=>todo.id!==item.id);saveTodos()}else{tasks=tasks.filter(task=>task.id!==item.id);saveTasks()}renderEntryList()})};

Object.entries({calendar:'برنامه‌هایت را اینجا ثبت کن.',schedule:'درس هر زنگ و هر روز هفته را اینجا ثبت کن.',tasks:'تکلیف‌هایت را همراه درس و مهلت تحویل مدیریت کن.',todo:'کارهای شخصی‌ات را با تاریخ، ساعت و میزان اهمیت مرتب کن.',profile:'اطلاعات تحصیلی و تصویر پروفایلت را اینجا تنظیم کن.'}).forEach(([id,text])=>{let paragraph=$('#'+id+' .page-title p');if(paragraph)paragraph.textContent=text});
resetProfileDraft();populateSubjectControls();drawTodos();drawSchedule();paint();drawCalendar();

/* نسخه ۱۸: انتخاب مطمئن آواتار و گزینهٔ پروفایل بدون عکس */
showDraftAvatar=function(){
  let source=pendingProfileImage||avatarFileFor(pendingProfileAvatar);putAvatar($('#profilePhoto'),source);
  $$('[data-avatar]').forEach(button=>button.classList.toggle('selected-avatar',!pendingProfileImage&&button.dataset.avatar===pendingProfileAvatar));
  $('#clearAvatar')?.classList.toggle('selected-avatar',!pendingProfileImage&&!pendingProfileAvatar);
};
$$('[data-avatar]').forEach(button=>button.onclick=()=>{
  if(button.disabled)return;
  let key=button.dataset.avatar,source=avatarFileFor(key);
  pendingProfileAvatar=key;pendingProfileImage='';showDraftAvatar();
  toast('آواتار انتخاب شد؛ برای ذخیره، «ثبت اطلاعات پروفایل» را بزن.');
  let image=new Image();image.onload=()=>openCrop(source);image.onerror=()=>toast('آواتار انتخاب شد؛ حالا اطلاعات پروفایل را ثبت کن.');image.src=source;
});
$('#clearAvatar').onclick=()=>{pendingProfileImage='';pendingProfileAvatar='';showDraftAvatar();toast('حالت بدون عکس انتخاب شد؛ برای ذخیره، اطلاعات پروفایل را ثبت کن.')};
$('#applyCrop').onclick=()=>{
  let button=$('#applyCrop'),stage=$('#cropStage'),image=$('#cropImage');
  if(!cropState.source||!image.naturalWidth||!image.naturalHeight){toast('تصویر هنوز آماده نشده؛ یک لحظه دیگر دوباره بزن.');return}
  button.disabled=true;button.textContent='در حال آماده‌سازی...';
  try{
    let rect=stage.getBoundingClientRect(),scale=cropState.baseScale*cropState.zoom,canvas=document.createElement('canvas'),context=canvas.getContext('2d');
    canvas.width=600;canvas.height=600;
    context.drawImage(image,-cropState.x/scale,-cropState.y/scale,rect.width/scale,rect.height/scale,0,0,600,600);
    pendingProfileImage=canvas.toDataURL('image/jpeg',.9);pendingProfileAvatar='';showDraftAvatar();closeCrop();toast('عکس انتخاب شد؛ حالا «ثبت اطلاعات پروفایل» را بزن.');
  }catch(error){
    if(pendingProfileAvatar){closeCrop();showDraftAvatar();toast('آواتار انتخاب شد؛ حالا اطلاعات پروفایل را ثبت کن.')}else toast('آماده‌سازی عکس انجام نشد؛ دوباره امتحان کن.');
  }finally{button.disabled=false;button.textContent='استفاده از این عکس'}
};
resetProfileDraft();paint();

/* نسخه ۲۰: راهنما، پشتیبانی، ثبت سریع، جست‌وجو، اعلان داخلی و تنظیمات */
(function lernoV20(){
  const icon=(paths,viewBox='0 0 24 24')=>`<svg viewBox="${viewBox}" aria-hidden="true" focusable="false">${paths}</svg>`;
  const icons={
    help:icon('<circle cx="12" cy="12" r="9"></circle><path d="M9.8 9a2.35 2.35 0 1 1 3.2 2.18c-.78.36-1 1-1 1.82"></path><path d="M12 17h.01"></path>'),
    search:icon('<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>'),
    bell:icon('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path>'),
    headset:icon('<path d="M4 13v-2a8 8 0 0 1 16 0v2"></path><path d="M4 13h3v6H5a1 1 0 0 1-1-1zM20 13h-3v6h2a1 1 0 0 0 1-1z"></path><path d="M17 19c0 1.1-1.8 2-4 2"></path>'),
    plus:icon('<path d="M12 5v14M5 12h14"></path>'),
    gear:icon('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.12 2.12-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20h-3v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06-2.12-2.12.06-.06A1.65 1.65 0 0 0 7.2 15a1.65 1.65 0 0 0-1.51-1H5v-3h.69A1.65 1.65 0 0 0 7.2 10a1.65 1.65 0 0 0-.33-1.82l-.06-.06L8.93 6l.06.06a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V4h3v.88a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.12 2.12-.06.06A1.65 1.65 0 0 0 19.4 10a1.65 1.65 0 0 0 1.51 1H21v3h-.09a1.65 1.65 0 0 0-1.51 1z"></path>')
  };

  function addTopTools(){
    let actions=$('.topbar .actions'),theme=$('#theme');if(!actions||$('#v20Help'))return;
    let group=document.createElement('div');group.className='v20-top-tools';group.innerHTML=`<button id="v20Help" class="top-tool help-tool" type="button" aria-label="راهنمای این بخش">${icons.help}<span id="helpHint">راهنما</span></button><button id="v20Search" class="top-tool" type="button" aria-label="جست‌وجو">${icons.search}</button><button id="v20Bell" class="top-tool bell-tool" type="button" aria-label="اعلان‌های داخل برنامه">${icons.bell}<b id="v20BellBadge" hidden>۰</b></button>`;
    actions.insertBefore(group,theme);$('#v20Help').onclick=openSectionHelp;$('#v20Search').onclick=openGlobalSearch;$('#v20Bell').onclick=openNotificationCenter;
    let alternate=false;setInterval(()=>{let hint=$('#helpHint');if(!hint)return;alternate=!alternate;hint.textContent=alternate?'کمک می‌خوای؟':'راهنما'},4500);
  }

  const helpContent={
    home:{title:'راهنمای خانه',purpose:'خانه مهم‌ترین چیزهای امروز را خلاصه می‌کند تا بدانی بهتر است از کجا شروع کنی.',steps:['پیشنهاد LERNO را بخوان.','برای افزودن تکلیف، آزمون یا کار تازه، «ثبت سریع» را بزن.','کارهای مهم و آزمون‌های نزدیک را از دو کارت پایین بررسی کن.'],buttons:'«شروع» تو را مستقیم به بخش مناسب می‌برد و «همه کارها» فهرست کامل را باز می‌کند.',example:'مثال: اگر تکلیف علوم برای امروز داشته باشی، LERNO همان را به‌عنوان پیشنهاد اول نشان می‌دهد.',tip:'هر بار که کاری را انجام دادی، آن را تیک بزن تا پیشنهاد بعدی دقیق‌تر شود.'},
    calendar:{title:'راهنمای تقویم',purpose:'تقویم محل دیدن تکلیف‌ها، آزمون‌ها، پروژه‌ها و کارهای تاریخ‌دار در یک نمای ماهانه است.',steps:['ماه موردنظر را با فلش‌ها انتخاب کن.','روی روز دلخواه بزن.','نوع برنامه و توضیح آن را وارد و ثبت کن.'],buttons:'رنگ آبی برای تکلیف، صورتی برای آزمون، نارنجی برای پروژه و سبز برای کارهای شخصی است.',example:'مثال: روی ۱۸ شهریور بزن، «آزمون» را انتخاب کن و بنویس «آزمون ریاضی».',tip:'تقویم LERNO از شهریور ۱۴۰۵ شروع می‌شود و تاریخ‌های قبل از آن نمایش داده نمی‌شوند.'},
    schedule:{title:'راهنمای برنامه هفتگی',purpose:'در برنامه هفتگی، درس هر روز و هر زنگ را می‌چینی تا برنامه مدرسه همیشه دم دستت باشد.',steps:['پایه و در صورت نیاز رشته را در پروفایل ثبت کن.','روز و زنگ موردنظر را انتخاب کن.','درس همان پایه را انتخاب و ذخیره کن.'],buttons:'«افزودن به برنامه» کلاس را ثبت می‌کند و دکمهٔ حذف، خانهٔ انتخاب‌شده را خالی می‌کند.',example:'مثال: شنبه، زنگ اول، ریاضی را انتخاب کن.',tip:'فهرست درس‌ها با پایه و رشتهٔ ثبت‌شده در پروفایل هماهنگ می‌شود.'},
    tasks:{title:'راهنمای تکالیف',purpose:'تکالیف برای ثبت کارهای درسی و زمان تحویل آن‌هاست.',steps:['عنوان تکلیف و درس را وارد کن.','نوع و مهلت انجام را مشخص کن.','«ثبت با مهلت» را بزن و بعد از انجام، کنار آن تیک بزن.'],buttons:'دکمهٔ تیک، تکلیف را انجام‌شده می‌کند و × آن را حذف می‌کند.',example:'مثال: «حل تمرین صفحه ۳۲» برای درس ریاضی با مهلت فردا.',tip:'تکلیف تاریخ‌دار همان روز در تقویم هم دیده می‌شود.'},
    todo:{title:'راهنمای فهرست کارها',purpose:'فهرست کارها برای کارهای شخصی و غیردرسی مثل آماده‌کردن کیف یا تماس با دوست است.',steps:['عنوان کار را بنویس.','اهمیت، تاریخ و ساعت اختیاری را انتخاب کن.','کار را اضافه کن و پس از انجام تیک بزن.'],buttons:'«ویرایش» عنوان، زمان و اهمیت را تغییر می‌دهد و × کار را حذف می‌کند.',example:'مثال: «آماده‌کردن وسایل ورزش» برای دوشنبه ساعت ۷ صبح.',tip:'هر کار تاریخ‌دار به‌طور خودکار در تقویم هم نمایش داده می‌شود.'},
    grades:{title:'راهنمای نمره‌ها',purpose:'این بخش نمره‌ها را نگه می‌دارد و معدل تقریبی تو را حساب می‌کند.',steps:['درس را انتخاب یا نامش را بنویس.','نمره از ۲۰ و ضریب را وارد کن.','«ثبت نمره» را بزن.'],buttons:'× نمرهٔ اشتباه را حذف می‌کند؛ معدل و بهترین درس خودکار به‌روز می‌شوند.',example:'مثال: علوم، نمره ۱۸٫۵، ضریب ۲.',tip:'ضریب بیشتر یعنی آن نمره اثر بیشتری روی معدل تقریبی دارد.'},
    focus:{title:'راهنمای زمان مطالعه',purpose:'تایمر مطالعه کمک می‌کند یک بازه کوتاه را بدون حواس‌پرتی روی یک کار بمانی.',steps:['یکی از زمان‌های پیشنهادی را انتخاب کن.','«شروع جلسه» را بزن.','پس از پایان، استراحت کوتاه را انجام بده.'],buttons:'«توقف موقت» تایمر را نگه می‌دارد و «بازگشت» صفحهٔ اصلی مطالعه را باز می‌کند.',example:'مثال: برای مرور یک درس، جلسه ۲۵ دقیقه‌ای را شروع کن.',tip:'پیش از شروع، اعلان‌ها و چیزهای حواس‌پرت‌کن را کنار بگذار.'},
    'progress-page':{title:'راهنمای پیشرفت',purpose:'پیشرفت، وضعیت انجام تکالیف، زمان مطالعه و استمرار تو را خلاصه می‌کند.',steps:['تکلیف‌های انجام‌شده را تیک بزن.','جلسه‌های مطالعه را کامل کن.','برای دیدن نتیجه به این صفحه برگرد.'],buttons:'نوارها خودکار تغییر می‌کنند و نیازی به ثبت دستی ندارند.',example:'مثال: اگر ۳ تکلیف از ۴ تکلیف انجام شود، پیشرفت تکالیف ۷۵٪ است.',tip:'این آمار برای مقایسه با خودت است، نه دیگران.'},
    calculator:{title:'راهنمای ماشین حساب',purpose:'برای محاسبه‌های سریع مدرسه و کارهای روزانه از ماشین حساب استفاده کن.',steps:['عدد اول را وارد کن.','عملگر و عدد بعدی را بزن.','با = نتیجه را ببین.'],buttons:'C همه‌چیز را پاک می‌کند و ⌫ فقط آخرین ورودی را برمی‌گرداند.',example:'مثال: برای میانگین دو نمره، مجموعشان را بر ۲ تقسیم کن.',tip:'برای محاسبه معدل دقیق‌تر، از بخش «نمره‌ها و معدل» استفاده کن.'},
    profile:{title:'راهنمای پروفایل',purpose:'پروفایل پایه، رشته و تصویر تو را نگه می‌دارد تا بخش‌های LERNO متناسب با اطلاعاتت شوند.',steps:['یک آواتار، عکس شخصی یا حالت بدون عکس را انتخاب کن.','نام، پایه و اطلاعات تحصیلی را وارد کن.','«ثبت اطلاعات پروفایل» را بزن.'],buttons:'«استفاده از این عکس» برش را تأیید می‌کند و «تغییر اطلاعات» فرم را دوباره باز می‌کند.',example:'مثال: پایه دهم و رشته ریاضی را ثبت کن تا درس‌های همان رشته پیشنهاد شوند.',tip:'تا دکمهٔ ثبت اطلاعات را نزنی، تصویر بالای صفحه تغییر نمی‌کند.'},
    support:{title:'راهنمای پشتیبانی',purpose:'در پشتیبانی می‌توانی مشکل یا پیشنهادت را بنویسی و سابقهٔ پیام را روی همین دستگاه ببینی.',steps:['مشکل را کوتاه و روشن توضیح بده.','اگر لازم است نام بخشی که مشکل دارد را هم بنویس.','دکمهٔ «ارسال» را بزن.'],buttons:'تا زمان اتصال پایگاه‌داده، پیام فقط روی همین دستگاه ذخیره می‌شود و هنوز برای مدیر ارسال آنلاین ندارد.',example:'مثال: «در صفحه تقویم، نوشته تکلیف روز ۱۸ شهریور دیده نمی‌شود.»',tip:'برای ارسال واقعی و دریافت پاسخ داخل LERNO باید اتصال پشتیبانی آنلاین بعداً فعال شود.'}
  };
  function activePage(){return $('.page.active')?.id||'home'}
  function openSectionHelp(){let data=helpContent[activePage()]||helpContent.home,wrap=document.createElement('div');wrap.className='help-dialog-content';let lead=document.createElement('p');lead.className='help-purpose';lead.textContent=data.purpose;let section=document.createElement('section');section.className='help-steps';let heading=document.createElement('b');heading.textContent='روش استفاده';let list=document.createElement('ol');data.steps.forEach(text=>{let item=document.createElement('li');item.textContent=text;list.append(item)});section.append(heading,list);let buttons=document.createElement('div');buttons.className='help-detail';buttons.innerHTML='<b>دکمه‌های مهم</b><span></span>';buttons.querySelector('span').textContent=data.buttons;let example=document.createElement('div');example.className='help-example';example.innerHTML='<b>یک مثال ساده</b><span></span>';example.querySelector('span').textContent=data.example;let tip=document.createElement('div');tip.className='help-tip';tip.innerHTML='<b>نکته</b><span></span>';tip.querySelector('span').textContent=data.tip;let support=document.createElement('button');support.type='button';support.className='plain help-support-link';support.textContent='هنوز سؤال دارم؛ پشتیبانی';support.onclick=()=>{document.querySelector('.site-dialog')?.remove();lernoNavigate('support')};wrap.append(lead,section,buttons,example,tip,support);siteDialog(data.title,wrap)}

  function addSupportPage(){
    let nav=$('#sidebar nav'),profileButton=nav?.querySelector('[data-page="profile"]');if(!nav||$('#support'))return;
    let button=document.createElement('button');button.type='button';button.dataset.page='support';button.innerHTML=`${icons.headset}<span>پشتیبانی</span>`;nav.insertBefore(button,profileButton);button.onclick=()=>lernoNavigate('support');
    let page=document.createElement('section');page.className='page support-page';page.id='support';page.innerHTML=`<div class="page-title"><button class="page-back support-back" type="button"><span aria-hidden="true">←</span> بازگشت</button><small>LERNO / همراه تو</small><h1>پشتیبانی</h1><p>پرسش یا مشکلت را روشن و کوتاه بنویس.</p></div><section class="support-layout"><article class="support-chat-card"><header><span class="support-agent">${icons.headset}</span><div><b>پشتیبانی LERNO</b><small>گفت‌وگو در همین صفحه</small></div><span class="support-status">آزمایشی</span></header><div id="supportMessages" class="support-messages"></div><form id="supportForm"><label class="sr-only" for="supportText">پیامت را بنویس</label><div class="support-composer"><textarea id="supportText" rows="1" placeholder="پیامت را بنویس..." required></textarea><button class="blue" type="submit"><span>ارسال</span><i aria-hidden="true">←</i></button></div><small class="support-connection-note">اتصال ارسال و پاسخ آنلاین هنوز تنظیم نشده است.</small></form></article><aside class="support-contact-card"><span class="support-contact-icon">${icons.headset}</span><h2>راه ارتباطی جایگزین</h2><p>تا فعال‌شدن پاسخ داخل برنامه، شناسهٔ پشتیبانی در پیام‌رسان‌ها:</p><a class="messenger telegram" href="https://t.me/AvaBayattt" target="_blank" rel="noopener noreferrer">تلگرام <b dir="ltr">@AvaBayattt</b></a><a class="messenger bale" href="https://ble.ir/AvaBayattt" target="_blank" rel="noopener noreferrer">بله <b dir="ltr">@AvaBayattt</b></a></aside></section>`;
    $('.content').append(page);page.querySelector('.support-back').onclick=()=>{let target=lernoPageTrail.pop()||'home';lernoNavigate(target,false)};$('#supportForm').onsubmit=event=>{event.preventDefault();saveSupportMessage($('#supportText').value.trim())};$('#supportText').addEventListener('input',event=>{event.target.style.height='auto';event.target.style.height=Math.min(event.target.scrollHeight,90)+'px'});renderSupportMessages();
    let floating=document.createElement('button');floating.id='floatingSupport';floating.className='floating-action floating-support';floating.type='button';floating.setAttribute('aria-label','بازکردن پشتیبانی');floating.innerHTML=icons.headset+'<span>پشتیبانی</span>';floating.onclick=()=>lernoNavigate('support');document.body.append(floating);
  }
  function readSupportMessages(){try{return JSON.parse(localStorage.getItem('lerno-support-messages')||'[]')}catch{return []}}
  function renderSupportMessages(){let box=$('#supportMessages');if(!box)return;box.innerHTML='';let intro=document.createElement('div');intro.className='support-bubble agent';intro.textContent='سلام! پرسشت را اینجا بنویس. فعلاً پیام روی همین دستگاه ذخیره می‌شود.';box.append(intro);let messages=readSupportMessages();messages.forEach(item=>{let bubble=document.createElement('div');bubble.className='support-bubble user';bubble.textContent=item.text;let time=document.createElement('small');time.textContent=new Intl.DateTimeFormat('fa-IR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(item.at));bubble.append(time);box.append(bubble)});box.scrollTop=box.scrollHeight}
  function saveSupportMessage(text){if(!text)return;let messages=readSupportMessages();messages.push({id:Date.now(),text,at:new Date().toISOString()});localStorage.setItem('lerno-support-messages',JSON.stringify(messages.slice(-30)));$('#supportText').value='';renderSupportMessages();toast('پیام روی این دستگاه ذخیره شد؛ ارسال آنلاین بعد از اتصال پشتیبانی فعال می‌شود.')}

  function addQuickAdd(){if($('#quickAdd'))return;let button=document.createElement('button');button.id='quickAdd';button.className='floating-action quick-add';button.type='button';button.setAttribute('aria-label','ثبت سریع');button.innerHTML=icons.plus+'<span>ثبت سریع</span>';button.onclick=openQuickAdd;document.body.append(button)}
  function quickGo(page,selector,message){document.querySelector('.site-dialog')?.remove();lernoNavigate(page);setTimeout(()=>{let field=$(selector);if(field){field.focus();field.scrollIntoView({behavior:'smooth',block:'center'})}if(message)toast(message)},80)}
  function openQuickAdd(){let wrap=document.createElement('div');wrap.className='quick-add-grid';[
    ['✓','تکلیف','با درس و مهلت','tasks','#taskInput',''],['▦','امتحان یا پروژه','در یک روز تقویم','calendar','#days','روی روز موردنظر بزن.'],['☷','کار روزانه','با تاریخ و ساعت','todo','#todoInput',''],['◴','شروع مطالعه','تایمر تمرکز','focus','#beginFocus','']
  ].forEach(([glyph,title,description,page,selector,message])=>{let button=document.createElement('button');button.type='button';button.innerHTML='<i></i><span><b></b><small></small></span>';button.querySelector('i').textContent=glyph;button.querySelector('b').textContent=title;button.querySelector('small').textContent=description;button.onclick=()=>quickGo(page,selector,message);wrap.append(button)});siteDialog('چی می‌خواهی ثبت کنی؟',wrap)}

  const normalizeSearch=value=>String(value||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u064B-\u065F]/g,'').trim().toLowerCase();
  function searchIndex(){let list=[];tasks.forEach(item=>list.push({title:item.title,meta:(item.kind==='project'?'پروژه':'تکلیف')+(item.date?' · '+taskDueText(item):''),page:'tasks',date:item.date}));todos.forEach(item=>list.push({title:item.title,meta:'فهرست کارها'+(item.date?' · '+lernoV17TodoDateText(item):''),page:'todo',date:item.date}));entries.forEach(item=>list.push({title:item.text,meta:entryTypeLabel(item.type)+' · '+formatPersianDate(item.date),page:'calendar',date:item.date}));schedule.forEach(item=>list.push({title:item.subject,meta:'برنامه هفتگی · '+weekDays[item.day]+' · زنگ '+fa(item.period||1),page:'schedule'}));grades.forEach(item=>list.push({title:item.subject,meta:'نمره '+fa(item.score)+' از ۲۰',page:'grades'}));return list}
  function formatPersianDate(value){if(!value)return '';let date=new Date(value+'T12:00:00');return Number.isNaN(date.getTime())?'':new Intl.DateTimeFormat('fa-IR-u-ca-persian',{day:'numeric',month:'long',year:'numeric'}).format(date)}
  function openGlobalSearch(){let wrap=document.createElement('div');wrap.className='search-dialog';wrap.innerHTML='<label class="search-field"><span aria-hidden="true">⌕</span><input id="globalSearchInput" type="search" autocomplete="off" placeholder="نام تکلیف، درس یا کار را بنویس..."></label><div id="globalSearchResults" class="search-results"></div>';let modal=siteDialog('جست‌وجو در LERNO',wrap),input=wrap.querySelector('input');input.oninput=()=>renderSearchResults(input.value,wrap.querySelector('.search-results'),modal);renderSearchResults('',wrap.querySelector('.search-results'),modal);setTimeout(()=>input.focus(),50)}
  function renderSearchResults(query,box,modal){let needle=normalizeSearch(query),items=searchIndex().filter(item=>!needle||normalizeSearch(item.title+' '+item.meta).includes(needle)).slice(0,20);box.innerHTML='';if(!items.length){let empty=document.createElement('p');empty.className='search-empty';empty.textContent='نتیجه‌ای پیدا نشد.';box.append(empty);return}items.forEach(item=>{let button=document.createElement('button');button.type='button';button.className='search-result';let copy=document.createElement('span'),title=document.createElement('b'),meta=document.createElement('small');title.textContent=item.title;meta.textContent=item.meta;copy.append(title,meta);button.append(copy);button.insertAdjacentHTML('beforeend','<i aria-hidden="true">←</i>');button.onclick=()=>{modal.remove();if(item.page==='calendar'&&item.date){cursor=clampCalendarCursor(jalaliParts(new Date(item.date+'T12:00:00')));drawCalendar()}lernoNavigate(item.page)};box.append(button)})}

  function dueNotifications(){let today=ymd(new Date()),now=new Date(),lead=Math.max(0,Math.min(2,Number(localStorage.getItem('lerno-reminder-days')||1)));now.setHours(0,0,0,0);let items=[];
    tasks.filter(item=>!item.done&&item.date).forEach(item=>items.push({title:item.title,date:item.date,page:'tasks',type:item.kind==='project'?'پروژه':'تکلیف'}));
    todos.filter(item=>!item.done&&item.date).forEach(item=>items.push({title:item.title,date:item.date,page:'todo',type:item.priority==='important'?'کار مهم':'کار'}));
    entries.filter(item=>item.date&&(item.type==='exam'||item.type==='project')).forEach(item=>items.push({title:item.text,date:item.date,page:'calendar',type:entryTypeLabel(item.type)}));
    return items.map(item=>{let day=new Date(item.date+'T12:00:00'),diff=Math.round((day-now)/86400000),status=item.date<today?'عقب‌افتاده':diff===0?'امروز':diff===1&&lead>=1?'فردا':diff===2&&lead>=2?'پس‌فردا':'';return {...item,status,diff}}).filter(item=>item.status).sort((a,b)=>a.date.localeCompare(b.date))
  }
  function remindersEnabled(){return localStorage.getItem('lerno-inapp-reminders')!=='off'}
  function updateNotificationBadge(){let badge=$('#v20BellBadge');if(!badge)return;let count=remindersEnabled()?dueNotifications().length:0;badge.hidden=!count;badge.textContent=fa(Math.min(count,99))}
  function openNotificationCenter(){let wrap=document.createElement('div');wrap.className='notification-list';if(!remindersEnabled()){let empty=document.createElement('div');empty.className='notification-empty';empty.textContent='یادآوری‌های داخل برنامه از تنظیمات خاموش‌اند.';wrap.append(empty)}else{let items=dueNotifications();if(!items.length){let empty=document.createElement('div');empty.className='notification-empty';empty.textContent='فعلاً مورد نزدیک یا عقب‌افتاده‌ای نداری.';wrap.append(empty)}items.forEach(item=>{let button=document.createElement('button');button.type='button';button.className='notification-item '+(item.status==='عقب‌افتاده'?'late':'');button.innerHTML='<i></i><span><b></b><small></small></span>';button.querySelector('i').textContent=item.status==='عقب‌افتاده'?'!':'•';button.querySelector('b').textContent=item.title;button.querySelector('small').textContent=item.type+' · '+item.status+(item.status==='این هفته'?' · '+formatPersianDate(item.date):'');button.onclick=()=>{document.querySelector('.site-dialog')?.remove();if(item.page==='calendar'){cursor=clampCalendarCursor(jalaliParts(new Date(item.date+'T12:00:00')));drawCalendar()}lernoNavigate(item.page)};wrap.append(button)})}siteDialog('اعلان‌های LERNO',wrap)}

  function addProfileSettings(){if($('#profileSettings'))return;let card=document.createElement('button');card.id='profileSettings';card.type='button';card.className='profile-settings-card';card.innerHTML=`<span>${icons.gear}</span><div><b>تنظیمات برنامه</b><small>ظاهر، اندازهٔ نوشته و یادآوری‌ها</small></div><i aria-hidden="true">←</i>`;card.onclick=openSettings;let profilePage=$('#profile'),account=profilePage.querySelector('.account-card');profilePage.insertBefore(card,account||null)}
  function themePreference(){return localStorage.getItem('lerno-theme-preference')||localStorage.getItem('lerno-theme')||'light'}
  function applyPreferences(){let theme=themePreference(),dark=theme==='dark'||(theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.body.classList.toggle('dark',dark);$('#theme').textContent=dark?'☀':'☾';let size=localStorage.getItem('lerno-font-size')||'normal';document.body.classList.toggle('font-comfortable',size==='comfortable');updateNotificationBadge()}
  function openSettings(){let wrap=document.createElement('form');wrap.className='settings-form';wrap.innerHTML='<label>حالت نمایش<select id="settingTheme"><option value="light">روشن</option><option value="dark">تیره</option><option value="system">هماهنگ با دستگاه</option></select></label><label>اندازه نوشته‌ها<select id="settingFont"><option value="normal">معمولی</option><option value="comfortable">کمی بزرگ‌تر</option></select></label><label class="toggle-setting"><span><b>صدای پایان مطالعه</b><small>پایان تایمر با یک صدای کوتاه اعلام شود</small></span><input id="settingSound" type="checkbox"></label><label class="toggle-setting"><span><b>یادآوری داخل برنامه</b><small>موارد نزدیک روی زنگوله نشان داده شوند</small></span><input id="settingReminders" type="checkbox"></label><button class="blue" data-yes type="button">ذخیره تنظیمات</button>';wrap.querySelector('#settingTheme').value=themePreference();wrap.querySelector('#settingFont').value=localStorage.getItem('lerno-font-size')||'normal';wrap.querySelector('#settingSound').checked=localStorage.getItem('lerno-timer-sound')!=='off';wrap.querySelector('#settingReminders').checked=remindersEnabled();siteDialog('تنظیمات برنامه',wrap,()=>{localStorage.setItem('lerno-theme-preference',wrap.querySelector('#settingTheme').value);localStorage.setItem('lerno-theme',wrap.querySelector('#settingTheme').value==='dark'?'dark':'light');localStorage.setItem('lerno-font-size',wrap.querySelector('#settingFont').value);localStorage.setItem('lerno-timer-sound',wrap.querySelector('#settingSound').checked?'on':'off');localStorage.setItem('lerno-inapp-reminders',wrap.querySelector('#settingReminders').checked?'on':'off');applyPreferences();toast('تنظیمات ذخیره شد ✓')})}
  $('#theme').onclick=()=>{let next=document.body.classList.contains('dark')?'light':'dark';localStorage.setItem('lerno-theme-preference',next);localStorage.setItem('lerno-theme',next);applyPreferences()};matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(themePreference()==='system')applyPreferences()});
  const baseBeep=beep;beep=function(){if(localStorage.getItem('lerno-timer-sound')!=='off')baseBeep()};

  function showOnboarding(){if(!window.LERNO_AUTH?.session||localStorage.getItem('lerno-onboarding-v20')==='done'||$('#v20Onboarding'))return;let slides=[['همه‌چیز یک‌جا','تقویم، تکالیف، برنامه هفتگی و زمان مطالعه کنار هم هستند.'],['سریع ثبت کن','با دکمهٔ آبی «ثبت سریع» از هر صفحه کار جدیدت را شروع کن.'],['هرجا لازم شد، راهنما هست','علامت سؤال روش همان بخش را توضیح می‌دهد و پشتیبانی هم همیشه در دسترس است.']],index=0,overlay=document.createElement('section');overlay.id='v20Onboarding';overlay.className='onboarding';overlay.setAttribute('aria-label','معرفی LERNO');overlay.innerHTML='<div class="onboarding-card"><div class="onboarding-mark">LER<span>NO</span></div><div class="onboarding-visual"></div><small id="onboardingStep"></small><h1 id="onboardingTitle"></h1><p id="onboardingText"></p><div id="onboardingDots" class="onboarding-dots"></div><div class="onboarding-actions"><button id="onboardingSkip" class="plain" type="button">رد کردن</button><button id="onboardingNext" class="blue" type="button">بعدی</button></div></div>';document.body.append(overlay);let finish=()=>{localStorage.setItem('lerno-onboarding-v20','done');overlay.remove()};function render(){let slide=slides[index];overlay.querySelector('#onboardingStep').textContent='مرحله '+fa(index+1)+' از '+fa(slides.length);overlay.querySelector('#onboardingTitle').textContent=slide[0];overlay.querySelector('#onboardingText').textContent=slide[1];let dots=overlay.querySelector('#onboardingDots');dots.innerHTML='';slides.forEach((_,i)=>{let dot=document.createElement('i');dot.classList.toggle('active',i===index);dots.append(dot)});overlay.querySelector('#onboardingNext').textContent=index===slides.length-1?'شروع استفاده از LERNO':'بعدی'}render();overlay.querySelector('#onboardingSkip').onclick=finish;overlay.querySelector('#onboardingNext').onclick=()=>{if(index===slides.length-1)finish();else{index++;render()}}}

  function homeDateLabel(value){if(!value)return 'بدون تاریخ';let today=ymd(new Date()),tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);if(value<today)return 'مهلت گذشته';if(value===today)return 'امروز';if(value===ymd(tomorrow))return 'فردا';return formatPersianDate(value)}
  function homeCandidates(){let all=[];tasks.filter(item=>!item.done).forEach(item=>all.push({id:item.id,title:item.title,date:item.date||'',important:false,type:item.kind==='project'?'پروژه':'تکلیف',page:'tasks'}));todos.filter(item=>!item.done).forEach(item=>all.push({id:item.id,title:item.title,date:item.date||'',important:item.priority==='important',type:item.priority==='important'?'کار مهم':'کار',page:'todo',time:item.time||''}));let today=ymd(new Date());return all.sort((a,b)=>{let rank=item=>item.date&&item.date<today?0:item.date===today?1:item.important?2:item.date?3:4,delta=rank(a)-rank(b);return delta||String(a.date||'9999').localeCompare(String(b.date||'9999'))||b.id-a.id})}
  function homeMiniRow(item,kind){let button=document.createElement('button');button.type='button';button.className='home-mini-row '+kind;button.innerHTML='<i aria-hidden="true"></i><span><b></b><small></small></span><em aria-hidden="true">←</em>';button.querySelector('i').textContent=kind==='exam'?'●':'✓';button.querySelector('b').textContent=item.title;button.querySelector('small').textContent=kind==='exam'?homeDateLabel(item.date):(item.type+' · '+homeDateLabel(item.date)+(item.time?' · '+item.time:''));button.onclick=()=>lernoNavigate(item.page);return button}
  function emptyHomeList(box,text,page,label){box.innerHTML='';let empty=document.createElement('div');empty.className='home-list-empty';let span=document.createElement('span');span.textContent=text;let button=document.createElement('button');button.type='button';button.textContent=label+' ←';button.onclick=()=>lernoNavigate(page);empty.append(span,button);box.append(empty)}
  function drawHomeDashboard(){let candidates=homeCandidates(),today=ymd(new Date()),important=candidates.filter(item=>item.important||(item.date&&item.date<=today)).slice(0,3),importantBox=$('#homeImportantList'),examBox=$('#homeExamList');if(!importantBox||!examBox)return;
    importantBox.innerHTML='';important.length?important.forEach(item=>importantBox.append(homeMiniRow(item,'important'))):emptyHomeList(importantBox,'فعلاً کار فوری نداری.','todo','افزودن کار');
    let exams=entries.filter(item=>item.type==='exam'&&item.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3).map(item=>({title:item.text,date:item.date,page:'calendar'}));examBox.innerHTML='';exams.length?exams.forEach(item=>examBox.append(homeMiniRow(item,'exam'))):emptyHomeList(examBox,'آزمونی ثبت نشده است.','calendar','ثبت آزمون');
    let suggestion=candidates[0],title=$('#smartSuggestionTitle'),meta=$('#smartSuggestionMeta'),action=$('#smartSuggestionAction');if(suggestion){title.textContent=suggestion.title;meta.textContent=suggestion.type+' · '+homeDateLabel(suggestion.date)+(suggestion.time?' · ساعت '+suggestion.time:'');action.textContent='شروع ←';action.onclick=()=>lernoNavigate(suggestion.page)}else{title.textContent='اولین کارت را ثبت کن';meta.textContent='یک کار کوچک برای شروع امروز کافی است.';action.textContent='ثبت سریع ←';action.onclick=openQuickAdd}
  }
  window.lernoDrawHome=drawHomeDashboard;
  $('#homeQuickAdd')?.addEventListener('click',openQuickAdd);

  addTopTools();addSupportPage();addQuickAdd();addProfileSettings();applyPreferences();updateNotificationBadge();
  const taskSave=saveTasks;saveTasks=function(){taskSave();updateNotificationBadge();drawHomeDashboard()};const todoSave=saveTodos;saveTodos=function(){todoSave();updateNotificationBadge();drawHomeDashboard()};const entrySave=saveCalendarEntries;saveCalendarEntries=function(){entrySave();updateNotificationBadge();drawHomeDashboard()};
  drawHomeDashboard();
})();

/* نسخه ۲۲: نوار بالای یکپارچه و مجموعهٔ تازهٔ آواتارها */
(function lernoV22(){
  const oldAvatar=/^a(?:[1-9]|10)$/;
  if(!profile.image&&oldAvatar.test(profile.avatar||'')){
    profile.avatar='';
    localStorage.setItem('lerno-open-profile',JSON.stringify(profile));
  }

  const grid=$('.avatar-grid'),insertPoint=grid?.querySelector('.add-photo');
  grid?.querySelectorAll('[data-avatar]').forEach(button=>{
    if(oldAvatar.test(button.dataset.avatar||''))button.remove();
  });
  if(grid&&insertPoint){
    for(let number=19;number<=21;number++){
      if(grid.querySelector(`[data-avatar="a${number}"]`))continue;
      const button=document.createElement('button');
      button.type='button';
      button.className=`student-avatar locked-avatar vip-avatar a${number}`;
      button.dataset.avatar=`a${number}`;
      button.setAttribute('aria-label',`آواتار VIP ${fa(number-18)}`);
      button.style.backgroundImage=`url('assets/avatars-v4/avatar-${number-1}.png')`;
      button.innerHTML='<i aria-hidden="true">VIP</i>';
      button.onclick=()=>{
        if(button.disabled)return;
        pendingProfileAvatar=button.dataset.avatar;
        pendingProfileImage='';
        showDraftAvatar();
        toast('آواتار انتخاب شد؛ برای ذخیره، «ثبت اطلاعات پروفایل» را بزن.');
        openCrop(avatarFileFor(button.dataset.avatar));
      };
      grid.insertBefore(button,insertPoint);
    }
  }

  const clear=$('#clearAvatar');
  if(clear){
    clear.innerHTML='<svg class="no-photo-symbol" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"></circle><circle cx="16" cy="11" r="4"></circle><path d="M8.5 24c1.7-4.2 4.1-6.2 7.5-6.2s5.8 2 7.5 6.2"></path><path class="no-photo-slash" d="M6 26 26 6"></path></svg><span class="no-photo-label">بدون عکس</span><i class="no-photo-check" aria-hidden="true">✓</i>';
    clear.title='برداشتن عکس پروفایل';
    clear.setAttribute('aria-label','انتخاب حالت پروفایل بدون عکس');
  }
  const note=$('.unlock-note');
  if(note)note.textContent='سه آواتار VIP بعد از ۵ روز مطالعهٔ متوالی باز می‌شوند.';

  const topbar=$('.topbar'),actions=topbar?.querySelector('.actions'),tools=$('.v20-top-tools'),theme=$('#theme'),dateLine=$('.date-line');
  if(topbar&&actions&&tools&&theme&&dateLine){
    topbar.classList.add('topbar-modern');
    actions.classList.add('modern-actions');
    tools.classList.add('top-tool-dock');
    theme.classList.add('top-tool','theme-tool');
    tools.append(theme);
    const currentDate=$('#date')?.textContent||'';
    const currentTime=$('#time')?.textContent||'';
    dateLine.innerHTML='<span class="date-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"></path></svg></span><b id="date"></b><time id="time"></time>';
    $('#date').textContent=currentDate;
    $('#time').textContent=currentTime;
  }

  resetProfileDraft();
  paint();
  clock();
})();

/* نسخه ۲۳: اصلاح املای امتحان در اطلاعات قدیمی و ورودی‌های تازه */
(function lernoV23ExamSpelling(){
  const correctExamSpelling=value=>typeof value==='string'?value.replaceAll('امتخان','امتحان'):value;
  let changed=false;
  [tasks,entries,todos,schedule,grades].forEach(collection=>collection.forEach(item=>{
    Object.keys(item).forEach(key=>{
      const corrected=correctExamSpelling(item[key]);
      if(corrected!==item[key]){item[key]=corrected;changed=true}
    });
  }));
  if(changed){
    localStorage.setItem('lerno-open-tasks',JSON.stringify(tasks));
    localStorage.setItem('lerno-calendar-entries',JSON.stringify(entries));
    localStorage.setItem('lerno-todos',JSON.stringify(todos));
    localStorage.setItem('lerno-weekly-schedule',JSON.stringify(schedule));
    localStorage.setItem('lerno-grades',JSON.stringify(grades));
    draw();drawCalendar();drawTodos();drawSchedule();drawGrades();window.lernoDrawHome?.();
  }
  document.addEventListener('submit',event=>{
    event.target.querySelectorAll?.('input[type="text"],input:not([type]),textarea').forEach(field=>{
      field.value=correctExamSpelling(field.value);
    });
  },true);
})();

/* نسخه ۲۴: داشبورد واقعی خانه */
(function lernoV24Home(){
  const todayKey=()=>ymd(new Date());
  const startOfDay=value=>{let date=value instanceof Date?new Date(value):new Date(value+'T12:00:00');date.setHours(0,0,0,0);return date};
  const persianShortDate=value=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',{weekday:'long',day:'numeric',month:'long'}).format(new Date(value+'T12:00:00'));
  const dueLabel=value=>{
    if(!value)return 'بدون تاریخ';let today=todayKey(),tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
    if(value<today)return 'مهلت گذشته';if(value===today)return 'امروز';if(value===ymd(tomorrow))return 'فردا';return persianShortDate(value);
  };
  function greeting(){let first=(profile.name||'').trim().split(/\s+/)[0],title=$('#homeGreeting');if(title)title.textContent=first?'سلام '+first+'؛ برنامهٔ امروزت آماده است':'سلام؛ برنامهٔ امروزت آماده است'}
  function importantItems(){
    let today=todayKey(),items=[];
    tasks.filter(item=>!item.done).forEach(item=>items.push({source:'task',record:item,title:item.title,date:item.date||'',type:item.kind==='project'?'پروژه':'تکلیف',important:false}));
    todos.filter(item=>!item.done).forEach(item=>items.push({source:'todo',record:item,title:item.title,date:item.date||'',time:item.time||'',type:item.priority==='important'?'کار مهم':'کار',important:item.priority==='important'}));
    return items.sort((a,b)=>{let rank=item=>item.date&&item.date<today?0:item.date===today?1:item.important?2:item.date?3:4;return rank(a)-rank(b)||String(a.date||'9999').localeCompare(String(b.date||'9999'))||b.record.id-a.record.id}).slice(0,4);
  }
  function drawImportant(){
    let box=$('#homeImportantList');if(!box)return;let items=importantItems();box.innerHTML='';
    if(!items.length){let empty=document.createElement('div');empty.className='home-empty-state';empty.innerHTML='<span>فعلاً کار مهمی باقی نمانده است.</span><button type="button">ثبت اولین کار</button>';empty.querySelector('button').onclick=()=>$('#quickAdd')?.click();box.append(empty);return}
    items.forEach(item=>{let label=document.createElement('label');label.className='home-important-row '+(item.date&&item.date<todayKey()?'is-late':'');let check=document.createElement('input');check.type='checkbox';check.setAttribute('aria-label','انجام شد: '+item.title);let copy=document.createElement('span');copy.className='home-important-copy';let title=document.createElement('b');title.textContent=item.title;let meta=document.createElement('small');meta.textContent=item.type+' · '+dueLabel(item.date)+(item.time?' · ساعت '+item.time:'');copy.append(title,meta);let chip=document.createElement('em');chip.className='home-priority-chip';chip.textContent=item.date&&item.date<todayKey()?'عقب‌افتاده':item.important?'مهم':item.date===todayKey()?'امروز':'بعدی';check.onchange=()=>{item.record.done=true;item.source==='task'?saveTasks():saveTodos();toast('انجام شد ✓')};label.append(check,copy,chip);box.append(label)})
  }
  function drawExam(){
    let box=$('#homeExamList');if(!box)return;let today=startOfDay(new Date()),exam=entries.filter(item=>item.type==='exam'&&startOfDay(item.date)>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];box.innerHTML='';
    if(!exam){let empty=document.createElement('div');empty.className='home-empty-state';empty.innerHTML='<span>هنوز امتحانی ثبت نکرده‌ای.</span><button type="button">ثبت امتحان</button>';empty.querySelector('button').onclick=()=>lernoNavigate('calendar');box.append(empty);return}
    let days=Math.max(0,Math.round((startOfDay(exam.date)-today)/86400000)),card=document.createElement('div');card.className='home-exam-countdown';card.innerHTML='<small>نزدیک‌ترین امتحان</small><strong></strong><div class="home-exam-days"><b></b><span></span></div><div class="home-exam-date"><span></span><span>برای مرور آماده شو</span></div><button class="home-exam-open" type="button">بازکردن در تقویم</button>';card.querySelector('strong').textContent=exam.text;card.querySelector('.home-exam-days b').textContent=fa(days);card.querySelector('.home-exam-days span').textContent=days===0?'امروز':days===1?'روز مانده':'روز مانده';card.querySelector('.home-exam-date span').textContent=persianShortDate(exam.date);card.querySelector('button').onclick=()=>{cursor=clampCalendarCursor(jalaliParts(new Date(exam.date+'T12:00:00')));drawCalendar();lernoNavigate('calendar')};box.append(card)
  }
  function tomorrowSchoolDate(){let date=new Date();date.setDate(date.getDate()+1);while(date.getDay()===5)date.setDate(date.getDate()+1);return date}
  function bagItemName(subject){let value=String(subject||'').trim();if(/ورزش/.test(value))return 'لباس و وسایل ورزش';if(/هنر|نقاشی/.test(value))return 'وسایل '+value;if(/آزمایش/.test(value))return 'وسایل '+value;return 'کتاب و دفتر '+value}
  function drawBag(){
    let box=$('#homeBagList'),status=$('#homeBagProgress'),dayLabel=$('#homeBagDay');if(!box||!status)return;let date=tomorrowSchoolDate(),key=ymd(date),day=schoolDayIndex(date),subjects=[...new Set(schedule.filter(item=>item.day===day&&item.subject).sort((a,b)=>(a.period||0)-(b.period||0)).map(item=>item.subject))],names=subjects.map(bagItemName),saved=JSON.parse(localStorage.getItem('lerno-bag-checks')||'{}'),checked=new Set((saved[key]||[]).filter(name=>names.includes(name)));box.innerHTML='';if(dayLabel)dayLabel.textContent='برنامهٔ '+weekDays[day];
    if(!subjects.length){let empty=document.createElement('div');empty.className='home-empty-state';empty.innerHTML='<span>برای '+weekDays[day]+' هنوز درسی ثبت نشده است.</span><button type="button">تنظیم برنامه هفتگی</button>';empty.querySelector('button').onclick=()=>lernoNavigate('schedule');box.append(empty);status.textContent='';return}
    subjects.forEach(subject=>{let name=bagItemName(subject),label=document.createElement('label');label.className='home-bag-row '+(checked.has(name)?'is-ready':'');let input=document.createElement('input');input.type='checkbox';input.checked=checked.has(name);let span=document.createElement('span');span.textContent=name;input.onchange=()=>{input.checked?checked.add(name):checked.delete(name);saved[key]=[...checked];localStorage.setItem('lerno-bag-checks',JSON.stringify(saved));label.classList.toggle('is-ready',input.checked);drawBagProgress()};label.append(input,span);box.append(label)});
    function drawBagProgress(){status.textContent=checked.size===subjects.length?'کیف فردا آماده است ✓':fa(subjects.length-checked.size)+' مورد باقی مانده است.'}drawBagProgress()
  }
  function drawQuickNote(){let notes=JSON.parse(localStorage.getItem('lerno-quick-notes')||'[]'),latest=notes[0],label=$('#homeLastNote');if(label)label.textContent=latest?latest.text:'یک نکته را همین‌جا نگه دار.'}
  function setupQuickNote(){let form=$('#homeQuickNoteForm'),input=$('#homeQuickNote');if(!form||!input)return;form.onsubmit=event=>{event.preventDefault();let text=input.value.trim();if(!text)return;let notes=JSON.parse(localStorage.getItem('lerno-quick-notes')||'[]');notes.unshift({id:Date.now(),text,date:new Date().toISOString()});localStorage.setItem('lerno-quick-notes',JSON.stringify(notes.slice(0,20)));input.value='';drawQuickNote();toast('یادداشت ذخیره شد ✓')}}
  function drawHome(){greeting();drawImportant();drawExam();drawBag();drawQuickNote()}
  window.lernoDrawHome=drawHome;
  const saveTasksBeforeHome=saveTasks;
  saveTasks=function(){saveTasksBeforeHome();drawHome()};
  const saveTodosBeforeHome=saveTodos;
  saveTodos=function(){saveTodosBeforeHome();drawHome()};
  const saveEntriesBeforeHome=saveCalendarEntries;
  saveCalendarEntries=function(){saveEntriesBeforeHome();drawHome()};
  const saveScheduleBeforeHome=saveSchedule;
  saveSchedule=function(){saveScheduleBeforeHome();drawHome()};
  const paintBeforeHome=paint;
  paint=function(){paintBeforeHome();greeting();drawBag()};
  setupQuickNote();drawHome();
})();
