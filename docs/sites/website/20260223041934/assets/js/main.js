document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- Sticky Header ---
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav ul');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('nav-open');
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        mainNav.querySelector('a').focus();
      }
    });
  }

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      const content = header.nextElementSibling;
      content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
    });
  });

  // --- Testimonial Carousel ---
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.dots');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dotsContainer.querySelectorAll('span').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => goToSlide((currentIndex - 1 + slides.length) % slides.length));
    nextBtn.addEventListener('click', () => goToSlide((currentIndex + 1) % slides.length));

    goToSlide(0);
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');
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

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('show');
              } else {
                  stickyCTA.classList.remove('show');
              }
          });
      }, { rootMargin: '0px 0px -200px 0px' });
      const heroSection = document.querySelector('.hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Global Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    let galleryImages = [];
    let currentIndex = 0;

    const updateImage = () => {
      const currentImage = galleryImages[currentIndex];
      const imagePath = currentImage.dataset.kmImage;
      const altText = currentImage.alt;
      lightboxImg.src = imagePath.startsWith('..') ? imagePath : `../${imagePath}`.replace('../assets', 'assets');
      lightboxImg.alt = altText;
    };

    const showLightbox = () => {
      document.body.classList.add('no-scroll');
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
    };

    const hideLightbox = () => {
      document.body.classList.remove('no-scroll');
      lightbox.classList.remove('show');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
    };

    document.addEventListener('click', e => {
      if (e.target.matches('.lightbox-trigger')) {
        galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
        currentIndex = galleryImages.indexOf(e.target);
        updateImage();
        showLightbox();
      }
    });

    closeBtn.addEventListener('click', hideLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) hideLightbox(); });
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      updateImage();
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      updateImage();
    });

    document.addEventListener('keydown', e => {
      if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
      }
    });
  }
});