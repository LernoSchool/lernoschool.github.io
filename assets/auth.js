(function(){
  const rawGet=Storage.prototype.getItem,rawSet=Storage.prototype.setItem,rawRemove=Storage.prototype.removeItem;
  const AUTH_ACCOUNTS='lerno-v26-auth-accounts',AUTH_SESSION='lerno-v26-auth-session',AUTH_LAST_PHONE='lerno-v26-auth-last-phone',ONBOARDING_KEY='lerno-v44-welcome-cards',ONBOARDING_DATA='lerno-v44-welcome-data',FRESH_START_KEY='lerno-v44-fresh-start-complete',TEN_DAYS=10*24*60*60*1000;
  const readRaw=key=>rawGet.call(localStorage,key),writeRaw=(key,value)=>rawSet.call(localStorage,key,value),removeRaw=key=>rawRemove.call(localStorage,key);
  /* یک بازنشانی آزمایشی برای دیدن تجربهٔ واقعی ورود اول در نسخهٔ ۴۴ */
  if(readRaw(FRESH_START_KEY)!=='yes'){
    for(let index=localStorage.length-1;index>=0;index--){const key=localStorage.key(index);if(key&&key.startsWith('lerno-'))removeRaw(key)}
    writeRaw(FRESH_START_KEY,'yes');
  }
  const parse=(value,fallback)=>{try{return JSON.parse(value)||fallback}catch{return fallback}};
  const normalizePhone=value=>String(value||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g,'').replace(/^98(?=9)/,'0');
  let session=parse(readRaw(AUTH_SESSION),null);
  const isValidSession=()=>session&&session.phone&&Date.now()-Number(session.lastSeen||0)<TEN_DAYS;
  if(!isValidSession()){session=null;removeRaw(AUTH_SESSION)}else{session.lastSeen=Date.now();writeRaw(AUTH_SESSION,JSON.stringify(session))}
  window.LERNO_AUTH={get session(){return session},rawGet:readRaw,rawSet:writeRaw,rawRemove:removeRaw};
  const scoped=key=>session&&String(key).startsWith('lerno-')?'lerno-v26-user-'+session.phone+'-'+key:key;
  Storage.prototype.getItem=function(key){return rawGet.call(this,scoped(key))};Storage.prototype.setItem=function(key,value){return rawSet.call(this,scoped(key),value)};Storage.prototype.removeItem=function(key){return rawRemove.call(this,scoped(key))};
  const hash=async text=>{const bytes=new TextEncoder().encode(text),digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('')};
  const gate=document.getElementById('authGate'),message=document.getElementById('authMessage');
  const showMessage=(text,type='error')=>{message.textContent=text;message.className='auth-message '+type};
  const accounts=()=>parse(readRaw(AUTH_ACCOUNTS),{}),saveAccounts=value=>writeRaw(AUTH_ACCOUNTS,JSON.stringify(value));
  function openApp(phone,name){session={phone,name,lastSeen:Date.now()};writeRaw(AUTH_LAST_PHONE,phone);writeRaw(AUTH_SESSION,JSON.stringify(session));location.reload()}
  function logoutDialog(){const modal=document.createElement('section');modal.className='auth-confirm';modal.innerHTML='<div class="auth-confirm-box"><h2>خروج از حساب</h2><p>آیا مطمئنید می‌خواهید از حساب خارج شوید؟</p><div><button type="button" class="auth-cancel">خیر</button><button type="button" class="auth-logout">بله، خارج شوم</button></div></div>';modal.querySelector('.auth-cancel').onclick=()=>modal.remove();modal.querySelector('.auth-logout').onclick=()=>{removeRaw(AUTH_SESSION);location.reload()};modal.onclick=event=>{if(event.target===modal)modal.remove()};document.body.append(modal)}
  gate.hidden=true;
  if(session){document.documentElement.classList.add('authenticated');setTimeout(()=>{const form=document.getElementById('profileForm');if(!form)return;const box=document.createElement('div');box.className='signed-account';box.innerHTML='<div><small>حساب فعال</small><b></b><span></span></div><button type="button">خروج از حساب</button>';box.querySelector('b').textContent=session.name||'دانش‌آموز LERNO';box.querySelector('span').textContent=session.phone.replace(/(\d{4})(\d{3})(\d{4})/,'$1 $2 $3');box.querySelector('button').onclick=logoutDialog;form.append(box)},0)}
  else document.documentElement.classList.add('guest-mode');

  /* ورود اختیاری از نوار بالای برنامه */
  const authTopButton=document.createElement('button');
  authTopButton.id='topAuthButtonV43';
  authTopButton.type='button';
  authTopButton.className='top-auth-v43';
  authTopButton.textContent=session?'حساب من':'ورود / ثبت‌نام';
  document.querySelector('.topbar .actions')?.prepend(authTopButton);
  const closeGate=()=>{gate.hidden=true;gate.classList.remove('auth-gate-window-v43')};
  let closeAuth=document.createElement('button');closeAuth.type='button';closeAuth.className='auth-close-v43';closeAuth.setAttribute('aria-label','بستن');closeAuth.textContent='×';gate.querySelector('.auth-panel')?.prepend(closeAuth);closeAuth.onclick=closeGate;
  const openAuth=tab=>{gate.hidden=false;gate.classList.add('auth-gate-window-v43');document.querySelector('[data-auth-tab="'+tab+'"]')?.click();setTimeout(()=>document.getElementById(tab==='register'?'registerName':'loginPhone')?.focus(),80)};
  authTopButton.onclick=()=>{if(session){if(typeof lernoNavigate==='function')lernoNavigate('profile');else document.querySelector('[data-page="profile"]')?.click()}else openAuth('login')};
  gate.addEventListener('click',event=>{if(event.target===gate)closeGate()});

  if(!session&&!Object.keys(accounts()).length){
    const notice=document.createElement('aside');notice.className='guest-notice-v43';notice.innerHTML='<div><b>هنوز حساب نساختی</b><span>می‌توانی فعلاً مهمان استفاده کنی و هر وقت خواستی ثبت‌نام کنی.</span></div><button class="guest-register-v43" type="button">ثبت‌نام</button><button class="guest-dismiss-v43" type="button" aria-label="بستن">×</button>';
    document.querySelector('#home .home-dashboard-head')?.after(notice);
    notice.querySelector('.guest-register-v43').onclick=()=>openAuth('register');notice.querySelector('.guest-dismiss-v43').onclick=()=>notice.remove();
  }
  document.querySelectorAll('[data-auth-tab]').forEach(button=>button.onclick=()=>{document.querySelectorAll('[data-auth-tab]').forEach(x=>x.classList.toggle('active',x===button));const register=button.dataset.authTab==='register';document.getElementById('loginForm').hidden=register;document.getElementById('registerForm').hidden=!register;document.getElementById('authTitle').textContent=register?'ساخت حساب':'ورود به LERNO';showMessage('')});
  const gradeOptions=['اول ابتدایی','دوم ابتدایی','سوم ابتدایی','چهارم ابتدایی','پنجم ابتدایی','ششم ابتدایی','هفتم','هشتم','نهم','دهم','یازدهم','دوازدهم'];
  const gradeMode=grade=>{const index=gradeOptions.indexOf(grade);return index<0?'':index<3?'early':index<6?'upper':index<9?'middle':'high'};
  function showPersonalizedOnboarding(){
    if(readRaw(ONBOARDING_KEY)==='done')return;
    const answers=parse(readRaw(ONBOARDING_DATA),{});
    const steps=[
      {type:'intro',icon:'✦',title:'مدرسه‌ات را ساده‌تر مدیریت کن',text:'تکلیف‌ها، برنامهٔ هفتگی، آزمون‌ها و کارهای مهمت را در یک جای مرتب داشته باش.'},
      {type:'choice',key:'source',icon:'⌕',title:'لرنو را از کجا پیدا کردی؟',text:'یک گزینه را انتخاب کن.',options:['دوستان یا خانواده','مدرسه یا معلم','جست‌وجوی اینترنتی','شبکه‌های اجتماعی','جای دیگر']},
      {type:'grade',key:'grade',icon:'⌂',title:'کلاس چندمی هستی؟',text:'تا درس‌ها و فضای برنامه برای پایهٔ تو آماده شود.',options:gradeOptions},
      {type:'choice',key:'goal',icon:'◎',title:'بیشتر برای چه کاری به لرنو نیاز داری؟',text:'بعداً هر زمان خواستی می‌توانی همهٔ بخش‌ها را استفاده کنی.',options:['تکلیف‌هایم را فراموش نکنم','برای امتحان آماده شوم','برنامهٔ مدرسه‌ام مرتب باشد','زمان مطالعه‌ام منظم شود','همهٔ این موارد']},
      {type:'name',key:'name',icon:'☺',title:'دوست داری چطور صدایت کنیم؟',text:'نامت را بنویس تا لرنو برای خودت شخصی‌تر شود.'},
      {type:'finish',icon:'✓',title:'لرنو برای تو آماده است',text:'حالا می‌توانی مستقیم وارد خانه شوی و استفاده را شروع کنی.'}
    ];
    let index=0,overlay=document.createElement('section');overlay.className='lerno-onboarding';overlay.id='lernoOnboarding';overlay.setAttribute('aria-label','شروع کار با لرنو');overlay.innerHTML='<div class="ob-shell"><header class="ob-top"><div class="ob-brand"><img src="./assets/lerno-focus-orbit-v14-192.png" alt="لوگوی لرنو"><b>LER<span>NO</span></b></div><div class="ob-account-actions"><button type="button" data-ob-login>ورود</button><button type="button" class="primary" data-ob-register>ثبت‌نام</button></div></header><article class="ob-card"><div class="ob-progress" aria-hidden="true"><i id="obProgress"></i></div><small id="obStep"></small><div id="obIcon" class="ob-icon"></div><h1 id="obTitle"></h1><p id="obText"></p><div id="obStage" class="ob-stage"></div><p id="obError" class="ob-error" role="alert"></p><footer class="ob-footer"><button id="obBack" class="ob-back" type="button">قبلی</button><button id="obNext" class="ob-next" type="button">ادامه <span>←</span></button></footer></article></div>';
    document.body.append(overlay);gate.hidden=true;
    const save=()=>writeRaw(ONBOARDING_DATA,JSON.stringify(answers));
    const finish=tab=>{save();writeRaw(ONBOARDING_KEY,'done');overlay.remove();if(!tab){const current=parse(localStorage.getItem('lerno-open-profile'),{});if(!current.name&&!current.grade)localStorage.setItem('lerno-open-profile',JSON.stringify({...current,name:answers.name||'',grade:answers.grade||'',school:'',year:'۱۴۰۵/۱۴۰۶',image:'',avatar:'',locked:false,onboardingSource:answers.source||'',onboardingGoal:answers.goal||'',experienceMode:gradeMode(answers.grade)}));location.reload();return}gate.hidden=false;gate.classList.add('auth-gate-window-v43');document.querySelector('[data-auth-tab="'+tab+'"]').click();if(tab==='register'&&answers.name)document.getElementById('registerName').value=answers.name;setTimeout(()=>document.getElementById(tab==='register'?'registerName':'loginPhone').focus(),80)};
    const choose=(key,value,button)=>{answers[key]=value;save();overlay.querySelectorAll('.ob-option').forEach(item=>item.classList.toggle('selected',item===button));overlay.querySelector('#obError').textContent=''};
    function render(){
      const step=steps[index],stage=overlay.querySelector('#obStage'),last=step.type==='finish';
      overlay.querySelector('#obProgress').style.width=((index+1)/steps.length*100)+'%';overlay.querySelector('#obStep').textContent='مرحله '+(index+1)+' از '+steps.length;overlay.querySelector('#obIcon').textContent=step.icon;overlay.querySelector('#obTitle').textContent=step.title;overlay.querySelector('#obText').textContent=step.text;overlay.querySelector('#obError').textContent='';stage.innerHTML='';
      if(step.type==='intro'){stage.innerHTML='<div class="ob-feature-grid"><div><b>✓</b><span>تکلیف و کارها</span></div><div><b>▦</b><span>برنامهٔ هفتگی</span></div><div><b>★</b><span>آزمون و پیشرفت</span></div></div>'}
      if(step.type==='choice'||step.type==='grade'){const grid=document.createElement('div');grid.className=step.type==='grade'?'ob-options ob-grade-grid':'ob-options';step.options.forEach(option=>{const button=document.createElement('button');button.type='button';button.className='ob-option';button.classList.toggle('selected',answers[step.key]===option);button.innerHTML='<span></span><b></b>';button.querySelector('span').textContent=option;button.querySelector('b').textContent='✓';button.onclick=()=>choose(step.key,option,button);grid.append(button)});stage.append(grid)}
      if(step.type==='name'){const input=document.createElement('input');input.className='ob-name-input';input.type='text';input.maxLength=40;input.autocomplete='name';input.placeholder='مثلاً آوا';input.value=answers.name||'';input.setAttribute('aria-label','نام شما');input.oninput=()=>{answers.name=input.value.trim();save();overlay.querySelector('#obError').textContent=''};stage.append(input);setTimeout(()=>input.focus(),50)}
      if(last){const modeLabels={early:'ساده و تصویری',upper:'روشن و مرحله‌ای',middle:'برنامه‌ریزی کامل',high:'برنامه‌ریزی پیشرفته'},summary=document.createElement('div');summary.className='ob-summary';summary.innerHTML='<div><small>پایه</small><b></b></div><div><small>هدف اصلی</small><b></b></div><div><small>نوع تجربه</small><b></b></div>';summary.children[0].querySelector('b').textContent=answers.grade||'انتخاب نشده';summary.children[1].querySelector('b').textContent=answers.goal||'همهٔ امکانات';summary.children[2].querySelector('b').textContent=modeLabels[gradeMode(answers.grade)];stage.append(summary)}
      overlay.querySelector('#obBack').hidden=index===0;overlay.querySelector('#obNext').innerHTML=last?'شروع استفاده <span>←</span>':'ادامه <span>←</span>';
    }
    const next=()=>{const step=steps[index];if(step.key&&!answers[step.key]){overlay.querySelector('#obError').textContent=step.type==='name'?'لطفاً نامت را بنویس.':'لطفاً یک گزینه را انتخاب کن.';return}if(step.type==='finish')return finish();if(index<steps.length-1){index++;render()}};
    overlay.querySelector('[data-ob-login]').onclick=()=>finish('login');overlay.querySelector('[data-ob-register]').onclick=()=>finish('register');overlay.querySelector('#obBack').onclick=()=>{if(index>0){index--;render()}};overlay.querySelector('#obNext').onclick=next;render();
  }
  showPersonalizedOnboarding();
  const hasSavedAccount=Object.keys(accounts()).length>0;
  const loginPhone=document.getElementById('loginPhone'),changeAccount=document.getElementById('changeAccount');
  if(hasSavedAccount){document.querySelector('.auth-tabs').hidden=true;document.getElementById('loginForm').hidden=false;document.getElementById('registerForm').hidden=true;document.getElementById('authTitle').textContent='ورود به LERNO';changeAccount.hidden=false;loginPhone.readOnly=true}
  loginPhone.value=readRaw(AUTH_LAST_PHONE)||'';
  changeAccount.onclick=()=>{const tabs=document.querySelector('.auth-tabs'),registerTab=document.querySelector('[data-auth-tab="register"]');tabs.hidden=false;registerTab.click();document.getElementById('registerName').focus()};
  document.querySelectorAll('[data-password-eye]').forEach(button=>button.onclick=()=>{const input=document.getElementById(button.dataset.passwordEye),show=input.type==='password';input.type=show?'text':'password';button.classList.toggle('showing',show);button.setAttribute('aria-label',show?'پنهان‌کردن رمز عبور':'نمایش رمز عبور')});
  document.getElementById('registerForm').onsubmit=async event=>{event.preventDefault();const name=document.getElementById('registerName').value.trim(),phone=normalizePhone(document.getElementById('registerPhone').value),secret=document.getElementById('registerSecret').value,again=document.getElementById('registerSecretAgain').value;if(!name)return showMessage('نام و نام خانوادگی را وارد کن.');if(!/^09\d{9}$/.test(phone))return showMessage('شماره موبایل را به شکل صحیح وارد کن.');if(secret.length<6)return showMessage('رمز عبور باید حداقل ۶ حرف یا عدد داشته باشد.');if(secret!==again)return showMessage('رمزهای عبور یکسان نیستند.');const list=accounts(),onboarding=parse(readRaw(ONBOARDING_DATA),{});if(list[phone])return showMessage('برای این شماره قبلاً حساب ساخته شده است.');list[phone]={name,secretHash:await hash(secret),createdAt:Date.now()};saveAccounts(list);writeRaw('lerno-v26-user-'+phone+'-lerno-open-profile',JSON.stringify({name,grade:onboarding.grade||'',school:'',year:'۱۴۰۵/۱۴۰۶',image:'',avatar:'',locked:false,onboardingSource:onboarding.source||'',onboardingGoal:onboarding.goal||'',experienceMode:gradeMode(onboarding.grade)}));removeRaw(ONBOARDING_DATA);openApp(phone,name)};
  document.getElementById('loginForm').onsubmit=async event=>{event.preventDefault();const phone=normalizePhone(document.getElementById('loginPhone').value),secret=document.getElementById('loginSecret').value,list=accounts(),account=list[phone];if(!/^09\d{9}$/.test(phone))return showMessage('شماره موبایل را به شکل صحیح وارد کن.');if(secret.length<6)return showMessage('رمز عبور باید حداقل ۶ حرف یا عدد داشته باشد.');if(!account||account.secretHash!==await hash(secret))return showMessage('شماره موبایل یا رمز عبور درست نیست.');openApp(phone,account.name)};
})();
