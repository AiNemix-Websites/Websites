document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    if (mobileMenuToggle && mobileMenuDrawer) {
        const toggleMenu = (isOpen) => {
            const expanded = isOpen === undefined ? mobileMenuToggle.getAttribute('aria-expanded') === 'false' : isOpen;
            mobileMenuToggle.setAttribute('aria-expanded', expanded);
            mobileMenuDrawer.classList.toggle('is-open', expanded);
            mobileMenuDrawer.setAttribute('aria-hidden', !expanded);
            document.body.classList.toggle('no-scroll', expanded);
        };

        mobileMenuToggle.addEventListener('click', () => toggleMenu());
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuDrawer.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- 4. Testimonial Carousel --- //
    const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
    if (carouselWrapper) {
        const carousel = carouselWrapper.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = carouselWrapper.querySelector('.carousel-prev');
        const nextButton = carouselWrapper.querySelector('.carousel-next');
        const dotsContainer = carouselWrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX && currentIndex < slides.length - 1) {
                currentIndex++;
                updateCarousel();
            }
            if (touchendX > touchstartX && currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        updateCarousel();
    }

    // --- 5. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- 6. Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxCloseBtn = lightbox ? lightbox.querySelector('.km-lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.km-lightbox-backdrop') : null;

    if (lightbox && lightboxImg && lightboxCloseBtn && lightboxBackdrop) {
        const imageContainers = document.querySelectorAll('[data-km-image-container]');

        const openLightbox = (imgPath, altText) => {
            lightboxImg.src = imgPath;
            lightboxImg.alt = altText;
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleLightboxKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleLightboxKeydown);
        };

        const handleLightboxKeydown = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        imageContainers.forEach(container => {
            const img = container.querySelector('img[data-km-image]');
            if (img) {
                container.style.cursor = 'pointer';
                container.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(img.getAttribute('data-km-image').replace('../', ''), img.alt);
                });
            }
        });

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    // --- 7. Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('is-visible');
                } else {
                    stickyCta.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});