/* ExpertAims — "The Meridian" shared behaviours */
(function(){
'use strict';

/* theme: stored choice wins; else follow OS live */
var root=document.documentElement;
function applyTheme(t){
  if(t){root.setAttribute('data-theme',t);}else{root.removeAttribute('data-theme');}
  var dark = t==='dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var meta=document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', dark ? '#141011' : '#F6F4F2');
}
try{applyTheme(localStorage.getItem('ea-theme')||null);}catch(e){applyTheme(null);}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',function(){
  var s=null;try{s=localStorage.getItem('ea-theme');}catch(e){}
  if(!s)applyTheme(null);
});
document.addEventListener('click',function(e){
  var b=e.target.closest('.thm');if(!b)return;
  var cur=root.getAttribute('data-theme');
  var dark = cur==='dark' || (!cur && window.matchMedia('(prefers-color-scheme: dark)').matches);
  var next = dark?'light':'dark';
  try{localStorage.setItem('ea-theme',next);}catch(e2){}
  applyTheme(next);
});

/* year */
document.querySelectorAll('.yr').forEach(function(y){y.textContent=new Date().getFullYear();});

/* mega menus: hover on desktop, click toggles for touch/keyboard */
document.querySelectorAll('.hd-item').forEach(function(it){
  var btn=it.querySelector('button.hd-lnk');if(!btn)return;
  it.addEventListener('mouseenter',function(){it.classList.add('open');btn.setAttribute('aria-expanded','true');});
  it.addEventListener('mouseleave',function(){it.classList.remove('open');btn.setAttribute('aria-expanded','false');});
  btn.addEventListener('click',function(){
    var open=it.classList.toggle('open');
    btn.setAttribute('aria-expanded',open?'true':'false');
    document.querySelectorAll('.hd-item').forEach(function(o){if(o!==it){o.classList.remove('open');}});
  });
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.hd-item.open').forEach(function(o){o.classList.remove('open');});setSheet(false);}});
document.addEventListener('click',function(e){
  if(!e.target.closest('.hd-item')){document.querySelectorAll('.hd-item.open').forEach(function(o){o.classList.remove('open');});}
});

/* mobile sheet */
var mbt=document.getElementById('mbt'),msh=document.getElementById('msh');
function setSheet(o){
  if(!mbt||!msh)return;
  mbt.classList.toggle('open',o);msh.classList.toggle('open',o);
  mbt.setAttribute('aria-expanded',o?'true':'false');
  document.body.style.overflow=o?'hidden':'';
}
if(mbt){mbt.addEventListener('click',function(){setSheet(!msh.classList.contains('open'));});}
if(msh){msh.addEventListener('click',function(e){if(e.target.closest('a'))setSheet(false);});}
window.addEventListener('resize',function(){if(window.innerWidth>1020)setSheet(false);});

/* reveal on scroll */
var rvs=document.querySelectorAll('.rv');
if('IntersectionObserver' in window){
  var rio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target);}});},{threshold:.1});
  rvs.forEach(function(e){rio.observe(e);});
}else{rvs.forEach(function(e){e.classList.add('in');});}

