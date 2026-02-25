document.addEventListener('DOMContentLoaded', () => {

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
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            mobileMenu.addEventListener('keydown', trapFocus);
            document.addEventListener('keydown', closeOnEscape);
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            mobileMenu.removeEventListener('keydown', trapFocus);
            document.removeEventListener('keydown', closeOnEscape);
        };

        menuToggle.addEventListener('click', openMenu);
        if(menuClose) menuClose.addEventListener('click', closeMenu);

        // Close on backdrop click (event delegation)
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('is-open') && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
                closeMenu();
            }
        });
        
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') closeMenu();
        };

        // Focus trap for accessibility
        const focusableElements = mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        const trapFocus = (e) => {
            const isTabPressed = e.key === 'Tab';
            if (!isTabPressed) return;

            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        };
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const hero = document.querySelector('.hero');
        if (hero) ctaObserver.observe(hero);
    }
    
    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = -1;
        let galleryImages = [];

        const updateLightbox = () => {
            if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
                const imgElement = galleryImages[currentImageIndex];
                lightboxImage.src = imgElement.getAttribute('data-lightbox-src');
                lightboxImage.alt = imgElement.querySelector('img')?.alt || 'Projektbild';
            }
        };

        const openLightbox = (e) => {
            const clickedImage = e.target.closest('a[data-lightbox-src]');
            if (clickedImage) {
                e.preventDefault();
                const group = clickedImage.getAttribute('data-lightbox-group') || 'default';
                galleryImages = Array.from(document.querySelectorAll(`a[data-lightbox-group='${group}']`));
                currentImageIndex = galleryImages.indexOf(clickedImage);
                
                updateLightbox();
                lightbox.classList.add('visible');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.classList.add('no-scroll');
                document.addEventListener('keydown', handleLightboxKeys);
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleLightboxKeys);
        };

        const showPrev = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightbox();
        };

        const showNext = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightbox();
        };

        const handleLightboxKeys = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.body.addEventListener('click', openLightbox);
        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

});