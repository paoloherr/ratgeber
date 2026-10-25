// Startseite 26.10.2026: Lichtfäden im Hero (Canvas, nur Seitenfarben, keine Dateien nachgeladen), Karten erscheinen
// beim Scrollen und tragen einen Lichtreflex, der der Maus folgt. Bei reduzierter Bewegung steht alles still und
// sofort sichtbar. Kein Tracking, keine Speicherung.
(function(){
  var c=document.querySelector('.hero-fx');
  if(c&&c.getContext){
    var ctx=c.getContext('2d'),cols=(c.dataset.farben||'#9ec5ff,#ff96d2').split(','),w=0,h=0,dpr=1,y0=0,ps=[],t=0,laeuft=false,sichtbar=true,letzt=0;
    var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var gl=function(a,b,x){x=Math.min(1,Math.max(0,(x-a)/(b-a)));return x*x*(3-2*x);};
    var groesse=function(){
      var r=c.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,1.5);w=r.width;h=r.height;
      c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
      y0=w<640?w*0.30:Math.min(h,w*0.4167)*0.43;
      var n=w<640?20:46;ps=[];
      for(var i=0;i<n;i++)ps.push({x:Math.random()*w,y:Math.random()*Math.min(h,w<640?w:w*0.4167),r:.7+Math.random()*1.5,s:.1+Math.random()*.3,p:Math.random()*6.28,k:i%cols.length});
    };
    var zeichne=function(){
      ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='lighter';ctx.lineWidth=1.3;
      for(var k=0;k<cols.length;k++){
        ctx.strokeStyle=cols[k];ctx.globalAlpha=.34;ctx.beginPath();
        var f=.006+k*.0007,sp=.5+k*.07,ph=k*1.3,off=(k-cols.length/2)*(w<640?2.2:4.2);
        for(var x=0;x<=w;x+=8){
          var env=gl(.16,.5,Math.abs(x-w/2)/(w/2));
          var y=y0+off*env+Math.sin(x*f+t*sp+ph)*(10+k*2.2)*env+Math.sin(x*f*2.3-t*sp*.6)*5*env;
          if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      }
      for(var i=0;i<ps.length;i++){
        var q=ps[i];ctx.fillStyle=cols[q.k];ctx.globalAlpha=.25+.45*Math.abs(Math.sin(t*.9+q.p));
        ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,6.283);ctx.fill();
        if(!still){q.y-=q.s;q.x+=Math.sin(t*.4+q.p)*.15;if(q.y<-4){q.y=Math.min(h,w<640?w:w*0.4167)+4;q.x=Math.random()*w;}}
      }
      ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    };
    var takt=function(z){
      if(!laeuft)return;requestAnimationFrame(takt);
      if(z-letzt<33)return;t+=(z-letzt)/1000*1.0;letzt=z;zeichne();
    };
    var start=function(){if(still||laeuft||!sichtbar||document.hidden)return;laeuft=true;letzt=performance.now();requestAnimationFrame(takt);};
    groesse();zeichne();
    if(!still){
      if('IntersectionObserver' in window)new IntersectionObserver(function(e){sichtbar=e[0].isIntersecting;if(sichtbar)start();else laeuft=false;}).observe(c);
      document.addEventListener('visibilitychange',function(){if(document.hidden)laeuft=false;else start();});
      start();
    }
    var rz;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){groesse();zeichne();},150);});
  }
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var karten=[].slice.call(document.querySelectorAll('.karte,.neu-karte'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){e.target.classList.remove('vor');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px'});
    karten.forEach(function(k){if(k.getBoundingClientRect().top<innerHeight)return;k.classList.add('vor');io.observe(k);});
  }
  // Lichtreflex: ein Listener am Raster, je Bild nur ein Schreibvorgang (requestAnimationFrame)
  var raster=document.querySelector('.karten');
  if(!raster||!matchMedia('(hover: hover)').matches)return;
  var x=0,y=0,ziel=null,offen=false;
  raster.addEventListener('pointermove',function(ev){
    ziel=ev.target.closest&&ev.target.closest('.karte');x=ev.clientX;y=ev.clientY;
    if(ziel&&!offen){offen=true;requestAnimationFrame(function(){offen=false;if(!ziel)return;
      var r=ziel.getBoundingClientRect();ziel.style.setProperty('--mx',(x-r.left)+'px');ziel.style.setProperty('--my',(y-r.top)+'px');});}
  },{passive:true});
})();
