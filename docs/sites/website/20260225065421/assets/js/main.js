document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const mobileMenu = document.querySelector('.mobile-nav-menu');

        if (!toggleBtn || !mobileMenu || !closeBtn) return;

        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
    };

    // --- Sticky Header --- //
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

        window.addEventListener('scroll', handleScroll);
    };

    // --- Scroll Reveal --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    // --- Testimonial Carousel --- //
    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        let currentIndex = 0;
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;

        const showSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        };

        setInterval(nextSlide, 5000);
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (!banner || !acceptBtn || !declineBtn) return;

        const cookieConsent = localStorage.getItem('cookie_consent');

        if (!cookieConsent) {
            banner.style.display = 'flex';
            setTimeout(() => banner.classList.add('is-visible'), 100);
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            banner.classList.remove('is-visible');
            setTimeout(() => banner.style.display = 'none', 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    };

    // --- Sticky CTA --- //
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const handleScroll = () => {
            if (window.scrollY > 600) {
                cta.style.display = 'block';
                setTimeout(() => cta.classList.add('is-visible'), 10);
            } else {
                cta.classList.remove('is-visible');
                setTimeout(() => { if(!cta.classList.contains('is-visible')) cta.style.display = 'none'; }, 500);
            }
        };

        window.addEventListener('scroll', handleScroll);
    };

    // --- Contact Form --- //
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            form.reset();
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initTestimonialCarousel();
    initCookieBanner();
    initStickyCTA();
    initContactForm();
});