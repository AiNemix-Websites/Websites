document.addEventListener('DOMContentLoaded', function() {

    // --- Body Scroll Lock --- //
    const bodyScrollLock = {
        disable() {
            document.body.style.overflow = 'hidden';
        },
        enable() {
            document.body.style.overflow = '';
        }
    };

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
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.style.display = 'flex';
        setTimeout(() => mobileMenu.classList.add('open'), 10);
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        bodyScrollLock.disable();
        document.addEventListener('keydown', handleMenuKeydown);
    };

    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        bodyScrollLock.enable();
        setTimeout(() => { mobileMenu.style.display = 'none'; }, 350);
        document.removeEventListener('keydown', handleMenuKeydown);
    };

    const handleMenuKeydown = (e) => {
        if (e.key === 'Escape') closeMenu();
    };

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', openMenu);
    }
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.dataset.reveal === 'stagger') {
                    const children = entry.target.querySelectorAll('[data-reveal-child]');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 150);
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.style.display = 'block';
                    setTimeout(() => stickyCTA.classList.add('visible'), 10);
                } else {
                    stickyCTA.classList.remove('visible');
                    setTimeout(() => { stickyCTA.style.display = 'none'; }, 350);
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('visible'), 500);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 350);
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'false');
            cookieBanner.classList.remove('visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 350);
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;
        let galleryImages = [];

        const updateLightboxImage = (index) => {
            if (index >= 0 && index < galleryImages.length) {
                const imageElement = galleryImages[index];
                lightboxImg.src = imageElement.dataset.lightboxSrc;
                lightboxImg.alt = imageElement.alt;
                currentImageIndex = index;
            }
        };

        const openLightbox = (e) => {
            const imageElement = e.currentTarget;
            galleryImages = Array.from(document.querySelectorAll('[data-lightbox-src]'));
            const imageIndex = galleryImages.indexOf(imageElement);

            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            updateLightboxImage(imageIndex);
            bodyScrollLock.disable();
            document.addEventListener('keydown', handleLightboxKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => { 
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 350);
            bodyScrollLock.enable();
            document.removeEventListener('keydown', handleLightboxKeydown);
        };

        const showPrevImage = () => {
            const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage(newIndex);
        };

        const showNextImage = () => {
            const newIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage(newIndex);
        };

        const handleLightboxKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        document.querySelectorAll('[data-lightbox-src]').forEach(el => {
            el.addEventListener('click', openLightbox);
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});