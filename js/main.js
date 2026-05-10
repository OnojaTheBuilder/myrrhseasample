/* ═══════════════════════════════════════════
   MYRRH SEA MERCANTILE — Main JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── ANNOUNCEMENT BAR ── */
  const msgs = document.querySelectorAll('.ann-msg');
  const annP = document.getElementById('annP');
  const annN = document.getElementById('annN');
  let cur = 0;

  function showMsg(i) {
    msgs.forEach(m => m.classList.remove('on'));
    msgs[i].classList.add('on');
  }

  annN?.addEventListener('click', () => { cur = (cur + 1) % msgs.length; showMsg(cur); });
  annP?.addEventListener('click', () => { cur = (cur - 1 + msgs.length) % msgs.length; showMsg(cur); });
  setInterval(() => { cur = (cur + 1) % msgs.length; showMsg(cur); }, 4000);

  /* ── HEADER SCROLL BEHAVIOR ── */
  const hdr = document.getElementById('hdr');
  const ann = document.getElementById('ann');
  const ANN_H = ann ? ann.offsetHeight : 40;
  let prev = 0;

  function onScroll() {
    const s = window.scrollY;
    s > 80 ? hdr.classList.add('solid') : hdr.classList.remove('solid');
    if (s > ANN_H + 10 && s > prev) hdr.classList.add('rise');
    else if (s < prev) hdr.classList.remove('rise');
    prev = s;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  /* ── MOBILE NAV ── */
  const ham   = document.getElementById('ham');
  const mob   = document.getElementById('mob');
  const mobX  = document.getElementById('mobX');

  ham?.addEventListener('click', () => {
    mob.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const closeNav = () => {
    mob.classList.remove('open');
    document.body.style.overflow = '';
  };
  mobX?.addEventListener('click', closeNav);
  mob?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ── DRAG-TO-SCROLL CAROUSELS ── */
  function makeDrag(el) {
    if (!el) return;
    let down = false, sx, sl;
    el.addEventListener('mousedown', e => {
      down = true; el.classList.add('drag');
      sx = e.pageX - el.offsetLeft; sl = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { down = false; el.classList.remove('drag'); });
    el.addEventListener('mouseup', () => { down = false; el.classList.remove('drag'); });
    el.addEventListener('mousemove', e => {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.4;
    });
    let tx, tsl;
    el.addEventListener('touchstart', e => { tx = e.touches[0].pageX; tsl = el.scrollLeft; }, { passive: true });
    el.addEventListener('touchmove', e => { el.scrollLeft = tsl + (tx - e.touches[0].pageX); }, { passive: true });
  }

  document.querySelectorAll('.h-scroll').forEach(makeDrag);

  /* ── DUPLICATE STRIP FOR INFINITE LOOP ── */
  const strip = document.getElementById('strip');
  if (strip) strip.innerHTML += strip.innerHTML;

  /* ── DISCOVER TABS ── */
  document.querySelectorAll('.d-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      this.closest('.disc-tabs')?.querySelectorAll('.d-tab').forEach(t => t.classList.remove('on'));
      this.classList.add('on');
    });
  });

  /* ── SHOP FILTER BUTTONS ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── SCROLL REVEAL ── */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
  }

  /* ── ACTIVE NAV LINK ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.hn-l a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === 'index.html' && href === 'index.html') ||
        (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── CONTACT FORM ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msg = document.getElementById('cfMsg');
      const btn = document.getElementById('cfBtn');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        msg.style.display = 'block';
        msg.style.color = '#111';
        msg.textContent = 'Message sent. We\'ll be in touch shortly.';
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        setTimeout(() => { msg.style.display = 'none'; }, 6000);
      }, 800);
    });
  }

});
