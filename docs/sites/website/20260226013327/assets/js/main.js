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
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('#nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('open');
            navList.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Accordion for FAQ --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
        });
    });

    // --- Carousel --- //
    const carousels = document.querySelectorAll('.carousel-wrapper');
    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = wrapper.querySelector('.next');
        const prevButton = wrapper.querySelector('.prev');
        const dotsNav = wrapper.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
            if (dotsNav) {
                const currentDot = dotsNav.querySelector('.active');
                if(currentDot) currentDot.classList.remove('active');
                dotsNav.children[currentIndex].classList.add('active');
            }
        };

        if (dotsNav) {
            slides.forEach((slide, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(dot);
            });
        }

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        // Touch/Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        track.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX && currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            } else if (touchendX > touchstartX && currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });

        updateControls();
    });

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
        const galleryImages = Array.from(lightboxTriggers).map(img => img.dataset.kmImage || img.src);
        let currentIndex = 0;

        const showImage = (index) => {
            const imagePath = galleryImages[index];
            const relativePath = lightboxImg.src.includes('/assets/') ? '../' : '';
            lightboxImg.src = `${relativePath}${imagePath}`.replace('../assets/','assets/'); // Simple path correction
            currentIndex = index;
        };

        lightboxTriggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                const rootPath = trigger.getAttribute('data-km-image');
                currentIndex = galleryImages.findIndex(path => path === rootPath);
                lightboxImg.src = trigger.src;
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('show'), 10);
                document.body.style.overflow = 'hidden';
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => lightbox.style.display = 'none', 300);
            document.body.style.overflow = '';
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            showImage(currentIndex);
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(currentIndex);
        };

        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-next').addEventListener('click', showNext);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNext();
                if (e.key === 'ArrowLeft') showPrev();
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.style.display = 'block';
                    setTimeout(() => stickyCTA.classList.add('show'), 10);
                } else {
                    stickyCTA.classList.remove('show');
                    setTimeout(() => stickyCTA.style.display = 'none', 300);
                }
            });
        }, { threshold: 0.1 });

        const hero = document.querySelector('.hero, .page-hero');
        if (hero) ctaObserver.observe(hero);
    }
});