/* signal compass: scroll-progress ring + station announcer */
(function(){
  var R=15,C=2*Math.PI*R;
  var cmp=document.createElement('div');
  cmp.className='cmp';
  cmp.innerHTML='<span class="vh" aria-live="polite"></span><button type="button" class="cmp-btn" aria-label="Scroll progress — back to top">'+
    '<svg viewBox="0 0 46 46" aria-hidden="true">'+
    '<circle class="tr" cx="23" cy="23" r="'+R+'" fill="none" stroke-width="2.5"/>'+
    '<circle class="pr" cx="23" cy="23" r="'+R+'" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 23 23)"/>'+
    '<circle class="ad" cx="23" cy="23" r="4.5"/></svg></button>'+
    '<span class="cmp-lb" aria-hidden="true"></span>';
  document.body.appendChild(cmp);
  var pr=cmp.querySelector('.pr'),lb=cmp.querySelector('.cmp-lb'),vh=cmp.querySelector('.vh');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stns=[].map.call(document.querySelectorAll('.stn-anchor'),function(a){
    var l=a.querySelector('.stn');
    return{el:a,txt:l?l.textContent.replace(/\s+/g,' ').trim():''};
  }).filter(function(s){return s.txt;});
  var cur=-1,sayT=null,tick=false;
  function upd(){
    tick=false;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    var p=h>0?Math.min(window.scrollY/h,1):0;
    pr.style.strokeDashoffset=String(C*(1-p));
    cmp.classList.toggle('on',window.scrollY>140);
    var k=-1;
    for(var i=0;i<stns.length;i++){if(stns[i].el.getBoundingClientRect().top<window.innerHeight*.45)k=i;}
    if(k!==cur){
      cur=k;
      var t=k>=0?stns[k].txt:(document.title.split('—')[1]||'Top of the line').trim();
      lb.innerHTML='';
      t.split('·').forEach(function(part,n){
        if(n){var i2=document.createElement('i');i2.textContent=' · ';lb.appendChild(i2);}
        lb.appendChild(document.createTextNode(part.trim()));
      });
      if(vh)vh.textContent=t;
      if(!reduce){
        cmp.classList.add('say');
        if(sayT)clearTimeout(sayT);
        sayT=setTimeout(function(){cmp.classList.remove('say');},1800);
      }
    }
  }
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
  window.addEventListener('resize',upd);
  upd();
  var ftEl=document.querySelector('.ft');
  if(ftEl&&'IntersectionObserver' in window){
    new IntersectionObserver(function(es){es.forEach(function(en){cmp.classList.toggle('off',en.isIntersecting);});},{threshold:.08}).observe(ftEl);
  }
  cmp.querySelector('.cmp-btn').addEventListener('click',function(){
    window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
  });
})();

/* rotating word (hero) */
var rot=document.getElementById('rot');
if(rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var words=JSON.parse(rot.getAttribute('data-words')||'[]'),wi=0;
  if(words.length>1){
    setInterval(function(){
      wi=(wi+1)%words.length;
      rot.style.opacity='0';rot.style.transform='translateY(8px)';
      setTimeout(function(){rot.textContent=words[wi];rot.style.opacity='1';rot.style.transform='none';},260);
    },2600);
    rot.style.transition='opacity .26s ease, transform .26s ease';
    rot.style.display='inline-block';
  }
}

/* horizontal rails: drag + arrows + progress */
document.querySelectorAll('.rail-wrap').forEach(function(w){
  var rail=w.querySelector('.rail');if(!rail)return;
  var bar=w.querySelector('.rail-bar i');
  function upd(){
    if(!bar)return;
    var max=rail.scrollWidth-rail.clientWidth;
    var frac=rail.clientWidth/rail.scrollWidth;
    bar.style.width=Math.max(frac*100,8)+'%';
    var x=max>0?(rail.scrollLeft/max)*(100-Math.max(frac*100,8)):0;
    bar.style.transform='translateX('+(x/Math.max(frac,0.08))+'%)';
    bar.style.left=(max>0?(rail.scrollLeft/max)*(100-Math.max(frac*100,8)):0)+'%';
    bar.style.transform='none';
  }
  rail.addEventListener('scroll',upd,{passive:true});
  window.addEventListener('resize',upd);upd();
  var prev=w.querySelector('[data-rail="prev"]'),next=w.querySelector('[data-rail="next"]');
  var step=function(){var c=rail.querySelector(':scope>*');return c?c.getBoundingClientRect().width+18:320;};
  if(prev)prev.addEventListener('click',function(){rail.scrollBy({left:-step(),behavior:'smooth'});});
  if(next)next.addEventListener('click',function(){rail.scrollBy({left:step(),behavior:'smooth'});});
  /* drag to scroll */
  var down=false,sx=0,sl=0;
  rail.addEventListener('pointerdown',function(e){down=true;sx=e.clientX;sl=rail.scrollLeft;rail.classList.add('drag');});
  window.addEventListener('pointermove',function(e){if(!down)return;rail.scrollLeft=sl-(e.clientX-sx);});
  window.addEventListener('pointerup',function(){down=false;rail.classList.remove('drag');});
});

/* count-up */
var cnts=document.querySelectorAll('.cnt');
if(cnts.length && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var cio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting||e.target.dataset.done)return;
      e.target.dataset.done='1';
      var end=+e.target.dataset.n,el=e.target,t0=null;
      function stp(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1100,1),k=1-Math.pow(1-p,3);el.textContent=Math.round(end*k).toLocaleString('en-US');if(p<1)requestAnimationFrame(stp);}
      requestAnimationFrame(stp);
    });
  },{threshold:.5});
  cnts.forEach(function(c){cio.observe(c);});
}

