document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const initMobileNav = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!toggleBtn || !mobileMenu) return;

        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle('is-open');
            toggleBtn.classList.toggle('is-active');
            toggleBtn.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        toggleBtn.addEventListener('click', toggleMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    };

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Scroll Reveal ---
    const initScrollReveal = () => {
        const srItems = document.querySelectorAll('.sr-item');
        if (srItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.srDelay) || 0;
                    const staggerChildren = entry.target.querySelectorAll('[data-sr-stagger]');
                    if (staggerChildren.length > 0) {
                         entry.target.classList.add('is-visible');
                    } else {
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, delay);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        srItems.forEach(item => {
            const stagger = parseInt(item.dataset.srStagger);
            if(stagger > 0) {
                const children = item.children;
                for(let i = 0; i < children.length; i++) {
                    children[i].style.transitionDelay = `${i * stagger}ms`;
                }
            }
            observer.observe(item);
        });
    };

    // --- FAQ Accordion ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        });
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.classList.add('is-visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('is-visible');
        });
    };

    // --- Sticky CTA ---
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const triggerElement = document.querySelector('.hero'); // Trigger after hero
        if (!cta || !triggerElement) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the trigger element is NOT intersecting (i.e., scrolled past it)
                cta.classList.toggle('is-visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });

        observer.observe(triggerElement);
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initStickyCTA();
});
