document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
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
    const mainMenu = document.getElementById('main-menu');
    if (navToggle && mainMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        if(el.classList.contains('reveal-stagger')) {
            // Stagger logic would be more complex, for now just reveal
        }
        observer.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
        
        updateCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('visible'), 100);
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = window.innerHeight * 0.75;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt) {
                stickyCTA.hidden = false;
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }, { passive: true });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (formStatus) {
                formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
                // In a real scenario, this would be an AJAX call.
                // For this static site, we just show a success message.
                setTimeout(() => {
                    formStatus.textContent = 'Nachricht erfolgreich gesendet! Wir melden uns in Kürze.';
                    contactForm.reset();
                }, 1500);
            }
        });
    }

    // --- Lightbox (Singleton) --- //
    // NOTE: This is the required global lightbox system. Since there are no images,
    // there are no triggers to open it, but the functionality is here as requested.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentImageSrc = '';

        const openLightbox = (src) => {
            if (!src) return;
            currentImageSrc = src;
            const imgContainer = lightbox.querySelector('.lightbox-image-container');
            imgContainer.innerHTML = `<img src='${src}' alt=''>`;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            lightbox.setAttribute('aria-hidden', 'false');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
            lightbox.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                lightbox.style.display = 'none';
                const imgContainer = lightbox.querySelector('.lightbox-image-container');
                imgContainer.innerHTML = '';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });

        // Example of how to add a trigger (none are present in the HTML)
        // document.querySelectorAll('[data-lightbox-src]').forEach(el => {
        //     el.addEventListener('click', (e) => {
        //         e.preventDefault();
        //         openLightbox(el.dataset.lightboxSrc);
        //     });
        // });
    }
});