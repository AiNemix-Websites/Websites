document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    const openMenu = () => {
        mobileMenu.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll');
        menuClose.focus();
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
        menuToggle.focus();
    };

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
        
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger-group');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA){
        window.addEventListener('scroll', () => {
             if (window.scrollY > 400) {
                stickyCTA.classList.add('is-visible');
            } else {
                stickyCTA.classList.remove('is-visible');
            }
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', (event) => {
            if (item.open) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.open) {
                        otherItem.open = false;
                    }
                });
            }
        });
    });

});