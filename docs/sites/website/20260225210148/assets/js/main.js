'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const initMobileNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const mainMenu = document.querySelector('#main-menu');
    const header = document.querySelector('.site-header');

    if (!navToggle || !mainMenu) return;

    const toggleNav = () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      header.classList.toggle('nav-open');
      document.body.classList.toggle('no-scroll');
    };

    navToggle.addEventListener('click', toggleNav);

    // Close on backdrop click
    mainMenu.addEventListener('click', (e) => {
        if (e.target === mainMenu) {
            toggleNav();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        toggleNav();
      }
    });
  };

  // --- Sticky Header --- //
  const initStickyHeader = () => {
    const header = document.querySelector('.site-header.sticky');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  };

  // --- Scroll Reveal Animation --- //
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger-group');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('reveal-stagger-group')) {
            const children = entry.target.children;
            for (let i = 0; i < children.length; i++) {
              setTimeout(() => {
                children[i].classList.add('is-visible');
              }, i * 150);
            }
          } else {
            entry.target.classList.add('is-visible');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => observer.observe(el));
  };

  // --- Cookie Banner --- //
  const initCookieBanner = () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (!banner || !acceptBtn || !declineBtn) return;

    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      banner.classList.add('show');
    }

    const setConsent = (value) => {
      localStorage.setItem('cookie_consent', value);
      banner.classList.remove('show');
    };

    acceptBtn.addEventListener('click', () => setConsent('accepted'));
    declineBtn.addEventListener('click', () => setConsent('declined'));
  };

  // --- Interactive House SVG --- //
  const initInteractiveHouse = () => {
    const svgContainer = document.getElementById('interactive-house-svg');
    if (!svgContainer) return;

    const houseParts = svgContainer.querySelectorAll('.house-part');
    const popup = document.getElementById('house-info-popup');
    const areaEl = popup.querySelector('.info-area');
    const serviceEl = popup.querySelector('.info-service');
    const detailsEl = popup.querySelector('.info-details');

    const updatePopup = (part) => {
        houseParts.forEach(p => p.classList.remove('active'));
        part.classList.add('active');
        areaEl.textContent = part.dataset.area;
        serviceEl.textContent = part.dataset.service;
        detailsEl.textContent = part.dataset.info;
    };

    houseParts.forEach(part => {
        const handleInteraction = () => updatePopup(part);
        part.addEventListener('click', handleInteraction);
        part.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteraction();
            }
        });
    });
  };

  // --- Testimonial Carousel --- //
  const initTestimonialCarousel = () => {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    if (slides.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    const goToSlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    goToSlide(0); // Initial setup
  };

  // --- Sticky CTA --- //
  const initStickyCta = () => {
    const cta = document.getElementById('sticky-cta');
    if (!cta) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when the hero section is NOT intersecting (i.e., scrolled past it)
        if (!entry.isIntersecting) {
          cta.classList.add('visible');
        } else {
          cta.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      observer.observe(heroSection);
    }
  };

  // --- Initialize All --- //
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initCookieBanner();
  initInteractiveHouse();
  initTestimonialCarousel();
  initStickyCta();
});