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
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Intersection Observer for Animations ---
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    revealItems.forEach(item => {
        observer.observe(item);
    });

    // --- Accordion (FAQ) ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Optional: close all others
            // accordionItems.forEach(i => i.classList.remove('active'));
            if (!wasActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Testimonials Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
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

        updateCarousel();
    }
    
    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    let galleryImages = [];
    let currentImageIndex = -1;

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = galleryImages[currentImageIndex];
        lightbox.classList.add('show');
        document.body.classList.add('no-scroll');
        addLightboxEventListeners();
    }

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.classList.remove('no-scroll');
        removeLightboxEventListeners();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
        lightboxImage.src = galleryImages[currentImageIndex];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
        lightboxImage.src = galleryImages[currentImageIndex];
    }
    
    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }

    function addLightboxEventListeners() {
        window.addEventListener('keydown', handleKeydown);
    }

    function removeLightboxEventListeners() {
        window.removeEventListener('keydown', handleKeydown);
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-trigger')) {
            e.preventDefault();
            const allTriggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
            galleryImages = allTriggers.map(img => img.dataset.kmImage || img.src);
            const clickedIndex = allTriggers.indexOf(e.target);
            openLightbox(clickedIndex);
        }
    });

    if (lightbox) {
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});