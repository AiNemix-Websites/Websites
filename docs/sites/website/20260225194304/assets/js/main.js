document.addEventListener('DOMContentLoaded', function() {

    // --- Global State ---
    const body = document.body;

    // --- Sticky Header ---
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

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            body.classList.toggle('no-scroll', isOpen);
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                menuToggle.click();
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Before & After Image Slider ---
    const slider = document.querySelector('.image-comparison-slider');
    if (slider) {
        const afterImage = slider.querySelector('.after-image');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            const percentage = (newX / rect.width) * 100;
            handle.style.left = percentage + '%';
            afterImage.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        };

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);

        slider.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        slider.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-controls .next');
        const prevButton = document.querySelector('.carousel-controls .prev');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX);
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = -1;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');

        const showImage = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentImageIndex = index;
            const imgSrc = galleryItems[index].dataset.kmImage;
            const imgAlt = galleryItems[index].alt;
            lightboxImg.src = galleryItems[index].src.replace('../',''); // Ensure correct path
            lightboxImg.alt = imgAlt;
            lightbox.classList.add('show');
            body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            body.classList.remove('no-scroll');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => showImage(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage((currentImageIndex - 1 + galleryItems.length) % galleryItems.length));
        nextBtn.addEventListener('click', () => showImage((currentImageIndex + 1) % galleryItems.length));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }
    
    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});