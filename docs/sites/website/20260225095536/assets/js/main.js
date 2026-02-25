document.addEventListener('DOMContentLoaded', () => {

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
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('scroll-locked');
            menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox --- (Placeholder, needs images with data-attributes to work)
    // This is a simplified global lightbox. Assumes images that can be opened have a `data-lightbox-src` attribute.
    // For a gallery, add a `data-gallery-id` to group images.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        let currentGallery = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index >= 0 && index < currentGallery.length) {
                currentIndex = index;
                lightboxImg.src = currentGallery[currentIndex];
            }
        };

        document.body.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-km-image]');
            if (trigger) {
                e.preventDefault();
                const galleryItems = Array.from(document.querySelectorAll('[data-km-image]'));
                currentGallery = galleryItems.map(item => item.getAttribute('data-km-image').replace('../', ''));
                const clickedIndex = galleryItems.indexOf(trigger);
                showImage(clickedIndex);
                lightbox.classList.add('visible');
                lightbox.setAttribute('aria-hidden', 'false');
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImg.src = '';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        if (prevBtn) prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + currentGallery.length) % currentGallery.length));
        if (nextBtn) nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % currentGallery.length));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});