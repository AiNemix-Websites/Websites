document.addEventListener('DOMContentLoaded', function() {

    // --- UTILITIES ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- STICKY HEADER ---
    const header = select('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = select('.mobile-nav-toggle');
    const mobileNavDrawer = select('.mobile-nav-drawer');
    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('mobile-nav-open');
            document.body.classList.toggle('no-scroll');
            mobileNavDrawer.classList.toggle('open');
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = selectAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- CAROUSEL LOGIC ---
    const carousels = selectAll('.carousel-wrapper');
    carousels.forEach(carousel => {
        const slides = carousel.querySelector('.carousel-slides');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let slideIndex = 0;

        if (!slides || slides.children.length === 0) return;

        // Create dots
        Array.from(slides.children).forEach((_, i) => {
            if(dotsContainer) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        });

        const updateCarousel = () => {
            slides.style.transform = `translateX(-${slideIndex * 100}%)`;
            if(dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => dot.classList.toggle('active', i === slideIndex));
            }
        };

        const goToSlide = (index) => {
            slideIndex = (index + slides.children.length) % slides.children.length;
            updateCarousel();
        };

        if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(slideIndex - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(slideIndex + 1));

        // Touch/Swipe logic
        let touchstartX = 0;
        let touchendX = 0;

        slides.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        slides.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) goToSlide(slideIndex + 1);
            if (touchendX > touchstartX) goToSlide(slideIndex - 1);
        });

        goToSlide(0);
    });

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const acceptBtn = select('#accept-cookies');
    const declineBtn = select('#decline-cookies');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent && cookieBanner) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('show'), 100);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- LIGHTBOX ---
    const lightbox = select('#km-lightbox');
    const lightboxContent = lightbox ? lightbox.querySelector('.km-lightbox-content img') : null;
    const galleryImages = selectAll('.gallery-img');
    let currentImageIndex = 0;

    if (lightbox && lightboxContent && galleryImages.length > 0) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.dataset.kmImage || imgElement.src;
            const imgAlt = imgElement.alt || 'Galeriebild';
            const pathPrefix = window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../';

            lightboxContent.src = pathPrefix + imgSrc;
            lightboxContent.alt = imgAlt;
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.hidden = false;
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => { lightbox.hidden = true; }, 300);
            document.body.classList.remove('no-scroll');
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => showImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length));
        nextBtn.addEventListener('click', () => showImage((currentImageIndex + 1) % galleryImages.length));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // --- STICKY CTA ---
    const stickyCTA = select('.sticky-cta');
    if (stickyCTA) {
        const heroSection = select('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.hidden = false;
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0 });

        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});