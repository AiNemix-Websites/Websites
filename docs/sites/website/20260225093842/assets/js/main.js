document.addEventListener('DOMContentLoaded', function () {

    // --- 1. STICKY HEADER & SCROLL-TO-TOP --- //
    const header = document.getElementById('main-header');
    const stickyCta = document.getElementById('sticky-cta');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 600) {
            stickyCta.classList.add('show');
        } else {
            stickyCta.classList.remove('show');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // --- 2. MOBILE MENU --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu-drawer');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const declineCookiesBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    const handleCookieConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('show');
    };

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => handleCookieConsent('accepted'));
    }
    if (declineCookiesBtn) {
        declineCookiesBtn.addEventListener('click', () => handleCookieConsent('declined'));
    }

    // --- 5. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.next-btn');
        const prevButton = document.querySelector('.prev-btn');
        const dotsNav = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    // --- 6. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.close-lightbox');
        const prevButton = lightbox.querySelector('.prev-lightbox');
        const nextButton = lightbox.querySelector('.next-lightbox');
        const imageTriggers = document.querySelectorAll('.lightbox-trigger');
        let currentImageIndex = 0;
        let galleryImages = [];

        const updateLightboxImage = (index) => {
            const imgElement = galleryImages[index];
            if (imgElement) {
                const imagePath = imgElement.dataset.kmImage;
                const altText = imgElement.alt;
                lightboxImage.src = imagePath.startsWith('..') ? imagePath : '../' + imagePath;
                lightboxImage.alt = altText;
                currentImageIndex = index;
            }
        };

        const openLightbox = (e) => {
            const clickedImage = e.currentTarget;
            galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
            const index = galleryImages.indexOf(clickedImage);
            updateLightboxImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrevImage = () => {
            const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage(newIndex);
        };

        const showNextImage = () => {
            const newIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage(newIndex);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        imageTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrevImage);
        nextButton.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});