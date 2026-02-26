document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.querySelector('.site-header');
    const stickyCTA = document.querySelector('.sticky-cta');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                if (stickyCTA) stickyCTA.classList.add('show');
            } else {
                header.classList.remove('scrolled');
                if (stickyCTA) stickyCTA.classList.remove('show');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler(); // Initial check
    }

    // --- 2. Mobile Navigation --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    if (menuToggle && mobileNavContainer) {
        const toggleMenu = (open) => {
            const isOpen = mobileNavContainer.classList.contains('open');
            if (open === isOpen) return; 

            mobileNavContainer.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        menuToggle.addEventListener('click', () => toggleMenu(!mobileNavContainer.classList.contains('open')));
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
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

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        const handleConsent = (consentValue) => {
            localStorage.setItem('cookie_consent', consentValue);
            cookieBanner.classList.remove('show');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- 5. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let galleryImages = [];
        let currentIndex = -1;

        const updateLightbox = () => {
            if (currentIndex >= 0 && currentIndex < galleryImages.length) {
                const currentImage = galleryImages[currentIndex];
                lightboxImg.src = currentImage.dataset.kmImage || currentImage.src;
                lightboxImg.alt = currentImage.alt;
                prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
                nextBtn.style.display = currentIndex < galleryImages.length - 1 ? 'block' : 'none';
            }
        };

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            // Clear src to stop video/gif playback
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        const showPrev = () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateLightbox();
            }
        };

        const showNext = () => {
            if (currentIndex < galleryImages.length - 1) {
                currentIndex++;
                updateLightbox();
            }
        };

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-trigger')) {
                e.preventDefault();
                galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
                const index = galleryImages.indexOf(e.target);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- 6. Contact Form Placeholder Behavior --- //
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        // Trigger check on load for pre-filled values
        if (input.value) {
            input.classList.add('filled');
        }
        input.addEventListener('blur', () => {
            if (input.value) {
                input.classList.add('filled');
            } else {
                input.classList.remove('filled');
            }
        });
    });
});