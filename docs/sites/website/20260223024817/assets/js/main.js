document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL EFFECT ---
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

  // --- MOBILE NAVIGATION ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('main-nav-menu');
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- ACCORDION ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      // Close all other accordions in the same group
      const parentAccordion = item.closest('.accordion, .faq-accordion');
      if(parentAccordion) {
          parentAccordion.querySelectorAll('.accordion-item').forEach(otherItem => {
              if (otherItem !== item) {
                  otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                  otherItem.querySelector('.accordion-content').style.maxHeight = null;
              }
          });
      }
      // Toggle current accordion
      header.setAttribute('aria-expanded', !isExpanded);
      content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
    });
  });

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); // Stagger effect
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- STICKY CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  const heroSection = document.querySelector('.hero');
  if (stickyCTA && heroSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyCTA.classList.add('visible');
        } else {
          stickyCTA.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });
    ctaObserver.observe(heroSection);
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineCookies) {
      declineCookies.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
      });
  }

  // --- TESTIMONIAL CAROUSEL ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }
  
  // --- GLOBAL LIGHTBOX ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentImageIndex = -1;
    let galleryImages = [];

    const openLightbox = (index) => {
        currentImageIndex = index;
        const imageSrc = galleryImages[currentImageIndex].dataset.kmImage;
        const imageAlt = galleryImages[currentImageIndex].alt;
        lightboxImg.src = imageSrc.startsWith('..') ? imageSrc : (galleryImages[currentImageIndex].src.includes('/leistungen/') || galleryImages[currentImageIndex].src.includes('/ueber-uns/') ? '../' + imageSrc : imageSrc);
        lightboxImg.alt = imageAlt;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
    };

    const showPrevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentImageIndex);
    };

    const showNextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(currentImageIndex);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    document.querySelectorAll('.clickable-image').forEach((img, index) => {
        galleryImages.push(img);
        img.addEventListener('click', () => openLightbox(index));
    });
    
    // Add gallery images to the lightbox scope
    document.querySelectorAll('.gallery-grid img').forEach((img) => {
        if (!galleryImages.includes(img)) {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(galleryImages.indexOf(img)));
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
  }

});