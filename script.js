/* ========================================
   PORTFOLIO SCRIPTS - Lalit Rajpurohit
======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Theme toggle ----- */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
      themeToggle.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  };

  applyTheme(root.getAttribute('data-theme') || 'light');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Follow system changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (localStorage.getItem('theme')) return;
      } catch (err) {}
      applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  /* ----- Mobile nav drawer ----- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const mobileNav = window.matchMedia('(max-width: 1510px)');

  const closeNav = () => {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Close drawer when clicking any nav link (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileNav.matches() || !navMenu || !navMenu.classList.contains('active')) return;
    if (!e.target.closest('#navbar')) closeNav();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  // Close drawer on scroll (mobile only)
  if (mobileNav.matches) {
    let scrollTimer;
    window.addEventListener('scroll', () => {
      if (!mobileNav.matches()) return;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(closeNav, 50);
    }, { passive: true });
  }

  /* ----- Hide nav on scroll down, show on scroll up ----- */
  const navEl = document.getElementById('navbar');
  if (navEl) {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      // Always show near the top
      if (y < 80) {
        navEl.classList.remove('nav-hidden');
      } else if (delta > 6) {
        // Scrolling down — hide (but close drawer first)
        navEl.classList.add('nav-hidden');
        if (navMenu && navMenu.classList.contains('active')) closeNav();
      } else if (delta < -6) {
        // Scrolling up — show
        navEl.classList.remove('nav-hidden');
      }

      lastY = y;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ----- Active section highlight (scroll spy) ----- */
  const navLinkMap = new Map();
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    const id = link.getAttribute('href').slice(1);
    if (id) navLinkMap.set(id, link);
  });

  if (navLinkMap.size && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinkMap.forEach((link) => link.classList.remove('is-active'));
          const link = navLinkMap.get(entry.target.id);
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    navLinkMap.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ----- Contact form ----- */
  const contactForm = document.getElementById('contactsform');
  if (!contactForm) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const API_URL = 'https://0w2rgqkyac.execute-api.ap-south-1.amazonaws.com/contact';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setStatus = (msg, tone) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.dataset.tone = tone || '';
  };

  const setLoading = (loading) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('is-loading', loading);
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: bots fill hidden fields
    if (contactForm.website && contactForm.website.value.trim() !== '') {
      setStatus('Message sent successfully!', 'success');
      contactForm.reset();
      return;
    }

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const subject = contactForm.subject.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !subject || !message) {
      setStatus('Please fill in all fields.', 'error');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setStatus('Please enter a valid email address.', 'error');
      return;
    }
    if (message.length < 10) {
      setStatus('Message is too short — please add a bit more context.', 'error');
      return;
    }

    setLoading(true);
    setStatus('Sending…', 'info');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, sub: subject, message })
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok) {
        contactForm.reset();
        setStatus('Message sent! I\'ll reply from rajpurohitlalit181@gmail.com — check spam if you don\'t see it.', 'success');
      } else {
        setStatus('Failed to send: ' + (result.message || 'please try again later.'), 'error');
      }
    } catch (error) {
      setStatus('Network error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  });

});
