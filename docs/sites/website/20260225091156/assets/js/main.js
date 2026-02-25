document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  
  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      toggleMobileMenu(true);
    });

    mobileNavClose.addEventListener('click', () => {
      toggleMobileMenu(false);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }
    });
  }

  function toggleMobileMenu(open) {
      if (open) {
          mobileNavMenu.classList.add('is-open');
          mobileNavToggle.setAttribute('aria-expanded', 'true');
          mobileNavMenu.setAttribute('aria-hidden', 'false');
          document.body.classList.add('no-scroll');
      } else {
          mobileNavMenu.classList.remove('is-open');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
          mobileNavMenu.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('no-scroll');
      }
  }

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => {
          cookieBanner.classList.add('visible');
      }, 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const gallery = document.getElementById('gallery');
  let galleryItems = [];
  let currentIndex = -1;

  if (lightbox && gallery) {
    galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');

    const showImage = (index) => {
        if (index < 0 || index >= galleryItems.length) return;
        const item = galleryItems[index];
        const imgSrc = item.querySelector('img').getAttribute('data-km-image');
        lightboxImg.setAttribute('src', imgSrc);
        currentIndex = index;
    };

    const openLightbox = (e) => {
        e.preventDefault();
        const clickedItem = e.target.closest('.gallery-item');
        if (!clickedItem) return;
        const index = galleryItems.indexOf(clickedItem);
        
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('is-visible'), 10);
        document.body.classList.add('no-scroll');
        showImage(index);
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        setTimeout(() => lightbox.style.display = 'none', 200);
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    };

    gallery.addEventListener('click', openLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past)
              if (!entry.isIntersecting) {
                  stickyCta.classList.add('visible');
              } else {
                  stickyCta.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero');
      if(heroSection) {
          ctaObserver.observe(heroSection);
      }
  }

});