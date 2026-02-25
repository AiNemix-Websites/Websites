document.addEventListener('DOMContentLoaded', () => {

    // --- HEADER SHRINK ON SCROLL ---
    const header = document.getElementById('site-header');
    if (header) {
        const shrinkHeader = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', shrinkHeader);
        shrinkHeader(); // Initial check
    }

    // --- MOBILE NAVIGATION ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('is-open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });

        goToSlide(0); // Initialize
    }

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    const galleryImageSources = Array.from(galleryItems).map(item => item.querySelector('img').dataset.kmImage);

    if (lightbox && lightboxImage && galleryItems.length > 0) {
        const openLightbox = (index) => {
            currentImageIndex = index;
            const imagePath = (document.body.dataset.pageDepth === 'sub' ? '../' : '') + galleryImageSources[index];
            lightboxImage.src = imagePath;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleLightboxKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.classList.remove('scroll-locked');
            }, 300);
            document.removeEventListener('keydown', handleLightboxKeydown);
        };

        const showPrevImage = () => {
            const newIndex = (currentImageIndex - 1 + galleryImageSources.length) % galleryImageSources.length;
            openLightbox(newIndex);
        };

        const showNextImage = () => {
            const newIndex = (currentImageIndex + 1) % galleryImageSources.length;
            openLightbox(newIndex);
        };

        const handleLightboxKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-prev').addEventListener('click', showPrevImage);
        lightbox.querySelector('.km-lightbox-next').addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Determine page depth for correct image paths
        if (window.location.pathname.split('/').filter(Boolean).length > 0 && !window.location.pathname.endsWith('/')) {
             document.body.dataset.pageDepth = 'sub';
        }
    }
    
    // --- STICKY CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const footer = document.querySelector('.site-footer');
    if (stickyCTA && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when footer is NOT intersecting, and we've scrolled down a bit
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCTA.hidden = false;
                } else {
                    stickyCTA.hidden = true;
                }
            });
        }, { threshold: 0.1 });
        observer.observe(footer);
    }
    
    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formFeedback = document.getElementById('form-feedback');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formFeedback.textContent = 'Vielen Dank! Ihre Nachricht wurde (simuliert) gesendet.';
            formFeedback.hidden = false;
            formFeedback.style.color = 'green';
            contactForm.reset();
            setTimeout(() => { formFeedback.hidden = true; }, 5000);
        });
    }
});