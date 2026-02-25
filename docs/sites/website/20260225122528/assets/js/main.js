document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('scrolled', e.intersectionRatio < 1),
            { threshold: [1] }
        );
        scrollObserver.observe(header);
    }

    // --- Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainMenu.classList.contains('open')) {
                mainMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousels = document.querySelectorAll('.testimonial-carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.testimonial-carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel) return;

        let currentIndex = 0;
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;

        if (totalSlides <= 1) {
           if(wrapper.querySelector('.carousel-controls')) wrapper.querySelector('.carousel-controls').style.display = 'none';
           return;
        }

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
        const dots = dotsContainer.querySelectorAll('span');

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        if (nextBtn) nextBtn.addEventListener('click', showNext);
        if (prevBtn) prevBtn.addEventListener('click', showPrev);
        
        updateCarousel();
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const galleryItems = document.querySelectorAll('[data-lightbox-src]');
    let currentImageIndex = -1;

    if (lightbox && lightboxImage && galleryItems.length > 0) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentImageIndex = index;
            const imageSrc = galleryItems[currentImageIndex].getAttribute('data-lightbox-src');
            lightboxImage.setAttribute('src', imageSrc);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.setAttribute('src', '');
            }, 300);
        };

        const showPrevImage = () => openLightbox((currentImageIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNextImage = () => openLightbox((currentImageIndex + 1) % galleryItems.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('show', !entry.isIntersecting);
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});