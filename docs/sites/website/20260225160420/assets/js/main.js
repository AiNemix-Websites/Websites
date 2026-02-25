document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const mobileMenu = document.querySelector('.mobile-nav-menu');
        if (!toggleBtn || !mobileMenu) return;

        const toggleMenu = (isOpen) => {
            const expanded = isOpen !== undefined ? isOpen : toggleBtn.getAttribute('aria-expanded') === 'false';
            toggleBtn.setAttribute('aria-expanded', expanded);
            mobileMenu.classList.toggle('open', expanded);
            document.body.classList.toggle('no-scroll', expanded);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu(false);
            }
        });
    };

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

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const cookieConsent = localStorage.getItem('cookieConsent');

        if (!cookieConsent) {
            banner.hidden = false;
            setTimeout(() => banner.classList.add('visible'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
            setTimeout(() => banner.hidden = true, 500);
        });
    };

    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const scrollHandler = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.hidden = false;
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
                // Optional: hide again after transition
                // setTimeout(() => { if(!cta.classList.contains('visible')) cta.hidden = true; }, 500);
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initStickyCta();
});