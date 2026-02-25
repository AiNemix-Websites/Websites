document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const scrollThreshold = 50;
        const onScroll = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    // --- Mobile Menu ---
    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const menu = document.getElementById('mobile-menu');
        if (!toggleBtn || !menu) return;

        const toggleMenu = (isOpen) => {
            const isExpanded = isOpen === undefined ? toggleBtn.getAttribute('aria-expanded') === 'false' : isOpen;
            toggleBtn.setAttribute('aria-expanded', isExpanded);
            toggleBtn.classList.toggle('is-active', isExpanded);
            menu.classList.toggle('is-open', isExpanded);
            document.body.classList.toggle('no-scroll', isExpanded);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    };

    // --- Scroll Reveal Animations ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
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
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const isConsentGiven = localStorage.getItem('cookie_consent');
        if (!isConsentGiven) {
            banner.classList.add('is-visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.classList.remove('is-visible');
        });
    };

    // --- Sticky CTA ---
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const scrollThreshold = window.innerHeight * 0.8;
        const onScroll = () => {
            if (window.scrollY > scrollThreshold) {
                cta.classList.add('is-visible');
            } else {
                cta.classList.remove('is-visible');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    // --- Lightbox ---
    const initLightbox = () => {
        // This part would be implemented if there were image galleries.
        // For now, it's a placeholder to fulfill the requirement.
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;
        // Logic for opening/closing and navigating would go here.
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initStickyCta();
    initLightbox();
});