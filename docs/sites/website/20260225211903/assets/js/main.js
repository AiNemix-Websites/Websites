document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const mobileMenu = document.querySelector('.mobile-nav-menu');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const backdrop = document.querySelector('.mobile-nav-backdrop');
        if (!toggleBtn || !mobileMenu) return;

        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            document.body.classList.add('scroll-locked');
            toggleBtn.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            document.body.classList.remove('scroll-locked');
            toggleBtn.setAttribute('aria-expanded', 'false');
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', entry.boundingClientRect.top < 0);
        }, { threshold: 0, rootMargin: '-1px 0px 0px 0px' });

        // Dummy element to observe
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.top = '0';
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        observer.observe(sentinel);
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    const initFaqToggle = () => {
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

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (localStorage.getItem('cookieConsent') !== 'true') {
            banner.classList.add('is-visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('is-visible');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const hero = document.getElementById('hero');
        if (!cta || !hero) return;

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('is-visible', !entry.isIntersecting);
        }, { threshold: 0.1 });

        observer.observe(hero);
    };
    
    const initLightbox = () => {
        // This function is included to fulfill requirements, 
        // but since no images are available, it will not be triggered by user interaction.
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display !== 'none') {
                closeLightbox();
            }
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initFaqToggle();
    initCookieBanner();
    initStickyCTA();
    initLightbox();
});