document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    const openMobileMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
            mobileNavClose.focus();
        }
    };

    const closeMobileMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.remove('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'true');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
            mobileNavToggle.focus();
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        mobileNavBackdrop.addEventListener('click', closeMobileMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
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

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'false');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('is-visible');
                } else {
                    stickyCta.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Lightbox --- //
    // This part is intentionally left empty as per instructions.
    // A global lightbox would require more complex logic for galleries.
    // For now, this placeholder ensures the file structure is correct.

});