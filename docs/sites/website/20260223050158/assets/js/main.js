document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Mobile Navigation --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (mobileMenuToggle && mobileDrawer) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.classList.toggle('active');
            mobileDrawer.classList.toggle('open');
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('scroll-locked', isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                mobileMenuToggle.click();
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- Testimonials Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
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

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                    stickyCTA.hidden = false;
                } else {
                    stickyCTA.classList.remove('visible');
                    stickyCTA.hidden = true;
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.hidden = false;
            document.body.classList.add('scroll-locked');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('scroll-locked');
        };

        const updateLightboxImage = () => {
            if (galleryImages.length > 0) {
                const imgElement = galleryImages[currentIndex];
                const src = imgElement.dataset.kmImage;
                const alt = imgElement.alt;
                lightboxImage.src = src.startsWith('..') ? src : `../${src}`.replace('../assets', 'assets'); // Adjust path for subpages
                lightboxImage.alt = alt;
            }
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        document.querySelectorAll('.gallery-image').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }
});