(() => {
 const root=document.documentElement;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

 // Interactive cosmic field: layered stars, nebulae and pointer-driven gravitational drift.
 const canvas=document.getElementById('cosmos');
 if(canvas){
  const ctx=canvas.getContext('2d'); let w=0,h=0,dpr=1,stars=[],pointer={x:innerWidth*.5,y:innerHeight*.35,tx:innerWidth*.5,ty:innerHeight*.35},frame=0;
  const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const n=Math.min(240,Math.max(90,Math.round(w*h/6500)));stars=Array.from({length:n},(_,i)=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.35+.25,a:Math.random()*.55+.18,p:Math.random()*Math.PI*2,s:Math.random()*.012+.003,depth:Math.random()*.9+.1,hue:Math.random()<.72?255:185}));};
  resize();window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('pointermove',e=>{pointer.tx=e.clientX;pointer.ty=e.clientY},{passive:true});
  const draw=()=>{frame++;pointer.x+=(pointer.tx-pointer.x)*.16;pointer.y+=(pointer.ty-pointer.y)*.16;ctx.clearRect(0,0,w,h);
   // Slow, layered violet/cyan nebulae respond to cursor position.
   const nebula=(x,y,r,c1,c2)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c1);g.addColorStop(.42,c2);g.addColorStop(1,'rgba(8,9,17,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)};
   nebula(w*.24+(pointer.x-w/2)*.22,h*.18+(pointer.y-h/2)*.18,Math.max(w*.42,340),'rgba(122,76,255,.27)','rgba(76,47,177,.11)');
   nebula(w*.79+(pointer.x-w/2)*-.26,h*.62+(pointer.y-h/2)*-.18,Math.max(w*.38,300),'rgba(55,151,220,.19)','rgba(103,57,205,.09)');
   nebula(pointer.x,pointer.y,Math.max(115,Math.min(w,h)*.12),'rgba(160,137,255,.24)','rgba(106,122,235,.08)');
   // Fine star points bend subtly around the pointer and shimmer independently.
   for(const st of stars){const dx=st.x-pointer.x,dy=st.y-pointer.y,dist=Math.hypot(dx,dy)||1,pull=Math.max(0,1-dist/300)*24*st.depth;const x=st.x-dx/dist*pull,y=st.y-dy/dist*pull;const alpha=st.a*(.68+.32*Math.sin(frame*st.s+st.p));ctx.beginPath();ctx.fillStyle=st.hue===185?`rgba(145,226,244,${alpha})`:`rgba(218,207,255,${alpha})`;ctx.shadowBlur=st.r>1.05?10:4;ctx.shadowColor=st.hue===185?'#74dff4':'#a58cff';ctx.arc(x,y,st.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
   // Soft orbit lines become visible around the pointer without distracting from content.
   const radius=13+Math.sin(frame*.025)*1.2;ctx.beginPath();ctx.strokeStyle='rgba(190,177,255,.32)';ctx.lineWidth=1;ctx.arc(pointer.x,pointer.y,radius,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.fillStyle='rgba(205,195,255,.65)';ctx.shadowBlur=10;ctx.shadowColor='rgba(151,123,255,.7)';ctx.arc(pointer.x,pointer.y,1.8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
   requestAnimationFrame(draw);
  };if(!reduced)requestAnimationFrame(draw);else{ctx.clearRect(0,0,w,h)}
 }

 const progress=document.querySelector('.progress');
 const glow=document.querySelector('.ambient-glow');
 const orbit=document.querySelector('.cursor-orbit');
 const workCursor=document.querySelector('.work-cursor');
 const finePointer=matchMedia('(hover:hover) and (pointer:fine)').matches;
 const updateProgress=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?window.scrollY/max*100:0)+'%'};
 window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
 document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.classList.add('image-unavailable');img.setAttribute('aria-hidden','true')},{once:true}));
 const button=document.querySelector('.hamb'),nav=document.querySelector('.nav nav');
 const closeMenu=()=>{nav?.classList.remove('open');button?.setAttribute('aria-expanded','false');button?.setAttribute('aria-label','Open menu')};
 if(button&&nav){button.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Close menu':'Open menu')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()})}
 const items=document.querySelectorAll('.reveal');
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.1,rootMargin:'0px 0px -30px 0px'});items.forEach(item=>observer.observe(item))}else items.forEach(item=>item.classList.add('visible'));
 if(finePointer&&!reduced){let raf=0,lastX=innerWidth*.68,lastY=innerHeight*.25;window.addEventListener('pointermove',e=>{lastX=e.clientX;lastY=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{root.style.setProperty('--mx',lastX+'px');root.style.setProperty('--my',lastY+'px');root.style.setProperty('--cx',lastX+'px');root.style.setProperty('--cy',lastY+'px');raf=0})},{passive:true});
  // Reference-style cursor: keep a soft halo everywhere, and show the
  // ivory circular arrow + underline when hovering interactive content.
  const interactiveSelector='a,button,[role="button"],.project-media,.journal-media,.feature-visual,.service,.cta-strip,.email';
  let activeTarget=null;
  const setHoverTarget=(node)=>{
    const target=node?.closest?.(interactiveSelector) || null;
    if(target===activeTarget)return;
    activeTarget=target;
    workCursor?.classList.toggle('active',!!target);
    workCursor?.classList.toggle('email-cursor',!!target?.matches('.email'));
    document.body.classList.toggle('cursor-link-active',!!target);
    document.body.classList.toggle('cursor-email-active',!!target?.matches('.email'));
    if(orbit) orbit.style.opacity=target?'0':'1';
  };
  document.addEventListener('pointermove',e=>{
    workCursor?.style.setProperty('left',e.clientX+'px');
    workCursor?.style.setProperty('top',e.clientY+'px');
    setHoverTarget(e.target);
  },{passive:true});
  document.addEventListener('pointerover',e=>setHoverTarget(e.target),{passive:true});
  document.addEventListener('pointerout',e=>{
    if(!e.relatedTarget) {
      activeTarget=null;
      workCursor?.classList.remove('active','email-cursor');
      document.body.classList.remove('cursor-link-active','cursor-email-active');
      if(orbit) orbit.style.opacity='1';
    } else {
      setHoverTarget(e.relatedTarget);
    }
  },{passive:true});
 }
 // Subtle pointer-responsive parallax for the hero portrait and glowing artwork.
 const portrait=document.querySelector('.hero-portrait img');
 if(portrait&&finePointer&&!reduced){const hero=document.querySelector('.hero');hero?.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;portrait.style.transform=`scale(1.025) translate(${x*-7}px,${y*-5}px)`});hero?.addEventListener('pointerleave',()=>portrait.style.transform='')}
})();


// v12 cursor state reinforcement: resolve nested text spans and SVGs to their link/button.
document.addEventListener('pointermove', function(e) {
  const cursor = document.querySelector('.work-cursor');
  if (!cursor) return;
  const hit = e.target && e.target.closest
    ? e.target.closest('a,button,[role="button"],.project-media,.journal-media,.feature-visual,.service,.cta-strip')
    : null;
  cursor.classList.toggle('active', !!hit);
  cursor.classList.toggle('email-cursor', !!(hit && hit.matches('.email')));
  document.body.classList.toggle('cursor-email-active', !!(hit && hit.matches('.email')));
}, {capture:true, passive:true});
