document.addEventListener('DOMContentLoaded', () => {

    // --- Helper: Scroll Lock --- //
    const body = document.body;
    const lockScroll = () => body.classList.add('scroll-locked');
    const unlockScroll = () => body.classList.remove('scroll-locked');

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial check
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('#mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            lockScroll();
        };
        const closeMenu = () => {
            mobileNavMenu.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            unlockScroll();
        };

        mobileNavToggle.addEventListener('click', () => {
            if (mobileNavMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        mobileNavMenu.querySelector('.mobile-nav-close').addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => e.key === 'Escape' && closeMenu());
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dotsContainer.querySelectorAll('button').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        prevButton.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        nextButton.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });
        
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
        carousel.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextButton.click();
            if (touchStartX - touchEndX < -50) prevButton.click();
        });

        goToSlide(0);
    }

    // --- Back to Top & Sticky CTA --- //
    const backToTopButton = document.querySelector('.back-to-top');
    const stickyCTA = document.querySelector('.sticky-cta');
    if (backToTopButton || stickyCTA) {
        const onScrollUI = () => {
            const isVisible = window.scrollY > 300;
            if (backToTopButton) backToTopButton.classList.toggle('visible', isVisible);
            if (stickyCTA) stickyCTA.classList.toggle('visible', isVisible);
        };
        window.addEventListener('scroll', onScrollUI, { passive: true });
        if (backToTopButton) backToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        onScrollUI();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('visible'), 10);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.lightbox-close');
        const prevButton = lightbox.querySelector('.lightbox-prev');
        const nextButton = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = -1;

        const updateImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            const imageElement = galleryImages[index];
            const imagePath = imageElement.dataset.kmImage;
            const altText = imageElement.alt || 'Galeriebild';
            lightboxImage.src = imageElement.src.replace(imageElement.dataset.kmImage, imagePath); // Ensure correct relative path
            lightboxImage.alt = altText;
            currentIndex = index;
            prevButton.style.display = (index === 0) ? 'none' : 'block';
            nextButton.style.display = (index === galleryImages.length - 1) ? 'none' : 'block';
        };

        const openLightbox = (clickedImage) => {
            galleryImages = Array.from(document.querySelectorAll('.clickable-image, [data-km-image]'));
            const clickedIndex = galleryImages.findIndex(img => img === clickedImage);
            if (clickedIndex === -1) return;

            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            updateImage(clickedIndex);
            lockScroll();
            closeButton.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImage.src = '';
            unlockScroll();
        };

        document.body.addEventListener('click', (e) => {
            const target = e.target.closest('.clickable-image, [data-km-image]');
            if (target) {
                e.preventDefault();
                openLightbox(target);
            }
        });

        closeButton.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', () => updateImage(currentIndex - 1));
        nextButton.addEventListener('click', () => updateImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevButton.click();
                if (e.key === 'ArrowRight') nextButton.click();
            }
        });
    }
});