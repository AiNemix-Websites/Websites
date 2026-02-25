document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Menu --- //
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
    if (mobileMenu) {
        mobileMenu.classList.add('open');
        document.body.classList.add('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'true');
    }
  };

  const closeMenu = () => {
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', openMenu);
  }
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', closeMenu);
  }
  if (mobileMenu) {
      mobileMenu.addEventListener('click', (e) => {
          if (e.target === mobileMenu) {
              closeMenu();
          }
      });
  }
  document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
          closeMenu();
      }
  });

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const delay = entry.target.dataset.delay || 0;
        const staggerElements = entry.target.querySelectorAll('.reveal-stagger') || document.querySelectorAll('.reveal-stagger');
        staggerElements.forEach((el, index) => {
            el.style.transitionDelay = `${index * 100}ms`;
            el.classList.add('visible');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 600) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
      });
  }

  // --- Cookie Banner --- //
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

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const gallery = document.getElementById('image-gallery');
  let galleryItems = [];
  let currentIndex = 0;

  if (gallery && lightbox) {
    galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');

    const showImage = (index) => {
      currentIndex = index;
      const item = galleryItems[index];
      const imgSrc = item.getAttribute('href');
      const imgAlt = item.querySelector('img').getAttribute('alt');
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', imgAlt);
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const clickedItem = e.target.closest('.gallery-item');
      if (!clickedItem) return;

      const index = galleryItems.indexOf(clickedItem);
      if (index > -1) {
        showImage(index);
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('open'), 10);
        document.body.classList.add('no-scroll');
      }
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.setAttribute('src', '');
      }, 300);
      document.body.classList.remove('no-scroll');
    };

    const showPrev = () => {
      const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      showImage(newIndex);
    };

    const showNext = () => {
      const newIndex = (currentIndex + 1) % galleryItems.length;
      showImage(newIndex);
    };

    gallery.addEventListener('click', openLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('open')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }
});