document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mainNav.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }

    // --- Project Filter ---
    const filterContainer = document.querySelector('.project-filters');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('button');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projectCards.forEach(card => {
                    const categories = card.dataset.category.split(' ');
                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

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

    // --- Lightbox (Global Singleton) ---
    // The code is here, but will not be triggered as there are no images to click.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const lightboxImg = lightbox.querySelector('img');
        let currentImageIndex;
        let galleryImages = [];

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            const imgData = galleryImages[currentImageIndex];
            if (imgData) {
                lightboxImg.src = imgData.src;
                lightboxImg.alt = imgData.alt;
                lightboxImg.dataset.kmImage = imgData.kmImage;
            }
            prevBtn.style.display = (currentImageIndex === 0) ? 'none' : 'block';
            nextBtn.style.display = (currentImageIndex === galleryImages.length - 1) ? 'none' : 'block';
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentImageIndex > 0) { currentImageIndex--; updateLightboxImage(); }
            if (e.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) { currentImageIndex++; updateLightboxImage(); }
        };

        // Event delegation for opening the lightbox
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('[data-lightbox-gallery]')) {
                const galleryId = e.target.dataset.lightboxGallery;
                galleryImages = Array.from(document.querySelectorAll(`[data-lightbox-gallery='${galleryId}']`)).map(el => ({
                    src: el.href,
                    alt: el.dataset.alt || '',
                    kmImage: el.dataset.kmImage
                }));
                const clickedIndex = galleryImages.findIndex(img => img.src === e.target.href);
                e.preventDefault();
                openLightbox(clickedIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => { if (currentImageIndex > 0) { currentImageIndex--; updateLightboxImage(); } });
        nextBtn.addEventListener('click', () => { if (currentImageIndex < galleryImages.length - 1) { currentImageIndex++; updateLightboxImage(); } });
    }

});