document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '10px 0px 0px 0px' });
    // Dummy element to observe
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    document.body.prepend(sentinel);
    scrollObserver.observe(sentinel);
  }

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.getElementById('mobile-nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll', !isOpen);
    });
    // Close on backdrop click
    navMenu.addEventListener('click', (e) => {
        if(e.target === navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        }
    });
  }

  // --- Accordions --- //
  const accordions = document.querySelectorAll('.accordion-item');
  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Optional: close other accordions
      // accordions.forEach(i => i.classList.remove('open'));
      item.classList.toggle('open', !isOpen);
      header.setAttribute('aria-expanded', !isOpen);
    });
  });

  // --- Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Testimonial Carousel --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('button');

    prevBtn.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(newIndex);
    });

    nextBtn.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    });

    goToSlide(0);
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver(([entry]) => {
        stickyCTA.classList.toggle('visible', entry.boundingClientRect.top < -300);
    }, { threshold: [0, 0.1, 0.2, 0.8, 0.9, 1] });
    const heroSection = document.querySelector('.hero');
    if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Global Lightbox (Singleton) --- //
  // Not used as there are no images, but the logic is here as required.
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    const lightboxImg = lightbox.querySelector('img');
    let currentImageIndex = -1;
    let galleryImages = [];

    const openLightbox = (index) => {
      currentImageIndex = index;
      updateLightboxImage();
      lightbox.style.display = 'flex';
      setTimeout(() => lightbox.classList.add('visible'), 10);
      document.body.classList.add('no-scroll');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
      }, 300);
      document.body.classList.remove('no-scroll');
    };

    const updateLightboxImage = () => {
      if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
        const imgData = galleryImages[currentImageIndex];
        // Note: data-km-image is always root-relative
        lightboxImg.src = (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/')) ? imgData.src : `../${imgData.src}`;
        lightboxImg.alt = imgData.alt;
      }
    };

    const showPrev = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightboxImage();
    };

    const showNext = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightboxImage();
    };

    document.querySelectorAll('[data-km-image]').forEach((el, index) => {
      galleryImages.push({ src: el.dataset.kmImage, alt: el.alt });
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      }
    });
  }

});