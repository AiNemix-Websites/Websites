document.addEventListener('DOMContentLoaded', function() {

    // --- HEADER LOGIC ---
    const header = document.querySelector('.site-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Sticky header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile nav toggle
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
    }

    // --- SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookie_consent')) {
        cookieBanner.style.display = 'block';
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.style.display = 'none';
        });
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentImageIndex = 0;
        let galleryImages = [];

        document.body.addEventListener('click', e => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const galleryName = trigger.dataset.lightboxTrigger;
                galleryImages = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryName}']`));
                currentImageIndex = galleryImages.indexOf(trigger);
                updateLightboxImage();
                showLightbox();
            }
        });

        function updateLightboxImage() {
            const trigger = galleryImages[currentImageIndex];
            const imgSrc = trigger.dataset.kmImage.startsWith('../') ? trigger.dataset.kmImage : '../' + trigger.dataset.kmImage;
            const pagePath = window.location.pathname;
            // Adjust path for root vs subfolder
            const finalSrc = pagePath.includes('/index.html') || pagePath === '/' ? trigger.dataset.kmImage : '../' + trigger.dataset.kmImage;
            lightboxImg.src = finalSrc;
            lightboxImg.alt = galleryImages[currentImageIndex].querySelector('img')?.alt || 'Galeriebild';
        }

        function showLightbox() {
            lightbox.style.display = 'flex';
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        }

        function hideLightbox() {
            lightbox.style.display = 'none';
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) hideLightbox();
        });
        closeBtn.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
    }

    // --- CAROUSEL ---
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.carousel');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);

        if (slides.length === 0) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => scrollToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        function updateControls() {
            const scrollLeft = carousel.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            const currentIndex = Math.round(scrollLeft / slideWidth);
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function scrollToSlide(index) {
            carousel.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        }

        prevBtn.addEventListener('click', () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        carousel.addEventListener('scroll', updateControls);
        updateControls();
    });

    // --- STICKY CTA & BACK TO TOP ---
    const stickyCTA = document.getElementById('sticky-cta');
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            if (stickyCTA) stickyCTA.classList.add('visible');
            if (backToTop) backToTop.classList.add('visible');
        } else {
            if (stickyCTA) stickyCTA.classList.remove('visible');
            if (backToTop) backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});