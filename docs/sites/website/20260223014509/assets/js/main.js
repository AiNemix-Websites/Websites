document.addEventListener('DOMContentLoaded', () => {

  // --- Helper: Debounce --- 
  function debounce(func, wait = 10, immediate = false) {
    let timeout;
    return function() {
      const context = this, args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // --- Sticky Header --- 
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', debounce(() => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }));
  }

  // --- Mobile Navigation --- 
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('scroll-locked', isOpen);
    });
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainMenu.classList.contains('is-open')) {
            mainMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
        }
    });
  }

  // --- Scroll Animations --- 
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  scrollElements.forEach(el => observer.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if(question && answer) {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    }
  });

  // --- Testimonial Carousel ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.childNodes.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.ariaLabel = `Go to slide ${index + 1}`;
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    updateCarousel(); // Initial setup
  }

  // --- Cookie Banner --- 
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.hidden = false;
        cookieBanner.classList.add('is-visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('is-visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // --- Lightbox --- 
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const gallery = document.getElementById('image-gallery');
    const galleryItems = gallery ? Array.from(gallery.querySelectorAll('[data-lightbox-trigger]')) : [];
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    let currentIndex = 0;

    function showImage(index) {
        if (index < 0 || index >= galleryItems.length) return;
        const item = galleryItems[index];
        const imgSrc = item.dataset.kmImage || item.src;
        const imgAlt = item.alt || 'Galeriebild';
        lightboxImg.src = (imgSrc.startsWith('assets') ? '../' : '') + imgSrc;
        lightboxImg.alt = imgAlt;
        currentIndex = index;
    }

    function openLightbox(index) {
        showImage(index);
        lightbox.hidden = false;
        document.body.classList.add('scroll-locked');
        setTimeout(() => lightbox.classList.add('is-visible'), 10);
    }

    function closeLightbox() {
        lightbox.classList.remove('is-visible');
        document.body.classList.remove('scroll-locked');
        setTimeout(() => lightbox.hidden = true, 300);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        }
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting
              if (!entry.isIntersecting) {
                  stickyCTA.hidden = false;
                  stickyCTA.classList.add('is-visible');
              } else {
                  stickyCTA.classList.remove('is-visible');
              }
          });
      }, { threshold: 0.1 });

      const heroSection = document.querySelector('.hero');
      if(heroSection) {
          ctaObserver.observe(heroSection);
      }
  }
});