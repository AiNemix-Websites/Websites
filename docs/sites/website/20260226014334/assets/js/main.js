document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNavToggle && mobileNav) {
        const toggleNav = (isOpen) => {
            const expanded = isOpen ? 'true' : 'false';
            mobileNavToggle.setAttribute('aria-expanded', expanded);
            mobileNavToggle.classList.toggle('is-active', isOpen);
            mobileNav.classList.toggle('is-open', isOpen);
            mobileNav.setAttribute('aria-hidden', !isOpen);
            document.body.classList.toggle('body-lock', isOpen);
        };

        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'false';
            toggleNav(isOpen);
        });

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) { // Click on backdrop
                toggleNav(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                toggleNav(false);
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseInt(element.dataset.staggerDelay) || 0;
                    
                    if (delay > 0) {
                        const children = element.querySelectorAll('.reveal-child');
                        children.forEach((child, index) => {
                            child.style.transitionDelay = `${index * delay}ms`;
                        });
                    }
                    element.classList.add('is-visible');
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // --- Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.hidden = isExpanded;
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieAccepted = localStorage.getItem('cookieAccepted');

    if (!cookieAccepted && cookieBanner) {
        cookieBanner.classList.add('is-visible');
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCta.classList.add('is-visible');
            } else {
                stickyCta.classList.remove('is-visible');
            }
        });
    }

    // --- Smooth scroll for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) { // Ensure it's not just '#'
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});