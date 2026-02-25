document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    const openMenu = () => {
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('no-scroll');
        document.addEventListener('keydown', handleMenuKeydown);
        mobileMenu.addEventListener('click', handleBackdropClick);
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleMenuKeydown);
        mobileMenu.removeEventListener('click', handleBackdropClick);
    };

    const handleMenuKeydown = (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    };

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            // Scroll Down
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            // Scroll Up
            header.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // --- Scroll Animations --- //
    const revealItems = document.querySelectorAll('.reveal-item, .reveal-stagger-group');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger-group')) {
                    entry.target.classList.add('is-visible');
                    const items = entry.target.querySelectorAll(':scope > *');
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * 100}ms`;
                    });
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    const cookieStatus = localStorage.getItem('cookie_status');

    if (!cookieStatus && cookieBanner) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'declined');
            cookieBanner.classList.remove('show');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }, { passive: true });
    }

});