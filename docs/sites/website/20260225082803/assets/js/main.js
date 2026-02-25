'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        const stickyThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > stickyThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            if (isOpen) {
                mobileMenu.style.display = 'flex';
                setTimeout(() => mobileMenu.classList.add('open'), 10);
                document.body.classList.add('scroll-locked');
            } else {
                mobileMenu.classList.remove('open');
                setTimeout(() => { mobileMenu.style.display = 'none'; }, 300);
                document.body.classList.remove('scroll-locked');
            }
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'flex';
        }
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (element.dataset.staggerDelay) {
                    const items = element.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * parseInt(element.dataset.staggerDelay));
                    });
                } else {
                    element.classList.add('visible');
                }
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.display = isExpanded ? 'none' : 'block';
            });
        }
    });

    // --- Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const closeBtn = lightbox ? lightbox.querySelector('.close-btn') : null;
    const triggers = document.querySelectorAll('.lightbox-trigger');

    const openLightbox = (src, alt) => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.style.display = 'flex';
        setTimeout(() => lightbox.classList.add('visible'), 10);
        document.body.classList.add('scroll-locked');
        addLightboxListeners();
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('visible');
        setTimeout(() => {
            lightbox.style.display = 'none';
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
        document.body.classList.remove('scroll-locked');
        removeLightboxListeners();
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
    };

    const addLightboxListeners = () => {
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', handleKeydown);
    };

    const removeLightboxListeners = () => {
        if (closeBtn) closeBtn.removeEventListener('click', closeLightbox);
        document.removeEventListener('keydown', handleKeydown);
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const src = trigger.dataset.kmImage || trigger.src;
            const alt = trigger.alt || 'Detailansicht';
            openLightbox(src, alt);
        });
    });

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const ctaThreshold = 400;
        window.addEventListener('scroll', () => {
            if (window.scrollY > ctaThreshold) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

});