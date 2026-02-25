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
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        // Clone nav for mobile to avoid conflicts
        const mobileNav = mainNav.cloneNode(true);
        mobileNav.classList.add('is-mobile');
        document.body.appendChild(mobileNav);

        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            mobileNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
            document.body.classList.toggle('mobile-menu-open');
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
                document.body.classList.remove('mobile-menu-open');
            });
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    // Apply stagger delay for .reveal-stagger elements
                    if (el.classList.contains('reveal-stagger')) {
                        el.style.transitionDelay = `${index * 100}ms`;
                    }
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('show'), 10);
            }
        }, 2000);

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Lightbox (Global Singleton) --- //
    // The structure is here as required, even if no images trigger it.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            // Add prev/next functionality if needed
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', handleKeydown);
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateCTA = () => {
            const scrollY = window.scrollY;
            if (scrollY > 500) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateCTA);
                ticking = true;
            }
        });
    }
});