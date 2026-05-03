/* ===== TOUCH DETECTION ===== */
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (!isTouch) document.body.classList.add('has-cursor');

/* ===== CUSTOM CURSOR ===== */
if (!isTouch) {
  const cur = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });

  (function animR() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    curR.style.left = rx + 'px';
    curR.style.top = ry + 'px';
    requestAnimationFrame(animR);
  })();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cur.style.width = '14px'; cur.style.height = '14px'; cur.style.background = 'var(--teal)';
      curR.style.width = '52px'; curR.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cur.style.width = '7px'; cur.style.height = '7px'; cur.style.background = 'var(--accent)';
      curR.style.width = '32px'; curR.style.height = '32px';
    });
  });
}

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ===== NAV SCROLL EFFECT ===== */
const nav = document.querySelector('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
  lastScroll = window.scrollY;
}, { passive: true });

/* ===== BACK TO TOP ===== */
const backTop = document.getElementById('backTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > window.innerHeight);
  }, { passive: true });
  backTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== MARQUEE ===== */
const skills = [
  'JavaScript ES6+', 'Python', 'scikit-learn', 'AWS Cloud', 'HTML5 & CSS3',
  'REST APIs', 'Razorpay', 'NLTK & NLP', 'Figma', 'Git & GitHub',
  'React.js', 'TF-IDF Vectorization', 'Responsive Design', 'Web3Forms',
  'DOM Manipulation', 'IEEE Research'
];
const mq = document.getElementById('mq');
if (mq) {
  mq.innerHTML = [...skills, ...skills, ...skills, ...skills]
    .map(s => `<div class="mqi">${s}<b>◆</b></div>`).join('');
}

/* ===== HERO CANVAS ===== */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  (function initHeroCanvas() {
    const c = document.getElementById('heroC');
    if (!c) return;
    const ctx = c.getContext('2d');

    function rsz() { c.width = c.offsetWidth; c.height = c.offsetHeight; }
    rsz();
    window.addEventListener('resize', rsz);

    const ptCount = isTouch ? 10 : 20;
    const triCount = isTouch ? 5 : 10;

    const pts = Array.from({ length: ptCount }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 2.5 + .8,
      col: Math.random() < .6 ? '124,111,240' : '61,184,176',
      a: Math.random() * .35 + .1
    }));

    const tris = Array.from({ length: triCount }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      sz: Math.random() * 44 + 16, rot: Math.random() * Math.PI * 2,
      vr: .003 * (Math.random() - .5),
      col: Math.random() < .5 ? '124,111,240' : '61,184,176',
      a: Math.random() * .12 + .03
    }));

    function draw() {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const t of tris) {
        t.x += t.vx; t.y += t.vy; t.rot += t.vr;
        if (t.x < -60) t.x = c.width + 60; if (t.x > c.width + 60) t.x = -60;
        if (t.y < -60) t.y = c.height + 60; if (t.y > c.height + 60) t.y = -60;
        ctx.save(); ctx.translate(t.x, t.y); ctx.rotate(t.rot);
        ctx.beginPath(); ctx.moveTo(0, -t.sz); ctx.lineTo(t.sz * .866, t.sz * .5); ctx.lineTo(-t.sz * .866, t.sz * .5); ctx.closePath();
        ctx.strokeStyle = `rgba(${t.col},${t.a})`; ctx.lineWidth = .8; ctx.stroke();
        ctx.restore();
      }
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.col},${p.a})`; ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(124,111,240,${(1 - d / 160) * .07})`; ctx.lineWidth = .5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  })();
}

/* ===== WORK CANVASES ===== */
if (!prefersReduced) {
  document.querySelectorAll('.wc').forEach(c => {
    const ctx = c.getContext('2d');
    const W = c.width, H = c.height;
    const type = c.dataset.t;
    let t = 0;

    if (type === 'wave') {
      const cols = ['rgba(95,82,212,', 'rgba(61,184,176,', 'rgba(124,111,240,'];
      (function d() {
        ctx.fillStyle = '#111118'; ctx.fillRect(0, 0, W, H);
        for (let k = 0; k < 3; k++) {
          ctx.beginPath();
          for (let x = 0; x <= W; x += 2) {
            const y = H / 2 + Math.sin((x / W) * Math.PI * 2.8 + t + k * 1.3) * 32 * (1 - k * .15) + Math.sin((x / W) * Math.PI * 5 + t * 1.4 + k) * .14;
            k === 0 && x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.strokeStyle = cols[k] + `${.28 - k * .04})`; ctx.lineWidth = 1.4 - k * .25; ctx.stroke();
        }
        ctx.fillStyle = 'rgba(12,12,16,.5)'; ctx.fillRect(W - 200, H - 56, 192, 40);
        ctx.fillStyle = 'rgba(61,184,176,.6)'; ctx.font = '10px "DM Sans"';
        ctx.fillText('tejaldesae.com · LIVE', W - 190, H - 32);
        t += .007; requestAnimationFrame(d);
      })();
    } else if (type === 'particles') {
      const ps = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.8 + .5
      }));
      ctx.fillStyle = '#111118'; ctx.fillRect(0, 0, W, H);
      (function d() {
        ctx.fillStyle = 'rgba(17,17,24,.18)'; ctx.fillRect(0, 0, W, H);
        for (const p of ps) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(61,184,176,.65)'; ctx.fill();
        }
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
            const d2 = Math.sqrt(dx * dx + dy * dy);
            if (d2 < 75) {
              ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
              ctx.strokeStyle = `rgba(61,184,176,${(1 - d2 / 75) * .28})`; ctx.lineWidth = .5; ctx.stroke();
            }
          }
        }
        ctx.fillStyle = 'rgba(12,12,16,.5)'; ctx.fillRect(W - 180, H - 56, 172, 40);
        ctx.fillStyle = 'rgba(61,184,176,.6)'; ctx.font = '10px "DM Sans"';
        ctx.fillText('veherex.in · IEEE 2026', W - 170, H - 32);
        requestAnimationFrame(d);
      })();
    } else if (type === 'grid') {
      const COLS = 14, ROWS = 10;
      const CW = W / COLS, CH = H / ROWS;
      const g = Array.from({ length: ROWS * COLS }, (_, i) => ({
        r: Math.floor(i / COLS), c: i % COLS, v: Math.random()
      }));
      (function d() {
        ctx.fillStyle = '#0c0c10'; ctx.fillRect(0, 0, W, H);
        for (const cell of g) {
          cell.v += .018 * (Math.random() - .49);
          cell.v = Math.max(0, Math.min(1, cell.v));
          const x = cell.c * CW, y = cell.r * CH;
          if (cell.v > .58) {
            ctx.fillStyle = `rgba(124,111,240,${(cell.v - .58) * 2.2 * .42})`;
            ctx.fillRect(x + 1, y + 1, CW - 2, CH - 2);
          }
          ctx.strokeStyle = `rgba(124,111,240,${cell.v * .07 + .02})`; ctx.lineWidth = .5;
          ctx.strokeRect(x, y, CW, CH);
        }
        ctx.fillStyle = 'rgba(12,12,16,.5)'; ctx.fillRect(W - 180, H - 56, 172, 40);
        ctx.fillStyle = 'rgba(124,111,240,.6)'; ctx.font = '10px "DM Sans"';
        ctx.fillText('NLP · TF-IDF · sklearn', W - 170, H - 32);
        t += .01; requestAnimationFrame(d);
      })();
    }
  });
}

/* ===== INTERSECTION OBSERVER ===== */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
  });
}, { threshold: .1 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));

/* ===== DYNAMIC YEAR ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
