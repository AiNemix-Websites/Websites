document.addEventListener('DOMContentLoaded', () => {

    // --- UTILS ---
    const $ = selector => document.querySelector(selector);
    const $$ = selector => document.querySelectorAll(selector);

    // --- STICKY HEADER ---
    const initStickyHeader = () => {
        const header = $('#main-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { threshold: 0.99, rootMargin: '-80px 0px 0px 0px' });

        observer.observe(document.body);
    };

    // --- MOBILE NAVIGATION ---
    const initMobileNav = () => {
        const toggleButtons = $$('.mobile-nav-toggle');
        const mobileNav = $('#mobile-nav');
        if (toggleButtons.length === 0 || !mobileNav) return;

        const toggleNav = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : mobileNav.getAttribute('aria-hidden') === 'true';
            mobileNav.setAttribute('aria-hidden', !open);
            toggleButtons.forEach(btn => btn.setAttribute('aria-expanded', open));
            document.body.classList.toggle('no-scroll', open);
        };

        toggleButtons.forEach(button => {
            button.addEventListener('click', () => toggleNav());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.getAttribute('aria-hidden') === 'false') {
                toggleNav(false);
            }
        });
    };

    // --- SCROLL REVEAL ANIMATION ---
    const initScrollReveal = () => {
        const revealElements = $$('.scroll-reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay || '0', 10);
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- COOKIE BANNER ---
    const initCookieBanner = () => {
        const banner = $('#cookie-banner');
        const acceptBtn = $('#accept-cookies');
        const declineBtn = $('#decline-cookies');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (consent) return;

        banner.setAttribute('aria-hidden', 'false');

        const handleConsent = () => {
            localStorage.setItem('cookie_consent', 'true');
            banner.setAttribute('aria-hidden', 'true');
        };

        acceptBtn.addEventListener('click', handleConsent);
        declineBtn.addEventListener('click', handleConsent);
    };

    // --- TESTIMONIAL CAROUSEL ---
    const initTestimonialCarousel = () => {
        const carousel = $('.testimonial-carousel');
        const dotsContainer = $('.carousel-dots');
        if (!carousel || !dotsContainer) return;

        const slides = Array.from(carousel.children);
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const button = document.createElement('button');
            button.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(button);
        });

        const dots = Array.from(dotsContainer.children);

        const updateCarousel = () => {
            carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        carousel.addEventListener('scroll', () => {
            const newIndex = Math.round(carousel.scrollLeft / carousel.offsetWidth);
            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            }
        });
        
        updateCarousel();
    };

    // --- LIGHTBOX ---
    const initLightbox = () => {
        const lightbox = $('#km-lightbox');
        if (!lightbox) return;

        const content = $('.km-lightbox-content');
        const image = $('.km-lightbox-image');
        const closeBtn = $('.km-lightbox-close');
        const backdrop = $('.km-lightbox-backdrop');
        const galleryImages = $$('[data-lightbox-src]');

        const openLightbox = (src, alt) => {
            image.src = src;
            image.alt = alt;
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            image.src = '';
        };

        galleryImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(img.dataset.lightboxSrc, img.alt);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) {
                closeLightbox();
            }
        });
    };
    
    // --- STICKY CTA ---
    const initStickyCta = () => {
        const cta = $('#sticky-cta');
        if (!cta) return;
        
        const heroSection = $('.hero');
        if (!heroSection) return; // Only show on pages with a hero

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('is-visible', !entry.isIntersecting);
            cta.setAttribute('aria-hidden', entry.isIntersecting);
        }, { threshold: 0 });

        observer.observe(heroSection);
    };
    
    // --- CONTACT FORM ---
    const initContactForm = () => {
        const form = $('#contact-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden. (Dies ist eine Demo - es wurde keine E-Mail gesendet)');
            form.reset();
        });
    };

    // --- INITIALIZE ALL MODULES ---
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initCookieBanner();
    initTestimonialCarousel();
    initLightbox();
    initStickyCta();
    initContactForm();
});