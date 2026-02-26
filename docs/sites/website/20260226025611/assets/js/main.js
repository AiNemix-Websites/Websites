document.addEventListener('DOMContentLoaded', function() {

    // --- 1. HEADER & MOBILE MENU --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Sticky Header Shrink
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- 2. COOKIE BANNER --- //
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

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- 4. BEFORE/AFTER IMAGE SLIDER --- //
    const slider = document.getElementById('image-comparison-slider');
    if (slider) {
        const beforeWrapper = slider.querySelector('.before-image-wrapper');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        const startDrag = () => isDragging = true;
        const stopDrag = () => isDragging = false;

        const onDrag = (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            let x = (e.clientX || e.touches[0].clientX) - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;
            beforeWrapper.style.width = `${percent}%`;
            handle.style.left = `${percent}%`;
        };

        handle.addEventListener('mousedown', startDrag);
        handle.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag, { passive: true });
    }

    // --- 5. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('#gallery-grid .gallery-item');
    let currentImageIndex = 0;
    let galleryImages = [];

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img) {
                const imagePath = img.getAttribute('data-km-image');
                const altText = img.getAttribute('alt');
                galleryImages.push({ src: imagePath, alt: altText });

                item.addEventListener('click', () => {
                    currentImageIndex = index;
                    openLightbox();
                });
            }
        });

        const updateImage = () => {
            const relativePath = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';
            lightboxImg.src = relativePath + galleryImages[currentImageIndex].src;
            lightboxImg.alt = galleryImages[currentImageIndex].alt;
        };

        const openLightbox = () => {
            updateImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrev = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        };

        const showNext = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- 6. TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.getElementById('carousel-prev');
        const nextBtn = document.getElementById('carousel-next');
        let currentIndex = 0;

        const showSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });
    }

    // --- 7. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});