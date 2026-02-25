document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        };

        menuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const summary = item.querySelector('summary');
        summary.addEventListener('click', (e) => {
            // Prevent default browser behavior if we want to handle animation ourselves
            // For this simple case, we let the browser handle the open/close state.
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieConsentKey = 'repairCafeBrakelCookieConsent';

    if (cookieBanner && cookieAcceptBtn) {
        const consent = localStorage.getItem(cookieConsentKey);
        if (!consent) {
            cookieBanner.classList.add('visible');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem(cookieConsentKey, 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaScrollThreshold = 300; // Show after scrolling 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaScrollThreshold) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

});