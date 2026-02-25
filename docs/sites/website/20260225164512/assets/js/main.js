document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header --- //
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

  // --- 2. Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  if (mobileNavToggle && mobileNavMenu) {
    const closeButton = mobileNavMenu.querySelector('.mobile-nav-close');
    const backdrop = mobileNavMenu.querySelector('.mobile-nav-backdrop');
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let firstFocusableElement, lastFocusableElement;

    const openMenu = () => {
      mobileNavToggle.classList.add('is-active');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      mobileNavMenu.classList.add('is-open');
      mobileNavMenu.removeAttribute('aria-hidden');
      document.body.classList.add('scroll-locked');
      const focusableContent = mobileNavMenu.querySelectorAll(focusableElements);
      firstFocusableElement = focusableContent[0];
      lastFocusableElement = focusableContent[focusableContent.length - 1];
      firstFocusableElement.focus();
    };

    const closeMenu = () => {
      mobileNavToggle.classList.remove('is-active');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      mobileNavMenu.classList.remove('is-open');
      mobileNavMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('scroll-locked');
      mobileNavToggle.focus();
    };

    mobileNavToggle.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    backdrop.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        closeMenu();
      }
      if (e.key === 'Tab' && mobileNavMenu.classList.contains('is-open')) {
        if (e.shiftKey) { /* shift + tab */
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else { /* tab */
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- 4. FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- 5. Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- 6. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');

  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('show');
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- 7. Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let galleryImages = [];
    let currentIndex = -1;

    const openLightbox = (index) => {
      if (index < 0 || index >= galleryImages.length) return;
      currentIndex = index;
      const item = galleryImages[currentIndex];
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('scroll-locked');
      document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('scroll-locked');
      document.removeEventListener('keydown', handleKeydown);
    };

    const showPrev = () => openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    const showNext = () => openLightbox((currentIndex + 1) % galleryImages.length);

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    document.querySelectorAll('[data-lightbox-src]').forEach((el, index) => {
        galleryImages.push({ src: el.getAttribute('data-lightbox-src'), alt: el.getAttribute('data-alt') || '' });
        el.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
  }

  // --- 8. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past)
            if (!entry.isIntersecting && window.scrollY > 300) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

});