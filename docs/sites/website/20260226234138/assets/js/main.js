document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navClose = document.querySelector('.nav-close');
  const mobileNavContainer = document.getElementById('mobile-nav-container');
  const mobileNav = document.getElementById('mobile-nav');

  const toggleNav = (open) => {
    const isOpen = mobileNavContainer.classList.contains('open');
    if (open === isOpen) return;

    if (open) {
      mobileNavContainer.classList.add('open');
      mobileNav.classList.add('open');
      document.body.classList.add('body-no-scroll');
      navToggle.setAttribute('aria-expanded', 'true');
    } else {
      mobileNavContainer.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.classList.remove('body-no-scroll');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (navToggle && mobileNavContainer && mobileNav) {
    navToggle.addEventListener('click', () => toggleNav(true));
    navClose.addEventListener('click', () => toggleNav(false));
    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer) {
        toggleNav(false);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) {
        toggleNav(false);
      }
    });
  }

  // --- 3. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
    });
  });

  // --- 5. TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      updateDots(index);
      currentIndex = index;
    };

    const updateDots = (index) => {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    });

    goToSlide(0); // Initialize
  }

  // --- 6. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000);
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- 7. STICKY CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('visible');
              } else {
                  stickyCta.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- 8. CONTACT FORM (simulation) --- //
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const feedbackEl = document.getElementById('form-feedback');
      feedbackEl.style.display = 'block';
      feedbackEl.style.marginTop = '1rem';
      feedbackEl.style.padding = '1rem';
      feedbackEl.style.backgroundColor = 'var(--color-primary)';
      feedbackEl.style.borderRadius = 'var(--radius-sm)';
      feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wurde (simuliert) gesendet.';
      contactForm.reset();
      setTimeout(() => {
        feedbackEl.style.display = 'none';
      }, 5000);
    });
  }

});