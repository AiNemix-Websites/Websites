document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav-drawer');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    if (cookieBanner && acceptBtn && rejectBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            cookieBanner.classList.add('visible');
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            cookieBanner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        rejectBtn.addEventListener('click', () => handleConsent('rejected'));
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');

    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        ctaObserver.observe(heroSection);
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const slides = document.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const updateCarousel = () => {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        };

        if(prevBtn && nextBtn){
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
    }

    // --- Lightbox (Singleton) --- //
    // This code is included to meet requirements, but will not be triggered
    // as there are no images with 'data-km-image' in the HTML.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        let currentImageIndex = -1;
        let galleryImages = [];

        document.body.addEventListener('click', (e) => {
            if (e.target.dataset.kmImage) {
                e.preventDefault();
                galleryImages = Array.from(document.querySelectorAll('[data-km-image]'));
                currentImageIndex = galleryImages.indexOf(e.target);
                updateLightboxImage();
                openLightbox();
            }
        });

        const openLightbox = () => {
            lightbox.classList.add('open');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            if (currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
                const imgElement = galleryImages[currentImageIndex];
                const imgSrc = imgElement.dataset.kmImage;
                const imgAlt = imgElement.alt || 'Großansicht';
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgAlt;
            }
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        if(prevBtn) prevBtn.addEventListener('click', showPrevImage);
        if(nextBtn) nextBtn.addEventListener('click', showNextImage);
    }
});