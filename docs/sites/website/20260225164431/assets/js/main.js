document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
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

    // --- Mobile Menu --- 
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('open');
            mainMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Sticky CTA --- 
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        ctaObserver.observe(heroSection);
    }

    // --- Cookie Banner --- 
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
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
    
    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formStatus = document.getElementById('form-status');
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            // In a real scenario, you would send the data to a server here.
            setTimeout(() => {
                 formStatus.textContent = 'Nachricht erfolgreich gesendet. Wir melden uns in Kürze.';
                 contactForm.reset();
            }, 1500);
        });
    }

    // --- Global Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const galleryTriggers = document.querySelectorAll('[data-lightbox-trigger]');
        
        galleryTriggers.forEach(trigger => {
            const imagePath = trigger.getAttribute('data-km-image-path');
            if (imagePath) galleryImages.push(imagePath);

            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const clickedImagePath = trigger.getAttribute('data-km-image-path');
                currentIndex = galleryImages.indexOf(clickedImagePath);
                updateLightboxImage();
                showLightbox();
            });
        });

        function updateLightboxImage() {
            if (galleryImages.length > 0) {
                const imagePath = galleryImages[currentIndex];
                const relativePath = lightbox.ownerDocument.location.pathname.includes('/index.html') || lightbox.ownerDocument.location.pathname === '/' ? '' : '../';
                lightboxImage.src = relativePath + imagePath;
            }
            prevBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = galleryImages.length > 1 ? 'flex' : 'none';
        }

        function showLightbox() {
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        }

        function hideLightbox() {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
            lightboxImage.src = ''; // Clear src to stop loading
        }

        function showPrevImage() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        }

        function showNextImage() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightboxImage();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') hideLightbox();
            if (galleryImages.length > 1) {
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        }

        closeBtn.addEventListener('click', hideLightbox);
        backdrop.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }
});