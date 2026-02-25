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

  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    const toggleMenu = (open) => {
        const isExpanded = open === undefined ? menuToggle.getAttribute('aria-expanded') === 'false' : open;
        menuToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenu.setAttribute('aria-hidden', !isExpanded);
        document.body.classList.toggle('mobile-menu-open', isExpanded);
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
            toggleMenu(false);
        }
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  const handleConsent = (consent) => {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('visible');
  };

  if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > window.innerHeight * 0.8) {
              stickyCta.classList.add('visible');
          } else {
              stickyCta.classList.remove('visible');
          }
      });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');
  let gallery = [];
  let currentIndex = -1;

  if (lightbox && lightboxTriggers.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    gallery = Array.from(lightboxTriggers).map(trigger => trigger.dataset.lightboxSrc);

    const showImage = (index) => {
        if (index < 0 || index >= gallery.length) return;
        currentIndex = index;
        const imagePath = lightboxTriggers[0].closest('html').querySelector('body').classList.contains('is-subpage') ? `../${gallery[index]}` : gallery[index];
        lightboxImg.src = gallery[index].startsWith('..') ? gallery[index] : (document.body.dataset.rootPath || '') + gallery[index];
        prevBtn.style.display = index === 0 ? 'none' : 'block';
        nextBtn.style.display = index === gallery.length - 1 ? 'none' : 'block';
    };

    const openLightbox = (index) => {
        document.body.style.overflow = 'hidden';
        lightbox.classList.add('visible');
        showImage(index);
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        document.body.style.overflow = '';
        lightbox.classList.remove('visible');
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    };

    lightboxTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
  }

  // Set root path for JS asset loading on subpages
  const isSubpage = window.location.pathname.split('/').filter(Boolean).length > 0 && !window.location.pathname.endsWith('/');
  if (isSubpage || (window.location.pathname.split('/').filter(Boolean).length > 0 && window.location.pathname.endsWith('/'))) {
      document.body.dataset.rootPath = '../';
  }

});