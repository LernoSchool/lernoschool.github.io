(()=>{
  const sidebar=document.getElementById('sidebar');
  const menu=document.getElementById('menu');
  if(sidebar&&menu){
    const backdrop=document.createElement('button');
    backdrop.type='button';
    backdrop.className='mobile-nav-backdrop-v45';
    backdrop.setAttribute('aria-label','بستن منو');
    document.body.appendChild(backdrop);
    const closeBtn=document.createElement('button');
    closeBtn.type='button';
    closeBtn.className='mobile-nav-close-v45';
    closeBtn.setAttribute('aria-label','بستن منو');
    closeBtn.textContent='×';
    sidebar.appendChild(closeBtn);
    const sync=()=>{const open=sidebar.classList.contains('open')&&innerWidth<=860;backdrop.classList.toggle('open',open);document.body.classList.toggle('menu-open-v45',open);menu.setAttribute('aria-expanded',String(open));};
    menu.addEventListener('click',()=>requestAnimationFrame(sync));
    const close=()=>{sidebar.classList.remove('open');sync()};
    backdrop.addEventListener('click',close);closeBtn.addEventListener('click',close);
    sidebar.querySelectorAll('[data-page]').forEach(x=>x.addEventListener('click',close));
    addEventListener('resize',()=>{if(innerWidth>860)close();});
  }
  const guestLabel=()=>{if(window.LERNO_AUTH?.session)return;document.querySelectorAll('#sidebar [data-page="profile"] span').forEach(x=>x.textContent='ورود / ثبت‌نام');};
  guestLabel();
  addEventListener('resize',()=>{document.documentElement.scrollLeft=0;document.body.scrollLeft=0;});
})();
