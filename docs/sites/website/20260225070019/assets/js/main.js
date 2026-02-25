document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Sticky Header --- //
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

  // --- 2. Mobile Navigation --- //
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = document.getElementById('mobile-menu-close');

  const openMenu = () => {
    if (mobileMenu) {
        mobileMenu.hidden = false;
        setTimeout(() => {
            mobileMenu.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
            closeButton.focus();
        }, 10);
    }
  };

  const closeMenu = () => {
    if (mobileMenu) {
        mobileMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
        setTimeout(() => { mobileMenu.hidden = true; }, 300);
    }
  };

  if (menuToggle && mobileMenu && closeButton) {
    menuToggle.addEventListener('click', openMenu);
    closeButton.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  // --- 3. Scroll Reveal Animations --- //
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, index * 100); 
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 4. Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && acceptBtn && declineBtn) {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('is-visible'), 1000);
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'accepted');
      cookieBanner.classList.remove('is-visible');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });

    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'declined');
      cookieBanner.classList.remove('is-visible');
      setTimeout(() => cookieBanner.hidden = true, 500);
    });
  }

  // --- 5. Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              // Show when hero is NOT intersecting (scrolled past)
              if (!entry.isIntersecting) {
                  stickyCTA.hidden = false;
                  stickyCTA.classList.add('is-visible');
              } else {
                  stickyCTA.classList.remove('is-visible');
                  setTimeout(() => { stickyCTA.hidden = true; }, 500);
              }
          });
      }, { threshold: 0.1 });
      
      const heroSection = document.querySelector('.hero');
      if (heroSection) {
        ctaObserver.observe(heroSection);
      }
  }

  // --- 6. FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if(question && answer) {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    }
  });

  // --- 7. Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = carousel.querySelector('.next');
    const prevButton = carousel.querySelector('.prev');
    const slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const moveToSlide = (targetIndex) => {
      track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
      currentIndex = targetIndex;
    }

    nextButton.addEventListener('click', () => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      moveToSlide(nextIndex);
    });

    prevButton.addEventListener('click', () => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      moveToSlide(prevIndex);
    });
  }

  // --- 8. Program Filter --- //
  const genreFilter = document.getElementById('filter-genre');
  const eventList = document.getElementById('event-list');
  if (genreFilter && eventList) {
      const allEvents = Array.from(eventList.children);
      genreFilter.addEventListener('change', (e) => {
          const selectedGenre = e.target.value;
          allEvents.forEach(event => {
              if (selectedGenre === 'all' || event.dataset.genre === selectedGenre) {
                  event.style.display = '';
              } else {
                  event.style.display = 'none';
              }
          });
      });
  }

});