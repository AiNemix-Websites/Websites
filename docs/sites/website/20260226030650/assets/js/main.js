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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    function openMobileNav() {
        mobileNav.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        mobileNavToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMobileNav() {
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
        mobileNavToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeMobileNav();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMobileNav();
            }
        });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-animate-delay')) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', showNext);
            prevBtn.addEventListener('click', showPrev);
        }
        // Simple auto-play
        setInterval(showNext, 7000);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('show');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex;

    if (lightbox && lightboxImg && galleryImages.length > 0) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const openLightbox = (index) => {
            currentImageIndex = index;
            const imgSrc = galleryImages[currentImageIndex].getAttribute('data-km-image');
            const pagePath = window.location.pathname;
            // Adjust path for subpages
            const finalSrc = pagePath.includes('/leistungen/') || pagePath.includes('/ueber-uns/') || pagePath.includes('/karriere/') || pagePath.includes('/kontakt/') ? `../${imgSrc}` : imgSrc;
            lightboxImg.setAttribute('src', finalSrc);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.style.overflow = '';
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentImageIndex);
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            openLightbox(currentImageIndex);
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const showThreshold = heroSection ? heroSection.offsetHeight : 300;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        });
    }
});