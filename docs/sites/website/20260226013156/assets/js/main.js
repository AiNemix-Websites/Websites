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
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
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

    // --- Testimonials Carousel --- //
    const carousel = document.getElementById('testimonials-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
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
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent && cookieBanner) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        
        const heroSection = document.querySelector('.hero');
        if(heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('img[data-km-image]');
    let currentImageIndex = 0;
    const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);

    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');

        function openLightbox(index) {
            currentImageIndex = index;
            const imagePath = imageSources[currentImageIndex];
            const relativePath = lightbox.dataset.isSubpage === 'true' ? `../${imagePath}` : imagePath;
            lightboxImg.src = relativePath;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 350);
            document.body.classList.remove('no-scroll');
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageSources.length - 1;
            openLightbox(currentImageIndex);
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex < imageSources.length - 1) ? currentImageIndex + 1 : 0;
            openLightbox(currentImageIndex);
        }

        galleryImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
        
        // Check if on a subpage to adjust image paths
        if (window.location.pathname !== '/' && window.location.pathname.endsWith('/')) {
            lightbox.dataset.isSubpage = 'true';
        }
    }
});