/* testimonial slider */
document.querySelectorAll('.tsl').forEach(function(t){
  var tr=t.querySelector('.tsl-t'),n=tr.children.length,i=0,timer=null;
  var ui=t.querySelector('.tsl-ui');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(var d=0;d<n;d++){var b=document.createElement('button');b.className='tsl-d'+(d?'':' on');b.setAttribute('aria-label','Quote '+(d+1));b.dataset.i=d;ui.appendChild(b);}
  var dots=ui.children;
  function go(k){i=(k+n)%n;tr.style.transform='translateX(-'+i*100+'%)';for(var d2=0;d2<n;d2++)dots[d2].classList.toggle('on',d2===i);}
  function play(){if(reduce)return;stop();timer=setInterval(function(){go(i+1);},6000);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  ui.addEventListener('click',function(e){var b2=e.target.closest('.tsl-d');if(b2){go(+b2.dataset.i);play();}});
  t.addEventListener('mouseenter',stop);t.addEventListener('mouseleave',play);
  play();
});

/* filter pills (projects) */
var pb=document.getElementById('pills');
if(pb){
  var grid=document.getElementById('pjGrid');
  pb.addEventListener('click',function(e){
    var b=e.target.closest('.pill');if(!b)return;
    pb.querySelectorAll('.pill').forEach(function(x){x.classList.remove('on');});
    b.classList.add('on');
    var f=b.getAttribute('data-f');
    grid.querySelectorAll('.pj').forEach(function(p){
      p.classList.toggle('hide', f!=='all' && p.getAttribute('data-cat')!==f);
    });
  });
}

/* article modal (news) */
var amod=document.getElementById('amod');
if(amod){
  var tagEl=amod.querySelector('.tag'),tEl=amod.querySelector('h3'),bEl=amod.querySelector('.bd');
  var last=null;
  function aOpen(card){
    tagEl.textContent=card.querySelector('.tag').textContent;
    tEl.textContent=card.querySelector('h3').textContent;
    bEl.innerHTML=card.querySelector('template').innerHTML;
    last=document.activeElement;
    amod.hidden=false;document.body.style.overflow='hidden';
    amod.querySelector('.amod-x').focus();
  }
  function aClose(){amod.hidden=true;document.body.style.overflow='';if(last)last.focus();}
  document.querySelectorAll('.nc[data-article]').forEach(function(c){
    c.addEventListener('click',function(){aOpen(c);});
  });
  amod.addEventListener('click',function(e){if(e.target.closest('[data-close]'))aClose();});
  amod.addEventListener('keydown',function(e){trapFocus(amod,e);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!amod.hidden)aClose();});
}

/* enquiry forms -> pre-filled email drafts */
document.querySelectorAll('form[data-mailto]').forEach(function(f){
  var note=f.querySelector('.frm-note');
  if(note){note.setAttribute('role','alert');}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    f.querySelectorAll('.ff').forEach(function(w){
      var i=w.querySelector('input,textarea,select');if(!i)return;
      var v=i.value.trim();
      var bad=(i.required&&!v)||(i.type==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
      w.classList.toggle('bad',bad);if(i.required||i.type==='email')i.setAttribute('aria-invalid',bad?'true':'false');if(bad)ok=false;
    });
    if(!ok){if(note){note.textContent='Please complete the highlighted fields.';note.style.color='var(--err)';}return;}
    function v(n){var el=f.querySelector('[name='+n+']');return el?el.value.trim():'';}
    var subject=(f.getAttribute('data-subject')||'Enquiry')+' — '+v('name')+(v('company')?' ('+v('company')+')':'');
    var body='Name: '+v('name')+'\nEmail: '+v('email')+'\nCompany: '+v('company')+'\n\n'+v('msg');
    window.location.href='mailto:info@expertaims.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    if(note){note.textContent='Your email app has a pre-filled draft — review and send it.';note.style.color='var(--ok)';}
  });
});

/* ── v5.1 · signal draw on page entry ── */
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  var sig=document.createElement('div');
  sig.className='sig-load';sig.setAttribute('aria-hidden','true');
  document.body.appendChild(sig);
  sig.addEventListener('animationend',function(){sig.remove();});
}

