document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu
    const initMobileMenu = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (!navToggle || !navMenu) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('is-open');
            navMenu.classList.toggle('is-open', open);
            navToggle.classList.toggle('is-active', open);
            navToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        navToggle.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    };

    // Sticky Header
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
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // Scroll Reveal Animations
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || '0', 10);
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal-stagger').forEach((el, index) => {
             el.style.transitionDelay = `${index * 100}ms`;
        });

        revealElements.forEach(el => observer.observe(el));
    };

    // FAQ Accordion
    const initFaqAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (!header || !content) return;

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
            });
        });
    };

    // Cookie Banner
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const cookieAccepted = localStorage.getItem('cookieAccepted');
        if (!cookieAccepted) {
            setTimeout(() => banner.classList.add('visible'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            banner.classList.remove('visible');
        });
    };

    // Sticky CTA
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            const showPosition = window.innerHeight * 0.5;
            const hidePosition = pageHeight - (window.innerHeight * 0.2);

            if (scrollPosition > showPosition && scrollPosition < hidePosition) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initStickyCTA();
});