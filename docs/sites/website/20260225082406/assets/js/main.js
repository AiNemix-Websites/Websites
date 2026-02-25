document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITIES ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- STICKY HEADER ---
    const header = select('#main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE MENU ---
    const menuToggle = select('#mobile-menu-toggle');
    const menuClose = select('#mobile-menu-close');
    const mobileMenu = select('#mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('scroll-locked');
        });

        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('scroll-locked');
        });

        // Close on ESC
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('scroll-locked');
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = selectAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ ACCORDION ---
    const faqItems = selectAll('.faq-item');
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

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const nextBtn = select('.carousel-btn.next');
        const prevBtn = select('.carousel-btn.prev');
        const dotsContainer = select('.carousel-dots');
        let currentIndex = 0;
        let dots = [];

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const acceptBtn = select('#cookie-accept');
    const declineBtn = select('#cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- CONTACT FORM ---
    const contactForm = select('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusEl = select('#form-status');
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            // In a real scenario, you would send the form data here.
            setTimeout(() => {
                statusEl.textContent = 'Nachricht erfolgreich (simuliert) gesendet!';
                contactForm.reset();
            }, 2000);
        });
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = select('#km-lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const galleryItems = selectAll('.gallery-item');
    let currentImageIndex = 0;
    const imageSources = Array.from(galleryItems).map(item => item.dataset.kmImage);

    function showLightbox(index) {
        currentImageIndex = index;
        const relativePath = galleryItems[0].src.includes('../') ? '../' : '';
        lightboxContent.src = relativePath + imageSources[currentImageIndex];
        lightbox.classList.add('visible');
        document.body.classList.add('scroll-locked');
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        document.body.classList.remove('scroll-locked');
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % imageSources.length;
        showLightbox(currentImageIndex);
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
        showLightbox(currentImageIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => showLightbox(index));
    });

    lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
    lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
    lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('visible')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
});