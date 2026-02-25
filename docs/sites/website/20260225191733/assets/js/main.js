'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler(); // Initial check
    }

    // --- Mobile Menu ---
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('is-open');
            document.body.classList.add('scroll-locked');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('is-open');
            document.body.classList.remove('scroll-locked');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', openMenu);
    }
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('scroll-locked')) { // Click on backdrop
            closeMenu();
        }
    });

    // --- Scroll Reveal Animations ---
    const revealItems = document.querySelectorAll('.reveal-item, .reveal-group');
    if (revealItems.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        revealItems.forEach(item => observer.observe(item));
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
            updateDots(0);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(prevIndex);
            });
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (rejectBtn) rejectBtn.addEventListener('click', () => handleConsent('rejected'));

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaScrollHandler = () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', ctaScrollHandler, { passive: true });
    }

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const bttScrollHandler = () => {
            if (window.scrollY > window.innerHeight) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', bttScrollHandler, { passive: true });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lightbox (Singleton) ---
    // NOTE: This is prepared for when images are added. No triggers exist yet.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const lightboxImg = lightbox.querySelector('img');
        let currentGallery = [];
        let currentIndex = -1;

        const openLightbox = (gallery, index) => {
            currentGallery = gallery;
            currentIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'block';
            document.body.classList.add('scroll-locked');
            setTimeout(() => lightbox.style.opacity = 1, 10);
        };

        const closeLightbox = () => {
            lightbox.style.opacity = 0;
            document.body.classList.remove('scroll-locked');
            setTimeout(() => {
                lightbox.style.display = 'none';
                if(lightboxImg) lightboxImg.src = '';
            }, 300);
        };

        const updateLightboxImage = () => {
            if (currentIndex >= 0 && currentIndex < currentGallery.length) {
                const item = currentGallery[currentIndex];
                if(lightboxImg) {
                    lightboxImg.src = item.src;
                    lightboxImg.alt = item.alt;
                    lightboxImg.dataset.kmImage = item.dataset.kmImage;
                }
            }
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });

        // Example Event Delegation (add a class 'lightbox-trigger' to images)
        // document.body.addEventListener('click', (e) => {
        //     if (e.target.matches('.lightbox-trigger')) {
        //         e.preventDefault();
        //         const galleryItems = Array.from(document.querySelectorAll('.lightbox-trigger'));
        //         const index = galleryItems.indexOf(e.target);
        //         openLightbox(galleryItems, index);
        //     }
        // });
    }
});