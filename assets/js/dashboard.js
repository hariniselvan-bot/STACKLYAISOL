/* STACKLY — dashboard.js : charts (vanilla canvas), sidebar, tabs, tables */
(function(){"use strict";
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

/* sidebar */
const burger=$('.dash-burger'),side=$('.dash-side');
if(burger&&side)burger.addEventListener('click',()=>side.classList.toggle('open'));
$$('.ds-link',side||document).forEach(l=>l.addEventListener('click',()=>side&&side.classList.remove('open')));

/* profile from localStorage */
const u=JSON.parse(localStorage.getItem('stackly_user')||'null');
$$('.js-user-name').forEach(el=>el.textContent=u&&u.name?u.name.split(' ')[0]:(u&&u.email?u.email.split('@')[0]:'Alex'));
$$('.js-user-email').forEach(el=>el.textContent=u?u.email:'alex@stackly.ai');
$$('.js-user-role').forEach(el=>el.textContent=u&&u.role==='admin'?'Administrator':'Pro Member');
$$('.js-user-initial').forEach(el=>el.textContent=(u&&u.name?u.name:u&&u.email?u.email:'A')[0].toUpperCase());
$$('.js-logout').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();localStorage.removeItem('stackly_user');location.href='login.html';}));

/* ---------- canvas charts ---------- */
function prep(cv){const d=devicePixelRatio||1,r=cv.getBoundingClientRect();
  cv.width=r.width*d;cv.height=r.height*d;const x=cv.getContext('2d');x.scale(d,d);return x;}
function lineChart(cv,labels,data,opts={}){
  if(!cv)return;const x=prep(cv),W=cv.getBoundingClientRect().width,H=cv.getBoundingClientRect().height;
  const pad={l:8,r:8,t:14,b:22},max=Math.max(...data)*1.15;
  const px=i=>pad.l+i*(W-pad.l-pad.r)/(data.length-1), py=v=>H-pad.b-(v/max)*(H-pad.t-pad.b);
  x.strokeStyle='rgba(23,37,29,.07)';x.lineWidth=1;
  for(let g=0;g<4;g++){const y=pad.t+g*(H-pad.t-pad.b)/3;x.beginPath();x.moveTo(pad.l,y);x.lineTo(W-pad.r,y);x.stroke();}
  const col=opts.color||'#6F1025';
  const grad=x.createLinearGradient(0,pad.t,0,H);grad.addColorStop(0,col+'33');grad.addColorStop(1,col+'00');
  x.beginPath();data.forEach((v,i)=>i?x.lineTo(px(i),py(v)):x.moveTo(px(i),py(v)));
  x.lineTo(px(data.length-1),H-pad.b);x.lineTo(px(0),H-pad.b);x.closePath();x.fillStyle=grad;x.fill();
  x.beginPath();data.forEach((v,i)=>i?x.lineTo(px(i),py(v)):x.moveTo(px(i),py(v)));
  x.strokeStyle=col;x.lineWidth=2.5;x.lineJoin='round';x.stroke();
  x.fillStyle='#687661';x.font='10px Manrope';x.textAlign='center';
  labels.forEach((l,i)=>{if(i%Math.ceil(labels.length/7)===0)x.fillText(l,px(i),H-6);});
  const last=px(data.length-1),ly=py(data[data.length-1]);
  x.beginPath();x.arc(last,ly,4,0,7);x.fillStyle=col;x.fill();
  x.beginPath();x.arc(last,ly,8,0,7);x.fillStyle=col+'33';x.fill();
}
function bars(cv,labels,data,opts={}){
  if(!cv)return;const x=prep(cv),W=cv.getBoundingClientRect().width,H=cv.getBoundingClientRect().height;
  const pad={l:8,r:8,t:14,b:22},max=Math.max(...data)*1.15,bw=(W-pad.l-pad.r)/data.length;
  data.forEach((v,i)=>{const h=(v/max)*(H-pad.t-pad.b),bx=pad.l+i*bw+bw*.22;
    x.fillStyle=opts.color||'rgba(104,118,97,.75)';if(i===data.length-1)x.fillStyle='#6F1025';
    x.beginPath();x.roundRect(bx,H-pad.b-h,bw*.56,h,[5,5,0,0]);x.fill();});
  x.fillStyle='#687661';x.font='10px Manrope';x.textAlign='center';
  labels.forEach((l,i)=>{if(i%Math.ceil(labels.length/7)===0)x.fillText(l,pad.l+i*bw+bw/2,H-6);});
}
function donut(cv,parts){
  if(!cv)return;const x=prep(cv),W=cv.getBoundingClientRect().width,H=cv.getBoundingClientRect().height;
  const cx=W/2,cy=H/2,r=Math.min(W,H)/2-12;let a=-Math.PI/2;
  const tot=parts.reduce((s,p)=>s+p.v,0);
  parts.forEach(p=>{const a2=a+p.v/tot*Math.PI*2;
    x.beginPath();x.arc(cx,cy,r,a,a2);x.lineWidth=22;x.strokeStyle=p.c;x.stroke();a=a2;});
  x.fillStyle='#17251D';x.font='600 22px Fraunces';x.textAlign='center';x.textBaseline='middle';
  x.fillText(String(parts[0].v)+'%',cx,cy);
}
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
lineChart($('#ch-usage'),months,[42,55,48,70,64,82,78,95,88,104,97,118]);
lineChart($('#ch-revenue'),months,[12,18,15,24,22,31,29,38,36,44,49,57],{color:'#687661'});
lineChart($('#ch-traffic'),months,[8,11,14,13,19,22,21,27,26,31,34,39],{color:'#8B2940'});
bars($('#ch-orders'),['W1','W2','W3','W4','W5','W6','W7','W8'],[14,19,16,24,22,28,26,33]);
bars($('#ch-clients'),months,[3,5,4,7,6,9,8,11,10,13,12,15],{color:'#6F1025'});
donut($('#ch-donut'),[{v:42,c:'#6F1025'},{v:28,c:'#687661'},{v:18,c:'#8B2940'},{v:12,c:'rgba(23,37,29,.2)'}]);
donut($('#ch-donut2'),[{v:64,c:'#687661'},{v:22,c:'#6F1025'},{v:14,c:'rgba(23,37,29,.2)'}]);

/* animate mini bars */
$$('.mini-bar i').forEach(b=>{const w=b.style.width;b.style.width=0;
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transition='width 1.4s cubic-bezier(.22,1,.36,1)';e.target.style.width=w;o.disconnect();}}),{threshold:.4}).observe(b);});

/* tabs (admin) */
$$('.dtabs button').forEach(b=>b.addEventListener('click',()=>{
  $$('.dtabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  $$('.dtab-pane').forEach(p=>p.classList.toggle('on',p.id==='pane-'+b.dataset.tab));
}));
})();
