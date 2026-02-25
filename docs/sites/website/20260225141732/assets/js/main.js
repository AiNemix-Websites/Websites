document.addEventListener('DOMContentLoaded', function() {

    // --- Helper to handle reduced motion preference ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Animations ---
    if (!prefersReducedMotion) {
        const animatedElements = document.querySelectorAll('.animate-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Before/After Slider ---
    document.querySelectorAll('.before-after-slider').forEach(slider => {
        const input = slider.querySelector('.slider-input');
        const afterWrapper = slider.querySelector('.after-image-wrapper');
        const handle = slider.querySelector('.slider-handle');
        
        const updateSlider = (value) => {
            afterWrapper.style.clipPath = `inset(0 0 0 ${value}%)`;
            handle.style.left = `${value}%`;
        };

        input.addEventListener('input', (e) => updateSlider(e.target.value));
        // Add touch support
        let isDragging = false;
        const startDrag = (e) => { isDragging = true; };
        const stopDrag = () => { isDragging = false; };
        const onDrag = (e) => {
            if (!isDragging) return;
            const rect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            let percentage = (x / rect.width) * 100;
            percentage = Math.max(0, Math.min(100, percentage));
            input.value = percentage;
            updateSlider(percentage);
        };

        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('touchstart', startDrag, { passive: true });
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag, { passive: true });
    });

    // --- Testimonial Carousel ---
    const carousels = document.querySelectorAll('.testimonial-carousel');
    carousels.forEach(carousel => {
        let currentIndex = 0;
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;
        const wrapper = carousel.closest('.testimonial-carousel-wrapper');
        const nextBtn = wrapper.querySelector('.next');
        const prevBtn = wrapper.querySelector('.prev');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateCarousel();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
                updateCarousel();
            });
        }
    });

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-accordion').forEach(accordion => {
        accordion.addEventListener('click', e => {
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return;

            const item = questionButton.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

            questionButton.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Sticky CTA ---
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });

        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery-item, .service-image img');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;
        const images = Array.from(galleryItems).map(item => ({
            src: item.dataset.kmImage,
            alt: item.alt
        }));

        const showImage = (index) => {
            if (index < 0 || index >= images.length) return;
            currentImageIndex = index;
            const imgData = images[index];
            lightboxImage.src = (window.location.pathname.includes('/leistungen/') || window.location.pathname.includes('/faq/') || window.location.pathname.includes('/kontakt/') || window.location.pathname.includes('/impressum/') || window.location.pathname.includes('/datenschutz/')) ? `../${imgData.src}` : imgData.src;
            lightboxImage.alt = imgData.alt;
            prevBtn.style.display = (index === 0) ? 'none' : 'grid';
            nextBtn.style.display = (index === images.length - 1) ? 'none' : 'grid';
        };

        const openLightbox = (index) => {
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            showImage(index);
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        };

        galleryItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));
    }
});