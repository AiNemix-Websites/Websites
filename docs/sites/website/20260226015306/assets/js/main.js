document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = mobileMenu.classList.contains('open');
            if (open === isOpen) return;

            mobileMenu.classList.toggle('open', open);
            document.body.classList.toggle('mobile-menu-open', open);
            menuToggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';

            if (open) {
                document.addEventListener('keydown', handleEscKey);
            } else {
                document.removeEventListener('keydown', handleEscKey);
            }
        };

        menuToggle.addEventListener('click', () => {
            toggleMenu(!mobileMenu.classList.contains('open'));
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu(false);
            }
        });

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                toggleMenu(false);
            }
        };
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-up');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- 5. Sticky Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        window.addEventListener('scroll', () => {
            // Show after scrolling down 1 viewport height, and hide if near the footer
            const footer = document.querySelector('.main-footer');
            const footerTop = footer ? footer.offsetTop : document.body.scrollHeight;
            const isNearFooter = (window.scrollY + window.innerHeight) > (footerTop - 100);

            if (window.scrollY > window.innerHeight && !isNearFooter) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        }, { passive: true });
    }

});