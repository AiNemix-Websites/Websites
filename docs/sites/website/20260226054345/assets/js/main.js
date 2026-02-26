document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('scroll-locked');
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
                entry.target.classList.add('is-visible');
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
            cookieBanner.classList.add('is-visible');
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const imageTriggers = document.querySelectorAll('[data-lightbox-trigger]');

        const updateLightbox = () => {
            const currentImage = galleryImages[currentIndex];
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;
            prevBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
            nextBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
        };

        const openLightbox = (index) => {
            currentIndex = index;
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            updateLightbox();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            lightboxImage.src = ''; // Clear src to stop loading
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightbox();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightbox();
        };

        imageTriggers.forEach(trigger => {
            const galleryContainer = trigger.closest('.gallery-grid');
            if (galleryContainer) {
                const imagesInGallery = Array.from(galleryContainer.querySelectorAll('[data-lightbox-trigger]'));
                imagesInGallery.forEach(item => {
                    const src = item.dataset.imageSrc;
                    const alt = item.dataset.imageAlt;
                    if (!galleryImages.some(img => img.src === src)) {
                         galleryImages.push({ src, alt });
                    }
                });
            }
        });

        imageTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const src = trigger.dataset.imageSrc;
                const index = galleryImages.findIndex(img => img.src === src);
                if (index !== -1) {
                    openLightbox(index);
                }
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Auto-populate form subject from URL query ---
    const contactFormSubject = document.getElementById('subject');
    if (contactFormSubject) {
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        if (subject) {
            contactFormSubject.value = subject;
        }
    }

});