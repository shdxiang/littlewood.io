// Littlewood 图解页共用脚本：滚动渐显。
(function(){
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){
    targets.forEach(function(el){ el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {rootMargin:'0px 0px -8% 0px', threshold:0.06});
  targets.forEach(function(el){ io.observe(el); });
})();
