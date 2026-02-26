document.addEventListener('DOMContentLoaded', function() {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE NAVIGATION --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('scroll-locked', isOpen);
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('visible');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- 5. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
        let currentIndex = 0;

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const imgElement = galleryImages[index];
            const imagePath = imgElement.dataset.kmImage;
            const relativePath = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';
            lightboxImage.src = relativePath + imagePath;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => lightbox.style.display = 'none', 400);
            document.body.classList.remove('scroll-locked');
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // --- 6. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        const totalSlides = slides.length;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });

        updateCarousel(); // Initial state
    }

    // --- 7. CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const feedbackEl = document.getElementById('form-feedback');
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            feedbackEl.style.display = 'block';
            feedbackEl.style.color = 'green';
            // In a real scenario, you would send the data via fetch() here.
            setTimeout(() => {
                feedbackEl.textContent = 'Nachricht erfolgreich gesendet! Wir melden uns in Kürze.';
                contactForm.reset();
            }, 1500);
            setTimeout(() => {
                 feedbackEl.style.display = 'none';
            }, 5000);
        });
    }

    // --- 8. CONTEXTUAL CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when the footer is NOT visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    contextCta.classList.add('visible');
                } else {
                    contextCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const footer = document.querySelector('.main-footer');
        if (footer) {
            ctaObserver.observe(footer);
        }
    }
});