/* ── v5.1 · pointer spotlight on cards ── */
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
  document.addEventListener('pointermove',function(e){
    var c=e.target.closest('.svc,.pj');if(!c)return;
    var host=c.classList.contains('pj')?(c.querySelector('.pj-art')||c):c;
    var r=host.getBoundingClientRect();
    host.style.setProperty('--mx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    host.style.setProperty('--my',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  },{passive:true});
}

/* ── v5.3 · "Ai" logo effect ── */
document.querySelectorAll('.hd-logo .lg-f').forEach(function(lg){
  var fx=document.createElement('span');
  fx.className='lg-fx';fx.setAttribute('aria-hidden','true');
  fx.innerHTML='<i class="ai"></i><i class="shine"></i>';
  lg.appendChild(fx);
  var pg=document.createElement('span');
  pg.className='lg-ping';pg.setAttribute('aria-hidden','true');
  lg.appendChild(pg);
});

/* ── v6.1 · header logo expands on scroll ── */
(function(){
  var hd=document.querySelector('.hd');if(!hd)return;
  var tick=false;
  function upd(){hd.classList.toggle('exp',window.scrollY>90);tick=false;}
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});
  upd();
})();

/* ── v6.1 · back to top ── */
document.addEventListener('click',function(e){
  if(!e.target.closest('[data-top]'))return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});
});

/* ── v5.3 · hero banner slider ── */
var hb=document.querySelector('.hb');
if(hb){
  var hbT=hb.querySelector('.hb-t'),hbS=[].slice.call(hbT.children);
  var hbDots=hb.querySelector('.hb-dots'),hbN=hb.querySelector('.hb-n');
  var hbReduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HB_MS=6200,hbI=0,hbTimer=null;
  hb.style.setProperty('--hb-ms',HB_MS+'ms');
  hbS.forEach(function(s,i){
    var d=document.createElement('button');
    d.className='hb-d';d.type='button';
    d.setAttribute('aria-label','Slide '+(i+1)+' of '+hbS.length);
    d.innerHTML='<i></i>';d.dataset.i=i;
    hbDots.appendChild(d);
  });
  var hbD=[].slice.call(hbDots.children);
  function hbAcc(s,on){
    s.setAttribute('aria-hidden',on?'false':'true');
    s.querySelectorAll('a,button').forEach(function(f){f.tabIndex=on?0:-1;});
  }
  function hbGo(k){
    hbI=(k+hbS.length)%hbS.length;
    hbS.forEach(function(s,i){s.classList.toggle('on',i===hbI);hbAcc(s,i===hbI);});
    hbD.forEach(function(d,i){
      d.classList.remove('on');
      if(i===hbI){void d.offsetWidth;d.classList.add('on');}
    });
    if(hbN)hbN.textContent=('0'+(hbI+1)).slice(-2)+' / '+('0'+hbS.length).slice(-2);
    hbPlay();
  }
  function hbPlay(){
    if(hbTimer)clearTimeout(hbTimer);
    if(hbReduce||hb.classList.contains('paused'))return;
    hbTimer=setTimeout(function(){hbGo(hbI+1);},HB_MS);
  }
  var hbUserPaused=false;
  hb.addEventListener('click',function(e){
    var pp=e.target.closest('[data-hb-pp]');
    if(pp){
      hbUserPaused=!hbUserPaused;
      pp.setAttribute('aria-pressed',hbUserPaused?'true':'false');
      pp.setAttribute('aria-label',hbUserPaused?'Play slides':'Pause slides');
      pp.innerHTML=hbUserPaused
        ?'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.8v10.4c0 .8.9 1.3 1.6.9l8-5.2c.6-.4.6-1.4 0-1.8l-8-5.2c-.7-.4-1.6.1-1.6.9Z"/></svg>'
        :'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2.5" width="3.4" height="11" rx="1"/><rect x="9.6" y="2.5" width="3.4" height="11" rx="1"/></svg>';
      hbPause(hbUserPaused);return;
    }
    var ar=e.target.closest('[data-hb]');
    if(ar){hbGo(hbI+(ar.dataset.hb==='next'?1:-1));return;}
    var d=e.target.closest('.hb-d');
    if(d)hbGo(+d.dataset.i);
  });
  function hbPause(p){p=p||hbUserPaused;hb.classList.toggle('paused',p);if(p){if(hbTimer)clearTimeout(hbTimer);}else hbPlay();}
  hb.addEventListener('mouseenter',function(){hbPause(true);});
  hb.addEventListener('mouseleave',function(){hbPause(false);});
  hb.addEventListener('focusin',function(){hbPause(true);});
  hb.addEventListener('focusout',function(e){if(!hb.contains(e.relatedTarget))hbPause(false);});
  document.addEventListener('visibilitychange',function(){hbPause(document.hidden);});
  hb.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'){e.preventDefault();hbGo(hbI+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();hbGo(hbI-1);}
  });
  /* swipe */
  var hx=null;
  hbT.addEventListener('pointerdown',function(e){if(!e.target.closest('a,button'))hx=e.clientX;});
  window.addEventListener('pointerup',function(e){
    if(hx===null)return;
    var dx=e.clientX-hx;hx=null;
    if(Math.abs(dx)>56)hbGo(hbI+(dx<0?1:-1));
  });
  hbGo(0);
}

