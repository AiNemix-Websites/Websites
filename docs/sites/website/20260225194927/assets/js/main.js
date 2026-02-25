document.addEventListener('DOMContentLoaded', function() {

  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-active');
      document.body.classList.toggle('no-scroll', isActive);
      menuToggle.setAttribute('aria-expanded', isActive);
    });
  }

  // Close mobile menu with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-active')) {
        menuToggle.click();
    }
  });

  // 2. Sticky Header
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

  // 3. Scroll-Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // 4. Accordion
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (header && content) {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    }
  });

  // 5. Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }
  }

  // 6. Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1000);
  }

  if (acceptButton) {
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });
  }

  if (declineButton) {
    declineButton.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });
  }

  // 7. Sticky CTA
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show CTA when hero is NOT intersecting (i.e., scrolled past)
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

  // 8. Global Lightbox Logic (Singleton)
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    let currentGallery = [];
    let currentIndex = -1;

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    };

    // This function would be called by clickable images if they existed
    // window.openLightbox = (gallery, index) => {
    //   currentGallery = gallery;
    //   currentIndex = index;
    //   updateLightboxImage();
    //   lightbox.classList.add('show');
    //   lightbox.setAttribute('aria-hidden', 'false');
    //   document.body.classList.add('no-scroll');
    // };

    const updateLightboxImage = () => {
        if (currentIndex >= 0 && currentIndex < currentGallery.length) {
            const imgData = currentGallery[currentIndex];
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            lightboxImg.setAttribute('data-km-image', imgData.kmId);
        }
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
    });

    // Prev/Next functionality would be here, but is unused without a gallery.
  }

});