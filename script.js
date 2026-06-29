document.addEventListener('DOMContentLoaded', () => {

  /* ============================================
     PRELOADER — progress bar + graffiti draw
     ============================================ */
  const preloader = document.getElementById('preloader');
  const barEl     = document.getElementById('preloaderBar');
  const tagEl     = document.getElementById('preloaderTag');

  const loadingSteps = ['BOOTING . . .', 'LOADING ASSETS', 'BUILDING UI', 'ALL SYSTEMS GO'];
  let pct = 0;
  const stepDuration = 350; // ms per step chunk

  function animateBar() {
    const target = Math.min(pct + Math.random() * 22 + 10, 95);
    pct = target;
    if (barEl) barEl.style.width = pct + '%';
    const stepIdx = Math.min(Math.floor(pct / 25), loadingSteps.length - 1);
    if (tagEl) tagEl.textContent = loadingSteps[stepIdx];
    if (pct < 95) setTimeout(animateBar, stepDuration);
  }
  animateBar();

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (barEl) barEl.style.width = '100%';
      if (tagEl) tagEl.textContent = 'ALL SYSTEMS GO';
      setTimeout(() => {
        preloader.classList.add('is-done');
        document.body.style.overflow = '';
        runEntrance();
      }, 600);
    }, 1600);
  });

  /* ============================================
     HERO ENTRANCE TIMELINE
     ============================================ */
  function runEntrance() {
    const copy  = document.querySelector('.hero__copy');
    const media = document.querySelector('.hero__media');

    requestAnimationFrame(() => {
      copy.style.transition  = 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      media.style.transition = 'opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s';

      copy.style.opacity   = '1';
      copy.style.transform = 'translateY(0) rotateX(0deg)';
      media.style.opacity  = '1';
      media.style.transform = 'scale(1) rotateY(0deg)';
    });
  }

  /* ============================================
     GLOBAL CURSOR GLOW
     ============================================ */
  const cursorGlow = document.getElementById('cursorGlow');
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let gx = cx, gy = cy;

  window.addEventListener('mousemove', (e) => {
    cx = e.clientX;
    cy = e.clientY;
  });

  function animateCursor() {
    gx += (cx - gx) * 0.08;
    gy += (cy - gy) * 0.08;
    if (cursorGlow) {
      cursorGlow.style.left = gx + 'px';
      cursorGlow.style.top  = gy + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  /* ============================================
     CURSOR-REACTIVE HERO OVERLAY
     ============================================ */
  const frame   = document.getElementById('heroFrame');
  const overlay = document.getElementById('heroOverlay');

  if (frame && overlay) {
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      overlay.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
  }

  /* ============================================
     3D TILT ON HERO FRAME
     ============================================ */
  if (frame) {
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
      const py = (e.clientY - rect.top)  / rect.height - 0.5;

      const rotX = -py * 14;
      const rotY =  px * 14;
      frame.style.transition = 'transform 0.1s linear';
      frame.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    frame.addEventListener('mouseleave', () => {
      frame.style.transition = 'transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      frame.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    });
  }

  /* ============================================
     3D TILT ON PROJECT CARDS
     ============================================ */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
      const py = (e.clientY - rect.top)  / rect.height - 0.5;

      card.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear';
      card.style.transform  = `perspective(800px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg) translateY(-12px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ============================================
     3D TILT ON STACK CARDS
     ============================================ */
  document.querySelectorAll('.stack-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width  - 0.5;
      const py = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transition = 'transform 0.1s linear';
      card.style.transform  = `perspective(500px) rotateX(${-py * 15}deg) rotateY(${px * 15}deg) translateY(-6px) scale(1.04)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform  = '';
    });
  });

  /* ============================================
     NAV SCROLL STATE
     ============================================ */
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ============================================
     SCROLL-LINKED TICKER VELOCITY
     ============================================ */
  const tickerTrack = document.getElementById('tickerTrack');
  let baseSpeed = 0.6;
  let velocity = baseSpeed;
  let targetVelocity = baseSpeed;
  let position = 0;
  let lastScrollY = window.scrollY;
  let trackWidth = tickerTrack ? tickerTrack.scrollWidth / 2 : 0;

  window.addEventListener('resize', () => {
    if (tickerTrack) trackWidth = tickerTrack.scrollWidth / 2;
  });

  window.addEventListener('scroll', () => {
    const delta = window.scrollY - lastScrollY;
    targetVelocity = baseSpeed + delta * 0.8;
    targetVelocity = Math.max(-12, Math.min(12, targetVelocity));
    lastScrollY = window.scrollY;
  }, { passive: true });

  function tickerLoop() {
    velocity += (targetVelocity - velocity) * 0.08;
    targetVelocity += (baseSpeed - targetVelocity) * 0.02;
    position -= velocity;
    if (position <= -trackWidth) position += trackWidth;
    if (position >= 0) position -= trackWidth;
    if (tickerTrack) tickerTrack.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(tickerLoop);
  }
  requestAnimationFrame(tickerLoop);

  /* ============================================
     PARALLAX ON SCROLL (hero bg, sections)
     ============================================ */
  const heroBgGrid = document.querySelector('.hero__bg-grid');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    // Slow parallax on hero grid
    if (heroBgGrid) {
      heroBgGrid.style.transform = `translateY(${sy * 0.25}px)`;
    }
  }, { passive: true });

  /* ============================================
     SCROLL REVEAL (Intersection Observer)
     ============================================ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================
     SKILL BAR ANIMATION ON REVEAL
     ============================================ */
  const skillRows = document.querySelectorAll('.skill-row');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill   = entry.target.querySelector('.skill-row__fill');
        const target = fill ? parseInt(fill.getAttribute('data-target'), 10) : 0;

        // Stagger per row
        const delay = parseInt(getComputedStyle(entry.target).getPropertyValue('--delay') || '0', 10);
        setTimeout(() => {
          if (fill) fill.style.width = target + '%';
          entry.target.classList.add('is-visible');
        }, delay + 200);

        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillRows.forEach(row => skillObserver.observe(row));

  /* ============================================
     TEXT SCRAMBLE EFFECT
     ============================================ */
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';

  class Scramble {
    constructor(el) {
      this.el = el;
      this.original = el.textContent;
      this.frame = 0;
      this.queue = [];
      this.frameRequest = null;
    }
    run() {
      const length = this.original.length;
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const start = Math.floor(Math.random() * 10);
        const end = start + Math.floor(Math.random() * 15) + 10;
        this.queue.push({ to: this.original[i], start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this.update();
    }
    update() {
      let output = '';
      let complete = 0;
      for (let i = 0; i < this.queue.length; i++) {
        let { to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.4) {
            char = to === ' ' ? ' ' : scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            this.queue[i].char = char;
          }
          output += `<span style="opacity:0.5;color:var(--accent)">${char}</span>`;
        } else {
          output += '';
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) return;
      this.frame++;
      this.frameRequest = requestAnimationFrame(() => this.update());
    }
  }

  const scrambleTargets = document.querySelectorAll('[data-scramble]');
  const scrambleInstances = new Map();
  scrambleTargets.forEach(el => scrambleInstances.set(el, new Scramble(el)));

  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const inst = scrambleInstances.get(entry.target);
        if (inst) inst.run();
        scrambleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  scrambleTargets.forEach(el => scrambleObserver.observe(el));

  /* ============================================
     SMOOTH ANCHOR SCROLL
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetEl = document.querySelector(link.getAttribute('href'));
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================
     FLOATING GLASS CARDS MICRO-PARALLAX
     ============================================ */
  window.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;

    document.querySelectorAll('.hero__glass-badge').forEach(el => {
      el.style.transform = `translateZ(30px) translate(${mx * 6}px, ${my * 4}px)`;
    });

    document.querySelectorAll('.hero__stat').forEach((el, i) => {
      const depth = (i + 1) * 3;
      el.style.transform = `translate(${mx * depth}px, ${my * depth}px)`;
    });
  });

});
