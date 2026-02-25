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

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    function openMobileMenu() {
        mobileNavToggle.classList.add('open');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        mobileNavMenu.classList.add('open');
        mobileNavMenu.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closeMobileMenu() {
        mobileNavToggle.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        mobileNavMenu.classList.remove('open');
        mobileNavMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            if (mobileNavMenu.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        if(mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMobileMenu);
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // --- Copyright Year --- //
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
            }
        }, 1000);

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const showCtaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showCtaThreshold) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
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

    // --- Lightbox (Singleton) --- //
    // NOTE: This is the global lightbox system. Since no images are provided,
    // it won't be triggered, but the logic is here as required.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        let currentImageIndex = 0;
        let galleryImages = [];

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
        };

        const updateLightboxImage = () => {
            if (galleryImages.length > 0) {
                const imgData = galleryImages[currentImageIndex];
                // Path for src attribute needs to be relative to the current page
                const pathPrefix = document.querySelector('body > header > div > a').getAttribute('href') === './' ? '' : '../';
                lightboxImage.src = pathPrefix + imgData.path;
                lightboxImage.alt = imgData.alt;
            }
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        // Event Listeners for closing
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });

        // Event Listeners for navigation (if gallery exists)
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });

        // Example of how to initialize it if there were images:
        // const imageElements = document.querySelectorAll('.gallery-image');
        // imageElements.forEach((img, index) => {
        //     galleryImages.push({ path: img.dataset.kmImage, alt: img.alt });
        //     img.addEventListener('click', () => openLightbox(index));
        // });
    }
});