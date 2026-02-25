document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(
      ([e]) => e.target.classList.toggle('scrolled', e.intersectionRatio < 1),
      { threshold: [1] }
    );
    scrollObserver.observe(header);
  }

  // --- Mobile Navigation ---
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');
  if (mobileNavToggle && mobileNavMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
      mobileNavToggle.classList.toggle('is-active');
      mobileNavMenu.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', !isOpen);
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const totalSlides = slides.length;

    const showSlide = (index) => {
      const offset = -index * 100;
      carousel.style.transform = `translateX(${offset}%)`;
      currentIndex = index;
    };

    prevButton.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      showSlide(newIndex);
    });

    nextButton.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % totalSlides;
      showSlide(newIndex);
    });
    
    // Basic swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', (event) => {
        touchstartX = event.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (event) => {
        touchendX = event.changedTouches[0].screenX;
        if (touchendX < touchstartX) nextButton.click();
        if (touchendX > touchstartX) prevButton.click();
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    acceptCookiesBtn.addEventListener('click', () => {
      cookieBanner.classList.remove('show');
      localStorage.setItem('cookiesAccepted', 'true');
    });
  }

  // --- Global Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentImageIndex = 0;
  const imageSources = Array.from(galleryItems).map(item => item.dataset.kmImageSrc);

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');

    const openLightbox = (index) => {
      currentImageIndex = index;
      const imgSrc = imageSources[currentImageIndex];
      // Construct correct relative path for subpages
      const pageDepth = window.location.pathname.split('/').length - 2;
      const prefix = '../'.repeat(pageDepth);
      lightboxImg.src = prefix + imgSrc;
      lightbox.style.display = 'flex';
      setTimeout(() => lightbox.classList.add('show'), 10);
      document.addEventListener('keydown', handleKeydown);
      document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
      }, 300);
      document.removeEventListener('keydown', handleKeydown);
      document.body.classList.remove('no-scroll');
    };

    const showPrevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
      openLightbox(currentImageIndex);
    };

    const showNextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % imageSources.length;
      openLightbox(currentImageIndex);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
  }

  // --- Context CTA ---
  const contextCta = document.getElementById('context-cta');
  if(contextCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        contextCta.classList.add('show');
      } else {
        contextCta.classList.remove('show');
      }
    });
  }
});