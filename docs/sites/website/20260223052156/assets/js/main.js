document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER --- //
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

  // --- MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeNavBtn = document.querySelector('.mobile-nav-close');

  function openNav() {
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('active');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('scroll-locked');
  }

  function closeNav() {
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('scroll-locked');
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        closeNav();
      } else {
        openNav();
      }
    });

    if(closeNavBtn) {
        closeNavBtn.addEventListener('click', closeNav);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeNav();
      }
    });
  }

  // --- SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- TESTIMONIAL CAROUSEL --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }
    
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if(index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    // Touch swipe
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextBtn.click();
        if (touchendX > touchstartX) prevBtn.click();
    }, { passive: true });

    updateCarousel();
  }

  // --- STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      let lastScrollY = window.scrollY;
      window.addEventListener('scroll', () => {
          if (window.scrollY > 600 && window.scrollY > lastScrollY) {
              stickyCTA.classList.add('visible');
          } else {
              stickyCTA.classList.remove('visible');
          }
          lastScrollY = window.scrollY;
      }, { passive: true });
  }

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }
  
  if (declineBtn) {
      declineBtn.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'declined');
          cookieBanner.classList.remove('visible');
      });
  }

  // --- GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    let currentImageIndex = -1;
    let galleryImages = [];

    function openLightbox(index) {
        currentImageIndex = index;
        const imgElement = galleryImages[currentImageIndex];
        const imagePath = imgElement.dataset.kmImage;
        const relativePath = imgElement.src;
        lightboxImg.src = relativePath; 
        lightboxImg.alt = imgElement.alt || 'Großansicht';
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scroll-locked');
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-locked');
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
        openLightbox(currentImageIndex);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
        openLightbox(currentImageIndex);
    }

    document.querySelectorAll('.clickable-image').forEach((img, index) => {
        galleryImages.push(img);
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('visible')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
  }

});