document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
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

  // --- 2. MOBILE NAVIGATION --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.getElementById('main-menu');
  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. COOKIE BANNER --- //
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

  // --- 4. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --- 5. BEFORE/AFTER SLIDER --- //
  const sliderContainer = document.querySelector('.before-after-slider');
  if (sliderContainer) {
    const slider = sliderContainer.querySelector('.slider');
    const imgAfter = sliderContainer.querySelector('.img-after');
    const sliderButton = sliderContainer.querySelector('.slider-button');

    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      imgAfter.style.clipPath = `polygon(${value}% 0, 100% 0, 100% 100%, ${value}% 100%)`;
      sliderButton.style.left = `${value}%`;
    });
  }

  // --- 6. TESTIMONIAL CAROUSEL --- //
  const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
  if (carouselWrapper) {
    const carousel = carouselWrapper.querySelector('.testimonial-carousel');
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = carouselWrapper.querySelector('.prev');
    const nextBtn = carouselWrapper.querySelector('.next');
    const dotsContainer = carouselWrapper.querySelector('.dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Gehe zu Testimonial ${index + 1}`);
        dot.classList.toggle('active', index === currentIndex);
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
    }

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- 7. GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentImageIndex = 0;
  const images = Array.from(galleryItems).map(item => item.querySelector('img'));

  if (lightbox && lightboxImg && galleryItems.length > 0) {
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    function openLightbox(index) {
      currentImageIndex = index;
      const imgElement = images[currentImageIndex];
      const imagePath = imgElement.dataset.kmImage;
      const altText = imgElement.alt;
      
      // Use relative path for display
      const displayPath = lightbox.isConnected ? (lightbox.closest('main').querySelector(`img[data-km-image='${imagePath}']`)?.src || `../${imagePath}`) : imagePath;

      lightboxImg.src = displayPath;
      lightboxImg.alt = altText;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }

    function showPrevImage() {
      currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : images.length - 1;
      openLightbox(currentImageIndex);
    }

    function showNextImage() {
      currentImageIndex = (currentImageIndex < images.length - 1) ? currentImageIndex + 1 : 0;
      openLightbox(currentImageIndex);
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  
  // --- 8. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if(stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(!entry.isIntersecting) {
                stickyCTA.hidden = false;
                setTimeout(() => stickyCTA.classList.add('show'), 10);
            } else {
                stickyCTA.classList.remove('show');
                setTimeout(() => stickyCTA.hidden = true, 300);
            }
        });
    }, { threshold: 0.1 });
    if(heroSection) {
        observer.observe(heroSection);
    }
  }

});