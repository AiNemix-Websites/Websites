document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.getElementById('mobile-nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
      document.body.classList.toggle('scroll-lock');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
            navToggle.click();
        }
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        question.setAttribute('aria-expanded', !isExpanded);
      });
    }
  });

  // --- Scroll Reveal Animations ---
  const revealItems = document.querySelectorAll('.reveal-item');
  const observer = new IntersectionObserver((entries, observer) => {
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
    observer.observe(item);
  });

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');

  if (cookieBanner && acceptCookiesBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'block';
      setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }

    acceptCookiesBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      setTimeout(() => cookieBanner.style.display = 'none', 300);
    });
  }

  // --- Sticky CTA ---
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Show when hero is NOT intersecting (scrolled past)
            if (!entry.isIntersecting) {
                stickyCta.classList.add('is-visible');
            } else {
                stickyCta.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.1 });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- Testimonial Carousel ---
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    function updateCarousel() {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function updateDots() {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (index === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });

    updateCarousel();
  }

  // --- Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');
  let currentImageIndex = -1;

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');

    const showImage = (index) => {
        if (index < 0 || index >= galleryItems.length) return;
        currentImageIndex = index;
        const item = galleryItems[currentImageIndex];
        const imageSrc = item.getAttribute('data-lightbox-src');
        const imageAlt = item.querySelector('img')?.getAttribute('alt') || 'Galeriebild';
        lightboxImg.setAttribute('src', imageSrc);
        lightboxImg.setAttribute('alt', imageAlt);
    };

    const openLightbox = (index) => {
        showImage(index);
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('is-visible'), 10);
        document.body.classList.add('scroll-lock');
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.setAttribute('src', ''); // Prevent loading old image on next open
        }, 300);
        document.body.classList.remove('scroll-lock');
        document.removeEventListener('keydown', handleKeydown);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));
  }
});