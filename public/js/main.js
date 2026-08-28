// Marketing Integration LLC — main.js
(function () {
  'use strict';

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '✕' : '☰';
    });
    // Close on link click
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Header scrolled state
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Count-up stats
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        cio.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1600;
        var start = null;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          var val = target * ease;
          el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Bento spotlight (mouse-follow glow)
  var tiles = document.querySelectorAll('.bento-tile, .result-item, .stat');
  tiles.forEach(function (tile) {
    tile.addEventListener('mousemove', function (e) {
      var r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Back-to-top floating button (draggable + click to jump)
  (function () {
    var btn = document.createElement('button');
    btn.className = 'to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.setAttribute('title', 'Back to top');
    btn.innerHTML = '<span class="arr-up">↑</span>';
    document.body.appendChild(btn);

    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('visible', window.scrollY > 420);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Click → smooth scroll to top (unless just dragged)
    var moved = false;
    btn.addEventListener('click', function () {
      if (moved) { moved = false; return; }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Drag to reposition (pointer events, works for mouse + touch)
    var startX = 0, startY = 0, origLeft = 0, origTop = 0, dragging = false;
    btn.addEventListener('pointerdown', function (e) {
      dragging = true;
      moved = false;
      btn.classList.add('dragging');
      btn.setPointerCapture(e.pointerId);
      var r = btn.getBoundingClientRect();
      startX = e.clientX; startY = e.clientY;
      origLeft = r.left; origTop = r.top;
    });
    btn.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      var x = origLeft + dx;
      var y = origTop + dy;
      // Keep on screen
      x = Math.max(8, Math.min(window.innerWidth - btn.offsetWidth - 8, x));
      y = Math.max(8, Math.min(window.innerHeight - btn.offsetHeight - 8, y));
      btn.style.left = x + 'px';
      btn.style.top = y + 'px';
      btn.style.right = 'auto';
      btn.style.bottom = 'auto';
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      btn.classList.remove('dragging');
      try { btn.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    btn.addEventListener('pointerup', endDrag);
    btn.addEventListener('pointercancel', endDrag);
  })();

  // Contact form → POST to /api/contact (GitHub CSV lead capture)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      var data = {};
      ['name', 'email', 'phone', 'company', 'interest', 'message'].forEach(function (k) {
        var el = document.getElementById(k);
        if (el) data[k] = el.value;
      });
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.d.error || 'Request failed');
        form.hidden = true;
        var ok = document.getElementById('formSuccess');
        if (ok) ok.hidden = false;
      })
      .catch(function (err) {
        if (btn) { btn.disabled = false; btn.textContent = 'Send My Request →'; }
        var note = document.querySelector('.form-note');
        if (note) { note.textContent = '⚠ ' + err.message + ' — email jacklee@marketingintegrationllc.com instead.'; note.style.color = '#c00'; }
      });
    });
  }
})();
