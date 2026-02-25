(function() {
    'use strict';

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

        // Mobile Menu
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('open');
                mobileMenu.classList.toggle('open');
                document.body.classList.toggle('no-scroll');
            });
        }

        // Scroll Reveal Animation
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Stagger animation for items in a group
                    if (entry.target.classList.contains('stagger-group')) {
                        const items = entry.target.querySelectorAll('.stagger-item');
                        items.forEach((item, index) => {
                            item.style.setProperty('--stagger-index', index);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });

        // Testimonial Carousel
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            const slides = carousel.querySelectorAll('.testimonial-slide');
            const prevBtn = document.querySelector('.carousel-controls .prev');
            const nextBtn = document.querySelector('.carousel-controls .next');
            let currentIndex = 0;

            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            if(prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                    updateCarousel();
                });

                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                    updateCarousel();
                });
            }
        }

        // Cookie Banner
        const cookieBanner = document.getElementById('cookie-banner');
        const acceptCookiesBtn = document.getElementById('accept-cookies');
        if (cookieBanner && acceptCookiesBtn) {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.classList.add('visible');
            }

            acceptCookiesBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.remove('visible');
            });
        }

        // Back to Top Button
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        // Lightbox
        const lightbox = document.getElementById('km-lightbox');
        const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentImageIndex = 0;
        const imagePaths = Array.from(galleryItems).map(item => item.dataset.kmImagePath);

        function showLightbox(index) {
            if (!lightbox || !lightboxImg) return;
            currentImageIndex = index;
            const relativePath = window.location.pathname.includes('/referenzen/') ? '../' : '';
            lightboxImg.src = relativePath + imagePaths[currentImageIndex];
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
        }

        function hideLightbox() {
            if (!lightbox) return;
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        }

        function showNextImage() {
            const nextIndex = (currentImageIndex + 1) % imagePaths.length;
            showLightbox(nextIndex);
        }

        function showPrevImage() {
            const prevIndex = (currentImageIndex - 1 + imagePaths.length) % imagePaths.length;
            showLightbox(prevIndex);
        }

        if (galleryItems.length > 0) {
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    showLightbox(index);
                });
            });
        }

        if (lightbox) {
            lightbox.querySelector('.close-lightbox').addEventListener('click', hideLightbox);
            lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
            lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    hideLightbox();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (lightbox.classList.contains('visible')) {
                    if (e.key === 'Escape') hideLightbox();
                    if (e.key === 'ArrowRight') showNextImage();
                    if (e.key === 'ArrowLeft') showPrevImage();
                }
            });
        }

        // Contact Form (dummy handler)
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const formStatus = document.getElementById('form-status');
                formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
                formStatus.style.color = 'green';
                contactForm.reset();
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            });
        }

    });
})();