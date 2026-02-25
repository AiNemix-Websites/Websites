'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
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

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isActive = mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('no-scroll', isActive);
        };

        menuToggle.addEventListener('click', toggleMenu);

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const COOKIE_CONSENT_KEY = 'kaplan_cookie_consent';

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Back to Top & Context CTA ---
    const backToTopButton = document.getElementById('back-to-top');
    const contextCta = document.getElementById('context-cta');

    const handleScrollButtons = () => {
        const shouldBeVisible = window.scrollY > 300;
        if (backToTopButton) backToTopButton.classList.toggle('visible', shouldBeVisible);
        if (contextCta) contextCta.classList.toggle('visible', shouldBeVisible);
    };

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    window.addEventListener('scroll', handleScrollButtons, { passive: true });
    handleScrollButtons(); // Initial check

    // --- Global Lightbox (Singleton) ---
    // NOTE: This is included to fulfill requirements, but will not be triggered
    // as there are no images in the current build.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxContent = lightbox.querySelector('.lightbox-content');
        const closeButton = lightbox.querySelector('.close-lightbox');
        const prevButton = lightbox.querySelector('.prev-lightbox');
        const nextButton = lightbox.querySelector('.next-lightbox');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            const item = galleryItems[currentIndex];
            const imageSrc = item.dataset.kmImage; // Use data-km-image for the source
            
            lightboxContent.innerHTML = `<img src='${imageSrc}' alt='${item.alt || ''}'>`;
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxContent.innerHTML = '';
        };

        const showPrev = () => openLightbox(currentIndex - 1);
        const showNext = () => openLightbox(currentIndex + 1);

        const updateLightboxNav = () => {
            prevButton.style.display = (currentIndex > 0) ? 'block' : 'none';
            nextButton.style.display = (currentIndex < galleryItems.length - 1) ? 'block' : 'none';
        };
        
        document.querySelectorAll('[data-km-image]').forEach((item, index) => {
            galleryItems.push(item);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

});