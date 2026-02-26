document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const trapFocus = (element) => {
        const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        const KEYCODE_TAB = 9;

        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' && e.keyCode !== KEYCODE_TAB) return;

            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        });
        firstFocusableEl.focus();
    };

    const lockScroll = () => {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('nav-open');
    };

    const unlockScroll = () => {
        document.body.style.overflow = '';
        document.body.classList.remove('nav-open');
    };

    // --- STICKY HEADER ---
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const stickyThreshold = 50;

        const onScroll = () => {
            if (window.scrollY > stickyThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    // --- MOBILE NAVIGATION ---
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const navDrawer = document.getElementById('mobile-nav');
        if (!toggleBtn || !navDrawer) return;

        const openNav = () => {
            navDrawer.style.display = 'block';
            setTimeout(() => navDrawer.classList.add('open'), 10);
            toggleBtn.setAttribute('aria-expanded', 'true');
            lockScroll();
            trapFocus(navDrawer);
            document.addEventListener('keydown', handleEscKey);
        };

        const closeNav = () => {
            navDrawer.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            unlockScroll();
            document.removeEventListener('keydown', handleEscKey);
            setTimeout(() => navDrawer.style.display = 'none', 350);
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') closeNav();
        };

        toggleBtn.addEventListener('click', openNav);
        closeBtn.addEventListener('click', closeNav);
    };

    // --- SCROLL REVEAL ANIMATION ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-up');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- FAQ ACCORDION ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    };

    // --- COOKIE BANNER ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.classList.add('show');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.classList.remove('show');
        });
    };
    
    // --- STICKY CTA ---
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const visibleThreshold = 400;

        const onScroll = () => {
            if (window.scrollY > visibleThreshold) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    // --- INITIALIZE ALL MODULES ---
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initStickyCta();
});