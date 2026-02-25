document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        const backdrop = mobileNavMenu.querySelector('.mobile-nav-backdrop');
        const closeBtn = mobileNavMenu.querySelector('.mobile-nav-close');
        const focusableElements = 'a[href], button:not([disabled])';
        let firstFocusableElement, lastFocusableElement;

        const openMenu = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavMenu.classList.add('is-open');
            mobileNavMenu.removeAttribute('aria-hidden');
            document.body.classList.add('no-scroll');
            const focusable = Array.from(mobileNavMenu.querySelectorAll(focusableElements));
            firstFocusableElement = focusable[0];
            lastFocusableElement = focusable[focusable.length - 1];
            firstFocusableElement.focus();
            document.addEventListener('keydown', handleKeydown);
        };

        const closeMenu = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavMenu.classList.remove('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            mobileNavToggle.focus();
            document.removeEventListener('keydown', handleKeydown);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            } else if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        mobileNavToggle.addEventListener('click', openMenu);
        backdrop.addEventListener('click', closeMenu);
        closeBtn.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.dataset.staggerChildren) {
                    const delay = parseFloat(entry.target.dataset.staggerChildren) * 1000;
                    const children = entry.target.querySelectorAll('.reveal-on-scroll, [class*="-card"], .step-item');
                    children.forEach((child, index) => {
                        child.style.transitionDelay = `${index * delay}ms`;
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideWidth = slides[0].offsetWidth;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });
            updateDots();
        };

        const showNext = () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            goToSlide(nextIndex);
        };

        const showPrev = () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            goToSlide(prevIndex);
        };

        createDots();
        goToSlide(0);

        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        window.addEventListener('resize', () => {
            slideWidth = slides[0].offsetWidth;
            goToSlide(currentIndex);
        });

        // Basic swipe support
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) showNext();
            if (touchendX > touchstartX) showPrev();
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.classList.add('visible');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});