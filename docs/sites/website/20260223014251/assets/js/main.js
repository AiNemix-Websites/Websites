document.addEventListener('DOMContentLoaded', function() {

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

  // --- Mobile Navigation ---
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav-list');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100); // Staggered delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  // --- Accordion ---
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    header.addEventListener('click', () => {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });

  // --- Testimonial Carousel ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.childNodes.forEach((dot, index) => {
            if(index === currentIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });
    }

    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieAccepted')) {
      cookieBanner.classList.add('visible');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyCta.classList.add('visible');
      } else {
        stickyCta.classList.remove('visible');
      }
    });
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let currentIndex = 0;

    function showImage(index) {
      const item = galleryItems[index];
      if (!item) return;
      currentIndex = index;
      lightboxImage.src = item.dataset.lightboxSrc;
      lightboxImage.alt = item.dataset.lightboxAlt || '';
    }

    function openLightbox(index) {
      showImage(index);
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeydown);
    }

    function showPrev() {
      const newIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
      showImage(newIndex);
    }

    function showNext() {
      const newIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
      showImage(newIndex);
    }

    function handleKeydown(e) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
  }

});