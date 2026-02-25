document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        }, { rootMargin: '50px 0px 0px 0px' });
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- 2. MOBILE NAVIGATION --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileNavToggle && mobileNav) {
        const toggleNav = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileNav.classList.contains('is-open');
            mobileNav.classList.toggle('is-open', open);
            mobileNavToggle.classList.toggle('is-open', open);
            mobileNavToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('scroll-locked', open);
        };

        mobileNavToggle.addEventListener('click', () => toggleNav());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                toggleNav(false);
            }
        });

        document.body.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('is-open') && !mobileNav.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                toggleNav(false);
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('ruckzuck_cookies_accepted')) {
                cookieBanner.classList.add('is-visible');
            }
        }, 1500);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('ruckzuck_cookies_accepted', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- 5. STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    const triggerElement = document.getElementById('trigger-sticky-cta');

    if (stickyCta && triggerElement) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
        }, { threshold: 0 });
        ctaObserver.observe(triggerElement);
    }

    // --- 6. LIGHTBOX (Singleton Pattern) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        
        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        // This function would be called by clickable images if they existed.
        // window.openKmLightbox = (src, alt) => {
        //     lightbox.querySelector('.lightbox-image').src = src;
        //     lightbox.querySelector('.lightbox-image').alt = alt;
        //     lightbox.classList.add('is-visible');
        //     lightbox.setAttribute('aria-hidden', 'false');
        //     document.body.classList.add('scroll-locked');
        //     document.addEventListener('keydown', handleEsc, { once: true });
        // };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
    }

    // --- 7. CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real scenario, this would handle form submission via AJAX.
            // For this static site, we just show a confirmation.
            alert('Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }

    // --- 8. SMOOTH SCROLL FOR ANCHOR LINKS --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.length > 1) {
                try {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                } catch (error) {
                    // Invalid selector, do nothing
                }
            }
        });
    });
});