/* STACKLY — main.js : preloader, nav, cursor, counters, accordions, tilt, magnetic, page transitions */
(function(){
"use strict";
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Preloader ---------- */
const pre=$('#preloader');
function bootSite(){document.body.classList.add('loaded');window.dispatchEvent(new Event('stackly:ready'));}
if(pre){
  if(reduced){pre.remove();bootSite();}
  else{
    document.body.style.overflow='hidden';
    const pct=$('.pl-pct'), bar=$('.pl-bar i');
    let p={v:0};
    const tl=window.gsap?gsap.timeline():null;
    const finish=()=>{pre.classList.add('done');
      if(window.gsap){gsap.to(pre,{yPercent:-100,duration:1,ease:'power4.inOut',onComplete:()=>{pre.remove();bootSite();}});}
      else{pre.remove();bootSite();}
      document.body.style.overflow='';
    };
    if(tl){
      tl.to('#preloader .pl-logo span',{y:0,duration:.9,stagger:.05,ease:'power4.out'})
        .to('#preloader .pl-sub',{opacity:1,duration:.6},'-=.4')
        .to(p,{v:100,duration:1.6,ease:'power2.inOut',onUpdate:()=>{pct.textContent=Math.round(p.v)+'%';bar.style.transform=`scaleX(${p.v/100})`;}},'-=.6')
        .add(finish,'+=.15');
    } else {setTimeout(finish,600);}
  }
}else bootSite();

/* ---------- Navigation ---------- */
const nav=$('.nav');
const onScroll=()=>{ if(nav) nav.classList.toggle('scrolled',scrollY>40);
  const sp=$('.scroll-progress'); if(sp){const h=document.documentElement;sp.style.width=(scrollY/(h.scrollHeight-h.clientHeight)*100)+'%';}
};
addEventListener('scroll',onScroll,{passive:true}); onScroll();

const burger=$('.burger'), mmenu=$('.mobile-menu');
if(burger&&mmenu){
  const setMenu=open=>{
    mmenu.classList.toggle('open',open);
    burger.classList.toggle('open',open);
    document.body.style.overflow=open?'hidden':'';
    burger.setAttribute('aria-expanded',open);
    if(open&&window.gsap&&!reduced){
      gsap.fromTo('.mm-top',{y:-16,opacity:0},{y:0,opacity:1,duration:.5,ease:'power3.out'});
      gsap.fromTo('.mm-link',{y:34,opacity:0},{y:0,opacity:1,duration:.7,stagger:.06,ease:'power3.out',delay:.15});
      gsap.fromTo('.mm-bottom',{y:24,opacity:0},{y:0,opacity:1,duration:.6,ease:'power3.out',delay:.4});
    }
  };
  burger.addEventListener('click',()=>setMenu(!mmenu.classList.contains('open')));
  const closeMenu=()=>setMenu(false);
  const mmc=$('.mm-close',mmenu); if(mmc)mmc.addEventListener('click',closeMenu);
  $$('.mm-link',mmenu).forEach(a=>a.addEventListener('click',closeMenu));
  const mms=$('.mm-search input',mmenu);
  if(mms)mms.addEventListener('keydown',e=>{if(e.key==='Enter'&&mms.value.trim())location.href='blog.html?q='+encodeURIComponent(mms.value.trim());});
}

/* search */
const navSearch=$('.nav-search input');
if(navSearch){navSearch.addEventListener('keydown',e=>{if(e.key==='Enter'&&navSearch.value.trim())location.href='blog.html?q='+encodeURIComponent(navSearch.value.trim());});}
const langBtn=$('.lang-btn');
if(langBtn){langBtn.addEventListener('click',()=>{langBtn.querySelector('span').textContent=langBtn.querySelector('span').textContent==='En'?'Fr':'En';});}

/* ---------- Page transitions ---------- */
if(window.gsap&&!reduced){
  $$('a[href$=".html"]').forEach(a=>{
    if(a.target==='_blank'||a.href.includes('#'))return;
    a.addEventListener('click',e=>{
      const url=new URL(a.href); if(url.pathname===location.pathname)return;
      e.preventDefault();
      gsap.to('body',{opacity:0,y:-14,filter:'blur(6px)',duration:.4,ease:'power2.in',onComplete:()=>location.href=a.href});
    });
  });
  addEventListener('pageshow',e=>{if(e.persisted)gsap.set('body',{opacity:1,y:0,filter:'none'});});
}

/* ---------- Custom cursor ---------- */
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced){
  document.body.classList.add('has-cursor');
  const dot=document.createElement('div'),ring=document.createElement('div');
  dot.className='cursor-dot';ring.className='cursor-ring';document.body.append(dot,ring);
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    document.documentElement.style.setProperty('--mx',mx+'px');document.documentElement.style.setProperty('--my',my+'px');});
  (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;requestAnimationFrame(loop);})();
  $$('a,button,.case,.post,.bento-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('grow'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('grow'));
  });
  const spot=$('.spotlight'); if(spot)addEventListener('mousemove',()=>spot.style.opacity=1);
}

