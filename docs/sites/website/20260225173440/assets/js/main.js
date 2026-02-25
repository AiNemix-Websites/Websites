document.addEventListener('DOMContentLoaded', () => {

    // --- PREFERS REDUCED MOTION CHECK ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- STICKY HEADER ---
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

    // --- MOBILE MENU ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMenu = (open) => {
        document.body.classList.toggle('mobile-menu-open', open);
        document.body.classList.toggle('scroll-locked', open);
        menuToggle.setAttribute('aria-expanded', open);
        if(open) {
            mobileMenu.querySelector('a, button').focus();
        }
    };

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
        menuClose.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    if (!prefersReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-on-scroll-stagger');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('reveal-on-scroll-stagger')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.transitionDelay = `${i * 100}ms`;
                        }
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- ACCORDION ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
        });
    });

    // --- STICKY CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero-section');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                stickyCTA.classList.toggle('visible', !entry.isIntersecting && window.scrollY > 200);
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('visible'), 10);
            }
        }, 1000);

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentGallery = [];
        let currentIndex = -1;

        const galleryItems = document.querySelectorAll('[data-lightbox-src]');

        const updateLightbox = () => {
            if (currentIndex >= 0 && currentIndex < currentGallery.length) {
                const item = currentGallery[currentIndex];
                const src = item.getAttribute('data-lightbox-src');
                const alt = item.querySelector('img')?.alt || 'Referenzbild';
                lightboxImg.src = src.startsWith('..') ? src : `../${src}`.replace('../assets', 'assets');
                // Adjust path for root vs subpages
                const pageDepth = window.location.pathname.split('/').length - 2;
                let imagePath = item.getAttribute('data-lightbox-src');
                if (pageDepth > 0) {
                    imagePath = `../${imagePath}`;
                }
                lightboxImg.src = imagePath;
                lightboxImg.alt = alt;
            }
        };

        const openLightbox = (el) => {
            const group = el.getAttribute('data-lightbox-group');
            currentGallery = Array.from(document.querySelectorAll(`[data-lightbox-group='${group}']`));
            currentIndex = currentGallery.indexOf(el);
            updateLightbox();
            lightbox.classList.add('visible');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            lightboxImg.src = ''; // Clear src to stop loading
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGallery.length - 1;
            updateLightbox();
        };

        const showNext = () => {
            currentIndex = (currentIndex < currentGallery.length - 1) ? currentIndex + 1 : 0;
            updateLightbox();
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(item);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});