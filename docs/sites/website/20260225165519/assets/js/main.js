document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

  const openMobileMenu = () => {
    if (mobileNavMenu && navToggle) {
      mobileNavMenu.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
      mobileNavClose.focus();
    }
  };

  const closeMobileMenu = () => {
    if (mobileNavMenu && navToggle) {
      mobileNavMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
      navToggle.focus();
    }
  };

  if (navToggle && mobileNavMenu) {
    navToggle.addEventListener('click', openMobileMenu);
    mobileNavClose.addEventListener('click', closeMobileMenu);
    mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('revealed');
        }, index * 100); // Stagger effect
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- Testimonial Carousel ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
      currentIndex = index;
    };

    nextBtn.addEventListener('click', () => {
      let nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    });

    // Basic swipe detection
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'block';
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is not intersecting (scrolled past it)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // --- Contact Form --- 
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const formFeedback = document.getElementById('form-feedback');
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formFeedback.textContent = 'Vielen Dank für Ihre Nachricht. Wir werden uns in Kürze bei Ihnen melden.';
      formFeedback.style.display = 'block';
      contactForm.reset();
    });
  }

});