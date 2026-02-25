document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.sticky-header');
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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
        });

        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });

        // Close on backdrop click
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

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
        const wrapper = carousel.querySelector('.carousel-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        const updateCarousel = () => {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel(); // Initial state
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- Sticky CTA Bar --- //
    const stickyCta = document.querySelector('.sticky-cta-bar');
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
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.classList.add('show');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    let galleryImages = Array.from(lightboxTriggers).map(img => img.dataset.kmImage);
    let currentImageIndex = 0;

    if (lightbox && lightboxImg && lightboxTriggers.length > 0) {
        const openLightbox = (index) => {
            currentImageIndex = index;
            const imagePath = galleryImages[index];
            const relativePath = lightbox.getAttribute('data-relative-path') || '';
            lightboxImg.src = relativePath + imagePath;
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = ''; // Clear src to stop loading
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            openLightbox(currentImageIndex);
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentImageIndex);
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                // Determine relative path for assets based on page depth
                const pathPrefix = window.location.pathname.includes('/reparaturen/') || window.location.pathname.includes('/ueber-uns/') ? '../' : '';
                lightbox.setAttribute('data-relative-path', pathPrefix);
                openLightbox(index);
            });
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});