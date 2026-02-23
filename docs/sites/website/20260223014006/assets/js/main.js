document.addEventListener('DOMContentLoaded', function() {

  // --- 1. HEADER SCROLL & STICKY CTA ---
  const header = document.getElementById('main-header');
  const stickyCta = document.getElementById('sticky-cta');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (window.scrollY > 600) {
      stickyCta.classList.add('show');
    } else {
      stickyCta.classList.remove('show');
    }
  }

  // --- 2. MOBILE MENU ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const menuClose = document.getElementById('mobile-menu-close');
  const menuDrawer = document.getElementById('mobile-menu-drawer');

  function openMenu() {
    menuDrawer.classList.add('open');
    menuDrawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuDrawer.classList.remove('open');
    menuDrawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle && menuDrawer && menuClose) {
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuDrawer.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --- 3. SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- 4. TESTIMONIAL CAROUSEL ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('button');

    function updateCarousel() {
        carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === slides.length - 1;
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    nextButton.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    // Touch/Swipe support
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX && currentIndex < slides.length - 1) { currentIndex++; }
        if (touchendX > touchstartX && currentIndex > 0) { currentIndex--; }
        updateCarousel();
    });

    updateCarousel();
  }

  // --- 5. COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
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

  // --- 6. LIGHTBOX --- 
  const lightbox = document.getElementById('km-lightbox');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-image-trigger'));
  let currentImageIndex = -1;

  if (lightbox && galleryImages.length > 0) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

    const openLightbox = (index) => {
      currentImageIndex = index;
      const imgElement = galleryImages[index];
      const imgSrc = imgElement.getAttribute('src');
      const imgAlt = imgElement.getAttribute('alt');
      lightboxImage.setAttribute('src', imgSrc);
      lightboxImage.setAttribute('alt', imgAlt);
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      updateLightboxControls();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const showPrevImage = () => {
      if (currentImageIndex > 0) {
        openLightbox(currentImageIndex - 1);
      }
    };

    const showNextImage = () => {
      if (currentImageIndex < galleryImages.length - 1) {
        openLightbox(currentImageIndex + 1);
      }
    };

    const updateLightboxControls = () => {
      lightboxPrev.style.display = currentImageIndex > 0 ? 'grid' : 'none';
      lightboxNext.style.display = currentImageIndex < galleryImages.length - 1 ? 'grid' : 'none';
    };

    galleryImages.forEach((img, index) => {
      img.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
      }
    });
  }

  // --- INITIALIZATIONS ---
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
});