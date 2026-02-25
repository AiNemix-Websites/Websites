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
  const navClose = document.querySelector('.mobile-nav-close');

  const openMobileNav = () => {
    mobileNavMenu.style.display = 'block';
    setTimeout(() => mobileNavMenu.classList.add('open'), 10);
    document.body.classList.add('scroll-locked');
    navToggle.setAttribute('aria-expanded', 'true');
  };

  const closeMobileNav = () => {
    mobileNavMenu.classList.remove('open');
    setTimeout(() => {
        mobileNavMenu.style.display = 'none';
        document.body.classList.remove('scroll-locked');
        navToggle.setAttribute('aria-expanded', 'false');
    }, 300);
  };

  if (navToggle && mobileNavMenu) {
    navToggle.addEventListener('click', openMobileNav);
    navClose.addEventListener('click', closeMobileNav);
    mobileNavMenu.addEventListener('click', (e) => {
      if (e.target === mobileNavMenu) closeMobileNav();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) closeMobileNav();
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineCookies) {
    declineCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Service Finder Wizard ---
  const wizard = document.getElementById('service-wizard');
  if (wizard) {
    const steps = wizard.querySelectorAll('.wizard-step');
    const step1Buttons = wizard.querySelectorAll('#wizard-step1 button');
    
    const goToStep = (stepId) => {
        steps.forEach(s => s.classList.remove('active'));
        const nextStep = document.getElementById(stepId);
        if(nextStep) nextStep.classList.add('active');
    };

    step1Buttons.forEach(button => {
        button.addEventListener('click', () => {
            const nextStepId = `wizard-step2-${button.dataset.value}`;
            goToStep(nextStepId);
        });
    });

    const step2Buttons = wizard.querySelectorAll('#wizard-step2-garten button, #wizard-step2-haus button');
    step2Buttons.forEach(button => {
        button.addEventListener('click', () => {
            goToStep('wizard-result');
        });
    });
  }

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    showSlide(currentIndex);
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.display = isExpanded ? 'none' : 'block';
    });
  });

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  const dismissStickyCTA = document.getElementById('dismiss-sticky-cta');
  if (stickyCTA) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        stickyCTA.style.display = 'block';
        setTimeout(() => stickyCTA.classList.add('visible'), 10);
      } else {
        stickyCTA.classList.remove('visible');
      }
    });
    if (dismissStickyCTA) {
      dismissStickyCTA.addEventListener('click', () => {
        stickyCTA.style.display = 'none';
      });
    }
  }

  // --- Lightbox (Singleton Pattern) ---
  // The lightbox is included but will not be triggered as there are no images.
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const imgElement = lightbox.querySelector('img');
    let currentImageIndex = -1;
    let galleryImages = [];

    const openLightbox = (index) => {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.style.display = 'flex';
      setTimeout(() => { lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); }, 10);
      document.body.classList.add('scroll-locked');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      setTimeout(() => { lightbox.style.display = 'none'; }, 300);
      document.body.classList.remove('scroll-locked');
    };

    const updateLightboxImage = () => {
      if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
        imgElement.src = galleryImages[currentImageIndex];
      }
    };

    const showPrev = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    };

    const showNext = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightboxImage();
    };

    document.querySelectorAll('[data-km-image]').forEach((el, index) => {
      galleryImages.push(el.dataset.kmImage);
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }
});