document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER & MOBILE NAVIGATION ---
  const siteHeader = document.getElementById('site-header');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  // Sticky header shrink
  const handleScroll = () => {
    if (window.scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Mobile menu toggle
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenu.classList.add('is-open');
      document.body.classList.add('no-scroll');
      mobileMenuClose.focus();
    });

    const closeMenu = () => {
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('no-scroll');
      mobileMenuToggle.focus();
    };

    mobileMenuClose.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- 2. SCROLL REVEAL ANIMATION ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 3. TESTIMONIAL CAROUSEL ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-controls .prev');
    const nextButton = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    const goToSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        carousel.scrollTo({
            left: slides[index].offsetLeft,
            behavior: 'smooth'
        });
        currentIndex = index;
    };

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
  }

  // --- 4. COOKIE BANNER ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.classList.add('is-visible');
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
    });
  }

  // --- 5. STICKY CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const heroSection = document.querySelector('.hero');
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (i.e., scrolled past it)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('is-visible');
            } else {
                stickyCta.classList.remove('is-visible');
            }
        });
    }, { threshold: 0 });

    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- 6. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's not just a standalone '#' link
            if (href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

});