// stefanopasseri.com: the few small behaviors the site has.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover)').matches;

  // 1. The name: each letter gets its own small sag (0.5 to 2.7px) and delay, used on hover.
  var name = document.querySelector('.name');
  if (name) {
    var txt = name.textContent;
    name.setAttribute('aria-label', txt);
    name.textContent = '';
    for (var i = 0; i < txt.length; i++) {
      var c = document.createElement('span');
      c.className = 'ch';
      c.setAttribute('aria-hidden', 'true');
      c.textContent = txt[i] === ' ' ? ' ' : txt[i];
      c.style.setProperty('--d', (0.5 + Math.random() * 2.2).toFixed(2) + 'px');
      c.style.transitionDelay = (Math.random() * 0.25).toFixed(2) + 's';
      name.appendChild(c);
    }
  }

  // 2. Home thumbnails: a still from each work's clip. Resting the pointer on a row plays the clip
  //    from there; moving away pauses it wherever it is. A clip loads only the first time.
  document.querySelectorAll('.hrow').forEach(function (row) {
    var box = row.querySelector('.thumb');
    var v = box && box.querySelector('video');
    if (!v) return;
    row.addEventListener('mouseenter', function () {
      if (!canHover || reduce) return;
      if (!v.getAttribute('src')) {
        v.setAttribute('src', v.dataset.src);
        v.addEventListener('playing', function () { box.classList.add('started'); });
      }
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
    row.addEventListener('mouseleave', function () { v.pause(); });
  });

  // 3. Idle: after three minutes with no input, one image in view sinks 2px and stays until you leave the page.
  if (!reduce) {
    var timer = null, settled = false;
    var arm = function () {
      clearTimeout(timer);
      if (settled) return;
      timer = setTimeout(function () {
        var els = Array.prototype.filter.call(document.querySelectorAll('.thumb, .fig img, .fig video, .grid img, .grid video, .stack img'), function (el) {
          var r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
        });
        if (els.length) { els[Math.floor(Math.random() * els.length)].classList.add('settle'); settled = true; }
      }, 180000);
    };
    ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (ev) {
      window.addEventListener(ev, arm, { passive: true });
    });
    arm();
  }
})();
