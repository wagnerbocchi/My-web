/* ============================================================
   Wagner Bocchi — Terminal Portfolio
   main.js
   ============================================================ */

'use strict';

/* ---- Boot sequence lines --------------------------------- */
const BOOT_LINES = [
  { time: '0.000000', msg: 'Initializing bocchi.company kernel v2.6.1...',  ok: true  },
  { time: '0.001337', msg: 'Loading MITRE ATT&CK framework modules...',      ok: true  },
  { time: '0.002891', msg: 'Mounting encrypted filesystem (AES-256)...',     ok: true  },
  { time: '0.004200', msg: 'Starting iptables firewall daemon...',           ok: true  },
  { time: '0.005554', msg: 'Initializing SOC/SOAR pipelines...',             ok: true  },
  { time: '0.007103', msg: 'Establishing secure GCP connection...',          ok: true  },
  { time: '0.008876', msg: 'Loading portfolio data...',                      ok: true  },
  { time: '0.010234', msg: 'All systems operational. Welcome back, Wagner.', ok: true  },
];

/* ---- Run boot screen ------------------------------------- */
function runBoot() {
  const screen = document.getElementById('boot-screen');
  if (!screen) {
    initAnimations();
    return;
  }

  // Only show boot on first load per session
  if (sessionStorage.getItem('booted')) {
    screen.style.display = 'none';
    initAnimations();
    return;
  }

  const log = screen.querySelector('.boot-log');

  BOOT_LINES.forEach((line, i) => {
    const el = document.createElement('div');
    el.className = 'boot-line';
    el.style.animationDelay = `${i * 160}ms`;
    el.innerHTML =
      `<span class="boot-time">[${line.time}]</span>` +
      `<span class="boot-msg">${line.msg}</span>` +
      `<span class="${line.ok ? 'boot-ok' : 'boot-err'}">${line.ok ? '[ OK ]' : '[FAIL]'}</span>`;
    log.appendChild(el);
  });

  const duration = BOOT_LINES.length * 160 + 700;

  setTimeout(() => {
    screen.style.transition = 'opacity 0.45s ease';
    screen.style.opacity = '0';
    setTimeout(() => {
      screen.style.display = 'none';
      sessionStorage.setItem('booted', '1');
      initAnimations();
    }, 450);
  }, duration);
}

/* ---- Intersection observer for fade-in ------------------- */
function initAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  elements.forEach((el) => observer.observe(el));

  // Immediately reveal elements already in the viewport (fixes async timing)
  requestAnimationFrame(() => {
    elements.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  });
}

/* ---- Highlight active nav link --------------------------- */
function setActiveNav() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
}

/* ---- Live clock in navbar -------------------------------- */
function startClock() {
  const el = document.getElementById('nav-clock');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('pt-BR', { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

/* ---- Init ------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  startClock();
  runBoot();
});
