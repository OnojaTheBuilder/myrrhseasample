/* ═══════════════════════════════════════════
   MYRRH SEA MERCANTILE — Main JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  const isHome = document.body.classList.contains('home');
  const hdr    = document.getElementById('hdr');
  const ann    = document.getElementById('ann');
  const ANN_H  = ann ? ann.offsetHeight : 40;

  /* ── ANNOUNCEMENT BAR CYCLING ── */
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

  /* ── HEADER + ANN BAR SCROLL BEHAVIOR ── */
  let prev = 0;

  function onScroll() {
    const s = window.scrollY;

   if (!isHome) {
      hdr.classList.add('solid');
      hdr.style.top = '0';

    } else {
      /* ── HOME PAGE ──
         Ann bar hides when scrolling down
         Ann bar reappears when back at top
         Header transparent over hero, white on scroll */

      if (s > 10) {
        // Scrolled — hide ann bar, header rises to top
        ann.style.transform = 'translateY(-100%)';
        hdr.style.top = '0';
      } else {
        // At very top — show ann bar, header below it
        ann.style.transform = 'translateY(0)';
        hdr.style.top = ANN_H + 'px';
      }

      // Header transparency
      if (s > 80) {
        hdr.classList.add('solid');
      } else {
        hdr.classList.remove('solid');
      }
    }

    prev = s;
  }

  // Set ann bar transition
  if (ann) {
    ann.style.transition = 'transform 0.35s ease';
  }
  if (hdr) {
    hdr.style.transition = 'background 0.3s ease, border-color 0.3s ease, top 0.35s ease';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run immediately on load

  /* ── MOBILE NAV ── */
  const ham  = document.getElementById('ham');
  const mob  = document.getElementById('mob');
  const mobX = document.getElementById('mobX');

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
      down = true;
      el.classList.add('drag');
      sx = e.pageX - el.offsetLeft;
      sl = el.scrollLeft;
    });
    el.addEventListener('mouseleave', () => { down = false; el.classList.remove('drag'); });
    el.addEventListener('mouseup',    () => { down = false; el.classList.remove('drag'); });
    el.addEventListener('mousemove',  e => {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - el.offsetLeft - sx) * 1.4;
    });
    let tx, tsl;
    el.addEventListener('touchstart', e => {
      tx = e.touches[0].pageX;
      tsl = el.scrollLeft;
    }, { passive: true });
    el.addEventListener('touchmove', e => {
      el.scrollLeft = tsl + (tx - e.touches[0].pageX);
    }, { passive: true });
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
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.rv').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
  }

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

/* ═══════════════════════════════════════════
   PRODUCT IMAGE OPTIONS
   hover  → CSS swap (tap-to-flip on touch)
   slider → arrows / dots / swipe
   fade   → auto-advancing crossfade (pauses on hover, off-screen, hidden tab)
   ═══════════════════════════════════════════ */
(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch  = window.matchMedia && window.matchMedia('(hover: none)').matches;

  /* 1) HOVER SWAP — tap on touch devices */
  document.querySelectorAll('.pc-img[data-mode="hover"]').forEach(box => {
    if (touch) box.addEventListener('click', e => {
      if (e.target.closest('.pc-plus, .pc-sizes')) return;
      box.classList.toggle('flip');
    });
  });

  /* 2) SLIDESHOW */
  document.querySelectorAll('.pc-img[data-mode="slider"]').forEach(box => {
    const track = box.querySelector('.pc-track');
    const n     = track.children.length;
    const dots  = box.querySelectorAll('.pc-dots button');
    let i = 0;
    function go(k) {
      i = (k + n) % n;
      track.style.transform = 'translateX(' + (-100 * i) + '%)';
      dots.forEach((d, j) => d.classList.toggle('on', j === i));
    }
    box.querySelector('.prev').addEventListener('click', e => { e.stopPropagation(); go(i - 1); });
    box.querySelector('.next').addEventListener('click', e => { e.stopPropagation(); go(i + 1); });
    dots.forEach((d, j) => d.addEventListener('click', e => { e.stopPropagation(); go(j); }));
    /* swipe */
    let sx = null;
    box.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    }, { passive: true });
  });

  /* 3) AUTO-FADE */
  document.querySelectorAll('.pc-img[data-mode="fade"]').forEach((box, idx) => {
    const imgs = box.querySelectorAll('.pc-stack img');
    const dots = box.querySelectorAll('.pc-dots button');
    const n = imgs.length;
    let i = 0, hover = false, visible = true, timer = null;
    function show(k) {
      i = (k + n) % n;
      imgs.forEach((im, j) => { im.style.opacity = (j === i) ? 1 : 0; });
      dots.forEach((d, j) => d.classList.toggle('on', j === i));
    }
    dots.forEach((d, j) => d.addEventListener('click', e => { e.stopPropagation(); show(j); }));
    box.addEventListener('mouseenter', () => { hover = true; });
    box.addEventListener('mouseleave', () => { hover = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(box);
    }
    if (reduce) return;                       /* respect reduced-motion: no autoplay */
    /* stagger the cards so they don't all change at once */
    setTimeout(() => {
      timer = setInterval(() => {
        if (hover || !visible || document.hidden) return;
        show(i + 1);
      }, 3200);
    }, 900 + idx * 700);
  });
})();
