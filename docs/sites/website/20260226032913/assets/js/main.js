document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.getElementById('mobile-nav-toggle');
    const mainNav = document.getElementById('main-menu');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
            document.body.classList.toggle('scroll-lock');
        });
    }

    // --- STICKY HEADER --- //
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

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('visible'), 10);
            }
        }, 2000);

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the main CTA footer is NOT visible
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyCTA.style.display = 'block';
                    setTimeout(() => stickyCTA.classList.add('visible'), 10);
                } else {
                    stickyCTA.classList.remove('visible');
                    setTimeout(() => stickyCTA.style.display = 'none', 400);
                }
            });
        }, { threshold: 0.1 });

        const footerCTA = document.querySelector('.cta-footer');
        if(footerCTA) ctaObserver.observe(footerCTA);
    }

    // --- PROJECTS CAROUSEL --- //
    const carousel = document.getElementById('projects-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('carousel-next');
        const prevButton = document.getElementById('carousel-prev');
        
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        const moveToSlide = (track, currentSlide, targetSlide) => {
            const amountToMove = targetSlide.offsetLeft - currentSlide.offsetLeft;
            track.style.transform = 'translateX(-' + targetSlide.offsetLeft + 'px)';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateSlideWidth = () => {
            let slidesInView = 1;
            if (window.innerWidth > 768) slidesInView = 2;
            if (window.innerWidth <= 500) slidesInView = 1;
            
            const containerWidth = carousel.clientWidth;
            slideWidth = containerWidth / slidesInView;
            slides.forEach(s => s.style.flexBasis = `${slideWidth}px`);
            track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
        }

        nextButton.addEventListener('click', e => {
            currentIndex++;
            if (currentIndex >= slides.length) currentIndex = 0;
            track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
        });

        prevButton.addEventListener('click', e => {
            currentIndex--;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            track.style.transform = 'translateX(-' + (currentIndex * slideWidth) + 'px)';
        });

        window.addEventListener('resize', updateSlideWidth);
        updateSlideWidth();
    }

    // --- LIGHTBOX (Structure only, no images to trigger) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const content = lightbox.querySelector('.km-lightbox-content');
        let currentImageIndex = -1;
        let galleryImages = [];

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('scroll-lock');
            document.removeEventListener('keydown', handleKeydown);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

});