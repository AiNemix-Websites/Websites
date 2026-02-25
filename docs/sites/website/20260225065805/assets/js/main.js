document.addEventListener('DOMContentLoaded', () => {

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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('is-open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            mobileMenu.querySelector('a').focus();
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

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
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        const slides = document.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const updateCarousel = () => {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        };
        
        // Simplified scroll-based carousel for touch
        carousel.addEventListener('scroll', () => {
            currentIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        });
        
        const showSlide = (index) => {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;
            slides[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            currentIndex = index;
        }

        if(prevButton && nextButton) {
            prevButton.addEventListener('click', () => showSlide(currentIndex - 1));
            nextButton.addEventListener('click', () => showSlide(currentIndex + 1));
        }
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('is-visible');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const galleryItems = document.querySelectorAll('[data-lightbox-src]');
    let currentImageIndex = -1;

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        const showImage = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentImageIndex = index;
            lightboxImg.src = galleryItems[index].dataset.lightboxSrc;
            lightbox.classList.add('is-visible');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = '';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => showImage(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('is-visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        });
    }
    
    // --- Sticky CTA Bar --- //
    const stickyCTA = document.querySelector('.sticky-cta-bar');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('is-visible');
                } else {
                    stickyCTA.classList.remove('is-visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});