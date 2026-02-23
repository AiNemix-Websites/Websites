document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER --- //
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

  // --- MOBILE NAVIGATION --- //
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('main-nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  }

  // --- SCROLL REVEAL --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.revealDelay || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- TESTIMONIAL CAROUSEL --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const button = document.createElement('button');
            button.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === currentIndex) button.classList.add('active');
            button.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(button);
        });
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, {passive: true});
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    });

    updateCarousel();
  }

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('visible');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('scroll-locked');
    };

    document.body.addEventListener('click', e => {
      const imageElement = e.target.closest('img[data-km-image]');
      if (imageElement) {
        e.preventDefault();
        const imageSrc = imageElement.getAttribute('src');
        lightboxImage.setAttribute('src', imageSrc);
        lightboxImage.setAttribute('alt', imageElement.getAttribute('alt') || 'Großansicht');
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scroll-locked');
      }
    });

    lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.km-lightbox-backdrop').addEventListener('click', closeLightbox);
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
        closeLightbox();
      }
    });
  }

  // --- STICKY CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if(stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show CTA when hero is NOT intersecting (scrolled past it)
              if(!entry.isIntersecting) {
                  stickyCta.classList.add('visible');
              } else {
                  stickyCta.classList.remove('visible');
              }
          });
      }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });
      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- CONTACT FORM --- //
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const feedbackEl = document.getElementById('form-feedback');
      feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
      feedbackEl.className = 'form-feedback success';
      // Simulate sending and reset
      setTimeout(() => {
        feedbackEl.textContent = 'Ihre Nachricht wurde erfolgreich gesendet.';
        contactForm.reset();
        setTimeout(() => { feedbackEl.textContent = ''; feedbackEl.className = 'form-feedback'; }, 5000);
      }, 1000);
    });
  }

});