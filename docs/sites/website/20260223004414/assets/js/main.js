document.addEventListener('DOMContentLoaded', function() {

  // --- Scroll Reveal --- //
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    revealObserver.observe(el);
  });

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  function openMobileNav() {
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileNavToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('scroll-locked');
  }

  function closeMobileNav() {
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileNavToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('scroll-locked');
  }

  if (mobileNavToggle && mobileNavDrawer) {
    mobileNavToggle.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
            closeMobileNav();
        }
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('visible');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Carousel --- //
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides = Array.from(carousel.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-dots');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const createDots = () => {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsNav.appendChild(dot);
        });
    };

    const updateDots = () => {
        const dots = Array.from(dotsNav.children);
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    };

    const moveToSlide = (index) => {
        carousel.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        currentIndex = index;
        updateDots();
    };

    nextButton.addEventListener('click', () => {
        const nextIndex = (currentIndex + 1) % slides.length;
        moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        moveToSlide(prevIndex);
    });

    createDots();
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImage = document.getElementById('km-lightbox-image');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    let galleryImages = [];
    let currentIndex = 0;

    const updateImage = () => {
        const imgElement = galleryImages[currentIndex];
        const imagePath = imgElement.dataset.kmImage;
        lightboxImage.src = (imagePath.startsWith('../') ? '' : './') + imagePath;
        lightboxImage.alt = imgElement.alt;
    };

    const openLightbox = (index) => {
        currentIndex = index;
        updateImage();
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scroll-locked');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-locked');
    };

    document.querySelectorAll('.gallery-image').forEach((img, index) => {
        galleryImages.push(img);
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateImage();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateImage();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('visible')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (user has scrolled down)
              if (!entry.isIntersecting) {
                  stickyCTA.classList.add('visible');
              } else {
                  stickyCTA.classList.remove('visible');
              }
          });
      }, { threshold: 0.1 });
      
      const heroSection = document.querySelector('.hero, .page-hero');
      if(heroSection) ctaObserver.observe(heroSection);
  }

  // --- Modernisierungs-Rechner --- //
  const rechnerForm = document.getElementById('rechner-form');
  if (rechnerForm) {
      const steps = rechnerForm.querySelectorAll('.rechner-step');
      const ergebnisContainer = document.getElementById('rechner-ergebnis');
      const ergebnisText = document.getElementById('ergebnis-text');
      const data = {};

      rechnerForm.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON') {
              const stepEl = e.target.closest('.rechner-step');
              const currentStep = parseInt(stepEl.dataset.step, 10);
              const value = e.target.dataset.value;

              // Store data and style button
              data[`step${currentStep}`] = value;
              stepEl.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
              e.target.classList.add('selected');

              // Move to next step or show result
              const nextStep = rechnerForm.querySelector(`.rechner-step[data-step='${currentStep + 1}']`);
              if (nextStep) {
                  stepEl.style.display = 'none';
                  nextStep.style.display = 'block';
              } else {
                  showResult();
              }
          }
      });

      function showResult() {
          rechnerForm.style.display = 'none';
          let text = 'Basierend auf Ihren Angaben empfehlen wir eine persönliche Beratung, um die Potenziale für Ihr Gebäude zu ermitteln.';
          if (data.step2 === 'alt') {
              text = 'Bei einem Heizsystem, das älter als 15 Jahre ist, besteht oft ein hohes Einsparpotenzial. Eine Modernisierung, z.B. mit einer Wärmepumpe, könnte sich für Sie besonders lohnen. Gerne prüfen wir die Gegebenheiten vor Ort.';
          } else if (data.step2 === 'mittel') {
              text = 'Ihr Heizsystem ist im mittleren Alter. Eine Optimierung oder ein teilweiser Austausch könnten sinnvoll sein, um die Effizienz zu steigern. Lassen Sie uns gemeinsam die Möglichkeiten prüfen.';
          }
          ergebnisText.textContent = text;
          ergebnisContainer.style.display = 'block';
      }
  }
  
  // --- FAQ Accordion --- //
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      header.addEventListener('click', () => {
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          header.setAttribute('aria-expanded', !isExpanded);
          if (!isExpanded) {
              content.style.maxHeight = content.scrollHeight + 'px';
              content.style.padding = '0 0 var(--spacing-lg) 0';
          } else {
              content.style.maxHeight = '0';
              content.style.padding = '0';
          }
      });
  });

});