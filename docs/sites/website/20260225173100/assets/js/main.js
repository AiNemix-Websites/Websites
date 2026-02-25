document.addEventListener('DOMContentLoaded', function() {

    // --- GLOBAL UTILITIES ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- STICKY HEADER ---
    const header = select('#site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- MOBILE MENU ---
    const menuToggle = select('.mobile-menu-toggle');
    const mobileMenu = select('#mobile-menu');
    const menuClose = select('.mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            mobileMenu.classList.toggle('open', open);
            menuToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        menuToggle.addEventListener('click', () => toggleMenu(true));
        menuClose.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('keydown', (e) => e.key === 'Escape' && mobileMenu.classList.contains('open') && toggleMenu(false));
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = selectAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const cookieAccept = select('#cookie-accept');
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }
    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- LIGHTBOX GALLERY ---
    const lightbox = select('#km-lightbox');
    const lightboxImage = select('#km-lightbox-image');
    const galleryImages = selectAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && lightboxImage && galleryImages.length > 0) {
        const imageSources = Array.from(galleryImages).map(img => ({ src: img.dataset.kmImage, alt: img.alt }));

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('open');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleLightboxKeys);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleLightboxKeys);
        };

        const updateLightboxImage = () => {
            lightboxImage.src = imageSources[currentImageIndex].src.startsWith('..') ? imageSources[currentImageIndex].src : `../${imageSources[currentImageIndex].src}`;
            lightboxImage.alt = imageSources[currentImageIndex].alt;
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageSources.length;
            updateLightboxImage();
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            updateLightboxImage();
        };

        const handleLightboxKeys = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        galleryImages.forEach((img, index) => {
            img.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        select('.km-lightbox-close').addEventListener('click', closeLightbox);
        select('.km-lightbox-next').addEventListener('click', showNextImage);
        select('.km-lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
    }

    // --- INTERACTIVE HOUSE (HOME PAGE) ---
    const hotspots = selectAll('.hotspot');
    if (hotspots.length > 0) {
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', () => {
                const areaId = hotspot.dataset.area;
                selectAll('.area-description').forEach(desc => desc.classList.remove('active'));
                selectAll('.hotspot').forEach(hs => hs.classList.remove('active'));
                select(`#area-${areaId}`).classList.add('active');
                hotspot.classList.add('active');
            });
        });
    }

    // --- TESTIMONIAL CAROUSEL (REFERENCES PAGE) ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const prevButton = select('.carousel-prev');
        const nextButton = select('.carousel-next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });
        
        // Add touch support
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        carousel.addEventListener('touchend', e => { 
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }

    // --- STICKY CTA & BACK TO TOP ---
    const stickyCta = select('#sticky-cta');
    const backToTop = select('#back-to-top');
    if (stickyCta || backToTop) {
        window.addEventListener('scroll', () => {
            const shouldBeVisible = window.scrollY > 400;
            if (stickyCta) stickyCta.classList.toggle('visible', shouldBeVisible);
            if (backToTop) backToTop.classList.toggle('visible', shouldBeVisible);
        });
    }
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

});