document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const sticky = header.offsetTop;
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > sticky + 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navClose = document.querySelector('.mobile-nav-close');
    const mobileNav = document.getElementById('mobile-nav');

    const openNav = () => {
        document.body.classList.add('mobile-nav-open', 'scroll-locked');
        mobileNav.setAttribute('aria-hidden', 'false');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileNav.querySelector('a').focus();
    };

    const closeNav = () => {
        document.body.classList.remove('mobile-nav-open', 'scroll-locked');
        mobileNav.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
    };

    if (navToggle && mobileNav) {
        navToggle.addEventListener('click', openNav);
        navClose.addEventListener('click', closeNav);
        
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('mobile-nav-open') && !mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
                closeNav();
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
    };

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Lightbox (Singleton) --- //
    // NOTE: This is included to meet requirements, but will not be triggered as there are no images.
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const closeButton = lightbox.querySelector('.km-lightbox-close');
    const imageElements = document.querySelectorAll('[data-km-image]');
    let currentIndex = 0;

    if (lightbox) {
        const openLightbox = (index) => {
            currentIndex = index;
            const imagePath = imageElements[currentIndex].getAttribute('data-km-image');
            lightboxImage.setAttribute('src', imagePath);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.setAttribute('src', '');
            }, 350);
        };

        imageElements.forEach((el, index) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // --- Global ESC key listener --- //
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile nav
            if (document.body.classList.contains('mobile-nav-open')) {
                closeNav();
            }
            // Close lightbox
            if (lightbox && lightbox.classList.contains('visible')) {
                 const closeBtn = lightbox.querySelector('.km-lightbox-close');
                 if(closeBtn) closeBtn.click();
            }
        }
    });
});