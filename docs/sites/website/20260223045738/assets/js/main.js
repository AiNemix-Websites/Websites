document.addEventListener('DOMContentLoaded', function() {

    // --- GLOBAL UTILITIES ---
    const select = (el, all = false) => all ? document.querySelectorAll(el) : document.querySelector(el);

    // --- STICKY HEADER ---
    const header = select('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mainNav = select('.main-nav');
    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
            document.body.classList.toggle('nav-open');
            mobileNavToggle.setAttribute('aria-expanded', mainNav.classList.contains('open'));
        });

        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileNavToggle.contains(e.target) && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                mobileNavToggle.classList.remove('open');
                document.body.classList.remove('nav-open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                mobileNavToggle.classList.remove('open');
                document.body.classList.remove('nav-open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = select('.reveal-on-scroll', true);
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Stagger effect
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const cookieAccept = select('#cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'true');
        });
    }

    // --- LIGHTBOX ---
    const lightbox = select('#km-lightbox');
    const lightboxTriggers = select('.lightbox-trigger', true);
    let galleryImages = [];
    let currentIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        
        galleryImages = Array.from(lightboxTriggers).map(trigger => {
            return { src: trigger.dataset.kmImage || trigger.src, alt: trigger.alt };
        });

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const imagePath = galleryImages[index].src;
            const relativePath = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';
            lightboxImg.src = relativePath + imagePath;
            lightboxImg.alt = galleryImages[index].alt;
        };

        const openLightbox = (e) => {
            const clickedSrc = e.currentTarget.dataset.kmImage || e.currentTarget.src;
            const index = galleryImages.findIndex(img => (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../') + img.src === clickedSrc || img.src === clickedSrc);
            if(index > -1) {
                showImage(index);
                document.body.style.overflow = 'hidden';
                lightbox.classList.add('open');
            }
        };

        const closeLightbox = () => {
            document.body.style.overflow = '';
            lightbox.classList.remove('open');
        };

        lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
        
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    // --- TIMELINE CAROUSEL (About Us Page) ---
    const timelineCarousel = select('.timeline-carousel');
    if (timelineCarousel) {
        const prevBtn = select('.timeline-prev');
        const nextBtn = select('.timeline-next');
        const slides = select('.timeline-slide', true);
        let currentSlide = 0;

        const goToSlide = (slideIndex) => {
            if (slideIndex < 0) slideIndex = 0;
            if (slideIndex >= slides.length) slideIndex = slides.length - 1;
            timelineCarousel.scrollLeft = slides[slideIndex].offsetLeft;
            currentSlide = slideIndex;
        };

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Basic touch swipe
        let touchstartX = 0;
        let touchendX = 0;
        timelineCarousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; });
        timelineCarousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) goToSlide(currentSlide + 1);
            if (touchendX > touchstartX) goToSlide(currentSlide - 1);
        });
    }

    // --- STICKY CTA BAR ---
    const stickyCTA = select('.sticky-cta-bar');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = select('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- CONTACT FORM (simple validation) ---
    const contactForm = select('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is for demonstration. A real form needs server-side validation and submission.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});