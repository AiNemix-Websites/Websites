document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Header
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

    // 2. Mobile Navigation
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // 5. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // 6. Global Lightbox
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    let currentImageIndex;
    let galleryImages = [];

    const openLightbox = (index) => {
        if (index < 0 || index >= galleryImages.length) return;
        currentImageIndex = index;
        const imageElement = galleryImages[currentImageIndex];
        const imageSrc = imageElement.getAttribute('data-km-image') || imageElement.src;
        const imageAlt = imageElement.alt || 'Praxisansicht';
        
        // Use relative path for display
        const displaySrc = imageElement.src;
        
        lightboxImage.src = displaySrc;
        lightboxImage.alt = imageAlt;
        lightbox.classList.add('visible');
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const showPrevImage = () => openLightbox(currentImageIndex - 1);
    const showNextImage = () => openLightbox(currentImageIndex + 1);

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    document.addEventListener('click', (e) => {
        if (e.target.matches('.lightbox-trigger')) {
            e.preventDefault();
            const group = e.target.dataset.lightboxGroup;
            galleryImages = Array.from(document.querySelectorAll(`.lightbox-trigger[data-lightbox-group='${group}']`));
            const index = galleryImages.indexOf(e.target);
            openLightbox(index);
        }
    });

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
    }

    // 7. Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the header is NOT in view
                if (!entry.isIntersecting && window.scrollY > 200) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if(heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});