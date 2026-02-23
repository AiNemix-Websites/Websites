document.addEventListener('DOMContentLoaded', function() {

  // --- 1. Sticky Header --- //
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

  // --- 2. Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      mainNav.classList.toggle('is-open');
      const isOpen = mainNav.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('scroll-locked', isOpen);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
      }
    });
  }

  // --- 3. Scroll Reveal Animation --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- 4. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    setTimeout(() => {
      if (!localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
      }
    }, 2000);

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- 5. Carousel --- //
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  if (carouselWrapper) {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const slides = Array.from(carouselWrapper.children);
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const setupCarousel = () => {
        slides.forEach((slide, index) => {
            slide.style.left = slideWidth * index + 'px';
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsContainer.appendChild(dot);
        });
    };

    const moveToSlide = (targetIndex) => {
        if (targetIndex < 0) targetIndex = slides.length - 1;
        if (targetIndex >= slides.length) targetIndex = 0;
        
        carouselWrapper.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
        dotsContainer.children[currentIndex].classList.remove('active');
        dotsContainer.children[targetIndex].classList.add('active');
        currentIndex = targetIndex;
    };

    nextBtn.addEventListener('click', () => moveToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => moveToSlide(currentIndex - 1));
    
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width;
        moveToSlide(currentIndex);
    });

    setupCarousel();
  }

  // --- 6. Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    let galleryImages = [];
    let currentIndex = -1;

    const imageTriggers = document.querySelectorAll('.lightbox-trigger');
    imageTriggers.forEach((trigger, index) => {
        const imageSrc = trigger.dataset.kmImage || trigger.src;
        const imageAlt = trigger.alt;
        galleryImages.push({ src: imageSrc, alt: imageAlt });
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    function updateImage() {
        if (currentIndex > -1 && currentIndex < galleryImages.length) {
            const basePath = lightboxImg.src.includes('../') ? '../' : '';
            lightboxImg.src = basePath + galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
        }
    }

    function openLightbox(index) {
        currentIndex = index;
        updateImage();
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scroll-locked');
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-locked');
    }

    function showPrev() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
        updateImage();
    }

    function showNext() {
        currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
        updateImage();
    }

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
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

  // --- 7. Sticky Context CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });
      
      const heroElement = document.querySelector('.hero-portal, .page-hero');
      if (heroElement) {
          ctaObserver.observe(heroElement);
      }
  }

});