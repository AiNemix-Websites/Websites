document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-nav');
    const menuClose = document.querySelector('.mobile-menu-close');

    const toggleMenu = (open) => {
        const isOpen = mobileMenu.classList.contains('open');
        if (open === isOpen) return;

        mobileMenu.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', open);
        document.body.classList.toggle('no-scroll', open);
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
        menuClose.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
        document.body.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Accordion (FAQ) --- //
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
                content.style.maxHeight = '0';
            }
        });
    });

    // --- 5. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('show');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- 7. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const closeStickyCTA = document.getElementById('close-sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
        closeStickyCTA.addEventListener('click', () => {
            stickyCTA.style.display = 'none';
        });
    }

    // --- 8. Lightbox (Setup, no images to trigger it yet) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const contentContainer = lightbox.querySelector('.lightbox-content');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imgPath = galleryImages[index];
            contentContainer.innerHTML = `<img src='${imgPath}' alt='Galeriebild ${index + 1}'>`;
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            contentContainer.innerHTML = '';
        };

        const showPrev = () => openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => openLightbox((currentImageIndex + 1) % galleryImages.length);

        // Event Listeners for closing
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox(); });

        // Event Listeners for navigation
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });

        // This part would activate the lightbox, but is commented out as there are no images.
        /*
        const imageElements = document.querySelectorAll('.gallery-item');
        galleryImages = Array.from(imageElements).map(el => el.dataset.kmImage);

        imageElements.forEach((el, index) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });
        */
    }
});