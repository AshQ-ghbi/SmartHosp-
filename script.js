/* ═══════════════════════════════════════════════
   SmartHosp+ — Main JavaScript
   Author: Ashish Kumar (AshQ)
═══════════════════════════════════════════════ */

'use strict';

/* ── NAVBAR: scroll shadow + active state ── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── HAMBURGER MENU ── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ── SMOOTH SCROLL for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── SCROLL-ACTIVATED ANIMATIONS (AOS-lite) ── */
(function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger delay based on position among siblings
        const siblings = Array.from(entry.target.parentElement?.children || []);
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ── COUNTER ANIMATION for metrics ── */
(function initCounters() {
  const counters = document.querySelectorAll('.metric-val[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el, target, duration = 1800) => {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    const step = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOut(progress);
      const value    = eased * target;

      el.textContent = isFloat
        ? value.toFixed(1)
        : Math.round(value).toString();

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ── FAQ ACCORDION ── */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close all others
      items.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a')?.classList.remove('open');
        }
      });

      // toggle current
      btn.setAttribute('aria-expanded', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });
})();


/* ── CONTACT FORM ── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  const validate = () => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const val = field.value.trim();
      if (!val) {
        field.style.borderColor = '#ef4444';
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        field.style.borderColor = '#ef4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    return valid;
  };

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate async submission (replace with real endpoint / Formspree / EmailJS)
    setTimeout(() => {
      form.reset();
      submitBtn.textContent = 'Request My Demo →';
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';

      if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 6000);
      }
    }, 1400);
  });
})();


/* ── ACTIVE NAV LINK on scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const navH = document.getElementById('navbar')?.offsetHeight || 68;

  const highlight = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 80) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}`
        ? 'var(--blue)'
        : '';
    });
  };

  window.addEventListener('scroll', highlight, { passive: true });
  highlight();
})();


/* ── HERO PREVIEW BARS animated on load ── */
(function initPreviewBars() {
  // bars use CSS @keyframes barGrow so they auto-animate
  // but we re-trigger on viewport entry for deferred loads
  const bars = document.querySelectorAll('.preview-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'none';
        // force reflow
        void entry.target.offsetWidth;
        entry.target.style.animation = '';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => observer.observe(b));
})();


/* ── ROADMAP active marker pulse on scroll ── */
(function initRoadmapReveal() {
  const items = document.querySelectorAll('.roadmap-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-16px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    observer.observe(item);
  });
})();


/* ── TYPED HERO TAGLINE (subtle character reveal) ── */
(function initHeroBadge() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  // just ensure the badge fades in after a short delay
  badge.style.opacity = '0';
  badge.style.transform = 'translateY(-8px)';
  badge.style.transition = 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s';

  requestAnimationFrame(() => {
    badge.style.opacity = '1';
    badge.style.transform = 'translateY(0)';
  });
})();


/* ── FEATURE CARD tilt effect (desktop only) ── */
(function initCardTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const cards = document.querySelectorAll('.feature-card, .metric-card, .testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      const rx     = y * -6;
      const ry     = x *  6;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();


/* ── SCROLL TO TOP button (appears after 400px) ── */
(function initScrollTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 24px; z-index: 999;
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    color: #fff; border: none; cursor: pointer;
    font-size: 18px; font-weight: 700;
    box-shadow: 0 4px 16px rgba(37,99,235,0.35);
    opacity: 0; transform: scale(0.7);
    transition: opacity 0.3s ease, transform 0.3s ease;
    display: flex; align-items: center; justify-content: center;
  `;

  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    btn.style.opacity  = show ? '1' : '0';
    btn.style.transform = show ? 'scale(1)' : 'scale(0.7)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── TESTIMONIAL auto-highlight on hover ── */
(function initTestimonials() {
  const cards = document.querySelectorAll('.testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c !== card && (c.style.opacity = '0.6'));
    });
    card.addEventListener('mouseleave', () => {
      cards.forEach(c => (c.style.opacity = ''));
    });
  });
})();