/* ---------- Magnetic buttons ---------- */
if(matchMedia('(hover:hover)').matches&&!reduced){
  $$('.btn, .hero-arrow, .p-arr, .b-arr').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();
      el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.22}px)`;});
    el.addEventListener('mouseleave',()=>el.style.transform='');
  });
}

/* ---------- 3D tilt ---------- */
if(matchMedia('(hover:hover)').matches&&!reduced){
  $$('[data-tilt]').forEach(card=>{
    card.style.transition='transform .2s ease-out';card.style.transformStyle='preserve-3d';
    card.addEventListener('mousemove',e=>{const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-4px)`;});
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

/* ---------- Counters ---------- */
const counters=$$('.cnt');
if(counters.length){
  const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;io.unobserve(en.target);
    const el=en.target,end=parseFloat(el.dataset.count),dec=(el.dataset.count.split('.')[1]||'').length,suf=el.dataset.suffix||'';
    const t0=performance.now(),dur=1800;
    (function tick(t){const p=Math.min((t-t0)/dur,1),e=1-Math.pow(1-p,4);
      el.textContent=(end*e).toFixed(dec)+suf; if(p<1)requestAnimationFrame(tick);})(t0);
  }),{threshold:.5});
  counters.forEach(c=>io.observe(c));
}

/* ---------- FAQ accordion ---------- */
$$('.faq-item').forEach(item=>{
  const q=$('.faq-q',item),a=$('.faq-a',item);
  q.addEventListener('click',()=>{
    const open=item.classList.contains('open');
    $$('.faq-item.open').forEach(o=>{o.classList.remove('open');$('.faq-a',o).style.maxHeight=0;});
    if(!open){item.classList.add('open');a.style.maxHeight=a.scrollHeight+'px';}
  });
});

/* ---------- Pricing toggle ---------- */
const ptoggle=$('.toggle');
if(ptoggle){
  const btns=$$('button',ptoggle);
  btns.forEach((b,i)=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.classList.remove('on'));b.classList.add('on');
    ptoggle.classList.toggle('yearly',i===1);
    const yearly=i===1;
    $$('.p-amount').forEach(el=>{
      const target=parseFloat(yearly?el.dataset.yearly:el.dataset.monthly);
      const cur=parseFloat(el.textContent)||0,t0=performance.now();
      (function tick(t){const p=Math.min((t-t0)/600,1),e=1-Math.pow(1-p,3);
        el.textContent=Math.round(cur+(target-cur)*e).toLocaleString();
        if(p<1)requestAnimationFrame(tick);})(t0);
    });
    $$('.p-per-label').forEach(el=>el.textContent=yearly?'/ year, billed annually':'/ month');
  }));
}

/* ---------- Newsletter fake submit ---------- */
$$('.js-news').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();
  const i=$('input',f); if(i.checkValidity()){f.innerHTML='<p style="color:var(--sage-2);font-weight:700">Subscribed — welcome to the intelligence briefing.</p>';}
  else i.reportValidity();
}));

/* ---------- Flow steps light up ---------- */
const fsteps=$$('.flow-step');
if(fsteps.length){const io=new IntersectionObserver(es=>es.forEach((en)=>{if(en.isIntersecting){setTimeout(()=>en.target.classList.add('lit'),[...fsteps].indexOf(en.target)*220);io.unobserve(en.target);}}),{threshold:.4});fsteps.forEach(s=>io.observe(s));}

/* ---------- Spotlight ---------- */
if($('.spotlight')&&matchMedia('(hover:hover)').matches){document.body.insertAdjacentHTML('afterbegin','<div class="spotlight"></div>');}

/* ---------- 404 ---------- */
const back404=$('[data-back]');
if(back404 && back404.dataset.stacklyBackBound !== 'true'){
  back404.dataset.stacklyBackBound='true';
  back404.addEventListener('click',e=>{
    e.preventDefault();
    if(back404.dataset.processing === 'true') return;
    back404.dataset.processing='true';
    if(history.length > 1){ history.back(); return; }
    const previousPage = sessionStorage.getItem('404PreviousPage');
    if(previousPage){
      sessionStorage.removeItem('404PreviousPage');
      location.href = previousPage;
      return;
    }
    const referrer = document.referrer || '';
    if(referrer && !referrer.includes('/404.html')){ location.href = referrer; return; }
    location.href='index.html';
  });
}
const search404=$('.search-box');
if(search404)search404.addEventListener('submit',e=>{e.preventDefault();const v=$('input',search404).value.trim();
  if(v)location.href='blog.html?q='+encodeURIComponent(v);});

/* ---------- Active nav link ---------- */
const here=location.pathname.split('/').pop()||'index.html';
$$('.nav-links a, .mobile-menu a').forEach(a=>{if(a.getAttribute('href')===here)a.classList.add('active');});
})();
