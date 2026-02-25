document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-sticky');
      } else {
        header.classList.remove('is-sticky');
      }
    });
  }

  // --- Mobile Navigation ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('mobile-menu-open');
      mainNav.classList.toggle('is-mobile');
      mainNav.classList.toggle('is-open');
      const isOpen = mainNav.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        document.body.classList.add('body-scroll-lock');
      } else {
        document.body.classList.remove('body-scroll-lock');
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    const updateCarousel = () => {
      const slideWidth = carousel.querySelector('.testimonial-slide').clientWidth;
      carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
      });
    }
    window.addEventListener('resize', updateCarousel);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookies = document.getElementById('accept-cookies');
  const declineCookies = document.getElementById('decline-cookies');
  
  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'flex';
  }

  if (acceptCookies) {
    acceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.style.display = 'none';
    });
  }

  if (declineCookies) {
    declineCookies.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const heroSection = document.querySelector('.hero');
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stickyCta.style.display = 'flex';
          setTimeout(() => stickyCta.classList.add('visible'), 10);
        } else {
          stickyCta.classList.remove('visible');
          setTimeout(() => stickyCta.style.display = 'none', 300);
        }
      });
    }, { threshold: 0 });
    if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Contact Form ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // This is a dummy form submission handler.
      // In a real project, this would send data to a server.
      alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
      contactForm.reset();
    });
  }

  // --- Lightbox (Logic only, no triggers since no images) ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    let currentImageIndex = -1;
    let galleryImages = [];

    const openLightbox = (index) => {
      if (index < 0 || index >= galleryImages.length) return;
      currentImageIndex = index;
      const imagePath = galleryImages[currentImageIndex].getAttribute('data-km-image');
      lightboxImg.setAttribute('src', imagePath);
      lightbox.style.display = 'flex';
      setTimeout(() => lightbox.classList.add('visible'), 10);
      document.body.classList.add('body-scroll-lock');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.setAttribute('src', '');
      }, 300);
      document.body.classList.remove('body-scroll-lock');
    };

    const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
    const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryImages.length);

    // Event listeners for lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('visible')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
      }
    });

    // Add click listeners to gallery images (if any existed)
    // const imageElements = document.querySelectorAll('[data-km-image]');
    // galleryImages = Array.from(imageElements);
    // galleryImages.forEach((img, index) => {
    //   img.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     openLightbox(index);
    //   });
    // });
  }

});