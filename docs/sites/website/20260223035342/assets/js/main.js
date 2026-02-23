document.addEventListener('DOMContentLoaded', function() {

    // --- HEADER & NAVIGATION --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Sticky Header
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // Mobile Menu
    if (mobileMenuToggle && mainNav) {
        mainNav.classList.add('mobile-open'); // Add class for mobile styling
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
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

    // --- CAROUSEL --- //
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            const offset = -currentIndex * slides[0].offsetWidth;
            carouselContainer.style.transform = `translateX(${offset}px)`;
            carouselContainer.style.transition = 'transform 0.5s ease';
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (index === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        if (slides.length > 0) {
            updateDots();
            // Basic swipe support
            let touchstartX = 0;
            let touchendX = 0;
            carouselContainer.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
            carouselContainer.addEventListener('touchend', e => {
                touchendX = e.changedTouches[0].screenX;
                if (touchendX < touchstartX) nextBtn.click();
                if (touchendX > touchstartX) prevBtn.click();
            });
        }
    }

    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const closeLightboxBtn = lightbox.querySelector('.close-lightbox');
    const prevLightboxBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextLightboxBtn = lightbox.querySelector('.lightbox-nav.next');
    const clickableImages = document.querySelectorAll('.clickable-image');
    let currentImageIndex = 0;
    let galleryImages = [];

    function openLightbox(index) {
        currentImageIndex = index;
        const imgPath = galleryImages[currentImageIndex].dataset.kmImage;
        lightboxImg.src = galleryImages[currentImageIndex].src.replace('..', '.');
        lightboxImg.alt = galleryImages[currentImageIndex].alt;
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentImageIndex);
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openLightbox(currentImageIndex);
    }

    if (lightbox) {
        clickableImages.forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeLightboxBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevLightboxBtn.addEventListener('click', showPrevImage);
        nextLightboxBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Sende...';
            // This is a dummy form handler. In a real project, this would send data to a server.
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                contactForm.reset();
            }, 1000);
        });
    }
});