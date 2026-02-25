document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER ---
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

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavToggle.classList.toggle('active');
            mobileNavMenu.classList.toggle('active');
            document.body.classList.toggle('body-scroll-lock');
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- BEFORE/AFTER SLIDER ---
    const slider = document.querySelector('.comparison-slider .slider');
    if (slider) {
        const afterImage = document.querySelector('.comparison-item.after');
        slider.addEventListener('input', (e) => {
            afterImage.style.width = e.target.value + '%';
        });
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const nextBtn = document.querySelector('.carousel-controls .next');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }

    // --- BACK TO TOP BUTTON ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        let currentImageIndex;
        let galleryImages = [];

        const galleryItems = document.querySelectorAll('.gallery-image');
        galleryItems.forEach((item, index) => {
            galleryImages.push(item);
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        function openLightbox(index) {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('visible');
            document.body.classList.add('body-scroll-lock');
            document.addEventListener('keydown', handleKeydown);
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            document.body.classList.remove('body-scroll-lock');
            document.removeEventListener('keydown', handleKeydown);
        }

        function updateLightboxImage() {
            const imgElement = galleryImages[currentImageIndex];
            const imgSrc = imgElement.getAttribute('data-km-image');
            const imgAlt = imgElement.getAttribute('alt');
            lightboxImg.setAttribute('src', imgElement.src.replace('..', '.')); // Adjust path for lightbox
            lightboxImg.setAttribute('alt', imgAlt);
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
            updateLightboxImage();
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
            updateLightboxImage();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});