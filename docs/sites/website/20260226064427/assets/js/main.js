document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const openMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.add('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        }
    };

    const closeMenu = () => {
        if (mobileNavMenu) {
            mobileNavMenu.classList.remove('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'true');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMenu);
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
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

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;

    if (lightbox && lightboxImage && galleryItems.length > 0) {
        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        };

        const openLightbox = (index) => {
            currentImageIndex = index;
            const imgSrc = galleryItems[currentImageIndex].getAttribute('src');
            const imgAlt = galleryItems[currentImageIndex].getAttribute('alt');
            lightboxImage.setAttribute('src', imgSrc);
            lightboxImage.setAttribute('alt', imgAlt);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const showNextImage = () => {
            const nextIndex = (currentImageIndex + 1) % galleryItems.length;
            openLightbox(nextIndex);
        };

        const showPrevImage = () => {
            const prevIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(prevIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-backdrop').addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.km-lightbox-prev').addEventListener('click', showPrevImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
    
    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if(!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero, .page-hero');
        if(heroSection) {
             ctaObserver.observe(heroSection);
        }
    }

    // --- FAQ Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0px';
            }
        });
    });

});