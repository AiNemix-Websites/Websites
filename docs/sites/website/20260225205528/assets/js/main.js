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
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('open');
            mainMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                // Optional: Close other FAQs
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                //     }
                // });
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
        
        // Touch/Swipe functionality
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
            if (touchendX < touchstartX) { // Swiped left
                nextBtn.click();
            }
            if (touchendX > touchstartX) { // Swiped right
                prevBtn.click();
            }
        }

        updateCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT in view
                if (!entry.isIntersecting && window.scrollY > 200) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.km-lightbox-next');
    let galleryItems = [];
    let currentImageIndex = -1;

    function openLightbox(index) {
        if (index < 0 || index >= galleryItems.length) return;
        currentImageIndex = index;
        const item = galleryItems[index];
        const imageSrc = item.getAttribute('href');
        const imageAlt = item.getAttribute('data-alt') || 'Galeriebild';
        
        lightboxImage.setAttribute('src', imageSrc);
        lightboxImage.setAttribute('alt', imageAlt);
        
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('show'), 10);
        document.body.classList.add('no-scroll');
        updateLightboxNav();
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        setTimeout(() => {
             lightbox.style.display = 'none';
             lightboxImage.setAttribute('src', ''); // Clear src to stop loading
        }, 300);
        document.body.classList.remove('no-scroll');
    }

    function showPrevImage() {
        const newIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(newIndex);
    }

    function showNextImage() {
        const newIndex = (currentImageIndex + 1) % galleryItems.length;
        openLightbox(newIndex);
    }

    function updateLightboxNav() {
        lightboxPrev.style.display = galleryItems.length > 1 ? 'block' : 'none';
        lightboxNext.style.display = galleryItems.length > 1 ? 'block' : 'none';
    }

    const gallery = document.getElementById('gallery-grid');
    if (gallery) {
        galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
});