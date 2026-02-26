document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-nav-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        if (!toggleBtn || !mobileNav) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileNav.classList.contains('is-open');
            mobileNav.classList.toggle('is-open', open);
            toggleBtn.classList.toggle('is-active', open);
            toggleBtn.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    };

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Scroll Reveal Animation ---
    const initScrollReveal = () => {
        const revealItems = document.querySelectorAll('.reveal-item');
        if (revealItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || index * 100;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => observer.observe(item));
    };

    // --- Testimonial Carousel ---
    const initTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = carousel.parentElement.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.parentElement.querySelector('.carousel-btn.next');
        const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            if (currentIndex >= slides.length) currentIndex = 0;
            updateCarousel();
        };

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel(); // Initial call
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.classList.add('show');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('show');
        });
    };

    // --- Sticky CTA ---
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Lightbox ---
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const galleryItems = document.querySelectorAll('[data-lightbox-src]');
        if (galleryItems.length === 0) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentIndex = 0;
        const imageSources = Array.from(galleryItems).map(item => {
            // Use data-km-image for the correct relative path
            const img = item.querySelector('img');
            return img ? img.dataset.kmImage : item.dataset.lightboxSrc;
        });

        const showLightbox = (index) => {
            currentIndex = index;
            const rootPath = lightboxImg.src.includes('/leistungen/') || lightboxImg.src.includes('/ueber-uns/') ? '../' : './';
            lightboxImg.src = `${rootPath}${imageSources[currentIndex]}`.replace(/\.\/g, ''); // Fix path
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
        };

        const hideLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % imageSources.length;
            showLightbox(newIndex);
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
            showLightbox(newIndex);
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') hideLightbox();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showLightbox(index);
            });
        });

        closeBtn.addEventListener('click', hideLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
    };

    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initScrollReveal();
    initTestimonialCarousel();
    initCookieBanner();
    initStickyCTA();
    initLightbox();
});