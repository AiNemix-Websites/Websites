document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE MENU --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.classList.toggle('mobile-menu-open');
            mainNav.classList.toggle('mobile-open');
            document.body.style.overflow = !isOpen ? 'hidden' : '';
        });
    }

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.dataset.reveal === 'stagger-up') {
                    const elements = entry.target.querySelectorAll('.card, .process-step');
                    elements.forEach((el, index) => {
                        el.style.setProperty('--stagger-index', index);
                        el.dataset.reveal = 'stagger-up'; // ensure it has the attribute
                        el.classList.add('visible');
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
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

    // --- MODERNIZATION CALCULATOR --- //
    const calcForm = document.getElementById('modernization-form');
    const calcResult = document.getElementById('calculator-result');
    if (calcForm && calcResult) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calcForm.style.display = 'none';
            calcResult.style.display = 'block';
        });
    }

    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;
        let imageGallery = [];

        const openLightbox = (galleryName, index) => {
            imageGallery = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryName}']`));
            currentImageIndex = index;
            updateLightboxImage();
            document.body.style.overflow = 'hidden';
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        const closeLightbox = () => {
            document.body.style.overflow = '';
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        const updateLightboxImage = () => {
            const imgElement = imageGallery[currentImageIndex];
            const imgSrc = imgElement.dataset.kmImage || imgElement.src;
            const imgAlt = imgElement.alt;
            lightboxImage.src = imgSrc.startsWith('..') ? imgSrc.substring(1) : imgSrc; // Adjust path for subpages
            lightboxImage.alt = imgAlt;
            prevBtn.style.display = imageGallery.length > 1 ? 'block' : 'none';
            nextBtn.style.display = imageGallery.length > 1 ? 'block' : 'none';
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageGallery.length) % imageGallery.length;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageGallery.length;
            updateLightboxImage();
        };

        document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                const galleryName = trigger.dataset.lightboxTrigger;
                const galleryImages = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryName}']`));
                const imageIndexInGallery = galleryImages.indexOf(trigger);
                openLightbox(galleryName, imageIndexInGallery);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
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
        
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if(heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});