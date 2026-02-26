document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky Header --- //
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

  // --- Mobile Navigation --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-nav-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.classList.toggle('scroll-locked');
    });
  }

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right, .reveal-stagger');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    observer.observe(el);
  });

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const slides = Array.from(carousel.children);
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    });
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('cookie-accept');

  if (cookieBanner && acceptButton) {
    if (!localStorage.getItem('cookieConsent')) {
      cookieBanner.style.display = 'block';
      setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    acceptButton.addEventListener('click', () => {
      cookieBanner.classList.remove('visible');
      localStorage.setItem('cookieConsent', 'true');
      setTimeout(() => cookieBanner.style.display = 'none', 500);
    });
  }

  // --- Sticky CTA Bar --- //
  const stickyBar = document.querySelector('.sticky-cta-bar');
  if (stickyBar) {
    const heroSection = document.querySelector('.hero');
    const footer = document.querySelector('.site-footer');
    let heroHeight = heroSection ? heroSection.offsetHeight : 500;

    window.addEventListener('scroll', () => {
      const footerTop = footer.getBoundingClientRect().top;
      if (window.scrollY > heroHeight && footerTop > window.innerHeight) {
        stickyBar.classList.add('visible');
      } else {
        stickyBar.classList.remove('visible');
      }
    });
  }

  // --- Project Gallery Filter --- //
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterButtons.length > 0 && galleryCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        galleryCards.forEach(card => {
          if (filter === 'Alle' || card.dataset.category === filter) {
            card.classList.remove('hide');
          } else {
            card.classList.add('hide');
          }
        });
      });
    });
  }

});