document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            mobileNavMenu.querySelector('a, button').focus();
        };

        const closeMenu = () => {
            mobileNavMenu.classList.remove('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        };

        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Sticky Header --- //
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
        handleScroll();
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.dataset.reveal === 'stagger') {
                    const items = entry.target.querySelectorAll('[data-reveal-item]');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.transitionDelay = `${index * 100}ms`;
                            item.classList.add('is-visible');
                        }, 100);
                    });
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideWidth = slides[0].offsetWidth;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
            updateDots();
        };

        createDots();
        goToSlide(0);

        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        window.addEventListener('resize', () => {
             slideWidth = slides[0].offsetWidth;
             goToSlide(currentIndex);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                stickyCTA.hidden = entry.isIntersecting;
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Lightbox (Singleton) --- //
    // This code is included for future use if images are added.
    // No elements currently trigger it.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imageSrc = galleryImages[currentImageIndex].dataset.kmImage;
            const imageAlt = galleryImages[currentImageIndex].alt;
            lightboxImage.src = imageSrc;
            lightboxImage.alt = imageAlt;
            lightbox.style.display = 'flex';
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxImage.src = '';
            lightboxImage.alt = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'flex') {
                closeLightbox();
            }
        });

        // Example of how to attach it to images with a specific class
        // const imageElements = document.querySelectorAll('.gallery-image');
        // galleryImages = Array.from(imageElements);
        // galleryImages.forEach((img, index) => {
        //     img.addEventListener('click', () => openLightbox(index));
        // });
    }

});