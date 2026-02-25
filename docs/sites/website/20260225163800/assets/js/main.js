document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
            header.classList.toggle('nav-open', isOpen);
        });
    }

    // --- Scroll Animations --- //
    const scrollElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    scrollElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const dotsContainer = document.querySelector('.carousel-dots');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('span');

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        goToSlide(0);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const galleryItems = document.querySelectorAll('.gallery-item img, .project-item-image img');
    let currentImageIndex;

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        const imageSources = Array.from(galleryItems).map(item => item.dataset.kmImage);

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            lightboxImg.src = imageSources[index].startsWith('..') ? imageSources[index] : '../' + imageSources[index];
            if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
                lightboxImg.src = imageSources[index];
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                lightbox.classList.add('visible');
                lightbox.style.display = 'flex';
                document.body.classList.add('no-scroll');
                showImage(index);
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.classList.remove('no-scroll');
        };

        lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightbox.querySelector('.prev-btn').addEventListener('click', () => showImage(currentImageIndex - 1));
        lightbox.querySelector('.next-btn').addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        });
    }

    // --- Sticky CTA Bar --- //
    const stickyBar = document.getElementById('sticky-cta-bar');
    if (stickyBar) {
        const footer = document.querySelector('.site-footer-main');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // Show when footer is NOT visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyBar.classList.add('visible');
                } else {
                    stickyBar.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        if (footer) {
            observer.observe(footer);
        }
    }

});