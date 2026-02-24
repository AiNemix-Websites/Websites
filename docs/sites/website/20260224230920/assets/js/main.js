document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
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

    // --- Mobile Menu ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    const openMenu = () => {
        mobileMenu.classList.add('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('scroll-locked');
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('scroll-locked');
    };

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', openMenu);
    }
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animation ---
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

    // --- Testimonial Carousel ---
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
        
        // Make carousel transition smooth for JS navigation
        carousel.style.transition = 'transform 0.4s ease-in-out';
        updateDots();
    }

    // --- Cookie Banner ---
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

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    const showLightbox = (index) => {
        currentImageIndex = index;
        const imageSrc = galleryImages[currentImageIndex].dataset.kmImage;
        const imageAlt = galleryImages[currentImageIndex].alt;
        lightboxImg.src = galleryImages[currentImageIndex].src.replace('../', ''); // Use src for display, ensure correct path
        lightboxImg.alt = imageAlt;
        lightbox.classList.add('show');
        document.body.classList.add('scroll-locked');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const hideLightbox = () => {
        lightbox.classList.remove('show');
        document.body.classList.remove('scroll-locked');
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const showNextImage = () => {
        const newIndex = (currentImageIndex + 1) % galleryImages.length;
        showLightbox(newIndex);
    };

    const showPrevImage = () => {
        const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        showLightbox(newIndex);
    };

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    };

    if (lightbox) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => showLightbox(index));
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', hideLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});