document.addEventListener('DOMContentLoaded', function() {

    // --- PREFERS REDUCED MOTION CHECK ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- STICKY HEADER ---
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

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    const openMobileMenu = () => {
        if (!mobileNavContainer) return;
        mobileNavContainer.style.display = 'block';
        document.body.classList.add('body-no-scroll');
        setTimeout(() => {
            mobileNavContainer.classList.add('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }, 10);
    };

    const closeMobileMenu = () => {
        if (!mobileNavContainer) return;
        mobileNavContainer.classList.remove('is-open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('body-no-scroll');
        setTimeout(() => {
            mobileNavContainer.style.display = 'none';
        }, 300);
    };

    if (mobileNavToggle && mobileNavContainer) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            goToSlide(prevIndex);
        });
    }

    // --- TABS COMPONENT ---
    const tabsContainer = document.querySelector('.tabs-container');
    if (tabsContainer) {
        const tabButtons = tabsContainer.querySelectorAll('[role="tab"]');
        const tabPanels = tabsContainer.querySelectorAll('[role="tabpanel"]');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.setAttribute('aria-selected', 'false'));
                button.setAttribute('aria-selected', 'true');

                tabPanels.forEach(panel => {
                    if (panel.id === button.getAttribute('aria-controls')) {
                        panel.style.display = 'block';
                        panel.classList.add('active');
                    } else {
                        panel.style.display = 'none';
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.style.display = 'none';
        });
    }

    // --- STICKY CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const showCta = () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCta.style.display = 'block';
                setTimeout(() => stickyCta.classList.add('is-visible'), 10);
            } else {
                stickyCta.classList.remove('is-visible');
            }
        };
        window.addEventListener('scroll', showCta);
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.km-lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.km-lightbox-next') : null;
    let galleryImages = [];
    let currentImageIndex = -1;

    const openLightbox = (index) => {
        if (!lightbox || index < 0 || index >= galleryImages.length) return;
        currentImageIndex = index;
        const imageElement = galleryImages[currentImageIndex];
        const imagePath = imageElement.dataset.kmImage || imageElement.src;
        const imageAlt = imageElement.alt;

        // Adjust path for subpages
        const pageDepth = window.location.pathname.split('/').length - 2;
        const relativePath = '../'.repeat(pageDepth);
        lightboxImg.src = `${relativePath}${imagePath}`;
        lightboxImg.alt = imageAlt;

        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('is-open'), 10);
        document.body.classList.add('body-no-scroll');
        addLightboxEventListeners();
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
        }, 300);
        document.body.classList.remove('body-no-scroll');
        removeLightboxEventListeners();
    };
    
    const showPrevImage = () => {
        const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(newIndex);
    };

    const showNextImage = () => {
        const newIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(newIndex);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    function addLightboxEventListeners() {
        if (!lightbox) return;
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        document.addEventListener('keydown', handleKeydown);
    }

    function removeLightboxEventListeners() {
        if (!lightbox) return;
        lightboxClose.removeEventListener('click', closeLightbox);
        lightbox.removeEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        lightboxPrev.removeEventListener('click', showPrevImage);
        lightboxNext.removeEventListener('click', showNextImage);
        document.removeEventListener('keydown', handleKeydown);
    }

    document.querySelectorAll('.gallery-image').forEach((img, index) => {
        galleryImages.push(img);
        img.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });
});