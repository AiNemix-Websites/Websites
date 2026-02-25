document.addEventListener('DOMContentLoaded', () => {

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    };

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const navContainer = document.querySelector('.mobile-nav-container');
        if (!toggleBtn || !navContainer) return;

        const toggleNav = (show) => {
            const isExpanded = show === undefined ? toggleBtn.getAttribute('aria-expanded') === 'false' : show;
            toggleBtn.setAttribute('aria-expanded', isExpanded);
            document.body.classList.toggle('mobile-nav-active', isExpanded);
        };

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNav();
        });

        navContainer.addEventListener('click', () => toggleNav(false));
        navContainer.querySelector('.mobile-nav').addEventListener('click', (e) => e.stopPropagation());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
                toggleNav(false);
            }
        });
    };

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

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-stagger, .reveal-fade');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.classList.add('show');
        }

        const handleConsent = (value) => {
            localStorage.setItem('cookie_consent', value);
            banner.classList.remove('show');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    };

    const initBeforeAfterSlider = () => {
        const slider = document.getElementById('before-after-slider');
        if (!slider) return;

        const afterImage = slider.querySelector('.ba-image-after');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            afterImage.style.width = (pos * 100) + '%';
            handle.style.left = (pos * 100) + '%';
        };

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);

        window.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        window.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        });
    };

    const initStickyCtaBar = () => {
        const bar = document.getElementById('sticky-cta-bar');
        const hero = document.querySelector('.hero');
        if (!bar || !hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                bar.classList.toggle('show', !entry.isIntersecting);
            });
        }, { threshold: 0 });

        observer.observe(hero);
    };

    // Lightbox functionality will be added here if needed in the future.
    // For now, no images are designated to open in a lightbox.

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initFaqAccordion();
    initScrollReveal();
    initCookieBanner();
    initBeforeAfterSlider();
    initStickyCtaBar();
});