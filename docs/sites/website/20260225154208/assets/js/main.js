document.addEventListener('DOMContentLoaded', () => {

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

    const openMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    };

    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', closeMenu);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('is-visible'), 10);
            }
        }, 2000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.getElementById('hero');
        const ctaThreshold = heroSection ? heroSection.offsetHeight : 300;

        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCTA.classList.add('is-visible');
                stickyCTA.setAttribute('aria-hidden', 'false');
            } else {
                stickyCTA.classList.remove('is-visible');
                stickyCTA.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('main-contact-form');
    const formFeedback = document.getElementById('form-feedback');
    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formFeedback.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.';
            formFeedback.style.color = 'var(--colors-primary)';
            contactForm.reset();
            setTimeout(() => {
                formFeedback.textContent = '';
            }, 5000);
        });
    }

    // --- Lightbox Modal (Generic) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        const openLightbox = () => { // Example function, not used as no images
            lightbox.style.display = 'flex'; 
            setTimeout(() => {
                lightbox.classList.add('is-open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.classList.add('no-scroll');
            }, 10);
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
                closeLightbox();
            }
        });
    }

});