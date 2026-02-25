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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const body = document.body;

    const openMobileMenu = () => {
        mobileNavMenu.style.display = 'block';
        setTimeout(() => {
            mobileNavMenu.classList.add('open');
            body.style.overflow = 'hidden';
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }, 10);
    };

    const closeMobileMenu = () => {
        mobileNavMenu.classList.remove('open');
        body.style.overflow = '';
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            mobileNavMenu.style.display = 'none';
        }, 300);
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if(entry.target.classList.contains('stagger-children')){
                    const children = entry.target.children;
                    for(let i = 0; i < children.length; i++){
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;

        const dots = slides.map((_, i) => {
            const button = document.createElement('button');
            if (i === 0) button.classList.add('active');
            button.addEventListener('click', () => moveToSlide(i));
            return button;
        });
        dots.forEach(dot => dotsNav.appendChild(dot));

        const setSlidePosition = () => {
            slideWidth = slides[0].getBoundingClientRect().width;
            carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
        };

        const updateDots = () => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        const moveToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;
            carousel.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
            updateDots();
        };

        nextButton.addEventListener('click', () => moveToSlide(currentIndex + 1));
        prevButton.addEventListener('click', () => moveToSlide(currentIndex - 1));
        window.addEventListener('resize', setSlidePosition);
        setSlidePosition();
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryImages = Array.from(document.querySelectorAll('.image-gallery .lightbox-trigger'));
    let currentImageIndex = 0;

    const showImage = (index) => {
        if (index < 0 || index >= galleryImages.length) return;
        currentImageIndex = index;
        const imgElement = galleryImages[currentImageIndex];
        const imagePath = imgElement.getAttribute('data-km-image');
        lightboxImage.setAttribute('src', window.location.pathname.includes('/index.html') || !window.location.pathname.endsWith('/') ? imagePath : `../${imagePath}`);
    };

    const openLightbox = (e) => {
        const clickedImage = e.target;
        const index = galleryImages.indexOf(clickedImage);
        if (index > -1) {
            showImage(index);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (lightbox) {
        lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = () => {
        cookieBanner.classList.remove('visible');
        localStorage.setItem('cookieConsent', 'true');
    };

    if (acceptButton) acceptButton.addEventListener('click', handleConsent);
    if (declineButton) declineButton.addEventListener('click', handleConsent);

    // --- Sticky CTA --- //
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -200px 0px' });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});