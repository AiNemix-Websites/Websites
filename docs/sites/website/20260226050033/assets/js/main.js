document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- 2. MOBILE NAVIGATION --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const body = document.body;

    const closeMenu = () => {
        body.classList.remove('mobile-nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', handleEscKey);
    };

    const openMenu = () => {
        body.classList.add('mobile-nav-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.addEventListener('keydown', handleEscKey);
    };

    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };

    if (menuToggle && mobileNavContainer) {
        menuToggle.addEventListener('click', () => {
            if (body.classList.contains('mobile-nav-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                closeMenu();
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stagger children if needed
                const staggerContainer = entry.target.querySelector('.stagger-children');
                if (staggerContainer) {
                    const children = staggerContainer.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- 4. FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '0 var(--spacing-md)';
            } else {
                answer.style.maxHeight = '0';
                answer.style.padding = '0 var(--spacing-md)';
            }
        });
    });

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 6. STICKY CONTEXT CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});