document.addEventListener('DOMContentLoaded', () => {

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
  const navToggle = document.getElementById('mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav-menu');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isOpen);
      navToggle.classList.toggle('is-active');
      mobileNav.classList.toggle('is-open');
      document.body.classList.toggle('no-scroll');
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
  revealElements.forEach(el => observer.observe(el));

  // --- FAQ Accordion --- //
  const faqItems = document.querySelectorAll('.faq-item, .service-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question, .service-title');
    const answer = item.querySelector('.faq-answer, .service-description');
    if (button && answer) {
      button.addEventListener('click', () => {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = '0';
        }
      });
    }
  });

  // --- Testimonial Carousel --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const updateCarousel = () => {
      carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    const updateDots = () => {
      const dots = dotsContainer.querySelectorAll('button');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
      });
      dotsContainer.appendChild(dot);
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
      updateCarousel();
    });
    
    // Touch support
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
            nextButton.click();
        }
        if (touchendX > touchstartX) {
            prevButton.click();
        }
    }

    updateCarousel();
  }

  // --- Cookie Banner --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (!localStorage.getItem('cookieConsent')) {
      setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'true');
      cookieBanner.classList.remove('show');
    });
  }

  // --- Lightbox --- //
  const lightbox = document.getElementById('km-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const gallery = document.getElementById('praxis-gallery');
  let galleryImages = [];
  let currentImageIndex = -1;

  if (lightbox && gallery) {
    galleryImages = Array.from(gallery.querySelectorAll('.lightbox-trigger'));
    
    const openLightbox = (index) => {
        if (index < 0 || index >= galleryImages.length) return;
        currentImageIndex = index;
        const imgElement = galleryImages[currentImageIndex];
        const imagePath = imgElement.dataset.kmImage || imgElement.src;
        const altText = imgElement.alt || 'Großansicht';
        // Use the relative path for display
        lightboxImg.src = imgElement.src;
        lightboxImg.alt = altText;
        lightbox.classList.add('active');
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeydown);
        lightboxImg.src = ''; // Clear src to stop loading
    };

    const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryImages.length);
    const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    };
  }

  // --- Sticky CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      let lastScrollY = window.scrollY;
      let isVisible = false;

      window.addEventListener('scroll', () => {
          const currentScrollY = window.scrollY;
          const shouldBeVisible = currentScrollY > 400 && currentScrollY < (document.body.scrollHeight - window.innerHeight - 400);

          if (shouldBeVisible !== isVisible) {
              isVisible = shouldBeVisible;
              stickyCTA.classList.toggle('visible', isVisible);
          }
          lastScrollY = currentScrollY;
      });
  }

});