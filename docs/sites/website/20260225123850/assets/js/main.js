document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
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

  // --- Mobile Menu ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });
  }

  // --- Scroll Reveal ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach(item => revealObserver.observe(item));

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('button');

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      carousel.style.display = 'flex'; // Make sure it's flex for alignment
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateCarousel();
    }

    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Swipe functionality
    let touchstartX = 0;
    let touchendX = 0;
    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX) goToSlide(currentIndex + 1);
      if (touchendX > touchstartX) goToSlide(currentIndex - 1);
    });

    goToSlide(0);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Sticky CTA & Back to Top ---
  const stickyCTA = document.getElementById('sticky-cta');
  const backToTopBtn = document.getElementById('back-to-top');

  if (stickyCTA || backToTopBtn) {
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 400;
      if (stickyCTA) stickyCTA.classList.toggle('show', show);
      if (backToTopBtn) backToTopBtn.classList.toggle('show', show);
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // --- Contact Form --- 
  const contactForm = document.getElementById('contact-form');
  if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const statusEl = document.getElementById('form-status');
      statusEl.textContent = 'Nachricht wird gesendet...';
      // Simulate form submission
      setTimeout(() => {
        statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde erhalten.';
        contactForm.reset();
      }, 1000);
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a.scroll-to').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
  });

  // --- Lightbox (Singleton) ---
  // Although there are no images, the logic is here as required.
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeLightbox = () => {
      lightbox.classList.remove('show');
      setTimeout(() => { lightbox.style.display = 'none'; }, 300);
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', handleEscKey);
    };

    const handleEscKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('close')) {
        closeLightbox();
      }
    });

    // This part would be used to open the lightbox
    // Example: document.querySelectorAll('[data-lightbox-src]').forEach(el => {
    //   el.addEventListener('click', () => {
    //     const imgSrc = el.dataset.lightboxSrc;
    //     lightbox.querySelector('img').src = imgSrc;
    //     lightbox.style.display = 'flex';
    //     setTimeout(() => lightbox.classList.add('show'), 10);
    //     document.body.classList.add('no-scroll');
    //     document.addEventListener('keydown', handleEscKey);
    //   });
    // });
  }
});