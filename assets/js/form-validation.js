/* STACKLY — form-validation.js : contact, login, register */
(function(){"use strict";
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function setErr(input,msg){const f=input.closest('.field');if(!f)return;f.classList.add('error');const e=$('.f-err',f);if(e&&msg)e.textContent=msg;}
function clearErr(input){const f=input.closest('.field');if(f)f.classList.remove('error');}
$$('.field input,.field select,.field textarea').forEach(i=>i.addEventListener('input',()=>clearErr(i)));

/* ---------- Contact form ---------- */
const cf=$('#contactForm');
if(cf)cf.addEventListener('submit',e=>{
  e.preventDefault();let ok=true;
  const name=$('#cf-name'),email=$('#cf-email'),msg=$('#cf-msg');
  if(name.value.trim().length<2){setErr(name,'Please enter your full name.');ok=false;}
  if(!emailOk(email.value)){setErr(email,'Enter a valid work email.');ok=false;}
  if(msg.value.trim().length<10){setErr(msg,'Tell us a little more (min. 10 characters).');ok=false;}
  if(!ok)return;
  const okBox=$('.form-ok',cf);okBox.classList.add('show');
  okBox.textContent='Message received — a Stackly AI strategist will reach out within one business day.';
  cf.reset();setTimeout(()=>okBox.classList.remove('show'),6000);
});

/* ---------- Role switchers (login + register) ---------- */
$$('.role-switch').forEach(sw=>{
  const btns=$$('button',sw);
  btns.forEach((b,i)=>b.addEventListener('click',()=>{
    btns.forEach(x=>x.classList.remove('on'));b.classList.add('on');
    sw.classList.toggle('admin',i===1);
    const hint=$('.role-hint');if(hint)hint.textContent=i===1?'Admin access · enterprise controls & team management':'User access · projects, analytics & AI tools';
  }));
});

/* ---------- Login ---------- */
const lf=$('#loginForm');
if(lf)lf.addEventListener('submit',e=>{
  e.preventDefault();let ok=true;
  const email=$('#lf-email'),pass=$('#lf-pass');
  if(!emailOk(email.value)){setErr(email,'Enter a valid email address.');ok=false;}
  if(pass.value.length<8){setErr(pass,'Password must be at least 8 characters.');ok=false;}
  if(!ok)return;
  const role=$('.role-switch.admin')?'admin':'user';
  localStorage.setItem('stackly_user',JSON.stringify({email:email.value,role,ts:Date.now()}));
  const btn=$('button[type=submit]',lf);btn.textContent='Authenticating…';btn.disabled=true;
  setTimeout(()=>{location.href=role==='admin'?'admin-dashboard.html':'dashboard.html';},800);
});

/* ---------- Register ---------- */
const rf=$('#registerForm');
if(rf)rf.addEventListener('submit',e=>{
  e.preventDefault();let ok=true;
  const name=$('#rf-name'),email=$('#rf-email'),company=$('#rf-company'),
        p1=$('#rf-pass'),p2=$('#rf-pass2'),terms=$('#rf-terms');
  if(name.value.trim().length<2){setErr(name,'Please enter your full name.');ok=false;}
  if(!emailOk(email.value)){setErr(email,'Enter a valid email address.');ok=false;}
  if(company.value.trim().length<2){setErr(company,'Company name is required.');ok=false;}
  if(p1.value.length<8){setErr(p1,'Use at least 8 characters with a number.');ok=false;}
  else if(!/\d/.test(p1.value)){setErr(p1,'Include at least one number.');ok=false;}
  if(p2.value!==p1.value){setErr(p2,'Passwords do not match.');ok=false;}
  if(!terms.checked){setErr(terms,'Please accept the terms to continue.');ok=false;}
  if(!ok)return;
  const role=$('.role-switch.admin')?'admin':'user';
  localStorage.setItem('stackly_user',JSON.stringify({email:email.value,name:name.value,role,ts:Date.now()}));
  const btn=$('button[type=submit]',rf);btn.textContent='Creating workspace…';btn.disabled=true;
  setTimeout(()=>{location.href=role==='admin'?'admin-dashboard.html':'dashboard.html';},900);
});

/* password visibility */
$$('.pw-toggle').forEach(t=>t.addEventListener('click',()=>{
  const i=t.previousElementSibling;i.type=i.type==='password'?'text':'password';t.textContent=i.type==='password'?'Show':'Hide';
}));
})();
