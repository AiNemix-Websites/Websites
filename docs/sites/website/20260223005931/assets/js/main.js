document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SMOOTH SCROLL FOR ANCHOR LINKS --- 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- 2. STICKY HEADER --- 
    const header = document.getElementById('main-header');
    if (header) {
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 3. MOBILE NAVIGATION --- 
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = mobileMenu ? mobileMenu.querySelector('.mobile-menu-close') : null;

    if (mobileMenuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
            mobileMenu.classList.toggle('open', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        mobileMenuToggle.addEventListener('click', () => toggleMenu());
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => toggleMenu(false));
        }

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- 4. SCROLL REVEAL ANIMATIONS --- 
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.scrollDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- 5. TESTIMONIAL CAROUSEL --- 
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(newIndex);
            });

            nextButton.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % slides.length;
                goToSlide(newIndex);
            });
        }
        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }

    // --- 6. COOKIE BANNER --- 
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('visible');
                cookieBanner.setAttribute('aria-hidden', 'false');
            }
        }, 1000);

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- 7. GLOBAL LIGHTBOX --- 
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryImages = document.querySelectorAll('.gallery-grid img');
        const imageSources = Array.from(galleryImages).map(img => ({ src: img.dataset.kmImage, alt: img.alt }));
        let currentIndex = -1;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            currentIndex = index;
            lightboxImg.src = (document.body.classList.contains('is-subpage') ? '../' : '') + imageSources[index].src;
            lightboxImg.alt = imageSources[index].alt;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage((currentIndex - 1 + imageSources.length) % imageSources.length));
        nextBtn.addEventListener('click', () => showImage((currentIndex + 1) % imageSources.length));
    }
    // Add subpage class for correct image pathing
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        document.body.classList.add('is-subpage');
    }

    // --- 8. STICKY CTA --- 
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCTA.classList.add('visible');
                stickyCTA.setAttribute('aria-hidden', 'false');
            } else {
                stickyCTA.classList.remove('visible');
                stickyCTA.setAttribute('aria-hidden', 'true');
            }
        });
    }
    
    // --- 9. CONTACT FORM HANDLING --- 
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data to a server.
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formStatus.style.color = 'var(--color-accent2)';
            contactForm.reset();
            setTimeout(() => { formStatus.textContent = ''; }, 5000);
        });
    }

});