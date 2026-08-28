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
