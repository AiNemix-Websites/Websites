'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // --- Sticky Header ---
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

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('is-open');
            mobileMenu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const staggerDelay = parseInt(element.dataset.stagger) || 0;
                const items = element.querySelectorAll('.reveal-item');
                if (items.length > 0) {
                    items.forEach((item, index) => {
                        item.style.transitionDelay = `${index * staggerDelay}ms`;
                        item.classList.add('visible');
                    });
                } else {
                    element.classList.add('visible');
                }
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelector('.testimonial-slides');
        const slideItems = slides.querySelectorAll('.testimonial-slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const dotsContainer = carousel.querySelector('.dots');
        let currentIndex = 0;

        function updateCarousel() {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slideItems.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('span');

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideItems.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (localStorage.getItem('cookieConsent') !== 'true') {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'true');
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentGallery = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= currentGallery.length) return;
            currentIndex = index;
            lightboxImg.src = currentGallery[index];
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === currentGallery.length - 1 ? 'none' : 'block';
        };

        document.body.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('a[data-lightbox-src]');
            if (galleryItem) {
                e.preventDefault();
                const galleryContainer = galleryItem.closest('#image-gallery');
                if(galleryContainer) {
                    const items = galleryContainer.querySelectorAll('a[data-lightbox-src]');
                    currentGallery = Array.from(items).map(item => item.getAttribute('data-lightbox-src'));
                    const clickedIndex = currentGallery.indexOf(galleryItem.getAttribute('data-lightbox-src'));
                    showImage(clickedIndex);
                    lightbox.classList.add('show');
                    document.body.classList.add('no-scroll');
                }
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            }
        });
    }
    
    // --- Contact Form Placeholder ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Dies ist eine Demonstration. In einer echten Anwendung würden Ihre Daten jetzt gesendet.');
            contactForm.reset();
        });
    }
});