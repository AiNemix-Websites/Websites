document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE MENU --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    const openMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('open');
        body.classList.add('no-scroll');
        mobileMenu.querySelector('a').focus();
    };

    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        body.classList.remove('no-scroll');
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
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = () => {
        if (!cookieBanner) return;
        localStorage.setItem('cookieConsent', 'true');
        cookieBanner.classList.remove('visible');
    }

    if (acceptBtn) acceptBtn.addEventListener('click', handleConsent);
    if (rejectBtn) rejectBtn.addEventListener('click', handleConsent);

    // --- 5. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 6. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = lightbox ? lightbox.querySelector('.km-lightbox-image') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.km-lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.km-lightbox-next') : null;
    const galleryItems = document.querySelectorAll('.gallery-image');
    let currentIndex = 0;

    if (galleryItems.length > 0 && lightbox) {
        const imageSources = Array.from(galleryItems).map(item => item.getAttribute('data-km-image'));

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            currentIndex = index;
            const relativePath = lightboxImage.src.includes('/assets/') ? '' : '../'; // Adjust path for subpages
            const imagePath = document.querySelector(`[data-km-image='${imageSources[index]}']`).src;
            lightboxImage.src = imagePath;
        };

        const openLightbox = (index) => {
            lightbox.classList.add('open');
            body.classList.add('no-scroll');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            body.classList.remove('no-scroll');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
        lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

});