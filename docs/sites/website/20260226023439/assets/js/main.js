document.addEventListener('DOMContentLoaded', () => {

  // --- Header & Mobile Navigation ---
  const header = document.querySelector('.site-header');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  // Sticky header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpened = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      mobileMenuToggle.setAttribute('aria-expanded', !isOpened);
      document.body.classList.toggle('mobile-menu-open');
    });
  }

  // --- Intersection Observer for Animations ---
  const revealElements = document.querySelectorAll('[data-reveal]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.revealDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelector('.testimonial-slides');
    const slideItems = slides.querySelectorAll('.testimonial-slide');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    let currentIndex = 0;

    function updateCarousel() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slideItems.length - 1;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slideItems.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
  }

  // --- Global Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentGallery = [];
    let currentIndexInGallery = -1;

    const openLightbox = (gallery, index) => {
      currentGallery = gallery;
      currentIndexInGallery = index;
      updateLightboxImage();
      lightbox.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      document.body.style.overflow = '';
    };

    const updateLightboxImage = () => {
      if (currentIndexInGallery >= 0 && currentIndexInGallery < currentGallery.length) {
        const trigger = currentGallery[currentIndexInGallery];
        lightboxImg.src = trigger.dataset.kmImage;
        lightboxImg.alt = trigger.alt || 'Detailansicht';
      }
      prevBtn.style.display = currentGallery.length > 1 ? 'block' : 'none';
      nextBtn.style.display = currentGallery.length > 1 ? 'block' : 'none';
    };

    const showPrev = () => {
      currentIndexInGallery = (currentIndexInGallery > 0) ? currentIndexInGallery - 1 : currentGallery.length - 1;
      updateLightboxImage();
    };

    const showNext = () => {
      currentIndexInGallery = (currentIndexInGallery < currentGallery.length - 1) ? currentIndexInGallery + 1 : 0;
      updateLightboxImage();
    };

    document.body.addEventListener('click', e => {
        if (e.target.classList.contains('lightbox-trigger')) {
            e.preventDefault();
            const galleryName = e.target.dataset.gallery || 'default';
            const galleryTriggers = Array.from(document.querySelectorAll(`.lightbox-trigger[data-gallery='${galleryName}']`));
            const clickedIndex = galleryTriggers.indexOf(e.target);
            openLightbox(galleryTriggers, clickedIndex);
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.classList.add('visible');
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA Bar ---
  const stickyCta = document.querySelector('.sticky-cta-bar');
  const heroSection = document.querySelector('.hero');
  if (stickyCta && heroSection) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('visible');
              } else {
                  stickyCta.classList.remove('visible');
              }
          });
      }, { rootMargin: '0px 0px -100% 0px' });
      ctaObserver.observe(heroSection);
  }
});