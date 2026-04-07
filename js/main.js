/* ─── Loader ─────────────────────────────────── */
(function () {
  const loader  = document.getElementById('loader');
  const counter = document.getElementById('loader-count');
  const bar     = document.getElementById('loader-bar');
  let count = 0;
  const total = 100;
  const duration = 1400; // ms
  const step = duration / total;

  const tick = setInterval(() => {
    count++;
    counter.textContent = count;
    bar.style.width = count + '%';
    if (count >= total) {
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('hide');
        document.body.classList.remove('no-scroll');
        setTimeout(() => loader.remove(), 900);
      }, 200);
    }
  }, step);

  document.body.classList.add('no-scroll');
})();

/* ─── Custom Cursor ──────────────────────────── */
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // Dot: instant. Ring: lag
  function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  // Hover effect
  document.querySelectorAll('a, button, .work-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─── Scroll Reveal (IntersectionObserver) ───── */
(function () {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in-view'), +delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
})();

/* ─── Nav — shrink on scroll ─────────────────── */
(function () {
  const nav = document.getElementById('nav');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 80);
    lastY = y;
  }, { passive: true });
})();

/* ─── Active nav link highlight ──────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__links a');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
})();

/* ─── Contact Form (Web3Forms) ───────────────── */
(function () {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn    = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Button loading state
    btn.disabled = true;
    btn.textContent = 'Sending…';
    status.className = '';
    status.textContent = '';

    const formData = new FormData(form);
    const object   = Object.fromEntries(formData);
    const json     = JSON.stringify(object);

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    json
      });
      const data = await res.json();

      if (data.success) {
        status.className   = 'success';
        status.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
        form.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      status.className   = 'error';
      status.textContent = '✗ Could not send. Please email me directly: ss613999@gmail.com';
    } finally {
      btn.disabled  = false;
      btn.innerHTML = 'Send Message <span aria-hidden="true">→</span>';
    }
  });
})();
