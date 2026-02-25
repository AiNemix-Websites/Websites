document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER ---
  const header = document.getElementById('site-header');
  if (header) {
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  }

  // --- MOBILE NAVIGATION ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    const toggleNav = () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', !isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    };

    navToggle.addEventListener('click', toggleNav);

    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        toggleNav();
      }
    });
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      let delay = 0;
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger')) {
            entry.target.style.animationDelay = `${delay}s`;
            delay += 0.15;
          }
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
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

  // --- GLOBAL LIGHTBOX ---
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  let currentImageIndex = 0;

  if (lightbox && lightboxImg && galleryItems.length > 0) {
    const imageSources = Array.from(galleryItems).map(item => item.dataset.lightboxSrc);

    const showImage = (index) => {
        if (index < 0 || index >= imageSources.length) return;
        currentImageIndex = index;
        lightboxImg.setAttribute('src', imageSources[currentImageIndex]);
    };

    const openLightbox = (e) => {
        e.preventDefault();
        const clickedSrc = e.currentTarget.dataset.lightboxSrc;
        const index = imageSources.findIndex(src => src === clickedSrc);
        if (index !== -1) {
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.setAttribute('src', '');
        }, 300);
        document.body.classList.remove('no-scroll');
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', openLightbox);
    });

    lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.km-lightbox-prev').addEventListener('click', () => showImage(currentImageIndex - 1));
    lightbox.querySelector('.km-lightbox-next').addEventListener('click', () => showImage(currentImageIndex + 1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        }
    });
  }

  // --- STICKY CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const heroElement = document.querySelector('.hero, .page-hero');
      if (heroElement) {
          ctaObserver.observe(heroElement);
      }
  }

});