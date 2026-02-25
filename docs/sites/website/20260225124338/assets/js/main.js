document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal-up');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.ariaLabel = `Go to slide ${index + 1}`;
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;
    
    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextButton.click();
        if (touchendX > touchstartX) prevButton.click();
    });

    updateCarousel();
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'block';
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.style.display = 'none', 500);
    });
  }

  // --- Context CTA ---
  const contextCta = document.getElementById('context-cta');
  if (contextCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        contextCta.classList.add('visible');
      } else {
        contextCta.classList.remove('visible');
      }
    });
  }
  
  // --- FAQ Accordion ---
  const detailsElements = document.querySelectorAll('.faq-accordion details, .faq-accordion-full details');
  detailsElements.forEach(details => {
    details.addEventListener('toggle', () => {
      if (details.open) {
        detailsElements.forEach(otherDetails => {
          if (otherDetails !== details && otherDetails.open) {
            otherDetails.open = false;
          }
        });
      }
    });
  });

  // --- Lightbox --- (Code is present but won't be triggered without images)
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeButton = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const image = lightbox.querySelector('.lightbox-image');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    let currentImageIndex = -1;
    let imageSources = [];

    const openLightbox = (index) => {
        if (index < 0 || index >= imageSources.length) return;
        currentImageIndex = index;
        image.src = imageSources[currentImageIndex];
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('is-visible'), 10);
        document.body.classList.add('no-scroll');
        closeButton.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            image.src = '';
        }, 300);
        document.body.classList.remove('no-scroll');
    };
    
    const showPrev = () => openLightbox((currentImageIndex - 1 + imageSources.length) % imageSources.length);
    const showNext = () => openLightbox((currentImageIndex + 1) % imageSources.length);

    document.querySelectorAll('[data-km-image]').forEach((imgElement, index) => {
        const src = imgElement.dataset.kmImage;
        if (src) {
            imageSources.push(src);
            imgElement.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        }
    });

    closeButton.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', showPrev);
    nextButton.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('is-visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }

});