document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- 2. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.getElementById('mobile-nav-container');
    let isNavOpen = false;

    const toggleNav = (forceClose = false) => {
        if (forceClose) {
            isNavOpen = false;
        } else {
            isNavOpen = !isNavOpen;
        }
        
        mobileNavContainer.classList.toggle('is-open', isNavOpen);
        document.body.classList.toggle('no-scroll', isNavOpen);
        mobileNavToggle.setAttribute('aria-expanded', isNavOpen);
        
        if (isNavOpen) {
            // Optional: Focus first element in nav
            mobileNavContainer.querySelector('a').focus();
        }
    };

    if (mobileNavToggle && mobileNavContainer) {
        mobileNavToggle.addEventListener('click', () => toggleNav());

        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) { // Click on backdrop
                toggleNav(true);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isNavOpen) {
                toggleNav(true);
            }
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const COOKIE_CONSENT_KEY = 'pr_cookie_consent';

    if (cookieBanner && cookieAcceptBtn) {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1500);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- 5. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('is-visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 6. Smooth scroll for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});