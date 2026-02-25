document.addEventListener('DOMContentLoaded', () => {

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNav) {
        const openMenu = () => {
            mobileNav.classList.add('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
            mobileNavClose.focus();
        };

        const closeMenu = () => {
            mobileNav.classList.remove('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
            mobileNavToggle.focus();
        };

        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMenu();
            }
        });

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-button.next');
        const prevBtn = document.querySelector('.carousel-button.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial call
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
             cookieBanner.style.display = 'flex';
             setTimeout(() => cookieBanner.classList.add('show'), 10); // For transition
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const footer = document.querySelector('.site-footer-main');

    if (stickyCTA && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA if footer is NOT intersecting (i.e., not visible)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        // Observe the footer
        observer.observe(footer);
        
        // Also hide if at the very top of the page
        window.addEventListener('scroll', () => {
             if (window.scrollY < 200) {
                 stickyCTA.classList.remove('visible');
             }
        });
    }

});