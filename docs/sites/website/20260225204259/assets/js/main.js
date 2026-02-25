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
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.reveal === 'stagger' ? index * 100 : 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Lightbox (Global Singleton) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-btn');
        const lightboxImg = lightbox.querySelector('img');
        let currentGallery = [];
        let currentIndex = -1;

        const openLightbox = (galleryItems, index) => {
            currentGallery = galleryItems;
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
            currentGallery = [];
            currentIndex = -1;
        };

        const updateLightboxImage = () => {
            if (currentIndex >= 0 && currentIndex < currentGallery.length) {
                const item = currentGallery[currentIndex];
                const imgSrc = item.dataset.kmImage; // Use data-km-image for the full-size image
                const imgAlt = item.querySelector('img')?.alt || 'Galeriebild';
                if(imgSrc) {
                    lightboxImg.src = imgSrc.startsWith('..') ? imgSrc.substring(3) : imgSrc; // Adjust path for lightbox
                    lightboxImg.alt = imgAlt;
                }
            }
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateLightboxImage();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        document.querySelectorAll('[data-km-image]').forEach((item, index, nodeList) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(Array.from(nodeList), index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightbox.querySelector('.next-btn').addEventListener('click', showNext);
        lightbox.querySelector('.prev-btn').addEventListener('click', showPrev);
    }
});