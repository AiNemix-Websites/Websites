document.addEventListener('DOMContentLoaded', function() {

    // --- Header Scroll Effect ---
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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Animations ---
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const showCtaThreshold = heroSection ? heroSection.offsetHeight : 300;

        window.addEventListener('scroll', () => {
            if (window.scrollY > showCtaThreshold) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }

    // --- Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex;
        let galleryImages = [];

        const openLightbox = (imgElement) => {
            const gallery = imgElement.closest('[data-gallery]');
            if (gallery) {
                galleryImages = Array.from(gallery.querySelectorAll('[data-km-image]'));
                currentImageIndex = galleryImages.indexOf(imgElement);
                prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            } else {
                galleryImages = [imgElement];
                currentImageIndex = 0;
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
            updateLightboxImage();
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            const img = galleryImages[currentImageIndex];
            if (img) {
                const imagePath = img.dataset.kmImage;
                const altText = img.alt || '';
                lightboxImg.src = imagePath.startsWith('..') ? imagePath : (location.pathname.includes('/index.html') || location.pathname.endsWith('/') ? '' : '../') + imagePath;
                lightboxImg.alt = altText;
            }
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        document.body.addEventListener('click', (e) => {
            if (e.target.dataset.kmImage) {
                e.preventDefault();
                // Add a data-gallery attribute to a parent container of your images to enable gallery mode
                if (!e.target.closest('[data-gallery]')) {
                    const parent = e.target.parentElement;
                    if(parent) parent.dataset.gallery = 'default';
                }
                openLightbox(e.target);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }
});