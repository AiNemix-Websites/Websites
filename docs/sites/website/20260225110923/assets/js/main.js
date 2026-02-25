document.addEventListener('DOMContentLoaded', () => {

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
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isActive = navToggle.classList.toggle('is-active');
      mobileNav.classList.toggle('is-active');
      mobileNav.setAttribute('aria-hidden', !isActive);
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.classList.toggle('body-no-scroll', isActive);
    });
  }

  // --- 3. Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
           entry.target.classList.add('is-visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    const totalSlides = slides.length;

    const updateCarousel = () => {
      const scrollAmount = slides[0].offsetWidth * currentIndex;
      carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateCarousel();
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    updateCarousel(); // Initial call
  }

  // --- 5. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'block';
    }
    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- 6. Contextual CTA --- //
  const contextCta = document.getElementById('context-cta');
  if (contextCta) {
      window.addEventListener('scroll', () => {
          if (window.scrollY > 400) {
              contextCta.classList.add('visible');
          } else {
              contextCta.classList.remove('visible');
          }
      });
  }

  // --- 7. Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-content img');
  const galleryLinks = document.querySelectorAll('.lightbox-gallery a');
  const closeButton = lightbox.querySelector('.close-lightbox');
  const prevButton = lightbox.querySelector('.prev-lightbox');
  const nextButton = lightbox.querySelector('.next-lightbox');
  let currentImageIndex = -1;

  const showLightbox = (index) => {
    if (index < 0 || index >= galleryLinks.length) return;
    currentImageIndex = index;
    const imagePath = galleryLinks[currentImageIndex].getAttribute('href');
    lightboxImg.setAttribute('src', imagePath);
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.classList.add('visible'), 10);
    document.body.classList.add('body-no-scroll');
  };

  const hideLightbox = () => {
    lightbox.classList.remove('visible');
    setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.setAttribute('src', '');
        document.body.classList.remove('body-no-scroll');
    }, 300);
  };

  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showLightbox(index);
    });
  });

  if (lightbox) {
    closeButton.addEventListener('click', hideLightbox);
    prevButton.addEventListener('click', () => showLightbox(currentImageIndex - 1));
    nextButton.addEventListener('click', () => showLightbox(currentImageIndex + 1));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) hideLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('visible')) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') showLightbox(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showLightbox(currentImageIndex + 1);
        }
    });
  }

});