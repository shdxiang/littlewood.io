// 小木块 图解页共用脚本：滚动渐显、阅读进度、返回顶部、快速导航高亮。
(function(){
  var $ = function(id){ return document.getElementById(id); };
  // 滚动渐显
  var targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)){
    targets.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.06});
    targets.forEach(function(el){ io.observe(el); });
  }

  // 阅读进度、快速导航与返回顶部
  var progress = $('readingProgress');
  var backTop = $('backTop');
  var ticking = false;
  function updateScrollUI(){
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    var y = window.scrollY || doc.scrollTop;
    progress.style.transform = 'scaleX(' + Math.min(1, y / max) + ')';
    backTop.classList.toggle('show', y > 700);
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ window.requestAnimationFrame(updateScrollUI); ticking = true; }
  }, {passive:true});
  window.addEventListener('resize', updateScrollUI, {passive:true});
  backTop.addEventListener('click', function(){
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top:0, behavior:reduceMotion ? 'auto' : 'smooth'});
  });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.quicknav a'));
  var navTargets = navLinks.map(function(link){ return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window){
    var navIo = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          navLinks.forEach(function(link){
            var active = link.getAttribute('href') === '#' + entry.target.id;
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, {rootMargin:'-20% 0px -65% 0px'});
    navTargets.forEach(function(target){ navIo.observe(target); });
  }
  updateScrollUI();
})();
