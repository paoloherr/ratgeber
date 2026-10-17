// Karten erscheinen beim Scrollen und tragen einen Lichtreflex, der der Maus folgt (dezent, Paolo 17.10.2026).
// Bei reduzierter Bewegung bleibt alles statisch und sofort sichtbar. Kein Tracking, keine Speicherung.
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var karten=[].slice.call(document.querySelectorAll('.karte'));
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
