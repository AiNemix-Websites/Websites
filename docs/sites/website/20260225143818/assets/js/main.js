document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if(mobileMenu) mobileMenu.classList.add('open');
        document.body.classList.add('scroll-locked');
        if(mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        if(mobileMenu) mobileMenu.classList.remove('open');
        document.body.classList.remove('scroll-locked');
        if(mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
    };

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', openMenu);
    }

    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100); // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;

        const showSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        };

        if(nextButton) nextButton.addEventListener('click', nextSlide);
        if(prevButton) prevButton.addEventListener('click', prevSlide);
        
        // Touch support
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextSlide();
            if (touchStartX - touchEndX < -50) prevSlide();
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.km-lightbox-next');
    let galleryItems = [];
    let currentImageIndex = -1;

    const updateLightboxImage = (index) => {
        if (index >= 0 && index < galleryItems.length) {
            const item = galleryItems[index];
            const imagePath = item.getAttribute('data-km-image-path');
            const imageAlt = item.getAttribute('data-km-image-alt');
            lightboxImage.src = imagePath;
            lightboxImage.alt = imageAlt;
            currentImageIndex = index;
        }
    };

    const openLightbox = (index) => {
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('visible'), 10);
        document.body.classList.add('scroll-locked');
        updateLightboxImage(index);
        document.addEventListener('keydown', handleKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            lightboxImage.src = ''; // Clear src to stop loading
        }, 300);
        document.body.classList.remove('scroll-locked');
        document.removeEventListener('keydown', handleKeydown);
    };

    const showPrevImage = () => {
        const newIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage(newIndex);
    };

    const showNextImage = () => {
        const newIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage(newIndex);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        galleryItems.push(item);
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    if(lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
    }
});