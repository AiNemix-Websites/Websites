document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.getElementById('mobile-nav-toggle');
    const navList = document.getElementById('main-nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('open');
            navList.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
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
        revealObserver.observe(el);
    });

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 400);
        });
    }

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('lightbox-image');
        const closeBtn = document.getElementById('lightbox-close');
        const backdrop = document.getElementById('lightbox-backdrop');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        let currentImageIndex = 0;
        let galleryImages = [];

        const updateLightboxNav = () => {
            prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'block';
            nextBtn.style.display = currentImageIndex === galleryImages.length - 1 ? 'none' : 'block';
        };

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imageElement = galleryImages[currentImageIndex];
            const imageSrc = imageElement.getAttribute('data-km-image');
            const imageAlt = imageElement.getAttribute('alt') || 'Projektbild';
            lightboxImage.setAttribute('src', imageElement.tagName === 'IMG' ? imageElement.src : imageSrc);
            lightboxImage.setAttribute('alt', imageAlt);
            updateLightboxNav();
        };

        const openLightbox = (e) => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (!trigger) return;
            e.preventDefault();
            
            const galleryName = trigger.getAttribute('data-lightbox-trigger');
            galleryImages = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryName}']`));
            const clickedIndex = galleryImages.findIndex(el => el === trigger || el.contains(trigger));

            if (clickedIndex !== -1) {
                lightbox.classList.add('visible');
                document.body.classList.add('no-scroll');
                showImage(clickedIndex);
                closeBtn.focus();
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        document.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero, .page-header');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});