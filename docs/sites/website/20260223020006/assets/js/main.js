document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
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

  // --- 2. MOBILE MENU --- //
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
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

  // --- 4. TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  if (carousel && prevButton && nextButton) {
    const slides = document.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;

    function updateCarousel() {
        const offset = -currentIndex * slides[0].offsetWidth;
        carousel.style.transform = `translateX(${offset}px)`;
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        slides[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
  }

  // --- 5. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
    }
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.hidden = true;
    });
  }

  // --- 6. GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item img');
  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    let currentImageIndex = 0;
    const imageSources = Array.from(galleryItems).map(img => img.getAttribute('data-km-image'));

    const showImage = (index) => {
      if (index >= 0 && index < imageSources.length) {
        lightboxImg.src = `../${imageSources[index]}`; // Adjust path for subpages
        lightboxImg.setAttribute('data-km-image', imageSources[index]);
        currentImageIndex = index;
      }
    };

    const openLightbox = (index) => {
      showImage(index);
      lightbox.hidden = false;
      document.body.classList.add('no-scroll');
      document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));
  }

  // --- 7. STICKY CONTEXT CTA --- //
  const contextCta = document.getElementById('context-cta');
  if (contextCta) {
    window.addEventListener('scroll', () => {
      const showPosition = window.innerHeight * 0.5;
      if (window.scrollY > showPosition) {
        contextCta.classList.add('visible');
      } else {
        contextCta.classList.remove('visible');
      }
    });
  }

});