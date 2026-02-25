document.addEventListener('DOMContentLoaded', function() {

  // --- STICKY HEADER ---
  const header = document.getElementById('site-header');
  if (header) {
    const scrollThreshold = 50;
    window.addEventListener('scroll', () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- MOBILE MENU ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuClose = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  const openMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    mobileMenu.querySelector('.mobile-menu__backdrop').addEventListener('click', closeMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });
  }

  // --- SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // --- TESTIMONIAL CAROUSEL ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
        dotsContainer.childNodes.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
    
    updateDots();
  }

  // --- COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const declineCookiesBtn = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.style.display = 'block';
    setTimeout(() => cookieBanner.classList.add('show'), 100);
  }

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineCookiesBtn) {
    declineCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- CONTACT FORM ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const feedbackEl = document.getElementById('form-feedback');
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird gesendet...';
      feedbackEl.className = 'form-feedback';

      setTimeout(() => {
        feedbackEl.textContent = 'Nachricht erfolgreich gesendet. Wir melden uns in Kürze!';
        feedbackEl.classList.add('success');
        contactForm.reset();
      }, 1500);
    });
  }

});