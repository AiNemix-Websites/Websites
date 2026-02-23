document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE NAVIGATION --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
            mainNav.classList.toggle('mobile-active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                document.body.classList.add('no-scroll');
            } else {
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
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

    revealElements.forEach((el, index) => {
        if (el.classList.contains('reveal-stagger')) {
            el.style.transitionDelay = `${index * 100}ms`;
        }
        observer.observe(el);
    });

    // --- 4. CAROUSEL --- //
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        goToSlide(0);

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    }

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
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

    // --- 6. LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const galleryImages = document.querySelectorAll('.gallery-image-trigger');
        let currentIndex = 0;

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.src;
            const imgAlt = imgElement.alt;
            const dataSrc = imgElement.dataset.kmImage;
            lightboxImage.src = `../${dataSrc}`.replace('../assets', 'assets'); // Adjust path for subpages
            lightboxImage.alt = imgAlt;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(prevIndex);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % galleryImages.length;
            showImage(nextIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // --- 7. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });
        
        const heroSection = document.querySelector('.hero');
        if(heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 8. FAQ Accordion (Single open) --- //
    const faqItems = document.querySelectorAll('.faq-accordion .faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', (event) => {
            if (item.open) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });
});