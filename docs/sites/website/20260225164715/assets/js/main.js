document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Menu ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll', isActive);
      menuToggle.setAttribute('aria-expanded', isActive);
    });
  }

  // --- Scroll Reveal Animation ---
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

  // --- Testimonial Carousel ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    function showSlide(index) {
      const offset = -index * 100;
      carousel.style.transform = `translateX(${offset}%)`;
      currentIndex = index;
    }

    nextBtn.addEventListener('click', () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    });
    
    // Initial setup
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${index * 100}%)`;
    });
    carousel.style.display = 'flex';
    let currentSlide = 0;
    const totalSlides = slides.length;

    const updateCarousel = () => {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieBanner.classList.add('visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Context CTA ---
  const contextCta = document.getElementById('context-cta');
  if(contextCta) {
      window.addEventListener('scroll', () => {
          if(window.scrollY > 400) {
              contextCta.classList.add('visible');
          } else {
              contextCta.classList.remove('visible');
          }
      });
  }

  // --- Contact Form (Placeholder) ---
  const contactForm = document.getElementById('contact-form');
  if(contactForm) {
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const formStatus = document.getElementById('form-status');
          formStatus.textContent = 'Vielen Dank! Ihre Anfrage wird simuliert.';
          formStatus.style.color = 'var(--colors-accent)';
          setTimeout(() => {
              formStatus.textContent = '';
              contactForm.reset();
          }, 4000);
      });
  }
});