document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header ---
  const initStickyHeader = () => {
    const header = document.getElementById('site-header');
    if (!header) return;
    const scrollThreshold = 50;
    const onScroll = () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  // --- Mobile Navigation ---
  const initMobileNav = () => {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navUl = document.getElementById('main-navigation');
    if (!toggleBtn || !navUl) return;

    const toggleNav = (isOpen) => {
      const expanded = isOpen === undefined ? toggleBtn.getAttribute('aria-expanded') === 'false' : isOpen;
      toggleBtn.setAttribute('aria-expanded', expanded);
      document.body.classList.toggle('nav-open', expanded);
      document.body.classList.toggle('scroll-lock', expanded);
    };

    toggleBtn.addEventListener('click', () => toggleNav());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        toggleNav(false);
      }
    });
  };

  // --- Scroll Reveal Animation ---
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  };

  // --- Testimonial Carousel ---
  const initCarousel = () => {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const wrapper = carousel.closest('.carousel-wrapper');
    const prevBtn = wrapper.querySelector('.carousel-prev');
    const nextBtn = wrapper.querySelector('.carousel-next');
    const dotsContainer = wrapper.querySelector('.carousel-dots');
    const slides = Array.from(carousel.children);
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

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
  };

  // --- Global Lightbox ---
  const initLightbox = () => {
    const lightbox = document.getElementById('km-lightbox');
    if (!lightbox) return;

    const triggers = document.querySelectorAll('.lightbox-trigger');
    if (!triggers.length) return;

    const galleryImages = Array.from(triggers).map(t => ({
        src: t.dataset.kmImage || t.src,
        alt: t.alt || 'Galeriebild'
    }));

    let currentIndex = 0;
    const lightboxImg = lightbox.querySelector('img');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const closeBtns = [lightbox.querySelector('.km-lightbox-close'), lightbox.querySelector('.km-lightbox-backdrop')];

    const showImage = (index) => {
        currentIndex = index;
        lightboxImg.src = galleryImages[index].src.startsWith('../') ? galleryImages[index].src : `../${galleryImages[index].src}`;
        lightboxImg.alt = galleryImages[index].alt;
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scroll-lock');
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-lock');
        document.removeEventListener('keydown', handleKeydown);
    };

    const showNext = () => showImage((currentIndex + 1) % galleryImages.length);
    const showPrev = () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    };

    triggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    closeBtns.forEach(btn => btn.addEventListener('click', closeLightbox));
  };

  // --- Cookie Banner ---
  const initCookieBanner = () => {
    const banner = document.getElementById('cookie-banner');
    if (!banner) return;

    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (cookieConsent === null) {
      banner.classList.add('visible');
    }

    const handleConsent = (consent) => {
      localStorage.setItem('cookie_consent', consent);
      banner.classList.remove('visible');
    }

    acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    declineBtn.addEventListener('click', () => handleConsent('declined'));
  };

  // --- Sticky CTA ---
  const initStickyCta = () => {
    const cta = document.getElementById('sticky-cta');
    if(!cta) return;

    const closeBtn = cta.querySelector('.sticky-cta-close');
    const scrollThreshold = window.innerHeight * 0.8;

    const checkVisibility = () => {
        if (window.scrollY > scrollThreshold) {
            cta.classList.add('visible');
        } else {
            cta.classList.remove('visible');
        }
    };

    closeBtn.addEventListener('click', () => {
        cta.style.display = 'none';
    });

    window.addEventListener('scroll', checkVisibility, { passive: true });
  };

  // Initialize all modules
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initCarousel();
  initLightbox();
  initCookieBanner();
  initStickyCta();
});