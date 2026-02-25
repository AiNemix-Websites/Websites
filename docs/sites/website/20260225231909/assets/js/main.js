document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('is-open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleMenuKeydown);
    };

    const closeMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleMenuKeydown);
    };

    const handleMenuKeydown = (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', closeMenu);
    }
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-stagger-group');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger-group')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                        children[i].classList.add('is-visible');
                    }
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const COOKIE_CONSENT_KEY = 'beautycorner_cookie_consent';

    if (cookieBanner && cookieAcceptBtn) {
        const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!hasConsent) {
            cookieBanner.style.display = 'block';
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- 5. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        stickyCTA.style.display = 'block'; // Make it available for observation
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 6. Lightbox (Global Singleton) --- //
    // NOTE: This is included for future use when images are added.
    // It will not be triggered if there are no '.gallery-item' elements.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxContent = lightbox.querySelector('.km-lightbox-content');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightboxContent();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleLightboxKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxContent.innerHTML = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleLightboxKeydown);
        };

        const updateLightboxContent = () => {
            if (currentIndex < 0 || currentIndex >= galleryItems.length) return;
            const item = galleryItems[currentIndex];
            const imgSrc = item.dataset.kmImage;
            const imgAlt = item.querySelector('img')?.alt || 'Galeriebild';
            lightboxContent.innerHTML = `<img src='${imgSrc}' alt='${imgAlt}'/>`;
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < galleryItems.length - 1 ? 'block' : 'none';
        };

        const showPrev = () => { if (currentIndex > 0) { currentIndex--; updateLightboxContent(); } };
        const showNext = () => { if (currentIndex < galleryItems.length - 1) { currentIndex++; updateLightboxContent(); } };

        const handleLightboxKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            galleryItems.push(item);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    }
    
    // --- 7. Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formStatus = document.getElementById('form-status');
            formStatus.textContent = 'Nachricht wird gesendet...';
            formStatus.style.color = 'var(--color-text)';

            // This is a dummy handler. In a real project, this would be an AJAX call.
            setTimeout(() => {
                formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde gesendet.';
                formStatus.style.color = 'var(--color-primary)';
                contactForm.reset();
            }, 1000);
        });
    }
});