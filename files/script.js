/**
 * Perfect Solution Point Reading Library
 * Main JavaScript - Animations, Interactions & Form Validation
 */

// ──────────────────────────────────────────────
// Loading Screen
// ──────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
  }
});
document.body.style.overflow = 'hidden';

// ──────────────────────────────────────────────
// Scroll Progress Bar
// ──────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
  }, { passive: true });
}

// ──────────────────────────────────────────────
// Sticky Navbar
// ──────────────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ──────────────────────────────────────────────
// Mobile Navigation
// ──────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navOverlay = document.querySelector('.nav-overlay');

function toggleMenu(open) {
  hamburger?.classList.toggle('open', open);
  navMenu?.classList.toggle('open', open);
  navOverlay?.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = navMenu.classList.contains('open');
  toggleMenu(!isOpen);
});
navOverlay?.addEventListener('click', () => toggleMenu(false));
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

// ──────────────────────────────────────────────
// Active Nav Link
// ──────────────────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ──────────────────────────────────────────────
// Hero Particles
// ──────────────────────────────────────────────
function createParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 60 + 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 10 + 8;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%; bottom:-${size}px;
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      opacity:${Math.random() * 0.2 + 0.05};
    `;
    container.appendChild(p);
  }
}
createParticles();

// ──────────────────────────────────────────────
// Animated Counter
// ──────────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const start = 0;
  const duration = 2000;
  const startTime = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(time) {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isDecimal ? value.toFixed(1) + suffix : Math.floor(value) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const countersStarted = new WeakSet();
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted.has(entry.target)) {
      countersStarted.add(entry.target);
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// ──────────────────────────────────────────────
// Scroll Reveal (Intersection Observer)
// ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Auto-add reveal class to common sections
const autoRevealSelectors = [
  '.feature-card', '.gallery-item', '.pricing-card',
  '.testimonial-card', '.facility-card', '.rule-item',
  '.timeline-item', '.value-item', '.about-highlight'
];
autoRevealSelectors.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
      revealObserver.observe(el);
    }
  });
});

// ──────────────────────────────────────────────
// Contact Form Validation
// ──────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const validators = {
    name: (v) => v.trim().length >= 2 ? '' : 'Please enter your full name (min 2 characters)',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email address',
    phone: (v) => !v || /^[\d\s\+\-\(\)]{7,15}$/.test(v) ? '' : 'Please enter a valid phone number',
    subject: (v) => v ? '' : 'Please select a subject',
    message: (v) => v.trim().length >= 20 ? '' : 'Message must be at least 20 characters',
  };

  function validateField(field) {
    const name = field.name;
    const error = validators[name]?.(field.value);
    const errorEl = document.getElementById(`${name}-error`);
    if (error) {
      field.classList.add('error');
      if (errorEl) { errorEl.textContent = error; errorEl.classList.add('visible'); }
      return false;
    } else {
      field.classList.remove('error');
      if (errorEl) errorEl.classList.remove('visible');
      return true;
    }
  }

  contactForm.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (!valid) return;

    const btn = contactForm.querySelector('.btn-submit');
    const btnText = btn.innerHTML;
    btn.innerHTML = '⏳ Sending...';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.style.display = 'none';
      document.getElementById('formSuccess')?.classList.add('show');
    }, 1500);
  });
}

// ──────────────────────────────────────────────
// Smooth Anchor Scroll
// ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ──────────────────────────────────────────────
// Parallax Hero (subtle)
// ──────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ──────────────────────────────────────────────
// Year in Footer
// ──────────────────────────────────────────────
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
