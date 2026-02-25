document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeButton = document.querySelector('.mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
            mobileMenu.querySelector('a, button').focus();
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
        };

        menuToggle.addEventListener('click', openMenu);
        if (closeButton) closeButton.addEventListener('click', closeMenu);

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close on backdrop click
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
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
    }

    // --- 4. TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    }
    
    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1000);
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

    // --- 6. STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 7. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const gallery = document.getElementById('image-gallery');
    let galleryImages = [];
    let currentImageIndex = -1;

    if (lightbox && gallery) {
        galleryImages = Array.from(gallery.querySelectorAll('.gallery-image'));

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imgElement = galleryImages[index];
            const imagePath = imgElement.getAttribute('data-km-image');
            const altText = imgElement.getAttribute('alt');
            
            // Use relative path for display
            const displayPath = lightbox.contains(imgElement) ? imagePath : `../${imagePath}`.replace('../assets', 'assets');

            lightboxImage.setAttribute('src', displayPath);
            lightboxImage.setAttribute('alt', altText);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryImages.length);
        const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);

        galleryImages.forEach((img, index) => {
            img.parentElement.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.km-lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }

});