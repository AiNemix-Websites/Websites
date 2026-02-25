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
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', () => {
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpened);
            document.body.classList.toggle('mobile-nav-open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
            }
        }, 1000);
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Before/After Slider ---
    const slider = document.querySelector('.before-after-slider');
    if (slider) {
        const afterImage = slider.querySelector('.after-image');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            let percent = (newX / rect.width) * 100;
            afterImage.style.width = `${percent}%`;
            handle.style.left = `${percent}%`;
        };

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);

        slider.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        slider.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        };

        goToSlide(0);

        setInterval(() => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        }, 5000);
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const gallery = document.getElementById('project-gallery');
    let galleryItems = [];
    let currentImageIndex = -1;

    if (gallery && lightbox) {
        galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));

        gallery.addEventListener('click', (e) => {
            e.preventDefault();
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                currentImageIndex = galleryItems.indexOf(galleryItem);
                updateLightboxImage(currentImageIndex);
                openLightbox();
            }
        });

        const openLightbox = () => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = (index) => {
            if (index >= 0 && index < galleryItems.length) {
                const item = galleryItems[index];
                const imgSrc = item.href;
                const imgAlt = item.querySelector('img').alt;
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgAlt;
            }
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            updateLightboxImage(currentImageIndex);
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage(currentImageIndex);
        };

        lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
        lightbox.querySelector('.next-btn').addEventListener('click', showNextImage);
        lightbox.querySelector('.prev-btn').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };
    }
});