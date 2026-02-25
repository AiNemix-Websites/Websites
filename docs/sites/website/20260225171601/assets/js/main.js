document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
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

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ ACCORDION --- //
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

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageSrc = '';

    function openLightbox(src, alt) {
        if (lightbox && lightboxImg) {
            currentImageSrc = src;
            lightboxImg.setAttribute('src', currentImageSrc);
            lightboxImg.setAttribute('alt', alt);
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleLightboxKeydown);
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleLightboxKeydown);
            // Delay clearing src to avoid visual glitch
            setTimeout(() => { if (lightboxImg) lightboxImg.setAttribute('src', ''); }, 300);
        }
    }

    function handleLightboxKeydown(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }

    if (lightbox) {
        galleryImages.forEach(img => {
            img.addEventListener('click', (e) => {
                const imageElement = e.currentTarget;
                const src = imageElement.dataset.kmImage || imageElement.src;
                const alt = imageElement.alt || 'Großansicht des Bildes';
                // Adjust path for sub-pages if necessary
                const pathPrefix = window.location.pathname.split('/').length > 2 ? '../' : '';
                openLightbox(pathPrefix + src, alt);
            });
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Close on backdrop click
                closeLightbox();
            }
        });

        const closeButton = lightbox.querySelector('.lightbox-close');
        if (closeButton) {
            closeButton.addEventListener('click', closeLightbox);
        }
    }

    // --- STICKY CTA --- //
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            // Show after scrolling 25% down, hide before last 10%
            if (scrollPosition > window.innerHeight * 0.25 && scrollPosition < pageHeight * 0.9) {
                stickyCta.classList.add('show');
            } else {
                stickyCta.classList.remove('show');
            }
        });
    }

});