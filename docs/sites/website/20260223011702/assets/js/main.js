document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
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

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    });
  }

  // --- 3. SCROLL REVEAL ANIMATIONS --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- 4. TESTIMONIAL CAROUSEL --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const dotsContainer = document.querySelector('.carousel-controls .dots');
    let currentIndex = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateControls();
    }

    function updateControls() {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

    goToSlide(0);
  }

  // --- 5. FAQ ACCORDION --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  });

  // --- 6. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.hidden = true;
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.hidden = true;
    });
  }

  // --- 7. GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentImageIndex = 0;

  if (lightbox && galleryItems.length > 0) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    const imageSources = Array.from(galleryItems).map(item => item.href);

    function showImage(index) {
        currentImageIndex = index;
        lightboxImg.src = imageSources[index];
        lightboxImg.alt = galleryItems[index].querySelector('img').alt;
        lightbox.hidden = false;
        document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.classList.remove('no-scroll');
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showImage(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage((currentImageIndex - 1 + imageSources.length) % imageSources.length));
    nextBtn.addEventListener('click', () => showImage((currentImageIndex + 1) % imageSources.length));

    document.addEventListener('keydown', (e) => {
        if (!lightbox.hidden) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
  }

  // --- 8. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const heroSection = document.querySelector('.hero');
      const footerSection = document.querySelector('.site-footer');
      
      const ctaObserver = new IntersectionObserver((entries) => {
          const heroEntry = entries.find(e => e.target === heroSection);
          const footerEntry = entries.find(e => e.target === footerSection);

          let showCTA = true;
          if (heroEntry && heroEntry.isIntersecting) {
              showCTA = false;
          }
          if (footerEntry && footerEntry.isIntersecting) {
              showCTA = false;
          }
          stickyCTA.hidden = !showCTA;
      }, { threshold: 0.1 });

      if(heroSection) ctaObserver.observe(heroSection);
      if(footerSection) ctaObserver.observe(footerSection);
  }
});