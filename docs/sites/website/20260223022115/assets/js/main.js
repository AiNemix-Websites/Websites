document.addEventListener('DOMContentLoaded', function() {

  // --- Scroll Reveal Animation ---
  const scrollReveal = () => {
    const elements = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, index * 100); // Staggered delay
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
  };

  // --- Sticky Header ---
  const stickyHeader = () => {
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
  };

  // --- Mobile Menu ---
  const mobileMenu = () => {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        document.body.classList.toggle('mobile-menu-open');
        nav.classList.toggle('mobile-open');
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
      });
    }
  };

  // --- Testimonial Carousel ---
  const testimonialCarousel = () => {
    const carousel = document.querySelector('.testimonial-carousel');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollStep = carousel.querySelector('.testimonial-slide').offsetWidth + 16; // 16 is gap

    nextBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  };

  // --- Cookie Banner ---
  const cookieBanner = () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!banner || !acceptBtn) return;

    if (!localStorage.getItem('cookiesAccepted')) {
      setTimeout(() => banner.classList.add('visible'), 1000);
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookiesAccepted', 'true');
      banner.classList.remove('visible');
    });
  };

  // --- Lightbox --- 
  const lightbox = () => {
    const lightboxEl = document.getElementById('km-lightbox');
    if (!lightboxEl) return;

    const galleryImages = document.querySelectorAll('.gallery-image');
    const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);
    let currentIndex = 0;

    const lightboxImage = lightboxEl.querySelector('.lightbox-image');
    const closeBtn = lightboxEl.querySelector('.lightbox-close');
    const prevBtn = lightboxEl.querySelector('.lightbox-prev');
    const nextBtn = lightboxEl.querySelector('.lightbox-next');
    const backdrop = lightboxEl.querySelector('.lightbox-backdrop');

    function showImage(index) {
        if (index < 0 || index >= imageSources.length) return;
        currentIndex = index;
        const relativePath = lightboxImage.src.includes('/referenzen/') ? '../' : './';
        lightboxImage.src = (location.pathname.includes('/referenzen/') ? '../' : '') + imageSources[currentIndex];
    }

    function openLightbox(index) {
        showImage(index);
        lightboxEl.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxEl.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    document.addEventListener('keydown', (e) => {
        if (!lightboxEl.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
  };

  // --- Sticky CTA ---
  const stickyCta = () => {
    const cta = document.getElementById('sticky-cta');
    if (!cta) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past)
            if (!entry.isIntersecting) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero, .hero-subpage');
    if (heroSection) {
        observer.observe(heroSection);
    }
  };

  // Initialize all functions
  scrollReveal();
  stickyHeader();
  mobileMenu();
  testimonialCarousel();
  cookieBanner();
  lightbox();
  stickyCta();
});