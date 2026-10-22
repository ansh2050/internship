/**
 * ui.js — Interactive UI components for PixelCraft Studio
 * Hamburger menu, theme toggle, carousel, modal, form validation, counters, back-to-top
 */

(function (window, document) {
  'use strict';

  const utils = window.PixelCraft && window.PixelCraft.utils;

  /* ==========================================================================
     1. Hamburger Menu & Mobile Navigation
     ========================================================================== */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navList = document.getElementById('nav-list');
    if (!hamburger || !navList) return;

    function toggleMenu(isOpen) {
      const open = typeof isOpen === 'boolean' ? isOpen : !hamburger.classList.contains('hamburger--active');
      hamburger.classList.toggle('hamburger--active', open);
      navList.classList.toggle('nav__list--open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking any nav link
    navList.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) {
        toggleMenu(false);
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navList.classList.contains('nav__list--open') && !navList.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('nav__list--open')) {
        toggleMenu(false);
        hamburger.focus();
      }
    });
  }

  /* ==========================================================================
     2. Dark / Light Theme Toggle
     ========================================================================== */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const THEME_KEY = 'pixelcraft-theme';
    const root = document.documentElement;

    function getPreferredTheme() {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
      root.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (err) {
        console.warn('Could not save theme preference:', err);
      }
      toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    // Initialize state
    const currentTheme = root.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(currentTheme);

    toggleBtn.addEventListener('click', () => {
      const active = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = active === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });

    // Listen to OS theme changes if user has not set explicit override
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  /* ==========================================================================
     3. Back-to-Top Button
     ========================================================================== */
  function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    const threshold = 300;
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > threshold) {
            backToTopBtn.classList.add('back-to-top--visible');
          } else {
            backToTopBtn.classList.remove('back-to-top--visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     4. Smooth Anchor Scrolling
     ========================================================================== */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#' || targetId === '#!') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElem.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        if (history.pushState) {
          history.pushState(null, '', targetId);
        }

        // Accessibility focus shift
        targetElem.setAttribute('tabindex', '-1');
        targetElem.focus({ preventScroll: true });
      }
    });
  }

  /* ==========================================================================
     5. Accessible Image Carousel
     ========================================================================== */
  function initCarousel() {
    const carousel = document.getElementById('carousel');
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!carousel || !track) return;

    const slides = Array.from(track.querySelectorAll('.carousel__slide'));
    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoplayInterval = null;
    const AUTOPLAY_DELAY = 4500;

    // Create dot indicators
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((slide, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot' + (idx === 0 ? ' carousel__dot--active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          goToSlide(idx);
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.carousel__dot');
        dots.forEach((dot, idx) => {
          const isActive = idx === currentIndex;
          dot.classList.toggle('carousel__dot--active', isActive);
          dot.setAttribute('aria-selected', String(isActive));
        });
      }

      // Update slide accessibility
      slides.forEach((slide, idx) => {
        slide.setAttribute('aria-hidden', String(idx !== currentIndex));
      });
    }

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateCarousel();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoplay();
      });
    }

    // Keyboard support
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        restartAutoplay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        restartAutoplay();
      }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        restartAutoplay();
      }
    }

    // Autoplay & pause on hover/focus
    function startAutoplay() {
      stopAutoplay();
      autoplayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
    }

    function stopAutoplay() {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
      }
    }

    function restartAutoplay() {
      startAutoplay();
    }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', stopAutoplay);
    carousel.addEventListener('focusout', startAutoplay);

    // Initial setup
    updateCarousel();
    startAutoplay();
  }

  /* ==========================================================================
     6. Modal Dialog ("Request a Quote")
     ========================================================================== */
  function initModal() {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;

    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');
    const quoteForm = document.getElementById('quote-form');
    let triggerElement = null;

    function openModal(trigger) {
      triggerElement = trigger || document.activeElement;
      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';

      // Focus first input
      const firstInput = modal.querySelector('input, textarea, button:not(#modal-close)');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 50);
      }
    }

    function closeModal() {
      modal.classList.remove('modal--open');
      document.body.style.overflow = '';
      if (triggerElement && typeof triggerElement.focus === 'function') {
        triggerElement.focus();
      }
    }

    // Listen to all buttons intended to open quote modal
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-modal-open="quote-modal"], .header__cta, a[href="#quote-modal"]');
      // If clicking .header__cta on index.html, open modal directly
      if (btn && modal) {
        e.preventDefault();
        openModal(btn);
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    // Escape key and focus trap
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('modal--open')) return;

      if (e.key === 'Escape') {
        closeModal();
        return;
      }

      // Trap focus
      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Handle quote form inside modal
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('quote-name');
        const emailInput = document.getElementById('quote-email');
        const projectInput = document.getElementById('quote-project');

        const isNameValid = utils ? utils.validators.name(nameInput.value) : nameInput.value.trim().length >= 2;
        const isEmailValid = utils ? utils.validators.email(emailInput.value) : emailInput.value.includes('@');
        const isProjectValid = utils ? utils.validators.message(projectInput.value) : projectInput.value.trim().length >= 5;

        if (!isNameValid || !isEmailValid || !isProjectValid) {
          alert('Please fill out all fields with valid information.');
          return;
        }

        quoteForm.innerHTML = `
          <div style="text-align:center; padding: 2rem 1rem;">
            <div style="font-size:3rem; color:var(--clr-success); margin-bottom:1rem;">✓</div>
            <h3 style="margin-bottom:0.5rem;">Quote Request Received!</h3>
            <p style="color:var(--clr-text-muted);">Thank you, ${utils.escapeHTML(nameInput.value)}. We will review your project and get in touch within 24 hours.</p>
            <button type="button" class="btn btn--primary" id="quote-modal-done" style="margin-top:1.5rem;">Close</button>
          </div>
        `;
        document.getElementById('quote-modal-done')?.addEventListener('click', closeModal);
      });
    }
  }

  /* ==========================================================================
     7. Contact Form Real-Time Validation
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = {
      name: {
        input: document.getElementById('contact-name'),
        error: document.getElementById('name-error'),
        validate: (val) => utils ? utils.validators.name(val) : val.trim().length >= 2
      },
      email: {
        input: document.getElementById('contact-email'),
        error: document.getElementById('email-error'),
        validate: (val) => utils ? utils.validators.email(val) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
      },
      phone: {
        input: document.getElementById('contact-phone'),
        error: document.getElementById('phone-error'),
        validate: (val) => utils ? utils.validators.phone(val) : val.trim().length >= 10
      },
      message: {
        input: document.getElementById('contact-message'),
        error: document.getElementById('message-error'),
        validate: (val) => utils ? utils.validators.message(val) : val.trim().length >= 10
      }
    };

    const successMsg = document.getElementById('form-success');

    function validateField(key, showFeedback = true) {
      const field = fields[key];
      if (!field || !field.input) return true;

      const isValid = field.validate(field.input.value);

      if (showFeedback) {
        if (!isValid) {
          field.input.classList.add(field.input.tagName === 'TEXTAREA' ? 'form__textarea--error' : 'form__input--error');
          field.input.classList.remove('form__input--valid');
          field.input.setAttribute('aria-invalid', 'true');
          if (field.error) field.error.classList.add('form__error--visible');
        } else {
          field.input.classList.remove(field.input.tagName === 'TEXTAREA' ? 'form__textarea--error' : 'form__input--error');
          field.input.classList.add('form__input--valid');
          field.input.setAttribute('aria-invalid', 'false');
          if (field.error) field.error.classList.remove('form__error--visible');
        }
      }
      return isValid;
    }

    // Attach real-time input and blur listeners
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.input) return;

      field.input.addEventListener('input', () => {
        // Validate on input only if already touched or showing error
        if (field.input.classList.contains('form__input--error') || field.input.classList.contains('form__textarea--error')) {
          validateField(key, true);
        }
      });

      field.input.addEventListener('blur', () => {
        if (field.input.value.trim().length > 0) {
          validateField(key, true);
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      Object.keys(fields).forEach((key) => {
        const isValid = validateField(key, true);
        if (!isValid) allValid = false;
      });

      if (!allValid) {
        // Focus first invalid input
        const firstInvalid = form.querySelector('.form__input--error, .form__textarea--error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Successful submission
      if (successMsg) {
        successMsg.classList.add('form__success--visible');
      }

      // Reset form fields
      form.reset();
      Object.keys(fields).forEach((key) => {
        const input = fields[key].input;
        if (input) {
          input.classList.remove('form__input--valid', 'form__input--error', 'form__textarea--error');
          input.removeAttribute('aria-invalid');
        }
      });

      // Auto-hide success message after 7 seconds
      setTimeout(() => {
        if (successMsg) successMsg.classList.remove('form__success--visible');
      }, 7000);
    });
  }

  /* ==========================================================================
     8. Animated Stats Counters
     ========================================================================== */
  function initStatsCounters() {
    const counterElements = document.querySelectorAll('.stats__number[data-target]');
    if (counterElements.length === 0) return;

    function animateCounter(elem) {
      const target = parseFloat(elem.getAttribute('data-target')) || 0;
      const suffix = elem.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeVal = utils ? utils.easeOutQuad(progress) : progress;
        const currentCount = Math.floor(easeVal * target);

        elem.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          elem.textContent = target + suffix;
        }
      }

      requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counterElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      counterElements.forEach((el) => animateCounter(el));
    }
  }

  /* ==========================================================================
     Public UI API
     ========================================================================== */
  window.PixelCraft = window.PixelCraft || {};
  window.PixelCraft.ui = {
    initMobileMenu,
    initThemeToggle,
    initBackToTop,
    initSmoothScroll,
    initCarousel,
    initModal,
    initContactForm,
    initStatsCounters,
    initAll() {
      initMobileMenu();
      initThemeToggle();
      initBackToTop();
      initSmoothScroll();
      initCarousel();
      initModal();
      initContactForm();
      initStatsCounters();
    }
  };
})(window, document);
