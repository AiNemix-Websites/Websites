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

    function openMenu() {
        if (mobileMenu && menuToggle) {
            menuToggle.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.style.display = 'flex';
            setTimeout(() => mobileMenu.classList.add('open'), 10);
            document.body.classList.add('scroll-lock');
            mobileMenu.addEventListener('keydown', trapFocus);
            menuClose.focus();
        }
    }

    function closeMenu() {
        if (mobileMenu && menuToggle) {
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
            document.body.classList.remove('scroll-lock');
            mobileMenu.removeEventListener('keydown', trapFocus);
            menuToggle.focus();
        }
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }
    
    // Focus trap for mobile menu
    function trapFocus(event) {
        const focusableElements = mobileMenu.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

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

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.style.display = 'block';
                setTimeout(() => stickyCTA.classList.add('visible'), 10);
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Lightbox (Singleton) --- //
    // Although there are no images, the logic is here for future use and robustness.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const contentImg = lightbox.querySelector('.km-lightbox-content img');
        let galleryImages = [];
        let currentIndex = 0;

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
            document.body.classList.add('scroll-lock');
            document.addEventListener('keydown', handleLightboxKeys);
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('scroll-lock');
            document.removeEventListener('keydown', handleLightboxKeys);
        }

        function updateLightboxImage() {
            if (galleryImages.length > 0) {
                const imageSrc = galleryImages[currentIndex].dataset.kmImage;
                const imageAlt = galleryImages[currentIndex].alt;
                contentImg.src = imageSrc;
                contentImg.alt = imageAlt;
                contentImg.dataset.kmImage = imageSrc;
            }
        }

        function showPrev() {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
            updateLightboxImage();
        }

        function showNext() {
            currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
            updateLightboxImage();
        }

        function handleLightboxKeys(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }

        document.querySelectorAll('[data-km-lightbox-gallery] img').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // --- Contact Form Placeholder --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a placeholder. In a real application, you would send the data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});