document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('main-header');
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

    // --- 2. Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu && menuClose) {
        const openMenu = () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.addEventListener('keydown', trapFocus);
            document.addEventListener('keydown', closeOnEscape);
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.removeEventListener('keydown', trapFocus);
            document.removeEventListener('keydown', closeOnEscape);
            menuToggle.focus();
        };

        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        
        // Close on Escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        };
        
        // Focus trap for accessibility
        const focusableElements = mobileMenu.querySelectorAll('a[href], button');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        const trapFocus = (e) => {
            const isTabPressed = e.key === 'Tab';

            if (!isTabPressed) { 
                return; 
            }

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        };
    }

    // --- 3. Scroll Reveal Animations --- //
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
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    if (cookieBanner && cookieAccept && cookieDecline) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });

        cookieDecline.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
        });
    }

    // --- 5. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        ctaObserver.observe(heroSection);
    }

    // --- 6. Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data to a server.
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formStatus.className = 'form-status success';
            contactForm.reset();

            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        });
    }
});
