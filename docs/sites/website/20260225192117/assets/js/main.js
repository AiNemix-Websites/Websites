document.addEventListener('DOMContentLoaded', function() {

  // --- MOBILE MENU --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');

  if (menuToggle && mobileMenu) {
    const openMenu = () => {
      mobileMenu.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('body-no-scroll');
    };

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('body-no-scroll');
    };

    menuToggle.addEventListener('click', openMenu);
    if(menuClose) menuClose.addEventListener('click', closeMenu);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- STICKY HEADER --- //
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // --- SCROLL REVEAL --- //
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach(item => {
    revealObserver.observe(item);
  });

  // --- FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
    });
  });

  // --- TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-controls .next');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const dotsContainer = document.querySelector('.dots');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = Array.from(dotsContainer.children);

    const updateCarousel = () => {
        const offset = slides[0].getBoundingClientRect().width * currentIndex;
        carousel.style.transform = `translateX(-${offset}px)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    const goToSlide = (index) => {
        currentIndex = index;
        updateCarousel();
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });
    
    // Basic swipe support
    let touchstartX = 0;
    let touchendX = 0;
    
    carousel.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false); 

    function handleSwipe() {
        if (touchendX < touchstartX) { // Swiped left
            currentIndex = Math.min(currentIndex + 1, slides.length - 1);
        }
        if (touchendX > touchstartX) { // Swiped right
            currentIndex = Math.max(currentIndex - 1, 0);
        }
        updateCarousel();
    }

    window.addEventListener('resize', updateCarousel);
  }

  // --- STICKY CTA BAR --- //
  const stickyCTA = document.querySelector('.sticky-cta-bar');
  const footer = document.querySelector('.site-footer-main');
  if (stickyCTA && footer) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show CTA when footer is NOT intersecting (i.e., user has scrolled past hero but not reached footer)
              stickyCTA.classList.toggle('is-visible', !entry.isIntersecting && window.scrollY > window.innerHeight / 2);
          });
      }, { threshold: 0 });
      ctaObserver.observe(footer);
  }

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');
  const declineButton = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('is-visible');
  }

  if (acceptButton) {
      acceptButton.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'accepted');
          cookieBanner.classList.remove('is-visible');
      });
  }

  if (declineButton) {
      declineButton.addEventListener('click', () => {
          localStorage.setItem('cookieConsent', 'declined');
          cookieBanner.classList.remove('is-visible');
      });
  }

  // --- CONTACT FORM --- //
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
      const successMessage = document.getElementById('form-success-message');
      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          // This is a simulation. In a real project, you'd send the data.
          contactForm.style.display = 'none';
          successMessage.style.display = 'block';
      });
  }

});