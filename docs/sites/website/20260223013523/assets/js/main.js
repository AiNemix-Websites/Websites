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
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav-list');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        navToggle.click();
      }
    });
  }

  // --- Scroll Animations --- //
  const animatedElements = document.querySelectorAll('.animate-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    cookieAccept.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
      localStorage.setItem('cookieConsent', 'true');
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  let currentImageIndex = 0;
  const galleryImages = Array.from(lightboxTriggers).map(img => ({ src: img.dataset.kmImage, alt: img.alt }));

  if (lightbox && lightboxImage && lightboxTriggers.length > 0) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');

    const openLightbox = (index) => {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.style.display = 'flex';
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const updateLightboxImage = () => {
      lightboxImage.src = galleryImages[currentImageIndex].src;
      lightboxImage.alt = galleryImages[currentImageIndex].alt;
    };

    const showPrevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    };

    const showNextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightboxImage();
    };

    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
      }
    });
  }
  
  // --- Sticky Context CTA --- //
  const contextCta = document.getElementById('context-cta');
  if(contextCta) {
      window.addEventListener('scroll', () => {
          const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
          if(scrollPercentage > 0.2 && scrollPercentage < 0.9) {
              contextCta.classList.add('visible');
          } else {
              contextCta.classList.remove('visible');
          }
      });
  }

});