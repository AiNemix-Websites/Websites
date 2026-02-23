document.addEventListener('DOMContentLoaded', () => {

  // --- Header Logic ---
  const header = document.getElementById('site-header');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mainNavList = document.getElementById('main-nav-list');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (mobileNavToggle && mainNavList) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
      mobileNavToggle.setAttribute('aria-expanded', !isOpen);
      mobileNavToggle.classList.toggle('open');
      mainNavList.classList.toggle('open');
      document.body.classList.toggle('scroll-locked');
    });
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('[data-scroll-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 50); // Stagger delay
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Cookie Banner ---
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // --- Sticky CTA ---
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const heroSection = document.querySelector('.hero');
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (i.e., scrolled past)
        stickyCTA.classList.toggle('visible', !entry.isIntersecting);
      });
    }, { threshold: 0 });

    if (heroSection) {
        ctaObserver.observe(heroSection);
    }
  }

  // --- Contact Form --- 
  const contactForm = document.getElementById('kontaktformular');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedbackEl = document.getElementById('form-feedback');
      feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wurde (simuliert) gesendet.';
      feedbackEl.classList.add('success');
      contactForm.reset();
      setTimeout(() => {
        feedbackEl.textContent = '';
        feedbackEl.classList.remove('success');
      }, 5000);
    });
  }

  // --- Lightbox --- 
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let currentGroup = [];
    let currentIndex = -1;

    const openLightbox = (src, group, index) => {
      lightboxImg.src = src;
      currentGroup = group;
      currentIndex = index;
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('scroll-locked');
      updateNavButtons();
      document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
      lightbox.classList.remove('visible');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('scroll-locked');
      document.removeEventListener('keydown', handleKeydown);
    };

    const updateNavButtons = () => {
      prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
      nextBtn.style.display = currentIndex < currentGroup.length - 1 ? 'block' : 'none';
    };

    const showImage = (index) => {
        if (index >= 0 && index < currentGroup.length) {
            currentIndex = index;
            lightboxImg.src = currentGroup[currentIndex].dataset.lightboxSrc;
            updateNavButtons();
        }
    };

    document.body.addEventListener('click', e => {
      const trigger = e.target.closest('[data-lightbox-src]');
      if (trigger) {
        e.preventDefault();
        const groupName = trigger.dataset.lightboxGroup;
        const galleryItems = groupName ? Array.from(document.querySelectorAll(`[data-lightbox-group='${groupName}']`)) : [trigger];
        const itemIndex = galleryItems.indexOf(trigger);
        openLightbox(trigger.dataset.lightboxSrc, galleryItems, itemIndex);
      }
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    const handleKeydown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    };
  }

});