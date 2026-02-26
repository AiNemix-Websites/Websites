document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                let delay = entry.target.dataset.staggerDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = lightbox.querySelector('.km-lightbox-image');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.km-lightbox-next');
    const lightboxBackdrop = lightbox.querySelector('.km-lightbox-backdrop');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    let galleryImages = [];
    let currentIndex = -1;

    function openLightbox(index) {
        if (index < 0 || index >= galleryImages.length) return;
        currentIndex = index;
        const imagePath = galleryImages[currentIndex];
        const altText = document.querySelector(`[data-km-image='${imagePath}'] img`)?.alt || 'Bildansicht';
        
        // Adjust path for subpages
        const onSubpage = window.location.pathname.split('/').filter(Boolean).length > 0;
        const finalPath = onSubpage ? `../${imagePath}` : imagePath;

        lightboxImage.src = finalPath;
        lightboxImage.alt = altText;
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scroll-locked');
        updateLightboxNav();
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scroll-locked');
        lightboxImage.src = '';
    }

    function showPrev() {
        openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
    }

    function showNext() {
        openLightbox((currentIndex + 1) % galleryImages.length);
    }

    function updateLightboxNav() {
        lightboxPrev.style.display = galleryImages.length > 1 ? 'block' : 'none';
        lightboxNext.style.display = galleryImages.length > 1 ? 'block' : 'none';
    }

    if (triggers.length > 0) {
        triggers.forEach((trigger, index) => {
            const imagePath = trigger.dataset.kmImage;
            if (imagePath) {
                galleryImages.push(imagePath);
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(galleryImages.indexOf(imagePath));
                });
            }
        });
    }

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrev);
        lightboxNext.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

});