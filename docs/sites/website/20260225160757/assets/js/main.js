document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
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

    // Mobile Navigation
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    if (menuToggle && mobileNavContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNavContainer.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                menuToggle.classList.remove('active');
                mobileNavContainer.classList.remove('open');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // Scroll Animations
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // FAQ Accordion
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

    // Testimonial Carousel
    const carouselContainer = document.querySelector('.testimonial-carousel');
    if (carouselContainer) {
        const slides = carouselContainer.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        if (slides.length > 0) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.dot');

            function updateCarousel() {
                carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            function goToSlide(index) {
                currentIndex = index;
                if (currentIndex < 0) currentIndex = slides.length - 1;
                if (currentIndex >= slides.length) currentIndex = 0;
                updateCarousel();
            }

            prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
            
            // Make carousel a flex container in JS to avoid layout shifts
            carouselContainer.style.display = 'flex';
            carouselContainer.style.transition = 'transform 0.5s ease-in-out';
        }
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }
    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // Back to Top & Sticky CTA
    const backToTopButton = document.getElementById('back-to-top');
    const stickyCtaBar = document.querySelector('.sticky-cta-bar');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            backToTopButton.classList.toggle('visible', show);
            if (stickyCtaBar) stickyCtaBar.classList.toggle('visible', show);
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Lightbox
    const lightbox = document.getElementById('km-lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item, .service-card img'));
    let currentImageIndex = 0;

    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        function showImage(index) {
            if (index < 0 || index >= galleryItems.length) return;
            const item = galleryItems[index];
            const imagePath = item.dataset.kmImage;
            const altText = item.alt;
            const pathPrefix = lightbox. beradaAufUnterseite ? '../' : '';
            lightboxContent.src = pathPrefix + imagePath;
            lightboxContent.alt = altText;
            currentImageIndex = index;
        }

        function openLightbox(index) {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            showImage(index);
        }

        function closeLightbox() {
            lightbox.classList.remove('show');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('no-scroll');
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            }
        });

        // Check if on subpage for correct image pathing
        lightbox.beradaAufUnterseite = window.location.pathname !== '/' && !window.location.pathname.endsWith('index.html');
    }
});