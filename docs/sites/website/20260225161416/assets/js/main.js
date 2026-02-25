document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-nav');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
            menuClose.focus();
        });

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
            menuToggle.focus();
        };

        menuClose.addEventListener('click', closeMenu);

        // Close on backdrop click
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
                closeMenu();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox (Singleton Pattern) ---
    // This is ready for when images are added to the site.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('img');
        const closeButton = lightbox.querySelector('.km-lightbox-close');
        const prevButton = lightbox.querySelector('.km-lightbox-prev');
        const nextButton = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imagePath = galleryImages[index].dataset.kmImage;
            lightboxImage.src = imagePath.startsWith('../') ? imagePath : (document.baseURI.includes('/index.html') ? '' : '.') + imagePath;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
            document.body.classList.add('no-scroll');
            closeButton.focus();
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
        };

        const showPrev = () => openLightbox(currentImageIndex - 1);
        const showNext = () => openLightbox(currentImageIndex + 1);

        const updateLightboxNav = () => {
            prevButton.style.display = currentImageIndex > 0 ? 'block' : 'none';
            nextButton.style.display = currentImageIndex < galleryImages.length - 1 ? 'block' : 'none';
        };

        document.querySelectorAll('[data-km-image]').forEach((el, index) => {
            galleryImages.push(el);
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});