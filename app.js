(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* arrancar siempre arriba: sin restauración de scroll ni salto por ancla al cargar */
  if('scrollRestoration' in history){ history.scrollRestoration='manual'; }
  window.addEventListener('load', function(){
    if(!window.location.hash){ window.scrollTo(0,0); }
  });

  /* filters (operate on real link cards) */
  var chipBtns=document.querySelectorAll('.chip-btn');
  chipBtns.forEach(function(b){
    b.addEventListener('click',function(){
      chipBtns.forEach(function(x){x.classList.remove('active');}); b.classList.add('active');
      var f=b.getAttribute('data-filter');
      document.querySelectorAll('.log').forEach(function(c){
        c.classList.toggle('hide', !(f==='all'||c.getAttribute('data-status')===f));
      });
    });
  });

  /* hero canvas */
  var cv=document.getElementById('traj');
  if(cv){
    var ctx=cv.getContext('2d'),W,H,dpr;
    function size(){dpr=Math.min(window.devicePixelRatio||1,2);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
    function yAt(px){var t=px/W;return H*0.34+t*(H*0.34)+Math.sin(t*Math.PI*3.1)*H*0.11*(1-t*0.35);}
    var prog=0,dir=1;
    var roR=document.getElementById('ro-range'),roA=document.getElementById('ro-alt'),roV=document.getElementById('ro-vel');
    function frame(){
      ctx.clearRect(0,0,W,H);
      ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
      for(var gx=0;gx<W;gx+=96){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,H);ctx.stroke();}
      ctx.beginPath();for(var x=0;x<=W;x+=6){var y=yAt(x);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.strokeStyle='rgba(84,224,230,0.16)';ctx.lineWidth=1.4;ctx.stroke();
      var end=W*prog;
      var grad=ctx.createLinearGradient(0,0,Math.max(end,1),0);
      grad.addColorStop(0,'rgba(84,224,230,0.25)');grad.addColorStop(1,'rgba(84,224,230,0.95)');
      ctx.beginPath();for(var x2=0;x2<=end;x2+=5){var y2=yAt(x2);x2===0?ctx.moveTo(x2,y2):ctx.lineTo(x2,y2);}
      ctx.strokeStyle=grad;ctx.lineWidth=2.2;ctx.stroke();
      var nx=end,ny=yAt(end);
      var g=ctx.createRadialGradient(nx,ny,0,nx,ny,26);
      g.addColorStop(0,'rgba(84,224,230,0.5)');g.addColorStop(1,'rgba(84,224,230,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(nx,ny,26,0,7);ctx.fill();
      ctx.fillStyle='#8cf2f6';ctx.beginPath();ctx.arc(nx,ny,3.4,0,7);ctx.fill();
      ctx.strokeStyle='rgba(84,224,230,0.28)';ctx.setLineDash([3,5]);
      ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(nx,H);ctx.stroke();ctx.setLineDash([]);
      if(roR){roR.textContent=Math.round(prog*4280)+' km';roA.textContent=Math.round((H-ny)/H*100)+' km';roV.textContent=(0.30+prog*0.16).toFixed(2)+' m/s';}
    }
    function loop(){prog+=dir*0.0016;if(prog>=1){prog=1;dir=-1;}if(prog<=0){prog=0;dir=1;}frame();requestAnimationFrame(loop);}
    function init(){size();if(reduce){prog=1;frame();}else{loop();}}
    window.addEventListener('resize',function(){size();if(reduce)frame();});
    init();
    if(!reduce){
      var hero=document.querySelector('.hero');
      hero.addEventListener('mousemove',function(e){
        var r=hero.getBoundingClientRect();
        var dx=(e.clientX-r.left)/r.width-0.5, dy=(e.clientY-r.top)/r.height-0.5;
        cv.style.transform='translate('+(dx*-16)+'px,'+(dy*-12)+'px)';
      });
      hero.addEventListener('mouseleave',function(){cv.style.transform='translate(0,0)';});
    }
  }

  /* scroll reveal */
  if(!reduce&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});
  } else { document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');}); }
})();
