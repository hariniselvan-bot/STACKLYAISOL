/* STACKLY — animations.js : GSAP hero timeline, ScrollTrigger scenes, guaranteed-reveal fallbacks */
(function(){
"use strict";
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MOB=matchMedia('(max-width:768px)').matches;
const DY=MOB?22:56;
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

/* ---------- GUARANTEED REVEAL: never leave content hidden ---------- */
function revealAll(){
  $$('.js [data-reveal], .js .hero-title .line>span, .js .reveal-line>span, .js .mm-link, .js .img-mask, [data-reveal], .hero-title .line>span, .img-mask')
    .forEach(el=>{el.style.opacity='1';el.style.transform='none';el.style.clipPath='none';el.style.visibility='visible';});
  $$('[data-stagger]').forEach(g=>[...g.children].forEach(el=>{el.style.opacity='1';el.style.transform='none';}));
  const hv=$('.hero-visual'); if(hv){hv.style.opacity='1';hv.style.transform='none';}
  $$('.hero-card').forEach(c=>{c.style.opacity='';c.style.transform='';});
  $$('.hero-badge,.hero-copy,.hero-ctas,.trust,.scroll-hint,.nav').forEach(el=>{el.style.opacity='1';el.style.transform='none';});
  document.body.classList.add('revealed');
}

/* ---------- Environment checks ---------- */
const hasGSAP=!!window.gsap, hasST=!!window.ScrollTrigger;
if(window.AOS&&window.AOS.init)AOS.init({duration:MOB?700:900,easing:'ease-out-cubic',once:true,offset:MOB?40:80,disable:reduced});
if(!hasGSAP||!hasST||reduced){
  revealAll();
  return; // everything stays visible, page fully functional without animation
}
try{gsap.registerPlugin(ScrollTrigger);}catch(e){revealAll();return;}

/* Safety net: if anything below throws or ScrollTriggers never fire, reveal after 3s */
let revealed=false;
function safeReveal(){if(revealed)return;revealed=true;revealAll();}
setTimeout(()=>{ // if user has scrolled near bottom and reveals didn't run, force show
  $$('[data-reveal],[data-stagger]').forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top<innerHeight&&getComputedStyle(el).opacity==='0')safeReveal();
  });
},3000);
addEventListener('load',()=>{ScrollTrigger.refresh();
  setTimeout(()=>{ // post-load audit: any element still hidden in viewport gets revealed
    $$('[data-reveal]').forEach(el=>{const r=el.getBoundingClientRect();
      if(r.top<innerHeight&&r.bottom>0&&getComputedStyle(el).opacity==='0'){el.style.opacity='1';el.style.transform='none';}});
  },600);
});

