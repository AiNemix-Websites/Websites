document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // --- Mobile Navigation ---
    const initMobileNav = () => {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        const nav = document.querySelector('.main-nav');
        if (!toggleBtn || !nav) return;

        const openMenu = () => {
            toggleBtn.classList.add('is-active');
            toggleBtn.setAttribute('aria-label', 'Menü schließen');
            nav.classList.add('mobile-active', 'open');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            toggleBtn.classList.remove('is-active');
            toggleBtn.setAttribute('aria-label', 'Menü öffnen');
            nav.classList.remove('open');
            setTimeout(() => nav.classList.remove('mobile-active'), 300);
            document.body.classList.remove('no-scroll');
        };

        toggleBtn.addEventListener('click', () => {
            if (toggleBtn.classList.contains('is-active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.body.addEventListener('click', (e) => {
            if (e.target.matches('body.no-scroll::before')) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('no-scroll')) {
                closeMenu();
            }
        });
    };

    // --- Scroll Reveal Animation ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- Testimonial Carousel ---
    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        let currentIndex = 0;

        if (slides.length === 0) return;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        };

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        showSlide(0);
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');
        if (!banner || !acceptBtn || !declineBtn) return;

        const cookieConsent = localStorage.getItem('cookie_consent');

        if (!cookieConsent) {
            banner.classList.add('show');
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookie_consent', consent);
            banner.classList.remove('show');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    };

    // --- Global Lightbox (Structure only, no images to click) ---
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;
        const closeBtn = lightbox.querySelector('.close-lightbox');

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    };

    // --- Sticky CTA ---
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const trigger = document.querySelector('.hero'); // Show after hero
        if (!cta || !trigger) return;

        const observer = new IntersectionObserver(([entry]) => {
            cta.classList.toggle('visible', !entry.isIntersecting);
        }, { rootMargin: '0px', threshold: 0 });

        observer.observe(trigger);
    };

    // --- Contact Form Handler ---
    const initContactForm = () => {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.getElementById('form-success-message');
            // This is a static site, so we just show a success message.
            form.style.display = 'none';
            successMessage.style.display = 'block';
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initTestimonialCarousel();
    initCookieBanner();
    initLightbox();
    initStickyCTA();
    initContactForm();
});
