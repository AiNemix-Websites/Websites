document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER ---
    const header = document.getElementById('site-header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler(); // Initial check
    }

    // --- MOBILE NAVIGATION ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.getElementById('main-nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('open');
            navList.classList.toggle('open');
            document.body.classList.toggle('scroll-locked');
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('open')) {
                navToggle.click();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
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

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }

        const handleConsent = (consentValue) => {
            localStorage.setItem('cookie_consent', consentValue);
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- HANDWERKERSUCHE PLACEHOLDER ---
    const searchBtn = document.getElementById('search-btn-placeholder');
    const searchResults = document.getElementById('search-results');
    if (searchBtn && searchResults) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchResults.hidden = false;
        });
    }

    // --- LIGHTBOX (Singleton Pattern) ---
    // This part is intentionally left simple as a full-featured lightbox
    // can be complex. This provides the basic open/close functionality.
    const lightbox = document.getElementById('km-lightbox');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const clickableImages = document.querySelectorAll('img[data-km-image]');

    if (lightbox && lightboxClose && clickableImages.length > 0) {
        const lightboxImage = lightbox.querySelector('img');

        const openLightbox = (imgElement) => {
            lightboxImage.src = imgElement.src;
            lightboxImage.alt = imgElement.alt;
            lightbox.hidden = false;
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('scroll-locked');
        };

        clickableImages.forEach(img => {
            // Example condition: make only non-hero images clickable for a gallery
            if (!img.closest('.hero-background')) {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => openLightbox(img));
            }
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Close on backdrop click
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.hidden) {
                closeLightbox();
            }
        });
    }

});