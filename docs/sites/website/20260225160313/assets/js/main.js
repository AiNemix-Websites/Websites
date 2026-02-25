document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');

    if (mobileNavToggle && mobileNavContainer) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavContainer.classList.toggle('is-open');
            document.body.classList.toggle('scroll-locked');
        });

        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                mobileNavToggle.setAttribute('aria-expanded', 'false');
                mobileNavContainer.classList.remove('is-open');
                document.body.classList.remove('scroll-locked');
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        let slideWidth = slides[0].offsetWidth;

        const updateSlideWidth = () => {
            slideWidth = slides[0].offsetWidth;
        };

        window.addEventListener('resize', updateSlideWidth);

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.setAttribute('aria-hidden', 'false');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    if (lightbox && lightboxImage && galleryItems.length > 0) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        const openLightbox = (index) => {
            currentIndex = index;
            const imageSrc = galleryItems[currentIndex].getAttribute('href');
            lightboxImage.setAttribute('src', imageSrc);
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImage.setAttribute('src', '');
            document.body.classList.remove('scroll-locked');
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
            openLightbox(currentIndex);
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
            openLightbox(currentIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.getAttribute('aria-hidden') === 'false') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'false');
                } else {
                    stickyCTA.classList.remove('is-visible');
                    stickyCTA.setAttribute('aria-hidden', 'true');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});