/* ---------- HERO TIMELINE ---------- */
addEventListener('stackly:ready',()=>{
  if(!$('.hero'))return;
  const tl=gsap.timeline({defaults:{ease:'power4.out'},onComplete:()=>{revealed=true;}});
  tl.fromTo('.nav',{y:-30,opacity:0},{y:0,opacity:1,duration:1})
    .to('.hero-title .line>span',{y:0,duration:1.3,stagger:.12,ease:'expo.out'},'-=.55')
    .fromTo('.hero-visual',{opacity:0,scale:.85,rotateY:18},{opacity:1,scale:1,rotateY:0,duration:1.5,ease:'expo.out',transformPerspective:1200},'-=.9')
    .fromTo('.hero-card.hc-1',{y:100,opacity:0,scale:.88,rotate:-18},{y:0,opacity:1,scale:1,rotate:-10,duration:1.5,ease:'expo.out'},'-=1.15')
    .fromTo('.hero-card.hc-2',{y:100,opacity:0,scale:.88,rotate:14},{y:0,opacity:1,scale:1,rotate:8,duration:1.5,ease:'expo.out'},'-=1.3')
    .fromTo('.hero-badge',{y:36,opacity:0},{y:0,opacity:1,duration:.9,stagger:.15,ease:'power3.out'},'-=.9')
    .fromTo('.hero-copy,.hero-ctas,.trust',{y:34,opacity:0},{y:0,opacity:1,duration:1,stagger:.12},'-=.7')
    .fromTo('.scroll-hint',{opacity:0},{opacity:1,duration:.8},'-=.4');
  gsap.to('.hero-visual',{yPercent:-16,scale:.94,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('.hero-title',{yPercent:22,opacity:.25,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  if(matchMedia('(hover:hover)').matches){
    const hx=gsap.quickTo('.hero-visual','x',{duration:.9,ease:'power3'}),
          hy=gsap.quickTo('.hero-visual','y',{duration:.9,ease:'power3'}),
          b1=gsap.quickTo('.hb-1','x',{duration:1.2,ease:'power3'}),
          b2=gsap.quickTo('.hb-2','x',{duration:1.2,ease:'power3'});
    addEventListener('mousemove',e=>{const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;
      hx(nx*26);hy(ny*20);b1(nx*-16);b2(nx*16);});
  }
  gsap.to('.hc-3',{y:-12,duration:3.6,yoyo:true,repeat:-1,ease:'sine.inOut'});
  gsap.to('.hc-1',{y:-8,duration:4.6,yoyo:true,repeat:-1,ease:'sine.inOut',delay:.6});
  gsap.to('.hc-2',{y:-9,duration:5.2,yoyo:true,repeat:-1,ease:'sine.inOut',delay:1.1});
  gsap.to('.hero-arrow',{rotate:360,duration:18,repeat:-1,ease:'none'});
},{once:true});

/* ---------- Generic reveals ---------- */
$$('[data-reveal="up"]').forEach(el=>gsap.fromTo(el,{y:DY,opacity:0},{y:0,opacity:1,duration:1.1,ease:'power3.out',
  scrollTrigger:{trigger:el,start:'top 88%',once:true,
    onLeave:()=>{},onEnter:()=>{el.style.opacity='1';}}}));
$$('[data-reveal="left"]').forEach(el=>gsap.fromTo(el,{x:MOB?-22:-56,opacity:0},{x:0,opacity:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
$$('[data-reveal="right"]').forEach(el=>gsap.fromTo(el,{x:MOB?22:56,opacity:0},{x:0,opacity:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
$$('[data-reveal="scale"]').forEach(el=>gsap.fromTo(el,{scale:.92,opacity:0},{scale:1,opacity:1,duration:1.2,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
$$('[data-stagger]').forEach(group=>{
  gsap.fromTo(group.children,{y:MOB?20:48,opacity:0},{y:0,opacity:1,duration:1,stagger:.1,ease:'power3.out',
    scrollTrigger:{trigger:group,start:'top 86%',once:true},
    onComplete:()=>[...group.children].forEach(c=>c.style.transform='none')});
});
$$('.img-mask').forEach(el=>gsap.to(el,{clipPath:'inset(0 0 0% 0)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 85%',once:true}}));

/* ---------- Horizontal showcase (desktop only, safe pin) ---------- */
const track=$('.hs-track');
if(track&&innerWidth>992){
  const dist=()=>Math.max(0,track.scrollWidth-innerWidth+80);
  if(dist()>100){
    gsap.to(track,{x:()=>-dist(),ease:'none',
      scrollTrigger:{trigger:'.showcase',start:'top top',end:()=>'+='+dist(),scrub:1,pin:true,
        anticipatePin:1,invalidateOnRefresh:true,
        onRefresh:self=>{if(self.end<=self.start)self.kill();}}});
  }
}
/* ---------- Flow word cycle ---------- */
const words=$$('.flow-word');
if(words.length){gsap.set(words[0],{opacity:1,scale:1});let i=0;
  setInterval(()=>{gsap.to(words[i],{opacity:0,scale:.94,duration:.5});
    i=(i+1)%words.length;gsap.to(words[i],{opacity:1,scale:1,duration:.7,ease:'power3.out'});},2600);}
/* ---------- Case image parallax ---------- */
$$('.case img,.sol-card img').forEach(img=>gsap.fromTo(img,{yPercent:-5},{yPercent:5,ease:'none',
  scrollTrigger:{trigger:img.closest('.case,.sol-card'),start:'top bottom',end:'bottom top',scrub:true}}));

/* ---------- SVG decorations: draw, rotate, float ---------- */
$$('.svg-deco .spin').forEach(el=>gsap.to(el,{rotation:360,duration:44,repeat:-1,ease:'none'}));
$$('.svg-deco .draw').forEach(pt=>{
  try{const L=pt.getTotalLength();
    gsap.set(pt,{strokeDasharray:L,strokeDashoffset:L});
    gsap.to(pt,{strokeDashoffset:0,duration:2.4,ease:'power2.out',
      scrollTrigger:{trigger:pt.closest('section,main,div'),start:'top 88%',once:true}});
  }catch(e){}
});
$$('.svg-deco .floaty').forEach((el,i)=>gsap.to(el,{y:i%2?-9:9,duration:5+i,yoyo:true,repeat:-1,ease:'sine.inOut'}));
/* ---------- AOS initialized at top (sections use data-aos) ---------- */
})();
