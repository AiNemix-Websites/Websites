document.addEventListener('DOMContentLoaded', () => {

  // --- STICKY HEADER & STICKY CTA --- //
  const header = document.getElementById('site-header');
  const stickyCta = document.getElementById('sticky-cta');
  const scrollThreshold = 100;
  const ctaThreshold = 400;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    if (window.scrollY > ctaThreshold) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- MOBILE NAVIGATION --- //
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.querySelector('.mobile-menu-close');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    mobileMenu.addEventListener('click', (e) => {
        if(e.target === mobileMenu) closeMenu();
    });
  }

  // --- SCROLL ANIMATIONS --- //
  const animatedElements = document.querySelectorAll('.animate-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${index * 100}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animatedElements.forEach(el => observer.observe(el));

  // --- FAQ ACCORDION --- //
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

  // --- COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);
  }

  function handleConsent(consent) {
    localStorage.setItem('cookieConsent', consent);
    cookieBanner.classList.remove('visible');
  }

  if(acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
  if(declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

  // --- GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.km-lightbox-close');
  const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
  const lightboxNext = lightbox.querySelector('.km-lightbox-next');
  const galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  let currentIndex = 0;

  function showImage(index) {
    if (index < 0 || index >= galleryItems.length) return;
    const item = galleryItems[index];
    const imgSrc = item.getAttribute('data-lightbox-src');
    // Correct path for subpages
    const finalSrc = window.location.pathname.includes('/index.html') || window.location.pathname === '/' ? imgSrc : `../${imgSrc}`;
    lightboxImg.src = finalSrc;
    lightboxImg.alt = item.querySelector('img')?.alt || 'Galeriebild';
    currentIndex = index;
  }

  function openLightbox(e) {
    e.preventDefault();
    const index = galleryItems.indexOf(e.currentTarget);
    lightbox.style.display = 'flex';
    setTimeout(() => lightbox.classList.add('open'), 10);
    showImage(index);
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleLightboxKeys);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    setTimeout(() => lightbox.style.display = 'none', 300);
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', handleLightboxKeys);
  }

  function handleLightboxKeys(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
  }

  if (galleryItems.length > 0) {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', openLightbox);
    });
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
    lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));
  }

});