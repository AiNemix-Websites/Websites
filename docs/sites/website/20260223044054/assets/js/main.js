document.addEventListener('DOMContentLoaded', () => {

    // --- Header & Mobile Navigation ---
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const body = document.body;

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            body.classList.toggle('mobile-menu-open');
            const isExpanded = body.classList.contains('mobile-menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
            body.classList.toggle('no-scroll', isExpanded);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger effect for elements in the same container
                const container = entry.target.closest('.stagger');
                if (container) {
                    const elements = Array.from(container.querySelectorAll('.scroll-reveal'));
                    elements.forEach((el, index) => {
                        el.style.transitionDelay = `${index * 100}ms`;
                        el.classList.add('is-visible');
                    });
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const galleryContainer = document.getElementById('gallery-container');
    let galleryItems = [];
    let currentImageIndex = -1;

    const openLightbox = (index) => {
        if (index < 0 || index >= galleryItems.length) return;
        currentImageIndex = index;
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const imagePath = img.getAttribute('data-km-image');
        const altText = img.getAttribute('alt');
        
        // Adjust path for subpages
        const pageDepth = window.location.pathname.split('/').length - 2;
        const prefix = '../'.repeat(pageDepth > 0 ? pageDepth : 0);
        lightboxImage.src = prefix + imagePath;

        lightboxImage.alt = altText;
        lightbox.hidden = false;
        document.body.classList.add('no-scroll');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.hidden = true;
        document.body.classList.remove('no-scroll');
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryItems.length);
    const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryItems.length) % galleryItems.length);

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    };

    if (galleryContainer && lightbox) {
        galleryItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
        lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
    }

    // --- Sticky CTA Bar ---
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCtaBar.classList.add('visible');
                } else {
                    stickyCtaBar.classList.remove('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});