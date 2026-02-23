document.addEventListener('DOMContentLoaded', () => {

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

  // --- 2. MOBILE NAVIGATION --- //
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      menuToggle.classList.toggle('mobile-menu-open');
      mainNav.classList.toggle('mobile-open');
      document.body.classList.toggle('scroll-locked');
    });
  }

  // --- 3. SCROLL REVEAL --- //
  const revealElements = document.querySelectorAll('.scroll-reveal');
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

  // --- 4. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');

  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- 5. TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const button = document.createElement('button');
      button.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(button);
    });
    const dots = Array.from(dotsContainer.children);

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    prevButton.addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(newIndex);
    });

    nextButton.addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    });

    goToSlide(0); // Initial setup
  }

  // --- 6. LIGHTBOX GALLERY --- //
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentImageIndex = -1;
  const galleryImages = Array.from(galleryItems).map(item => item.querySelector('img'));

  if (lightbox && galleryItems.length > 0) {
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const backdrop = lightbox.querySelector('.lightbox-backdrop');

    const openLightbox = (index) => {
      currentImageIndex = index;
      const imgElement = galleryImages[currentImageIndex];
      lightboxImage.src = imgElement.src;
      lightboxImage.alt = imgElement.alt;
      lightbox.style.display = 'flex';
      document.body.classList.add('scroll-locked');
      document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.classList.remove('scroll-locked');
      document.removeEventListener('keydown', handleKeydown);
    };

    const showPrevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      openLightbox(currentImageIndex);
    };

    const showNextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      openLightbox(currentImageIndex);
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrevImage();
      if (e.key === 'ArrowRight') showNextImage();
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
  }

  // --- 7. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past it)
        if (!entry.isIntersecting) {
          stickyCTA.hidden = false;
          stickyCTA.classList.add('visible');
        } else {
          stickyCTA.classList.remove('visible');
        }
      });
    }, { threshold: 0 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      ctaObserver.observe(heroSection);
    }
  }

});