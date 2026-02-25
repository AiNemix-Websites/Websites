document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
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
    }

    // --- 2. MOBILE NAVIGATION --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
            mobileNavMenu.querySelector('.mobile-nav-close').focus();
        };
        const closeMenu = () => {
            mobileNavMenu.classList.remove('is-open');
            mobileNavMenu.setAttribute('aria-hidden', 'true');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
            mobileNavToggle.focus();
        };

        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavMenu.querySelector('.mobile-nav-close').addEventListener('click', closeMenu);
        mobileNavMenu.querySelector('.mobile-nav-backdrop').addEventListener('click', closeMenu);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 4. TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dotsContainer = document.querySelector('.carousel-dots');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        if (slides.length > 0) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.dot');

            const goToSlide = (index) => {
                slides[currentIndex].classList.remove('active');
                dots[currentIndex].classList.remove('active');
                currentIndex = (index + slides.length) % slides.length;
                slides[currentIndex].style.display = 'none'; // Hide all
                slides[currentIndex].style.display = 'flex'; // Show current
                slides[currentIndex].classList.add('active');
                dots[currentIndex].classList.add('active');
            };

            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

            // Hide all slides initially except the first one
            slides.forEach((slide, index) => {
                slide.style.display = index === 0 ? 'flex' : 'none';
            });

            goToSlide(0);
        }
    }

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'block';
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- 6. STICKY CONTEXT CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const handleStickyCTAScroll = () => {
            // Show after scrolling past 800px, but hide if footer is in view
            const footer = document.querySelector('.site-footer-main');
            const footerInView = footer.getBoundingClientRect().top < window.innerHeight;
            if (window.scrollY > 800 && !footerInView) {
                stickyCTA.style.display = 'block';
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
                // Use timeout to allow fade-out animation before hiding
                setTimeout(() => { 
                    if (!stickyCTA.classList.contains('visible')) {
                        stickyCTA.style.display = 'none';
                    }
                }, 300);
            }
        };
        window.addEventListener('scroll', handleStickyCTAScroll, { passive: true });
    }

    // --- 7. GLOBAL LIGHTBOX (STRUCTURE ONLY) ---
    // This code is ready but won't be triggered as there are no images with the required data attributes.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'block';
            document.body.classList.add('scroll-locked');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('scroll-locked');
        };

        const updateLightboxImage = () => {
            if (galleryImages[currentIndex]) {
                lightboxImage.src = galleryImages[currentIndex].dataset.kmImage;
                lightboxImage.alt = galleryImages[currentIndex].alt || '';
            }
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.dataset.kmImage) {
                e.preventDefault();
                galleryImages = Array.from(document.querySelectorAll('[data-km-image]'));
                const index = galleryImages.findIndex(img => img.dataset.kmImage === e.target.dataset.kmImage);
                if (index > -1) openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    }
});