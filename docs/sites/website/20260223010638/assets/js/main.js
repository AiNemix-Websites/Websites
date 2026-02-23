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
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('open');
      navList.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const staggerElements = document.querySelectorAll('.scroll-reveal-stagger');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  staggerElements.forEach(container => {
    const elements = container.children;
    Array.from(elements).forEach((el, index) => {
      el.style.transitionDelay = `${index * 100}ms`;
      observer.observe(el);
    });
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 500);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Carousel ---
  const carousels = document.querySelectorAll('.carousel-wrapper');
  carousels.forEach(wrapper => {
    const container = wrapper.querySelector('.carousel-container');
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    if (!container || !prevBtn || !nextBtn) return;

    const scrollStep = container.querySelector('.carousel-slide').offsetWidth;

    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  });

  // --- Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const galleryItems = document.querySelectorAll('[data-km-image-gallery]');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let currentIndex = 0;

    const images = Array.from(galleryItems).map(item => item.getAttribute('href'));

    function showImage(index) {
      if (index < 0 || index >= images.length) return;
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('show');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
      lightbox.classList.remove('show');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  }
});