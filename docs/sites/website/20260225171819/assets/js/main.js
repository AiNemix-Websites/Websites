document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            mobileMenu.classList.toggle('is-visible');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Before/After Slider --- //
    const slider = document.getElementById('before-after-slider');
    if (slider) {
        const afterImage = slider.querySelector('.after-image');
        const handle = slider.querySelector('.slider-handle');
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = slider.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            const percent = (newX / rect.width) * 100;
            afterImage.style.width = percent + '%';
            handle.style.left = percent + '%';
        };

        slider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
        slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        window.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const galleryElements = document.querySelectorAll('.image-gallery');
        let currentImageIndex;
        let imagesInCurrentGallery = [];

        const openLightbox = (imgSrc, galleryImages, index) => {
            imagesInCurrentGallery = galleryImages;
            currentImageIndex = index;
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            updateLightboxNav();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        const showImage = (index) => {
            if (index < 0 || index >= imagesInCurrentGallery.length) return;
            currentImageIndex = index;
            lightboxImg.src = imagesInCurrentGallery[index];
            updateLightboxNav();
        };
        
        const updateLightboxNav = () => {
            const prevBtn = lightbox.querySelector('.prev-btn');
            const nextBtn = lightbox.querySelector('.next-btn');
            prevBtn.style.display = currentImageIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentImageIndex < imagesInCurrentGallery.length - 1 ? 'block' : 'none';
        };

        galleryElements.forEach(gallery => {
            const images = Array.from(gallery.querySelectorAll('img'));
            const imgSrcArray = images.map(img => img.getAttribute('src'));

            gallery.addEventListener('click', e => {
                if (e.target.tagName === 'IMG') {
                    const clickedIndex = images.indexOf(e.target);
                    openLightbox(e.target.src, imgSrcArray, clickedIndex);
                }
            });
        });

        lightbox.querySelector('.close-btn').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        lightbox.querySelector('.prev-btn').addEventListener('click', () => showImage(currentImageIndex - 1));
        lightbox.querySelector('.next-btn').addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
            }
        });
    }
    
    // --- Contextual CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const showCtaThreshold = 800; // Show after scrolling 800px
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateCtaVisibility = () => {
            if (window.scrollY > showCtaThreshold && window.scrollY > lastScrollY) {
                 contextCta.classList.add('visible');
            } else if(window.scrollY < lastScrollY) {
                 contextCta.classList.remove('visible');
            }
            lastScrollY = window.scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateCtaVisibility);
                ticking = true;
            }
        });
    }
});