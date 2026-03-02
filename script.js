/* ============================================================
   Perfect Solution Point Reading Library — Main Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. Navbar scroll effect & mobile toggle ──────────────────
  const navbar = document.querySelector('.navbar');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      navbar && navbar.classList.add('scrolled');
    } else {
      navbar && navbar.classList.remove('scrolled');
    }
  });

  const hamburger = document.querySelector('.hamburger');
  hamburger && hamburger.addEventListener('click', function () {
    navbar.classList.toggle('nav-mobile-open');
    hamburger.classList.toggle('open');
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      navbar && navbar.classList.remove('nav-mobile-open');
      hamburger && hamburger.classList.remove('open');
    });
  });

  // ── 2. Particles in Hero ─────────────────────────────────────
  var particlesWrap = document.getElementById('particles-wrap');
  if (particlesWrap) {
    for (var i = 0; i < 32; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = Math.random() * 4 + 2;
      p.style.cssText = [
        'left:'    + (Math.random() * 100) + '%',
        'width:'   + size + 'px',
        'height:'  + size + 'px',
        'animation-duration:' + (Math.random() * 14 + 8) + 's',
        'animation-delay:'    + (Math.random() * 10)     + 's',
        'opacity:' + (Math.random() * 0.45 + 0.08)
      ].join(';');
      particlesWrap.appendChild(p);
    }
  }

  // ── 3. Scroll Reveal ─────────────────────────────────────────
  var revealTargets = document.querySelectorAll(
    '.feature-card, .price-card, .testi-card, .value-card, ' +
    '.inclusion-item, .step-card, .info-card, .gallery-item, .stat-item'
  );

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
      if (entry.isIntersecting) {
        var delay = (Array.from(revealTargets).indexOf(entry.target) % 4) * 80;
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealTargets.forEach(function (el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ── 4. FAQ Toggle ─────────────────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(function (qEl) {
    qEl.addEventListener('click', function () {
      var item = this.parentElement;
      var isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item').forEach(function (f) { f.classList.remove('open'); });
      if (!isOpen) { item.classList.add('open'); }
    });
  });

  // ── 5. Ripple Effect on Buttons ───────────────────────────────
  document.querySelectorAll('.btn-join, .btn-primary, .btn-submit, .btn-dark, .nav-cta').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var circle = document.createElement('span');
      var rect   = this.getBoundingClientRect();
      circle.style.cssText = [
        'position:absolute',
        'width:20px', 'height:20px',
        'background:rgba(255,255,255,0.38)',
        'border-radius:50%',
        'top:'  + (e.clientY - rect.top  - 10) + 'px',
        'left:' + (e.clientX - rect.left - 10) + 'px',
        'animation:ripple 0.6s ease-out forwards',
        'pointer-events:none'
      ].join(';');
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(circle);
      setTimeout(function () { circle.remove(); }, 650);
    });
  });

  // ── 6. Animated Counter for Stats ─────────────────────────────
  function animateCounter(el, end, suffix) {
    var start    = 0;
    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var val = Math.floor(progress * end);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = end + suffix;
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el     = entry.target;
        var raw    = el.dataset.count || '';
        var suffix = el.dataset.suffix || '';
        var num    = parseInt(raw, 10);
        if (!isNaN(num)) animateCounter(el, num, suffix);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
    statsObserver.observe(el);
  });

  // ── 7. Active nav link highlight ──────────────────────────────
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === '/')) {
      link.classList.add('active');
    }
  });

  // ── 8. Smooth scroll for anchor links ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 9. Contact Form submission feedback ───────────────────────
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('.btn-submit');
      var original = btn.textContent;
      btn.textContent = '✅ Message Sent!';
      btn.style.background = 'linear-gradient(135deg,#4ade80,#22c55e)';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

});
