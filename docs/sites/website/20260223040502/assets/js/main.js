document.addEventListener('DOMContentLoaded', () => {

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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('mobile-menu-open');
            mainMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        let currentIndex = 0;

        const showSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.hidden = false;
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.hidden = true;
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.hidden = true;
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let galleryImages = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const imgPath = galleryImages[currentIndex].dataset.kmImage.startsWith('../') 
                ? galleryImages[currentIndex].dataset.kmImage 
                : (location.pathname.includes('/index.html') || location.pathname.endsWith('/') ? '' : '../') + galleryImages[currentIndex].dataset.kmImage;
            lightboxImg.src = imgPath;
            lightboxImg.alt = galleryImages[currentIndex].alt;
            lightbox.hidden = false;
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => openLightbox((currentIndex + 1) % galleryImages.length);

        document.querySelectorAll('.gallery-image, [data-km-image]').forEach((img, index) => {
            if(img.closest('.gallery-grid') || img.closest('.split-image')) {
                if(!galleryImages.includes(img)) galleryImages.push(img);
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    const clickedIndex = galleryImages.indexOf(img);
                    openLightbox(clickedIndex);
                });
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show when hero is NOT intersecting
                    stickyCTA.hidden = entry.isIntersecting;
                });
            }, { threshold: 0.1 });
            observer.observe(heroSection);
        }
    }
});