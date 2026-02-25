document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Navigation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('#mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpened = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpened);
            mobileNavToggle.classList.toggle('open');
            mobileNavMenu.classList.toggle('open');
            document.body.classList.toggle('mobile-nav-open');
        });
    }

    // 2. Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // 4. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const denyBtn = document.getElementById('cookie-deny');
    if (cookieBanner && acceptBtn && denyBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
            }
        }, 1000);

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        denyBtn.addEventListener('click', () => handleConsent('denied'));
    }

    // 5. Global Lightbox
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentGallery = [];
        let currentIndex = -1;

        const updateLightbox = () => {
            if (currentIndex >= 0 && currentIndex < currentGallery.length) {
                const imageElement = currentGallery[currentIndex];
                const imagePath = imageElement.dataset.kmImage;
                const imageAlt = imageElement.alt || 'Großansicht';
                // Adjust path for subpages
                const relativePath = window.location.pathname.includes('/index.html') || window.location.pathname === '/' ? '' : '../';
                lightboxImg.src = relativePath + imagePath;
                lightboxImg.alt = imageAlt;
            }
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'block' : 'none';
        };

        const openLightbox = (e) => {
            const trigger = e.target.closest('.lightbox-trigger');
            if (!trigger) return;

            e.preventDefault();
            const galleryName = trigger.dataset.gallery || 'default';
            currentGallery = Array.from(document.querySelectorAll(`.lightbox-trigger[data-gallery='${galleryName}']`));
            currentIndex = currentGallery.indexOf(trigger);
            
            updateLightbox();
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
            lightboxImg.src = ''; // Clear src to stop loading
        };

        const showPrev = () => { if (currentIndex > 0) { currentIndex--; updateLightbox(); } };
        const showNext = () => { if (currentIndex < currentGallery.length - 1) { currentIndex++; updateLightbox(); } };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.body.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }

    // 6. Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        observer.observe(heroSection);
    }

    // 7. Contact Form Simulation
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            feedbackEl.classList.add('success');
            setTimeout(() => {
                feedbackEl.textContent = 'Ihre Nachricht wurde erfolgreich versendet.';
                contactForm.reset();
            }, 1500);
            setTimeout(() => {
                feedbackEl.textContent = '';
                feedbackEl.classList.remove('success');
            }, 6500);
        });
    }
});