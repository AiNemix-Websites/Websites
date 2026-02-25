document.addEventListener('DOMContentLoaded', function() {

  // Mobile Navigation
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNavToggle.classList.toggle('is-active');
      mobileNavDrawer.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Sticky Header
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const childElements = entry.target.querySelectorAll('.reveal-child');
        childElements.forEach(child => child.classList.add('is-visible'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // Cookie Banner
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
        cookieBanner.classList.add('is-visible');
    }, 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('is-visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // Sticky CTA
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past it)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('is-visible');
              } else {
                  stickyCTA.classList.remove('is-visible');
              }
          });
      }, { threshold: 0.1 });
      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // Testimonial Carousel
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack) {
      const slides = Array.from(carouselTrack.children);
      const nextButton = document.querySelector('.next');
      const prevButton = document.querySelector('.prev');
      const slideWidth = slides[0].getBoundingClientRect().width;
      let currentIndex = 0;

      const moveToSlide = (track, currentSlide, targetSlide) => {
          track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
          currentSlide.classList.remove('current-slide');
          targetSlide.classList.add('current-slide');
      }

      const updateCarousel = () => {
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      }

      nextButton.addEventListener('click', e => {
          currentIndex = (currentIndex + 1) % slides.length;
          updateCarousel();
      });

      prevButton.addEventListener('click', e => {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
          updateCarousel();
      });
  }

  // Lightbox (structure only, as no images are present)
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        lightbox.style.display = 'none';
        document.body.classList.remove('no-scroll');
    };

    lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
  }

  // Contact Form
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // This is a dummy form submission handler.
      // In a real project, this would send data to a server.
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sende...';
      submitButton.disabled = true;

      setTimeout(() => {
        // Simulate success
        form.reset();
        submitButton.textContent = 'Erfolgreich gesendet!';
        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 3000);
      }, 1500);
    });
  }

});