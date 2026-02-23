document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER & MOBILE NAV --- //
  const header = document.querySelector('.site-header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  // Sticky Header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Nav Toggle
  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
      mainNav.classList.toggle('is-open');
      mainNav.classList.toggle('active'); // for transition
    });
  }

  // --- SCROLL REVEAL --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
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

    // Swipe functionality
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    carousel.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) nextBtn.click();
        if (touchEndX - touchStartX > 50) prevBtn.click();
    });

    updateCarousel();
  }

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (i.e., scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCTA.hidden = false;
                  setTimeout(() => stickyCTA.classList.add('show'), 10);
              } else {
                  stickyCTA.classList.remove('show');
                  setTimeout(() => stickyCTA.hidden = true, 500);
              }
          });
      }, { threshold: 0.1 });
      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- CONTACT FORM --- //
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    if (subject) {
      const subjectField = contactForm.querySelector('#subject');
      if (subjectField) subjectField.value = subject;
    }
  }

  // --- LIGHTBOX (Singleton) --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentGallery = [];
    let currentIndex = -1;

    const openLightbox = (gallery, index) => {
      currentGallery = gallery;
      currentIndex = index;
      updateLightboxImage();
      lightbox.hidden = false;
      setTimeout(() => lightbox.classList.add('show'), 10);
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      setTimeout(() => lightbox.hidden = true, 300);
      document.body.style.overflow = '';
    };

    const updateLightboxImage = () => {
      if (currentIndex >= 0 && currentIndex < currentGallery.length) {
        const imagePath = currentGallery[currentIndex].dataset.kmImage;
        const altText = currentGallery[currentIndex].alt || 'Galeriebild';
        // Use the correct relative path for src
        const pathPrefix = lightbox.dataset.pathPrefix || '';
        lightboxImg.src = pathPrefix + imagePath;
        lightboxImg.alt = altText;
      }
      prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
      nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'block' : 'none';
    };

    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-lightbox-trigger]')) {
        e.preventDefault();
        const galleryName = e.target.dataset.lightboxGallery || 'default';
        const galleryImages = Array.from(document.querySelectorAll(`[data-lightbox-gallery='${galleryName}']`));
        const clickedIndex = galleryImages.indexOf(e.target);
        
        // Set path prefix for correct image loading from subpages
        const isSubpage = window.location.pathname.split('/').filter(Boolean).length > 0;
        lightbox.dataset.pathPrefix = isSubpage ? '../' : '';

        openLightbox(galleryImages, clickedIndex);
      }
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    prevBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; updateLightboxImage(); } });
    nextBtn.addEventListener('click', () => { if (currentIndex < currentGallery.length - 1) { currentIndex++; updateLightboxImage(); } });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

});