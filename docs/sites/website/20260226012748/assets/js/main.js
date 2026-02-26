document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav');
    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            mobileNavDrawer.classList.toggle('open');
            document.body.classList.toggle('scroll-locked', isOpen);
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.toggle('open');
                question.setAttribute('aria-expanded', isOpen);
            });
        }
    });

    // --- 5. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
        updateCarousel();
    }

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'true');
        });
    }

    // --- 7. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = -1;
        let galleryImages = [];

        const galleryTriggers = document.querySelectorAll('.lightbox-trigger');
        galleryImages = Array.from(galleryTriggers);

        function openLightbox(index) {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imgElement = galleryImages[currentImageIndex];
            const imgSrc = imgElement.dataset.kmImage || imgElement.src;
            const imgAlt = imgElement.alt || 'Galeriebild';
            
            lightboxImg.src = imgElement.src.replace('..', '.'); // Adjust path for display
            lightboxImg.alt = imgAlt;
            
            lightbox.classList.add('show');
            document.body.classList.add('scroll-locked');
            prevBtn.style.display = (galleryImages.length > 1) ? 'block' : 'none';
            nextBtn.style.display = (galleryImages.length > 1) ? 'block' : 'none';
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            document.body.classList.remove('scroll-locked');
        }

        function showPrevImage() {
            const newIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
            openLightbox(newIndex);
        }

        function showNextImage() {
            const newIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
            openLightbox(newIndex);
        }

        galleryTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- 8. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        });
    }

});