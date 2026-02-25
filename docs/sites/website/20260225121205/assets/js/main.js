document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // --- Scroll Reveal Animation ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  revealItems.forEach(item => {
    observer.observe(item);
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('span');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyCTA.classList.add('show');
      } else {
        stickyCTA.classList.remove('show');
      }
    });
  }

  // --- Contact Form --- 
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
      contactForm.reset();
    });
  }

  // --- Global Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  const galleryContainer = document.getElementById('image-gallery');
  let galleryImages = [];
  let currentImageIndex = -1;

  if (lightbox && galleryContainer) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');

    const openLightbox = (index) => {
      currentImageIndex = index;
      lightboxImg.src = galleryImages[currentImageIndex];
      lightbox.classList.add('show');
      document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      document.body.classList.remove('no-scroll');
      lightboxImg.src = ''; // Stop loading
    };

    const showPrevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIndex];
    };

    const showNextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentImageIndex];
    };

    galleryImages = Array.from(galleryContainer.querySelectorAll('a')).map(a => a.href);

    galleryContainer.addEventListener('click', e => {
      e.preventDefault();
      const link = e.target.closest('a');
      if (link) {
        const index = galleryImages.indexOf(link.href);
        if (index > -1) {
          openLightbox(index);
        }
      }
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
      }
    });
  }

});