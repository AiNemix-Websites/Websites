document.addEventListener('DOMContentLoaded', () => {

    // --- Global State & Helpers ---
    const body = document.body;

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            body.classList.toggle('no-scroll', isOpen);
        };
        menuToggle.addEventListener('click', toggleMenu);
    }

    // --- Scroll Reveal Animations ---
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.hasAttribute('data-reveal-container')) {
                    const elements = entry.target.querySelectorAll('[data-reveal]');
                    elements.forEach((el, index) => {
                        el.style.setProperty('--reveal-order', index);
                        el.classList.add('revealed');
                    });
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal], [data-reveal-container]').forEach(el => {
        revealObserver.observe(el);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.style.display = 'flex'; // Set display after initial setup
            slides.forEach(s => s.style.transition = 'transform 0.5s ease-in-out');
            updateDots();
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                if (index === currentIndex) button.classList.add('active');
                dotsContainer.appendChild(button);
            });
        };

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });

    declineBtn?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            const item = galleryItems[index];
            const src = item.getAttribute('data-lightbox-src') || item.getAttribute('href');
            const caption = item.getAttribute('data-caption') || '';
            
            lightboxImage.src = src;
            lightboxCaption.textContent = caption;
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
            lightboxImage.src = ''; // Prevent loading in background
        };

        const showPrev = () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => openLightbox((currentIndex + 1) % galleryItems.length);

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.querySelectorAll('[data-lightbox-src]').forEach((item, index) => {
            galleryItems.push(item);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn?.addEventListener('click', closeLightbox);
        backdrop?.addEventListener('click', closeLightbox);
        prevBtn?.addEventListener('click', showPrev);
        nextBtn?.addEventListener('click', showNext);
    }

    // --- Sticky Context CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                contextCta.classList.toggle('show', !entry.isIntersecting && window.scrollY > 200);
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});