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

/* meridian scroll progress */
var mer=document.querySelector('.mer .mer-fill');
if(mer){
  var mtick=false;
  function merUpd(){
    var h=document.documentElement.scrollHeight-window.innerHeight;
    mer.style.transform='scaleY('+(h>0?Math.min(window.scrollY/h,1):0)+')';
    mtick=false;
  }
  window.addEventListener('scroll',function(){if(!mtick){mtick=true;requestAnimationFrame(merUpd);}},{passive:true});
  merUpd();
}

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
})();
