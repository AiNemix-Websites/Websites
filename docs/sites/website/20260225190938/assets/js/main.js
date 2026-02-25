document.addEventListener('DOMContentLoaded', () => {

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

    // --- Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonials Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.next-btn');
        const prevBtn = document.querySelector('.prev-btn');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function goToSlide(index) {
            slides.forEach(slide => slide.style.display = 'none');
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            
            currentIndex = (index + slides.length) % slides.length;

            slides[currentIndex].style.display = 'block';
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        goToSlide(0);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

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

    // --- Sticky CTA Bar --- //
    const stickyCta = document.querySelector('.sticky-cta-bar');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 300;
            if (window.scrollY > heroHeight) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');

        const imageSources = Array.from(galleryItems).map(item => ({
            src: item.href,
            alt: item.dataset.alt || 'Galeriebild'
        }));

        function showImage(index) {
            const imgData = imageSources[index];
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.alt;
            currentImageIndex = index;
        }

        function openLightbox(index) {
            document.body.classList.add('scroll-locked');
            lightbox.classList.add('visible');
            showImage(index);
        }

        function closeLightbox() {
            document.body.classList.remove('scroll-locked');
            lightbox.classList.remove('visible');
            // Delay clearing src to avoid flash of broken image during transition
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        }

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', e => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % imageSources.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});