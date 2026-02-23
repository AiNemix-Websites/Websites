document.addEventListener('DOMContentLoaded', function() {

  // --- Sticky Header ---
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

  // --- Mobile Navigation ---
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mainMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });
  }

  // --- Scroll Animations ---
  const scrollElements = document.querySelectorAll('.scroll-reveal');
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
  scrollElements.forEach(el => observer.observe(el));

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
    setTimeout(() => cookieBanner.classList.add('show'), 100);
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

  // --- Carousel ---
  const carousels = document.querySelectorAll('.projects-carousel');
  carousels.forEach(carousel => {
    const prevBtn = carousel.parentElement.querySelector('.carousel-prev');
    const nextBtn = carousel.parentElement.querySelector('.carousel-next');
    if (prevBtn && nextBtn) {
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: carousel.clientWidth, behavior: 'smooth' });
      });
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -carousel.clientWidth, behavior: 'smooth' });
      });
    }
  });

  // --- Global Lightbox ---
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
  let currentImageIndex = 0;
  const galleryImages = Array.from(lightboxTriggers).map(img => img.src);

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentImageIndex = index;
    lightboxImg.src = galleryImages[currentImageIndex];
    lightbox.hidden = false;
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleLightboxKeydown);
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', handleLightboxKeydown);
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex];
  }

  function handleLightboxKeydown(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  }

  if (lightbox) {
    lightboxTriggers.forEach((trigger, index) => {
      trigger.addEventListener('click', () => openLightbox(index));
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
    lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past it)
        if (!entry.isIntersecting) {
          stickyCTA.hidden = false;
          stickyCTA.classList.add('show');
        } else {
          stickyCTA.classList.remove('show');
        }
      });
    }, { threshold: 0.1 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }
  
  // --- Contact Form --- 
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Prefill subject from URL param
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    if (subject) {
        const subjectField = document.getElementById('subject');
        if(subjectField) subjectField.value = subject;
    }

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const statusEl = document.getElementById('form-status');
      statusEl.textContent = 'Senden...';
      // This is a dummy form handler. In a real project, this would be an AJAX call.
      setTimeout(() => {
        statusEl.textContent = 'Vielen Dank! Ihre Anfrage wurde gesendet.';
        contactForm.reset();
      }, 1000);
    });
  }

});