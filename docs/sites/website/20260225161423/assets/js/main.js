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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const toggleMobileMenu = () => {
        const isOpen = mobileNavMenu.classList.toggle('open');
        mobileNavToggle.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('scroll-locked', isOpen);
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', toggleMobileMenu);
        if(mobileNavClose) mobileNavClose.addEventListener('click', toggleMobileMenu);

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (mobileNavMenu.classList.contains('open') && !mobileNavMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                toggleMobileMenu();
            }
        });
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger')) {
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        setTimeout(() => {
                            children[i].classList.add('revealed');
                        }, i * 150);
                    }
                } else {
                    entry.target.classList.add('revealed');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner --- //
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

    // --- Before/After Slider --- //
    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        baSlider.addEventListener('input', (e) => {
            const afterImage = document.querySelector('.ba-image.after');
            if (afterImage) {
                afterImage.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
            }
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
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
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % slides.length;
            goToSlide(newIndex);
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(newIndex);
        });

        goToSlide(0);
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = document.getElementById('km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            currentImageIndex = index;
            const imgElement = galleryImages[currentImageIndex];
            const imagePath = imgElement.dataset.kmImage.startsWith('../') ? imgElement.dataset.kmImage : `../${imgElement.dataset.kmImage}`.replace('../assets', 'assets');
            const pageDepth = window.location.pathname.split('/').length - 2;
            let finalPath = '';
            if(pageDepth > 0) {
                finalPath = `../${imgElement.dataset.kmImage}`;
            } else {
                finalPath = imgElement.dataset.kmImage;
            }

            lightboxImage.src = finalPath;
            lightboxImage.alt = imgElement.alt;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        const showPrev = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(currentImageIndex);
        };

        const showNext = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            openLightbox(currentImageIndex);
        };

        document.querySelectorAll('.lightbox-trigger').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const footerSection = document.querySelector('.site-footer-main');
        
        const handleScroll = () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            const footerTop = footerSection.getBoundingClientRect().top;

            if (heroBottom < 0 && footerTop > window.innerHeight) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

});