document.addEventListener('DOMContentLoaded', function() {

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
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navContainer = document.getElementById('mobile-nav-container');
  if (navToggle && navContainer) {
    const nav = navContainer.querySelector('.mobile-nav');
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      document.body.classList.toggle('scroll-lock');
      navContainer.style.display = 'block';
      setTimeout(() => navContainer.classList.toggle('is-open'), 10);
    });

    const closeNav = () => {
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-lock');
        navContainer.classList.remove('is-open');
        setTimeout(() => { navContainer.style.display = 'none'; }, 350);
    };

    navContainer.addEventListener('click', (e) => {
        if (e.target === navContainer) closeNav();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navContainer.classList.contains('is-open')) closeNav();
    });
  }

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieAccepted = localStorage.getItem('cookieAccepted');

  if (!cookieAccepted && cookieBanner) {
    cookieBanner.style.display = 'flex';
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }

  // --- Sticky CTA --- //
  const stickyCta = document.getElementById('sticky-cta');
  if(stickyCta) {
      window.addEventListener('scroll', () => {
          if(window.scrollY > 400) {
              stickyCta.classList.add('visible');
          } else {
              stickyCta.classList.remove('visible');
          }
      });
  }

});