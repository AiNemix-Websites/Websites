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
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('scroll-lock');
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger, .reveal-fade-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Slider --- //
    function initSlider(sliderId) {
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const slides = slider.querySelectorAll('.testimonial-slide');
        const wrapper = slider.closest('.testimonial-slider-wrapper');
        const nextBtn = wrapper.querySelector('.slider-next');
        const prevBtn = wrapper.querySelector('.slider-prev');
        const dotsContainer = wrapper.querySelector('.slider-dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        function updateSlider() {
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });

        updateSlider();
    }

    initSlider('testimonial-slider');
    initSlider('testimonial-slider-page');

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.remove('hidden');
        } else {
             cookieBanner.style.display = 'none';
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let galleryImages = [];
        let currentIndex = -1;

        document.addEventListener('click', e => {
            const trigger = e.target.closest('[data-km-lightbox-trigger]');
            if (trigger) {
                const gallery = trigger.closest('.gallery-grid');
                if (gallery) {
                    galleryImages = Array.from(gallery.querySelectorAll('[data-km-lightbox-trigger] img'));
                    const clickedImg = trigger.querySelector('img');
                    currentIndex = galleryImages.indexOf(clickedImg);
                }
                const imgSrc = trigger.querySelector('img').dataset.kmImage;
                openLightbox(imgSrc);
            }
        });

        function openLightbox(src) {
            lightboxImg.setAttribute('src', src.startsWith('..') ? src : `../${src}`.replace('../assets', 'assets'));
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('scroll-lock');
            updateLightboxNav();
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.classList.remove('scroll-lock');
            galleryImages = [];
            currentIndex = -1;
        }

        function updateLightboxNav() {
            if (galleryImages.length > 1) {
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            } else {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        }

        function showPrevImage() {
            if (currentIndex > 0) {
                currentIndex--;
                const imgSrc = galleryImages[currentIndex].dataset.kmImage;
                openLightbox(imgSrc);
            }
        }

        function showNextImage() {
            if (currentIndex < galleryImages.length - 1) {
                currentIndex++;
                const imgSrc = galleryImages[currentIndex].dataset.kmImage;
                openLightbox(imgSrc);
            }
        }

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = document.body.scrollHeight / 4;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

});