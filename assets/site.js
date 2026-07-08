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
  cmp.innerHTML='<button type="button" class="cmp-btn" aria-label="Scroll progress — back to top">'+
    '<svg viewBox="0 0 46 46" aria-hidden="true">'+
    '<circle class="tr" cx="23" cy="23" r="'+R+'" fill="none" stroke-width="2.5"/>'+
    '<circle class="pr" cx="23" cy="23" r="'+R+'" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C+'" transform="rotate(-90 23 23)"/>'+
    '<circle class="ad" cx="23" cy="23" r="4.5"/></svg></button>'+
    '<span class="cmp-lb" aria-hidden="true"></span>';
  document.body.appendChild(cmp);
  var pr=cmp.querySelector('.pr'),lb=cmp.querySelector('.cmp-lb');
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
      function stp(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1100,1),k=1-Math.pow(1-p,3);el.textContent=Math.round(end*k);if(p<1)requestAnimationFrame(stp);}
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
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!amod.hidden)aClose();});
}

/* enquiry forms -> pre-filled email drafts */
document.querySelectorAll('form[data-mailto]').forEach(function(f){
  var note=f.querySelector('.frm-note');
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true;
    f.querySelectorAll('.ff').forEach(function(w){
      var i=w.querySelector('input,textarea,select');if(!i)return;
      var v=i.value.trim();
      var bad=(i.required&&!v)||(i.type==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
      w.classList.toggle('bad',bad);if(bad)ok=false;
    });
    if(!ok){if(note){note.textContent='Please complete the highlighted fields.';note.style.color='#9E0000';}return;}
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
      '<input type="text" placeholder="Search pages, services, actions…" aria-label="Search" autocomplete="off" spellcheck="false">'+
      '<kbd data-close role="button" tabindex="0" aria-label="Close search">ESC</kbd></div>'+
      '<div class="cp-ls" role="listbox" aria-label="Results"></div>'+
      '<div class="cp-ft"><span><kbd>↑↓</kbd>navigate</span><span><kbd>↵</kbd>open</span><span><kbd>esc</kbd>close</span></div></div>';
    document.body.appendChild(cp);
    inp=cp.querySelector('input');ls=cp.querySelector('.cp-ls');
    inp.addEventListener('input',function(){render(inp.value);});
    cp.addEventListener('click',function(e){
      if(e.target.closest('[data-close]')){close();return;}
      var it=e.target.closest('.cp-it');if(it){e.preventDefault();go(+it.dataset.i);}
    });
    cp.addEventListener('keydown',function(e){
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
    if(!res.length){ls.innerHTML='<p class="cp-mt">No match — try “backup”, “website” or “WhatsApp”.</p>';return;}
    res.forEach(function(r,n){
      var el=document.createElement(r.it.u?'a':'button');
      el.className='cp-it'+(n===0?' on':'');
      el.setAttribute('role','option');el.dataset.i=r.i;
      if(r.it.u){el.href=r.it.u;}else{el.type='button';}
      el.innerHTML='<span class="dot" aria-hidden="true"></span><span><b></b><span></span></span><span class="k"></span>';
      el.querySelector('b').textContent=r.it.t;
      el.querySelector('span span').textContent=r.it.d;
      el.querySelector('.k').textContent=r.it.g;
      ls.appendChild(el);items.push(el);
    });
  }
  function move(d){
    if(!items.length)return;
    items[sel].classList.remove('on');
    sel=(sel+d+items.length)%items.length;
    items[sel].classList.add('on');
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
