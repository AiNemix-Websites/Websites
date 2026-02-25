document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    if (mobileNavToggle && mobileNavContainer) {
        const openNav = () => {
            mobileNavContainer.style.display = 'block';
            setTimeout(() => mobileNavContainer.classList.add('open'), 10);
            document.body.classList.add('body-no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        };

        const closeNav = () => {
            mobileNavContainer.classList.remove('open');
            setTimeout(() => { 
                mobileNavContainer.style.display = 'none'; 
            }, 300);
            document.body.classList.remove('body-no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
        };

        mobileNavToggle.addEventListener('click', openNav);
        mobileNavClose.addEventListener('click', closeNav);
        mobileNavBackdrop.addEventListener('click', closeNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.classList.contains('open')) {
                closeNav();
            }
        });
    }

    // --- Scroll Reveal --- //
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentIndex = 0;

        function showSlide(index) {
            const offset = -index * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        }

        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Basic swipe detection
        let touchstartX = 0;
        let touchendX = 0;
        
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, {passive: true});
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextSlide();
            if (touchendX > touchstartX) prevSlide();
        });
    }
    
    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        document.querySelectorAll('.lightbox-gallery').forEach(gallery => {
            gallery.addEventListener('click', e => {
                e.preventDefault();
                const link = e.target.closest('a.gallery-item');
                if (!link) return;

                galleryImages = Array.from(gallery.querySelectorAll('a.gallery-item'));
                currentIndex = galleryImages.indexOf(link);
                
                openLightbox(link.href);
            });
        });

        const openLightbox = (src) => {
            lightboxImg.setAttribute('src', src);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.setAttribute('aria-hidden', 'false'), 10);
            document.body.classList.add('body-no-scroll');
            updateNavButtons();
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.classList.remove('body-no-scroll');
            removeLightboxListeners();
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].href;
            updateNavButtons();
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].href;
            updateNavButtons();
        };

        const updateNavButtons = () => {
            prevBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
            nextBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
        };
        
        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };
        
        function addLightboxListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            backdrop.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrevImage);
            nextBtn.addEventListener('click', showNextImage);
            document.addEventListener('keydown', handleKeydown);
        }

        function removeLightboxListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            backdrop.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrevImage);
            nextBtn.removeEventListener('click', showNextImage);
            document.removeEventListener('keydown', handleKeydown);
        }
    }
});