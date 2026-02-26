document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            mobileNavMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
        });
    }

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
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

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            document.querySelectorAll('.dots span').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('span');
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

        updateCarousel(); // Initial call
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const triggers = document.querySelectorAll('.lightbox-trigger');
        let currentIndex = 0;
        let gallery = [];

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = gallery[currentIndex];
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : gallery.length - 1;
            lightboxImg.src = gallery[currentIndex];
            updateLightboxNav();
        };

        const showNext = () => {
            currentIndex = (currentIndex < gallery.length - 1) ? currentIndex + 1 : 0;
            lightboxImg.src = gallery[currentIndex];
            updateLightboxNav();
        };

        const updateLightboxNav = () => {
            prevBtn.style.display = gallery.length > 1 ? 'block' : 'none';
            nextBtn.style.display = gallery.length > 1 ? 'block' : 'none';
        };

        triggers.forEach((trigger, index) => {
            const imagePath = trigger.dataset.kmImage || trigger.src;
            gallery.push(imagePath);
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(gallery.indexOf(imagePath));
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- Sticky CTA Bar ---
    const stickyCtaBar = document.querySelector('.sticky-cta-bar');
    if (stickyCtaBar) {
        const showCtaThreshold = 400; // Pixels from top to show the bar
        window.addEventListener('scroll', () => {
            if (window.scrollY > showCtaThreshold) {
                stickyCtaBar.classList.add('visible');
            } else {
                stickyCtaBar.classList.remove('visible');
            }
        });
    }

});