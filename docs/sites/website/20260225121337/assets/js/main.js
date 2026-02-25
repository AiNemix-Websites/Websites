document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation --- //
  const navToggle = document.getElementById('nav-toggle');
  const mainNavList = document.getElementById('main-nav-list');
  const siteHeader = document.getElementById('site-header');

  if (navToggle && mainNavList) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('nav-open');
      siteHeader.classList.toggle('nav-open');
    });
  }

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

  // --- Scroll Reveal Animation --- //
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- FAQ Accordion --- //
  const faqAccordion = document.getElementById('faq-accordion');
  if (faqAccordion) {
    faqAccordion.addEventListener('click', e => {
      const question = e.target.closest('.faq-question');
      if (!question) return;

      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      question.setAttribute('aria-expanded', !isExpanded);
      answer.hidden = isExpanded;
    });
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');

  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateCtaVisibility = () => {
        if (window.scrollY > 600) {
            stickyCta.hidden = false;
            setTimeout(() => stickyCta.classList.add('show'), 10);
        } else {
            stickyCta.classList.remove('show');
            setTimeout(() => stickyCta.hidden = true, 500);
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateCtaVisibility);
            ticking = true;
        }
    });
  }

});