document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
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
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuButton = document.querySelector('.mobile-menu-close');

    const toggleMenu = (open) => {
        const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
        mobileMenu.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('no-scroll', isOpen);
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => toggleMenu());
        if(closeMenuButton) closeMenuButton.addEventListener('click', () => toggleMenu(false));
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu(false);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
        }
    };

    if (acceptCookies) acceptCookies.addEventListener('click', () => handleConsent('accepted'));
    if (declineCookies) declineCookies.addEventListener('click', () => handleConsent('declined'));

    // --- Contextual CTA ---
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

    // --- FAQ Accordion on FAQ page ---
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        summary.addEventListener('click', (e) => {
            // If an item is being opened, close others
            if (!item.hasAttribute('open')) {
                e.preventDefault();
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.removeAttribute('open');
                    }
                });
                item.setAttribute('open', '');
            }
        });
    });

});