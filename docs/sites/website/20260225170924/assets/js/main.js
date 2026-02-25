document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const initMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navToggle.click();
            }
        });
    };

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        }, { rootMargin: '200px 0px 0px 0px', threshold: 1 });
        
        // Create a dummy element to observe
        const dummy = document.createElement('div');
        dummy.style.height = '1px';
        document.body.prepend(dummy);
        observer.observe(dummy);
    };

    // --- Scroll Reveal Animation ---
    const initScrollReveal = () => {
        const revealItems = document.querySelectorAll('.reveal-item');
        if (revealItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(item => {
            observer.observe(item);
        });
    };

    // --- FAQ Accordion ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (question && answer) {
                question.addEventListener('click', () => {
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';
                    question.setAttribute('aria-expanded', !isExpanded);
                    if (!isExpanded) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    } else {
                        answer.style.maxHeight = '0';
                    }
                });
            }
        });
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.hidden = false;
            setTimeout(() => banner.classList.add('is-visible'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('is-visible');
            setTimeout(() => banner.hidden = true, 500);
        });
    };

    // --- Sticky CTA ---
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('is-visible', !entry.isIntersecting);
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    };

    // --- Magnetic Effect (WOW Feature) ---
    const initMagneticEffect = () => {
        const magneticItems = document.querySelectorAll('.magnetic-item');
        if (window.matchMedia('(pointer: fine)').matches) { // Only on devices with precise pointer
            magneticItems.forEach(item => {
                item.addEventListener('mousemove', (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    item.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
                    item.style.transition = 'transform 0.1s ease';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translate(0, 0)';
                    item.style.transition = 'transform 0.4s ease';
                });
            });
        }
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initStickyCta();
    initMagneticEffect();

});