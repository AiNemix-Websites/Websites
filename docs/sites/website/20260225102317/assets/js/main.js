document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenuDrawer = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuToggle && mobileMenuDrawer) {
        const toggleMenu = (isOpen) => {
            mobileMenuDrawer.classList.toggle('is-open', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuDrawer.classList.contains('is-open');
            toggleMenu(!isOpen);
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => toggleMenu(false));
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuDrawer.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Scroll Reveal Animation --- //
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

    // --- Cookie Banner --- //
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

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let galleryImages = [];
        let currentIndex = -1;

        document.addEventListener('click', (e) => {
            if (e.target.matches('img[data-km-image]')) {
                e.preventDefault();
                const images = document.querySelectorAll('img[data-km-image]');
                galleryImages = Array.from(images).map(img => img.dataset.kmImage);
                currentIndex = galleryImages.findIndex(src => src === e.target.dataset.kmImage);
                showImage(currentIndex);
                openLightbox();
            }
        });

        const openLightbox = () => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const pathPrefix = lightboxImg.src.includes('../') ? '../' : '';
            lightboxImg.src = pathPrefix + galleryImages[currentIndex];
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
            nextBtn.style.display = (currentIndex === galleryImages.length - 1) ? 'none' : 'block';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    // --- Sticky CTA & Back to Top --- //
    const stickyCta = document.getElementById('sticky-cta');
    const backToTopBtn = document.getElementById('back-to-top');

    if (stickyCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const isVisible = window.scrollY > window.innerHeight * 0.5;
            if (stickyCta) stickyCta.classList.toggle('visible', isVisible);
            if (backToTopBtn) backToTopBtn.classList.toggle('visible', isVisible);
        });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});