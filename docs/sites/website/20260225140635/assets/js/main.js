document.addEventListener('DOMContentLoaded', function() {

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

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav-drawer');
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isOpened = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpened);
            document.body.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('no-scroll');
        });

        // Close on backdrop click
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('mobile-menu-open') && e.target === document.body) {
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('mobile-menu-open');
                document.body.classList.remove('no-scroll');
            }
        });

        // Close with ESC key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('mobile-menu-open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Optional: close all others
            // faqItems.forEach(i => i.classList.remove('active'));
            if (!wasActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('span');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

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

        updateCarousel(); // Initial setup
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Global Lightbox (Singleton) ---
    // This is a simplified example. A production site might need more features.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        let galleryImages = [];
        let currentIndex = 0;

        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-km-image]')) {
                e.preventDefault();
                const clickedImg = e.target.closest('img, div');
                const imagePath = clickedImg.dataset.kmImage;
                
                // Find all gallery images in the same context (e.g., section)
                const gallery = clickedImg.closest('section');
                galleryImages = gallery ? Array.from(gallery.querySelectorAll('[data-km-image]')) : [clickedImg];
                currentIndex = galleryImages.indexOf(clickedImg);

                updateLightboxImage(imagePath);
                showLightbox();
            }
        });

        function updateLightboxImage(path) {
            if (path) lightboxImg.src = path;
        }

        function showLightbox() {
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            addLightboxListeners();
        }

        function hideLightbox() {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            removeLightboxListeners();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            const nextImg = galleryImages[currentIndex];
            updateLightboxImage(nextImg.dataset.kmImage);
        }

        function showPrevImage() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            const prevImg = galleryImages[currentIndex];
            updateLightboxImage(prevImg.dataset.kmImage);
        }

        function addLightboxListeners() {
            closeBtn.addEventListener('click', hideLightbox);
            lightbox.addEventListener('click', e => { if (e.target === lightbox) hideLightbox(); });
            document.addEventListener('keydown', handleKeydown);
            lightbox.querySelector('.next-lightbox')?.addEventListener('click', showNextImage);
            lightbox.querySelector('.prev-lightbox')?.addEventListener('click', showPrevImage);
        }

        function removeLightboxListeners() {
            closeBtn.removeEventListener('click', hideLightbox);
            // This simple implementation doesn't remove the backdrop click listener to avoid complexity.
            document.removeEventListener('keydown', handleKeydown);
            lightbox.querySelector('.next-lightbox')?.removeEventListener('click', showNextImage);
            lightbox.querySelector('.prev-lightbox')?.removeEventListener('click', showPrevImage);
        }
    }
});