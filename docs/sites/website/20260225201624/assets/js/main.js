document.addEventListener('DOMContentLoaded', () => {

    // --- Global State ---
    const body = document.body;

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- Mobile Menu ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('scroll-locked');
        mobileMenu.addEventListener('keydown', trapFocus);
        mobileMenuClose.focus();
    };

    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('scroll-locked');
        mobileMenu.removeEventListener('keydown', trapFocus);
        mobileMenuToggle.focus();
    };

    if (mobileMenuToggle && mobileMenu && mobileMenuClose) {
        mobileMenuToggle.addEventListener('click', openMenu);
        mobileMenuClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // Focus Trap for Mobile Menu
    let focusableElements, firstFocusableElement, lastFocusableElement;
    const trapFocus = (e) => {
        if (e.key !== 'Tab') return;
        focusableElements = Array.from(mobileMenu.querySelectorAll('a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'));
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    };

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('show'), 10);
            }
        }, 1000);

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const gallery = document.getElementById('image-gallery');
    let galleryItems = [];
    let currentIndex = 0;

    if (lightbox && gallery) {
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));

        const showImage = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            const item = galleryItems[index];
            const imagePath = item.getAttribute('data-km-image');
            const altText = item.querySelector('img')?.alt || 'Galeriebild';
            lightboxImage.src = `../${imagePath}`;
            lightboxImage.alt = altText;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedItem = e.target.closest('.gallery-item');
            if (!clickedItem) return;

            const itemIndex = galleryItems.indexOf(clickedItem);
            showImage(itemIndex);

            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleLightboxKeys);
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleLightboxKeys);
        };

        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);
        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);

        const handleLightboxKeys = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        gallery.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- Context CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        }, { passive: true });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        summary.addEventListener('click', (e) => {
            if (item.hasAttribute('open')) {
                e.preventDefault();
                item.classList.add('closing');
                item.addEventListener('animationend', () => {
                    item.removeAttribute('open');
                    item.classList.remove('closing');
                }, { once: true });
            }
        });
    });
});