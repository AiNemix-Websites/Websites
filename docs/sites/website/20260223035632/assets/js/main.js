document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.getElementById('main-nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navList.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('is-open')) {
                navToggle.click();
            }
        });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    const observer = new IntersectionObserver((entries) => {
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Carousel --- //
    const carousels = document.querySelectorAll('[data-carousel]');
    carousels.forEach(initCarousel);

    function initCarousel(carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.parentElement.querySelector('[data-carousel-next]');
        const prevButton = carousel.parentElement.querySelector('[data-carousel-prev]');
        const dotsNav = carousel.parentElement.querySelector('[data-carousel-dots]');
        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition); // not needed for flexbox version

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            currentIndex = targetIndex;
            updateDots(targetIndex);
            updateArrows();
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                if (index === 0) button.classList.add('active');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
        }
        const dots = dotsNav ? Array.from(dotsNav.children) : [];

        const updateDots = (targetIndex) => {
            if (!dotsNav) return;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === targetIndex);
            });
        };

        const updateArrows = () => {
            if (!prevButton || !nextButton) return;
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        nextButton?.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
        });

        prevButton?.addEventListener('click', () => {
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });
        
        updateArrows();
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const gallery = document.getElementById('project-gallery');
        let galleryImages = [];
        let currentIndex = 0;

        if (gallery) {
            const imageElements = gallery.querySelectorAll('img');
            imageElements.forEach((img, index) => {
                galleryImages.push({ src: img.src, alt: img.alt });
                img.addEventListener('click', () => {
                    currentIndex = index;
                    openLightbox();
                });
            });
        }

        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const content = lightbox.querySelector('.km-lightbox-content');

        const openLightbox = () => {
            updateImage();
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateImage = () => {
            if (galleryImages.length > 0) {
                content.innerHTML = `<img src='${galleryImages[currentIndex].src}' alt='${galleryImages[currentIndex].alt}'>`;
            }
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
            updateImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
            updateImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const showAt = window.innerHeight * 0.8;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt) {
                stickyCTA.classList.add('show');
            } else {
                stickyCTA.classList.remove('show');
            }
        });
    }

});