/* STACKLY — navigation.js : sticky behaviors, mobile menu a11y, search overlay */
(function(){"use strict";
const $=(s,c=document)=>c.querySelector(s);
/* Esc closes mobile menu */
addEventListener('keydown',e=>{
  const m=$('.mobile-menu'); if(e.key==='Escape'&&m&&m.classList.contains('open')){$('.burger')?.click();}
});
/* Focus trap-ish: return focus to burger */
const b=$('.burger'),m=$('.mobile-menu');
if(b&&m){const obs=new MutationObserver(()=>{if(m.classList.contains('open'))b.focus();});obs.observe(m,{attributes:true});}
})();
