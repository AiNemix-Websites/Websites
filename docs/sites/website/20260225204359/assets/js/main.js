document.addEventListener('DOMContentLoaded', function() {

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

    // --- Mobile Navigation ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    if (menuToggle) {
        const navPanel = document.createElement('div');
        navPanel.className = 'mobile-nav-panel';
        const navOverlay = document.createElement('div');
        navOverlay.className = 'mobile-nav-overlay';
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            navPanel.innerHTML = mainNav.innerHTML;
            document.body.appendChild(navPanel);
            document.body.appendChild(navOverlay);

            const toggleMenu = () => {
                const isOpen = document.body.classList.toggle('mobile-menu-open');
                menuToggle.setAttribute('aria-expanded', isOpen);
                document.body.classList.toggle('no-scroll', isOpen);
            };

            menuToggle.addEventListener('click', toggleMenu);
            navOverlay.addEventListener('click', toggleMenu);
            navPanel.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    toggleMenu();
                }
            });
        }
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        goToSlide(0);
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookieConsent', 'true');
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let galleryImages = [];
        let currentIndex = 0;

        const gallery = document.getElementById('praxis-gallery');
        if (gallery) {
            galleryImages = Array.from(gallery.querySelectorAll('.gallery-item'));
            galleryImages.forEach((img, index) => {
                img.addEventListener('click', () => openLightbox(index));
            });
        }

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => lightbox.style.display = 'none', 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            const imgElement = galleryImages[currentIndex];
            if (imgElement) {
                const path = imgElement.getAttribute('data-km-image');
                lightboxImg.src = path.startsWith('..') ? path : '../' + path;
                lightboxImg.alt = imgElement.alt;
            }
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });
        const hero = document.querySelector('.hero');
        if(hero) ctaObserver.observe(hero);
    }

    // --- Contact Form (Placeholder) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const status = document.getElementById('form-status');
            status.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            status.style.color = 'green';
            contactForm.reset();
            setTimeout(() => status.textContent = '', 5000);
        });
    }
});