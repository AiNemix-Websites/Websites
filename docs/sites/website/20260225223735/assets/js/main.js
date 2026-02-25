document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    const stickyCTA = document.getElementById('sticky-cta');
    
    const headerObserver = new IntersectionObserver(([entry]) => {
        if (header) {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }
    }, { rootMargin: '200px 0px 0px 0px' });
    headerObserver.observe(document.body);

    // --- 2. STICKY CTA VISIBILITY --- //
    const heroSection = document.querySelector('.hero');
    if (heroSection && stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0.1 });
        ctaObserver.observe(heroSection);
    }

    // --- 3. MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpened);
            header.classList.toggle('nav-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- 4. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger-group');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 6. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-content') : null;
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        const imageSources = Array.from(galleryItems).map(item => item.dataset.kmImage);

        const showImage = (index) => {
            if (index >= 0 && index < imageSources.length) {
                currentIndex = index;
                // Use a placeholder while loading to prevent showing old image
                lightboxImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                lightboxImg.src = (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/')) ? imageSources[index] : `../${imageSources[index]}`;
                lightboxImg.alt = galleryItems[index].alt || 'Galeriebild';
            }
        };

        const openLightbox = (index) => {
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            showImage(index);
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            removeLightboxEventListeners();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        };

        const addLightboxEventListeners = () => {
            document.addEventListener('keydown', handleKeydown);
        };

        const removeLightboxEventListeners = () => {
            document.removeEventListener('keydown', handleKeydown);
        };

        lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
        lightbox.querySelector('.prev-btn').addEventListener('click', () => showImage(currentIndex - 1));
        lightbox.querySelector('.next-btn').addEventListener('click', () => showImage(currentIndex + 1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});