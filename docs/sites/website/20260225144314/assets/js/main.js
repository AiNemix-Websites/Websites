document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const select = (selector, scope = document) => scope.querySelector(selector);
    const selectAll = (selector, scope = document) => scope.querySelectorAll(selector);

    // --- STICKY HEADER ---
    const header = select('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mobileNavMenu = select('.mobile-nav-menu');
    const mobileNavClose = select('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            document.body.classList.add('mobile-nav-open', 'no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavMenu.setAttribute('aria-hidden', 'false');
            mobileNavClose.focus();
        };

        const closeMenu = () => {
            document.body.classList.remove('mobile-nav-open', 'no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavMenu.setAttribute('aria-hidden', 'true');
            mobileNavToggle.focus();
        };

        mobileNavToggle.addEventListener('click', openMenu);
        mobileNavClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
                closeMenu();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = selectAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay || '0', 10);
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const prevButton = select('.carousel-prev');
        const nextButton = select('.carousel-next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        const nextSlide = () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        };

        const prevSlide = () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        };

        nextButton.addEventListener('click', nextSlide);
        prevButton.addEventListener('click', prevSlide);
        
        // Touch/Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextSlide();
            if (touchendX > touchstartX) prevSlide();
        });
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = select('#km-lightbox');
    if (lightbox) {
        const lightboxImg = select('img', lightbox);
        const closeButton = select('.km-lightbox-close');
        const prevButton = select('.km-lightbox-prev');
        const nextButton = select('.km-lightbox-next');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            const item = galleryItems[index];
            const imagePath = item.dataset.kmImage;
            const pageRoot = window.location.pathname.includes('/index.html') ? '.' : '..';
            const finalPath = `${pageRoot}/${imagePath}`.replace(/\/\//g, '/');
            lightboxImg.src = finalPath;
            lightboxImg.alt = item.querySelector('img')?.alt || 'Galeriebild';
            currentIndex = index;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            document.body.classList.add('no-scroll');
            closeButton.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 350);
            document.body.classList.remove('no-scroll');
            if (currentIndex > -1 && galleryItems[currentIndex]) {
                galleryItems[currentIndex].focus();
            }
        };

        const showPrev = () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => openLightbox((currentIndex + 1) % galleryItems.length);

        document.addEventListener('click', e => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                galleryItems = Array.from(selectAll('.gallery-item'));
                const index = galleryItems.indexOf(galleryItem);
                openLightbox(index);
            }
        });

        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    if (cookieBanner) {
        const acceptBtn = select('#cookie-accept');
        const declineBtn = select('#cookie-decline');
        const cookieConsent = localStorage.getItem('cookieConsent');

        if (!cookieConsent) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
        }

        const handleConsent = (value) => {
            localStorage.setItem('cookieConsent', value);
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 350);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- STICKY CTA ---
    const stickyCTA = select('.sticky-cta');
    const heroSection = select('.hero');
    if (stickyCTA && heroSection) {
        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) {
                stickyCTA.style.display = 'block';
                setTimeout(() => stickyCTA.classList.add('is-visible'), 10);
            } else {
                stickyCTA.classList.remove('is-visible');
                setTimeout(() => { stickyCTA.style.display = 'none'; }, 350);
            }
        }, { threshold: 0 });
        observer.observe(heroSection);
    }

    // --- CONTACT FORM ---
    const contactForm = select('#contact-form');
    if (contactForm) {
        const formStatus = select('#form-status');
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            setTimeout(() => {
                formStatus.textContent = '';
                contactForm.reset();
            }, 4000);
        });
    }
});