document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  const mobileNavClose = document.querySelector('.mobile-nav-close');
  const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

  const openMobileMenu = () => {
    if (mobileNavMenu) {
      mobileNavMenu.style.display = 'block';
      setTimeout(() => mobileNavMenu.classList.add('is-open'), 10);
      document.body.classList.add('no-scroll');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
    }
  };

  const closeMobileMenu = () => {
    if (mobileNavMenu) {
      mobileNavMenu.classList.remove('is-open');
      setTimeout(() => {
          mobileNavMenu.style.display = 'none';
          document.body.classList.remove('no-scroll');
          mobileNavToggle.setAttribute('aria-expanded', 'false');
      }, 300);
    }
  };

  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', openMobileMenu);
    mobileNavClose.addEventListener('click', closeMobileMenu);
    mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
            closeMobileMenu();
        }
    });
  }

  // --- Scroll Animations ---
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.display = 'block';
      } else {
        answer.style.display = 'none';
      }
    });
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      updateDots(index);
      currentIndex = index;
    };

    const updateDots = (index) => {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    });

    goToSlide(0); // Initialize
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
    cookieBanner.style.display = 'block';
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImage = document.getElementById('km-lightbox-image');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let currentImageIndex = -1;
    let galleryItems = [];

    document.querySelectorAll('.gallery-item, .location-card img').forEach((item, index) => {
      galleryItems.push(item);
      item.addEventListener('click', (e) => {
        e.preventDefault();
        currentImageIndex = index;
        openLightbox();
      });
    });

    const openLightbox = () => {
      updateImage();
      lightbox.style.display = 'flex';
      document.body.classList.add('no-scroll');
      document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', handleKeydown);
    };

    const updateImage = () => {
      const item = galleryItems[currentImageIndex];
      const imageSrc = item.dataset.kmImage || item.src;
      lightboxImage.src = imageSrc.replace('../', '');
      lightboxImage.alt = item.alt;
    };

    const showPrev = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
      updateImage();
    };

    const showNext = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
      updateImage();
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
  }

});