/* ── v5.3 · service card icons + outlined numerals ── */
(function(){
  var IC={
    s1:'<rect x="8" y="8" width="32" height="12" rx="2.5"/><rect x="8" y="26" width="32" height="12" rx="2.5"/><circle cx="14.5" cy="14" r="1.6"/><circle cx="14.5" cy="32" r="1.6"/><path d="M22 14h12M22 32h12"/><circle class="dt" cx="40" cy="8" r="2.6"/>',
    s2:'<path d="M14 32a7.5 7.5 0 0 1-1-14.9A10.5 10.5 0 0 1 33.6 19 8 8 0 0 1 33 35H16"/><path d="M24 38V24m0 0-5 5m5-5 5 5"/><circle class="dt" cx="38" cy="12" r="2.6"/>',
    s3:'<path d="M24 6 38 11v11c0 9.5-6 15.6-14 20-8-4.4-14-10.5-14-20V11Z"/><path d="m17 23 5 5 9.5-10"/><circle class="dt" cx="38" cy="9" r="2.6"/>',
    s4:'<rect x="6" y="9" width="36" height="28" rx="3"/><path d="M6 17h36"/><circle cx="11.5" cy="13" r="1.3"/><circle cx="16.5" cy="13" r="1.3"/><path d="m19 30 -5-4.5 5-4.5M29 21l5 4.5-5 4.5"/><circle class="dt" cx="40" cy="13" r="2.6"/>',
    s5:'<path d="M8 38V22m10 16V14m10 24V26m10 12V8"/><path d="M30 8h8v8"/><circle class="dt" cx="38" cy="8" r="2.6"/>',
    s7:'<path d="M38 24a14 14 0 1 1-4.1-9.9M38 24v-8m0 8h-8"/><path d="M19 24l4 4 7-8"/><circle class="dt" cx="38" cy="10" r="2.6"/>',
    s6:'<path d="M24 8 42 16l-18 8L6 16Z"/><path d="M13 20v10c0 3 5 6 11 6s11-3 11-6V20"/><path d="M42 16v10"/><circle class="dt" cx="42" cy="28.5" r="2.4"/>'
  };
  window.__IC=IC;
  document.querySelectorAll('a.svc').forEach(function(c){
    var m=(c.getAttribute('href')||'').match(/#(s[1-7])/);
    if(!m||!IC[m[1]])return;
    var ic=document.createElement('span');
    ic.className='ic';ic.setAttribute('aria-hidden','true');
    ic.innerHTML='<svg viewBox="0 0 48 48">'+IC[m[1]]+'</svg>';
    c.appendChild(ic);
    var num=c.querySelector('.num');
    if(num){
      var bn=document.createElement('span');
      bn.className='bignum';bn.setAttribute('aria-hidden','true');
      bn.textContent=(num.textContent.match(/\d+/)||[''])[0];
      c.appendChild(bn);
    }
  });
})();

/* ── v5.3 · project card motifs by category ── */
(function(){
  var IC=window.__IC;if(!IC)return;
  document.querySelectorAll('.mega a.mg').forEach(function(a){
    var m=(a.getAttribute('href')||'').match(/#(s[1-7])/);
    if(!m||!IC[m[1]])return;
    var ic=document.createElement('span');
    ic.className='mg-ic';ic.setAttribute('aria-hidden','true');
    ic.innerHTML='<svg viewBox="0 0 48 48">'+IC[m[1]]+'</svg>';
    a.appendChild(ic);
  });
})();

(function(){
  var MT={
    websites:'<svg viewBox="0 0 120 90"><rect x="4" y="6" width="112" height="78" rx="6"/><path d="M4 22h112"/><circle cx="13" cy="14" r="2"/><circle cx="21" cy="14" r="2"/><circle cx="29" cy="14" r="2"/><path d="M16 38h48M16 50h64M16 62h40"/><rect x="88" y="34" width="18" height="32" rx="3"/></svg>',
    apps:'<svg viewBox="0 0 70 110"><rect x="6" y="4" width="58" height="102" rx="10"/><path d="M26 12h18"/><circle cx="35" cy="94" r="4"/><rect x="16" y="26" width="16" height="16" rx="3"/><rect x="38" y="26" width="16" height="16" rx="3"/><rect x="16" y="48" width="16" height="16" rx="3"/><rect x="38" y="48" width="16" height="16" rx="3"/></svg>',
    logos:'<svg viewBox="0 0 110 110"><path d="M20 90C20 50 50 20 90 20"/><circle cx="20" cy="90" r="5"/><circle cx="90" cy="20" r="5"/><path d="M20 90 55 55m35-35L55 55" stroke-dasharray="3 6"/><circle cx="55" cy="55" r="3"/><rect x="47" y="14" width="12" height="12" rx="2"/><rect x="14" y="84" width="12" height="12" rx="2" transform="rotate(0)"/></svg>',
    brands:'<svg viewBox="0 0 120 100"><path d="M14 62V38l52-24v72L14 62Z"/><path d="M66 30c14 0 24 8 24 20"/><path d="M20 62v18c0 4 3 6 7 6h6V64"/><path d="M98 26l10-8M100 50h14M96 68l10 8"/></svg>'
  };
  document.querySelectorAll('.pj').forEach(function(p){
    var art=p.querySelector('.pj-art');
    var cat=p.getAttribute('data-cat');
    if(!art||!MT[cat]||art.querySelector('.mt'))return;
    var mt=document.createElement('span');
    mt.className='mt';mt.setAttribute('aria-hidden','true');
    mt.innerHTML=MT[cat];
    art.insertBefore(mt,art.firstChild);
  });
})();

/* focus trap shared by all dialogs */
function trapFocus(box,e){
  if(e.key!=='Tab')return;
  var f=box.querySelectorAll('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])');
  if(!f.length)return;
  var first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
}

/* ── v6.0 · case reader ── */
var cmod=document.getElementById('cmod');
if(cmod){
  var cImg=cmod.querySelector('.cs-hero img'),cTag=cmod.querySelector('.tag'),cT=cmod.querySelector('h3'),cBd=cmod.querySelector('.bd');
  var cLast=null;
  function cOpen(card){
    cImg.src=card.querySelector('.cs-cover img').getAttribute('src');
    cTag.textContent=card.querySelector('.cs-cover .tag').textContent;
    cT.textContent=card.querySelector('.cs-b b').textContent;
    cBd.innerHTML=card.querySelector('template').innerHTML;
    cLast=document.activeElement;
    cmod.hidden=false;document.body.style.overflow='hidden';
    cmod.querySelector('.amod-x').focus();
  }
  function cClose(){cmod.hidden=true;document.body.style.overflow='';if(cLast)cLast.focus();}
  document.querySelectorAll('.cs[data-case]').forEach(function(c){c.addEventListener('click',function(){cOpen(c);});});
  cmod.addEventListener('click',function(e){if(e.target.closest('[data-close]'))cClose();});
  cmod.addEventListener('keydown',function(e){trapFocus(cmod,e);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!cmod.hidden)cClose();});
}

/* ── v6.0 · pointer tilt on plates and case covers ── */
if(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.querySelectorAll('.hb-art .plate,.cs-cover').forEach(function(el){el.setAttribute('data-tilt','');});
  document.addEventListener('pointermove',function(e){
    var host=e.target.closest('.hb-s.on,.cs');if(!host)return;
    var el=host.querySelector('[data-tilt]');if(!el)return;
    var r=host.getBoundingClientRect();
    var rx=((e.clientY-r.top)/r.height-.5)*-4.5;
    var ry=((e.clientX-r.left)/r.width-.5)*5.5;
    el.style.transform=(el.classList.contains('plate')?'translateY(-54%) ':'')+'perspective(900px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)';
  },{passive:true});
  document.addEventListener('pointerout',function(e){
    var host=e.target.closest('.hb-s,.cs');if(!host||host.contains(e.relatedTarget))return;
    var el=host.querySelector('[data-tilt]');if(el)el.style.transform='';
  });
}

/* ── v5.1 · Signal Search (command palette) ── */
(function(){
  var INDEX=[
    {t:'Home',d:'The line begins here',u:'index.html',g:'page',k:'home start meridian'},
    {t:'Services — all six practices',d:'Run · Move · Protect · Build · Grow · Enable',u:'services.html',g:'page',k:'services practices what we do'},
    {t:'IT Infrastructure & AMC',d:'Networks, servers, maintenance contracts',u:'services.html#s1',g:'service',k:'network servers helpdesk amc hardware infrastructure support'},
    {t:'Cloud, Microsoft 365 & Google Workspace',d:'Business email and files that follow the team',u:'services.html#s2',g:'service',k:'cloud m365 office email migration google workspace'},
    {t:'Cybersecurity & Backup',d:'Endpoint, email security, tested backups',u:'services.html#s3',g:'service',k:'security ransomware endpoint backup recovery protect'},
    {t:'Websites, E-commerce & Apps',d:'Built to convert, handed over documented',u:'services.html#s4',g:'service',k:'website ecommerce app store development build design'},
    {t:'SEO, Branding & Marketing',d:'Found first, remembered longer',u:'services.html#s5',g:'service',k:'seo brand logo marketing social media growth'},
    {t:'Training & Workshops',d:'Your team, upskilled on your stack',u:'services.html#s6',g:'service',k:'training workshops learning enable'},
    {t:'Digital Transformation',d:'Workflows digitised, AI put to work',u:'services.html#s7',g:'service',k:'digital transformation automation workflow erp crm integration ai paperless'},
    {t:'Projects & case studies',d:'26 delivered projects with filters',u:'projects.html',g:'page',k:'portfolio work case studies proof websites apps logos'},
    {t:'About ExpertAims',d:'Vision, mission, how we work since 2012',u:'about.html',g:'page',k:'company story values respect responsibility ownership'},
    {t:'Clients & industries',d:'Who trusts us, by sector',u:'clients.html',g:'page',k:'customers industries sectors trust'},
    {t:'News & insights',d:'Practice notes from the field',u:'news.html',g:'page',k:'articles blog insights reading'},
    {t:'Innovation & Capability Atlas',d:'Frontier practices, interactive map',u:'innovation.html',g:'page',k:'ai automation atlas future frontier'},
    {t:'Contact — three offices',d:'Kuwait · India · Malaysia',u:'contact.html',g:'page',k:'contact reach address phone kuwait india malaysia office faq'},
    {t:'WhatsApp us',d:'+965 9090 8625 · fastest reply',u:'https://wa.me/96590908625',g:'action',k:'whatsapp chat message call now'},
    {t:'Email info@expertaims.com',d:'Start an enquiry',u:'mailto:info@expertaims.com',g:'action',k:'email mail enquiry write'},
    {t:'Switch light / dark theme',d:'Follows your OS until you choose',g:'action',k:'theme dark light mode appearance',a:'theme'}
  ];
  var acts=document.querySelector('.hd-acts'),thm=document.querySelector('.thm');
  var mac=/Mac|iPhone|iPad/.test(navigator.platform||'');
  if(acts&&thm){
    var btn=document.createElement('button');
    btn.type='button';btn.className='cpb';btn.setAttribute('aria-label','Search the site (keyboard: '+(mac?'Command':'Control')+' K)');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg><span class="cpb-t">Search</span><kbd>'+(mac?'⌘':'Ctrl')+' K</kbd>';
    acts.insertBefore(btn,thm);
  }
  var cp,inp,ls,items=[],sel=0,lastFocus=null;
  function build(){
    cp=document.createElement('div');
    cp.className='cp';cp.hidden=true;
    cp.setAttribute('role','dialog');cp.setAttribute('aria-modal','true');cp.setAttribute('aria-label','Site search');
    cp.innerHTML='<div class="cp-bg" data-close></div>'+
      '<div class="cp-box"><div class="cp-hd">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>'+
      '<input type="text" placeholder="Search pages, services, actions…" aria-label="Search" role="combobox" aria-expanded="true" aria-controls="cp-ls" autocomplete="off" spellcheck="false">'+
      '<kbd data-close role="button" tabindex="0" aria-label="Close search">ESC</kbd></div>'+
      '<div class="cp-ls" id="cp-ls" role="listbox" aria-label="Results"></div><div class="vh" aria-live="polite"></div>'+
      '<div class="cp-ft"><span><kbd>↑↓</kbd>navigate</span><span><kbd>↵</kbd>open</span><span><kbd>esc</kbd>close</span></div></div>';
    document.body.appendChild(cp);
    inp=cp.querySelector('input');ls=cp.querySelector('.cp-ls');
    inp.addEventListener('input',function(){render(inp.value);});
    cp.addEventListener('click',function(e){
      if(e.target.closest('[data-close]')){close();return;}
      var it=e.target.closest('.cp-it');if(it){e.preventDefault();go(+it.dataset.i);}
    });
    cp.addEventListener('keydown',function(e){
      trapFocus(cp,e);
      if(e.key==='ArrowDown'){e.preventDefault();move(1);}
      else if(e.key==='ArrowUp'){e.preventDefault();move(-1);}
      else if(e.key==='Enter'){e.preventDefault();if(items[sel])go(+items[sel].dataset.i);}
    });
  }
  function score(it,q){
    var hay=(it.t+' '+it.d+' '+it.k).toLowerCase(),s=0;
    var terms=q.toLowerCase().split(/\s+/).filter(Boolean);
    for(var i=0;i<terms.length;i++){
      var w=terms[i];
      if(it.t.toLowerCase().indexOf(w)===0)s+=5;
      else if(it.t.toLowerCase().indexOf(w)>-1)s+=3;
      else if(hay.indexOf(w)>-1)s+=1;
      else return 0;
    }
    return s||1;
  }
  function render(q){
    var res=q.trim()
      ? INDEX.map(function(it,i){return{it:it,i:i,s:score(it,q)};}).filter(function(r){return r.s>0;}).sort(function(a,b){return b.s-a.s;})
      : INDEX.map(function(it,i){return{it:it,i:i};});
    ls.innerHTML='';items=[];sel=0;
    var live=cp.querySelector('.vh');
    if(live)live.textContent=res.length?res.length+' results':'No results';
    if(!res.length)inp.removeAttribute('aria-activedescendant');
    if(!res.length){ls.innerHTML='<p class="cp-mt">No match — try “backup”, “website” or “WhatsApp”.</p>';return;}
    res.forEach(function(r,n){
      var el=document.createElement(r.it.u?'a':'button');
      el.className='cp-it'+(n===0?' on':'');
      el.setAttribute('role','option');el.id='cp-opt-'+n;el.dataset.i=r.i;
      if(r.it.u){el.href=r.it.u;}else{el.type='button';}
      el.innerHTML='<span class="dot" aria-hidden="true"></span><span><b></b><span></span></span><span class="k"></span>';
      el.querySelector('b').textContent=r.it.t;
      el.querySelector('span span').textContent=r.it.d;
      el.querySelector('.k').textContent=r.it.g;
      ls.appendChild(el);items.push(el);
    });
    if(items[0])inp.setAttribute('aria-activedescendant',items[0].id);
  }
  function move(d){
    if(!items.length)return;
    items[sel].classList.remove('on');
    sel=(sel+d+items.length)%items.length;
    items[sel].classList.add('on');
    inp.setAttribute('aria-activedescendant',items[sel].id);
    items[sel].scrollIntoView({block:'nearest'});
  }
  function go(i){
    var it=INDEX[i];
    if(it.a==='theme'){close();var t=document.querySelector('.thm');if(t)t.click();return;}
    close();window.location.href=it.u;
  }
  function open(){
    if(!cp)build();
    lastFocus=document.activeElement;
    cp.hidden=false;document.body.style.overflow='hidden';
    inp.value='';render('');inp.focus();
  }
  function close(){
    if(!cp||cp.hidden)return;
    cp.hidden=true;document.body.style.overflow='';
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }
  document.addEventListener('click',function(e){if(e.target.closest('.cpb'))open();});
  document.addEventListener('keydown',function(e){
    if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K')){e.preventDefault();cp&&!cp.hidden?close():open();return;}
    if(e.key==='Escape')close();
    if(e.key==='/'&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
      var t=e.target;
      if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable))return;
      e.preventDefault();open();
    }
  });
})();
})();
