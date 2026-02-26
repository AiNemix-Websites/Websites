document.addEventListener('DOMContentLoaded', function() {

    // --- Helper to prevent event listener duplication ---
    const once = (target, type, listener, options) => {
        const uniqueId = `__${type}_listener__`;
        if (!target[uniqueId]) {
            target.addEventListener(type, listener, options);
            target[uniqueId] = true;
        }
    };

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            addCloseListeners();
        };

        const closeMenu = () => {
            mobileNavMenu.classList.remove('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            removeCloseListeners();
        };

        const handleMenuClick = (e) => {
            if (mobileNavToggle.contains(e.target)) {
                const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
                isExpanded ? closeMenu() : openMenu();
            } else if (e.target.matches('.mobile-nav-close, .mobile-nav-backdrop, .mobile-nav-link')) {
                closeMenu();
            }
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };

        const addCloseListeners = () => {
            once(document, 'keydown', handleEscKey);
        };

        const removeCloseListeners = () => {
            document.removeEventListener('keydown', handleEscKey);
            document.__keydown_listener__ = false;
        };
        
        document.addEventListener('click', handleMenuClick);
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
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
    }

    // --- Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '0 0 var(--spacing-lg) 0';
            } else {
                content.style.maxHeight = '0';
                content.style.padding = '0';
            }
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('is-visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('is-visible');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleCTAScroll = () => {
            const heroSection = document.querySelector('.hero, .page-header');
            if (!heroSection) return;
            const heroHeight = heroSection.offsetHeight;
            if (window.scrollY > heroHeight) {
                stickyCTA.classList.add('is-visible');
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        };
        window.addEventListener('scroll', handleCTAScroll, { passive: true });
    }

});