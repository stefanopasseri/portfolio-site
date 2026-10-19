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

  // Header: hides while scrolling down, comes back on any scroll up (always shown near the top).
  var top = document.querySelector('.top');
  if (top) {
    var last = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY, d = y - last;
      if (y < 80) top.classList.remove('away');
      else if (d > 6) top.classList.add('away');
      else if (d < -6) top.classList.remove('away');
      if (Math.abs(d) > 6) last = y;
    }, { passive: true });
  }

  // 2. Home. With a pointer: pointing at a title opens that work's clip (a photo for works without one,
  //    or if motion is reduced) just under the title, behind the list; leaving the title closes it.
  //    Clips are made once and kept, so coming back to a title continues its clip.
  //    On touch screens: one photo under the list, chosen at random on each visit.
  var pick = document.getElementById('pick');
  if (pick) {
    var M = '/images/index/';
    var WORKS = {
      ghost: ['Ghost of Ghost', 1], double: ['Double (December 1612)', 1], larry: ['Larry', 1],
      posture: ['A Question of Posture', 1], graybox: ['Gray Box', 1], torus: ['Twisted Torus', 0], characters: ['Cast of Characters', 0]
    };
    var clipSrc = function (k) { return k === 'double' ? '/images/thumbs/double.mp4?v=2' : M + k + '.mp4'; };
    var pointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (pointer) {
      pick.classList.add('hov');
      var home = document.querySelector('.home'), clips = {};
      var clip = function (k) {
        if (!clips[k]) {
          var v = document.createElement('video');
          v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
          v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
          v.src = clipSrc(k);
          clips[k] = v;
        }
        return clips[k];
      };
      var close = function () { pick.querySelectorAll('video').forEach(function (v) { v.pause(); }); pick.innerHTML = ''; };
      Object.keys(WORKS).forEach(function (k) {
        var im = new Image(); im.src = M + k + '.jpg';
        if (WORKS[k][1] && !reduce) clip(k);
      });
      document.querySelectorAll('.tindex a').forEach(function (a) {
        a.addEventListener('mouseenter', function () {
          var k = a.dataset.k; if (!WORKS[k]) return;
          close();
          if (WORKS[k][1] && !reduce) {
            var v = clip(k); pick.appendChild(v);
            var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
          } else {
            var im = document.createElement('img'); im.src = M + k + '.jpg'; im.alt = ''; pick.appendChild(im);
          }
          var hr = home.getBoundingClientRect(), tr = a.querySelector('.tt').getBoundingClientRect();
          pick.style.top = (tr.bottom - hr.top + 10) + 'px';
          pick.style.left = (tr.left - hr.left) + 'px';
        });
        a.addEventListener('mouseleave', close);
      });
    } else {
      var keys = Object.keys(WORKS), k = keys[Math.floor(Math.random() * keys.length)];
      pick.removeAttribute('aria-hidden');
      pick.innerHTML = '<a href="/projects/' + k + '.html"><img src="' + M + k + '.jpg" alt="' + WORKS[k][0] + '"></a>' +
        '<figcaption><a href="/projects/' + k + '.html">' + WORKS[k][0] + '</a></figcaption>';
    }
  }

  // 3. Idle: after three minutes with no input, one image in view sinks 2px and stays until you leave the page.
  if (!reduce) {
    var timer = null, settled = false;
    var arm = function () {
      clearTimeout(timer);
      if (settled) return;
      timer = setTimeout(function () {
        var els = Array.prototype.filter.call(document.querySelectorAll('.pick img, .thumb, .fig img, .fig video, .grid img, .grid video, .stack img'), function (el) {
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
