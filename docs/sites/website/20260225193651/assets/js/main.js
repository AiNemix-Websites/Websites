document.addEventListener('DOMContentLoaded', function() {

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
    const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select';
    let focusableElements, firstFocusableElement, lastFocusableElement;

    function openMenu() {
        if (!mobileMenu || !menuToggle) return;
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('body-no-scroll');
        
        focusableElements = Array.from(mobileMenu.querySelectorAll(focusableElementsString));
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        firstFocusableElement.focus();

        mobileMenu.addEventListener('keydown', trapFocus);
        mobileMenu.addEventListener('click', closeMenuOnClickOutside);
        document.addEventListener('keydown', closeMenuOnEsc);
    }

    function closeMenu() {
        if (!mobileMenu || !menuToggle) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('body-no-scroll');
        menuToggle.focus();

        mobileMenu.removeEventListener('keydown', trapFocus);
        mobileMenu.removeEventListener('click', closeMenuOnClickOutside);
        document.removeEventListener('keydown', closeMenuOnEsc);
    }
    
    function closeMenuOnClickOutside(event) {
        if (event.target === mobileMenu) {
            closeMenu();
        }
    }

    function closeMenuOnEsc(event) {
        if (event.key === 'Escape') {
            closeMenu();
        }
    }

    function trapFocus(e) {
        let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
        if (!isTabPressed) return;

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
    }

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            const heroSection = document.querySelector('.hero, .page-header');
            if (heroSection && window.scrollY > heroSection.offsetHeight) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        });
    }

    // --- Lightbox --- //
    // The functionality is included for future use when images are added.
    // No images are currently on the site to trigger this.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxContent = lightbox.querySelector('.km-lightbox-content');
        const closeButton = lightbox.querySelector('.km-lightbox-close');
        const prevButton = lightbox.querySelector('.km-lightbox-prev');
        const nextButton = lightbox.querySelector('.km-lightbox-next');
        let galleryImages = [];
        let currentIndex = 0;

        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-km-lightbox-gallery] img')) {
                e.preventDefault();
                const galleryName = e.target.closest('[data-km-lightbox-gallery]').dataset.kmLightboxGallery;
                galleryImages = Array.from(document.querySelectorAll(`[data-km-lightbox-gallery='${galleryName}'] img`));
                currentIndex = galleryImages.indexOf(e.target);
                openLightbox(e.target.dataset.kmImage || e.target.src);
            }
        });

        function openLightbox(src) {
            lightboxContent.innerHTML = `<img src='${src}' alt=''>`;
            lightbox.classList.add('show');
            lightbox.style.display = 'flex';
            document.body.classList.add('body-no-scroll');
            document.addEventListener('keydown', handleLightboxKeys);
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('body-no-scroll');
            document.removeEventListener('keydown', handleLightboxKeys);
        }

        function showImage(index) {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const imageElement = galleryImages[currentIndex];
            const src = imageElement.dataset.kmImage || imageElement.src;
            lightboxContent.innerHTML = `<img src='${src}' alt='${imageElement.alt || ''}'>`;
        }

        function showNext() { showImage(currentIndex + 1); }
        function showPrev() { showImage(currentIndex - 1); }

        function handleLightboxKeys(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }

        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});