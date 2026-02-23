document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('nav-open');
            body.classList.toggle('no-scroll', !isExpanded);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                body.classList.remove('nav-open', 'no-scroll');
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    const initTestimonialsCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(nextBtn) nextBtn.style.display = 'none';
            if(prevBtn) prevBtn.style.display = 'none';
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) goToSlide(currentIndex + 1);
            if (touchendX > touchstartX) goToSlide(currentIndex - 1);
        });
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        const body = document.body;

        const showLightbox = (src, alt) => {
            lightboxImage.src = src;
            lightboxImage.alt = alt;
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            body.classList.add('no-scroll');
            closeBtn.focus();
        };

        const hideLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            body.classList.remove('no-scroll');
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('img[data-km-image]');
            if (trigger) {
                e.preventDefault();
                showLightbox(trigger.src, trigger.alt);
            }
        });

        closeBtn.addEventListener('click', hideLightbox);
        backdrop.addEventListener('click', hideLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                hideLightbox();
            }
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');

        if (!banner || !acceptBtn) return;

        if (localStorage.getItem('cookieConsent') === 'true') {
            return; // Consent already given
        }

        setTimeout(() => banner.classList.add('visible'), 1000);

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
        });
    };
    
    const initContactForm = () => {
        const form = document.querySelector('.contact-form');
        if(!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            form.reset();
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initTestimonialsCarousel();
    initLightbox();
    initCookieBanner();
    initContactForm();
});