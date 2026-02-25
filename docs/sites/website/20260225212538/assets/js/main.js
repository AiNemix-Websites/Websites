document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('is-open');
            navToggle.classList.toggle('is-active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('body-no-scroll', isOpen);
        });
    }

    // --- STICKY HEADER ---
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || '0', 10);
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (cookieBanner && !cookieConsent) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            const imagePath = galleryImages[0].src.includes('../') ? `../${imageSources[index]}` : imageSources[index];
            lightboxImage.src = imagePath;
            lightboxImage.alt = galleryImages[index].alt;
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('show');
            document.body.classList.add('body-no-scroll');
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('body-no-scroll');
            removeLightboxEventListeners();
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'ArrowLeft') prevBtn.click();
        };

        const handleBackdropClick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };

        function addLightboxEventListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
            nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));
            document.addEventListener('keydown', handleKeydown);
            lightbox.addEventListener('click', handleBackdropClick);
        }

        function removeLightboxEventListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', () => showImage(currentImageIndex - 1));
            nextBtn.removeEventListener('click', () => showImage(currentImageIndex + 1));
            document.removeEventListener('keydown', handleKeydown);
            lightbox.removeEventListener('click', handleBackdropClick);
        }
    }

    // --- CAROUSEL ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.parentElement.querySelector('.prev');
        const nextBtn = carousel.parentElement.querySelector('.next');
        const dotsContainer = document.getElementById('carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].clientWidth;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            updateDots();
        };

        const createDots = () => {
            if (!dotsContainer) return;
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }

        createDots();
        updateCarousel();
        window.addEventListener('resize', updateCarousel);
    }

    // --- STICKY CTA BAR ---
    const stickyBar = document.getElementById('sticky-cta-bar');
    if(stickyBar) {
        const handleStickyBarScroll = () => {
            const showPoint = window.innerHeight * 0.5; // Show after 50% of viewport height scrolled
            const hidePoint = document.body.scrollHeight - window.innerHeight - 200; // Hide 200px before footer
            if (window.scrollY > showPoint && window.scrollY < hidePoint) {
                stickyBar.classList.add('show');
            } else {
                stickyBar.classList.remove('show');
            }
        };
        window.addEventListener('scroll', handleStickyBarScroll, { passive: true });
    }
});