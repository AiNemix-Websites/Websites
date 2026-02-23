document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavDrawer.setAttribute('aria-hidden', isExpanded);
      document.body.classList.toggle('nav-open');
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavDrawer.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // --- Scroll Animations --- //
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
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

    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.setAttribute('aria-hidden', 'false');
        cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 500);
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
      setTimeout(() => cookieBanner.setAttribute('aria-hidden', 'true'), 500);
    });
  }

  // --- Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    let galleryItems = [];
    let currentIndex = 0;

    const updateLightbox = () => {
      const item = galleryItems[currentIndex];
      const imgSrc = item.href;
      const imgAlt = item.querySelector('img')?.alt || 'Galeriebild';
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      prevBtn.style.display = currentIndex > 0 ? 'grid' : 'none';
      nextBtn.style.display = currentIndex < galleryItems.length - 1 ? 'grid' : 'none';
    };

    const openLightbox = (e) => {
        if(e.target.closest('.gallery-item')) {
            e.preventDefault();
            const clickedItem = e.target.closest('.gallery-item');
            galleryItems = Array.from(document.querySelectorAll('.image-gallery .gallery-item'));
            currentIndex = galleryItems.indexOf(clickedItem);
            updateLightbox();
            lightbox.setAttribute('aria-hidden', 'false');
            lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden';
            closeBtn.focus();
        }
    };

    const closeLightbox = () => {
      lightbox.setAttribute('aria-hidden', 'true');
      lightbox.classList.remove('visible');
      document.body.style.overflow = '';
    };

    document.querySelector('.image-gallery')?.addEventListener('click', openLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; updateLightbox(); } });
    nextBtn.addEventListener('click', () => { if (currentIndex < galleryItems.length - 1) { currentIndex++; updateLightbox(); } });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, index) => dot.classList.toggle('active', index === currentIndex));
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.ariaLabel = `Gehe zu Zitat ${index + 1}`;
      dot.addEventListener('click', () => { currentIndex = index; updateCarousel(); });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateCarousel(); });
    nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % slides.length; updateCarousel(); });
    updateCarousel();
  }

  // --- Sticky CTA & Back to Top --- //
  const stickyCTA = document.getElementById('sticky-cta');
  const backToTop = document.getElementById('back-to-top');
  const progressCircle = backToTop?.querySelector('.progress-ring-circle');
  const circumference = progressCircle ? 2 * Math.PI * progressCircle.r.baseVal.value : 0;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
  }

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const progress = scrollPosition / (docHeight - windowHeight);

    if (stickyCTA) {
      if (scrollPosition > windowHeight * 0.8) {
        stickyCTA.classList.add('visible');
        stickyCTA.setAttribute('aria-hidden', 'false');
      } else {
        stickyCTA.classList.remove('visible');
        stickyCTA.setAttribute('aria-hidden', 'true');
      }
    }

    if (backToTop) {
      if (scrollPosition > windowHeight) {
        backToTop.classList.add('visible');
        backToTop.setAttribute('aria-hidden', 'false');
      } else {
        backToTop.classList.remove('visible');
        backToTop.setAttribute('aria-hidden', 'true');
      }
      const offset = circumference - progress * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }
  };

  window.addEventListener('scroll', handleScroll);

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});