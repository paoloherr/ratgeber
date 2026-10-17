// Karten erscheinen beim Scrollen (dezent, Paolo 17.10.2026). Ohne IntersectionObserver oder bei
// reduzierter Bewegung bleibt alles sofort sichtbar. Kein Tracking, keine Speicherung.
(function(){
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var karten=[].slice.call(document.querySelectorAll('.karte'));
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){e.target.classList.remove('vor');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px'});
  karten.forEach(function(k){var r=k.getBoundingClientRect();
    if(r.top<innerHeight)return;   // schon sichtbar: nicht verstecken (kein Flackern)
    k.classList.add('vor');io.observe(k);});
})();
