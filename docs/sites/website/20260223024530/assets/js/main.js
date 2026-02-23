document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header --- //
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- 2. Mobile Navigation --- //
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('is-open');
      navMenu.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.reveal === 'group') {
          const items = entry.target.querySelectorAll('[data-reveal="item"]');
          items.forEach((item, index) => {
            item.style.setProperty('--i', index);
            item.classList.add('is-visible');
          });
        } else {
          entry.target.classList.add('is-visible');
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Testimonial Carousel --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
    };

    const nextSlide = () => {
      const newIndex = (currentIndex + 1) % slides.length;
      goToSlide(newIndex);
    };

    const prevSlide = () => {
      const newIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(newIndex);
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Touch/Swipe support
    let touchstartX = 0;
    let touchendX = 0;
    carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX) nextSlide();
      if (touchendX > touchstartX) prevSlide();
    });

    // Clone slides for infinite loop effect
    carousel.style.transition = 'transform 0.4s ease-in-out';
  }

  // --- 5. FAQ Accordion --- //
  const accordion = document.getElementById('faq-accordion');
  if (accordion) {
    const questions = accordion.querySelectorAll('.faq-question');
    questions.forEach(question => {
      question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Optional: Close other open items
        // questions.forEach(q => {
        //   q.setAttribute('aria-expanded', 'false');
        //   q.nextElementSibling.hidden = true;
        // });

        question.setAttribute('aria-expanded', !isExpanded);
        answer.hidden = isExpanded;
      });
    });
  }

  // --- 6. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAcceptBtn) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.hidden = false;
      setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('is-visible');
      setTimeout(() => cookieBanner.hidden = true, 300);
    });
  }

  // --- 7. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show when hero is NOT intersecting (scrolled past hero)
        if (!entry.isIntersecting) {
          stickyCTA.hidden = false;
          stickyCTA.classList.add('is-visible');
        } else {
          stickyCTA.classList.remove('is-visible');
        }
      });
    }, { threshold: 0 });
    const heroSection = document.querySelector('.hero');
    if (heroSection) ctaObserver.observe(heroSection);
  }

  // --- 8. Global Lightbox (Singleton) --- //
  const lightbox = {
    element: document.getElementById('km-lightbox'),
    imgElement: null,
    isOpen: false,
    init() {
      if (!this.element) return;
      this.imgElement = this.element.querySelector('img');
      const closeBtn = this.element.querySelector('.km-lightbox-close');
      const backdrop = this.element.querySelector('.km-lightbox-backdrop');
      
      closeBtn.addEventListener('click', () => this.close());
      backdrop.addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (this.isOpen && e.key === 'Escape') this.close();
      });
    },
    open(imageSrc) {
      if (!this.element || !imageSrc) return;
      this.imgElement.src = imageSrc;
      this.element.hidden = false;
      document.body.classList.add('lightbox-open');
      this.isOpen = true;
      this.element.querySelector('.km-lightbox-close').focus();
    },
    close() {
      if (!this.element) return;
      this.element.hidden = true;
      document.body.classList.remove('lightbox-open');
      this.isOpen = false;
      this.imgElement.src = '';
    }
  };
  lightbox.init();
  // Expose to window if needed for inline `onclick` (not used here)
  // window.kmLightbox = lightbox;

});