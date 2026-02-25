document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNav = document.getElementById('mobile-nav');

    const openMenu = () => {
        mobileNavOverlay.classList.add('open');
        mobileNav.classList.add('open');
        document.body.classList.add('scroll-locked');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuClose.focus();
    };

    const closeMenu = () => {
        mobileNavOverlay.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.classList.remove('scroll-locked');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
    };

    if (menuToggle && mobileNavOverlay && mobileNav && menuClose) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.getElementById('carousel-next');
        const prevBtn = document.getElementById('carousel-prev');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        const nextSlide = () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        };

        const prevSlide = () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        };

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Touch/Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextSlide();
            if (touchendX > touchstartX) prevSlide();
        });
    }

    // --- 5. FAQ Accordion --- //
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = '1rem';
            } else {
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
            }
        });
    });

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- 7. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- 8. Lightbox (Global Singleton) --- //
    // NOTE: No images on the page, so no triggers are set up.
    // The functionality is here and ready if images are added.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        let imageGallery = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= imageGallery.length) return;
            currentIndex = index;
            const imagePath = imageGallery[index];
            lightboxImage.src = imagePath; // On subpages, this needs prefixing
            lightboxImage.setAttribute('data-km-image', imagePath);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            lightboxImage.src = ''; // Clear src to stop loading
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });

        // Example of how to set it up:
        // const galleryTriggers = document.querySelectorAll('[data-gallery-item]');
        // imageGallery = Array.from(galleryTriggers).map(el => el.getAttribute('href'));
        // galleryTriggers.forEach((trigger, index) => {
        //     trigger.addEventListener('click', (e) => {
        //         e.preventDefault();
        //         openLightbox(index);
        //     });
        // });
    }

});