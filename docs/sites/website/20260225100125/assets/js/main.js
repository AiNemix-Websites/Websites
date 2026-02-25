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
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNavContainer = document.getElementById('mobile-nav-container');
  const mobileNavClose = document.querySelector('.mobile-nav-close');

  if (mobileNavToggle && mobileNavContainer) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavContainer.classList.add('open');
      document.body.classList.add('body-no-scroll');
    });

    const closeNav = () => {
      mobileNavContainer.classList.remove('open');
      document.body.classList.remove('body-no-scroll');
    };

    mobileNavContainer.addEventListener('click', (e) => {
      if (e.target === mobileNavContainer) closeNav();
    });
    if(mobileNavClose) mobileNavClose.addEventListener('click', closeNav);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) closeNav();
    });
  }

  // --- Scroll Animations --- //
  const revealElements = document.querySelectorAll('.reveal-anim');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => {
            entry.target.classList.add('is-visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // --- Comparison Slider --- //
  const slider = document.querySelector('.comparison-slider');
  if (slider) {
    const handle = slider.querySelector('.comparison-handle');
    const afterImage = slider.querySelector('.after');
    let isDragging = false;

    const moveHandler = (x) => {
        const rect = slider.getBoundingClientRect();
        let newX = x - rect.left;
        if (newX < 0) newX = 0;
        if (newX > rect.width) newX = rect.width;
        const percentage = (newX / rect.width) * 100;
        handle.style.left = percentage + '%';
        afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    };

    handle.addEventListener('mousedown', () => { isDragging = true; });
    document.addEventListener('mouseup', () => { isDragging = false; });
    document.addEventListener('mousemove', (e) => {
        if (isDragging) moveHandler(e.clientX);
    });
    handle.addEventListener('touchstart', () => { isDragging = true; });
    document.addEventListener('touchend', () => { isDragging = false; });
    document.addEventListener('touchmove', (e) => {
        if (isDragging) moveHandler(e.touches[0].clientX);
    });
  }

  // --- Testimonial Carousel --- //
  const carousel = document.querySelector('.testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
    };

    nextBtn.addEventListener('click', () => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      goToSlide(nextIndex);
    });

    prevBtn.addEventListener('click', () => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      goToSlide(prevIndex);
    });
    
    // Add swipe functionality
    let touchstartX = 0;
    let touchendX = 0;

    carousel.addEventListener('touchstart', function(event) {
        touchstartX = event.changedTouches[0].screenX;
    }, false);

    carousel.addEventListener('touchend', function(event) {
        touchendX = event.changedTouches[0].screenX;
        handleSwipe();
    }, false); 

    function handleSwipe() {
        if (touchendX < touchstartX) {
            nextBtn.click();
        }
        if (touchendX > touchstartX) {
            prevBtn.click();
        }
    }
  }

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
      const isExpanded = question.getAttribute('aria-expanded') === 'true';
      question.setAttribute('aria-expanded', !isExpanded);
      answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
    });
  });

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');
  const declineBtn = document.getElementById('decline-cookies');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => cookieBanner.classList.add('show'), 1000);
  }

  if(acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });
  }

  if(declineBtn) {
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });
  }

  // --- Global Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentImageIndex = 0;
  const images = Array.from(galleryItems).map(img => img.dataset.kmImage);

  if (lightbox) {
    const openLightbox = (index) => {
      currentImageIndex = index;
      const imagePath = (images[currentImageIndex].startsWith('..') ? '' : '../') + images[currentImageIndex];
      lightboxImg.src = location.pathname.includes('/projekte/') ? '../' + images[currentImageIndex] : images[currentImageIndex];
      lightbox.style.display = 'flex';
      setTimeout(() => lightbox.classList.add('show'), 10);
      document.body.classList.add('body-no-scroll');
    };

    const closeLightbox = () => {
      lightbox.classList.remove('show');
      setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
      }, 300);
      document.body.classList.remove('body-no-scroll');
    };

    const showNextImage = () => {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      openLightbox(currentImageIndex);
    };

    const showPrevImage = () => {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      openLightbox(currentImageIndex);
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
    lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });
  }

});