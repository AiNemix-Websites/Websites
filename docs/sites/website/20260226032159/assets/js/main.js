document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler(); // Initial check
    }

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
        };

        const closeMenu = () => {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
        };

        menuToggle.addEventListener('click', () => {
            if (menuToggle.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) { // Click on backdrop
                closeMenu();
            }
        });

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = (el.dataset.reveal === 'stagger' && el.dataset.staggerIndex) ? parseInt(el.dataset.staggerIndex) * 100 : 0;
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);
                observer.unobserve(el);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    document.querySelectorAll('[data-reveal="stagger"]').forEach((el, index) => {
        el.dataset.staggerIndex = index;
    });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Accordion --- //
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }

        const handleConsent = (consentValue) => {
            localStorage.setItem('cookieConsent', consentValue);
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Sticky Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting) {
                    contextCta.classList.add('visible');
                } else {
                    contextCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero, .page-header');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});