'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    const mainNavList = document.getElementById('main-nav-list');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });

        mainNav.addEventListener('click', (e) => {
            if (e.target === mainNav) { // Backdrop click
                document.body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                document.body.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = (entry.target.dataset.reveal === 'item' || entry.target.dataset.reveal.startsWith('item')) ? index * 100 : 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => {
             if(el.dataset.reveal === 'group') {
                const children = el.querySelectorAll('h1, h2, h3, p, .button, .card, .step, .pillar-card, .testimonial-card, .faq-item, .form-group, .contact-details-box');
                children.forEach((child, i) => {
                    child.style.transitionDelay = `${i * 100}ms`;
                });
             }
            revealObserver.observe(el);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0, rootMargin: '-200px 0px 0px 0px' });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        let currentIndex = 0;

        const moveToSlide = (index) => {
            carousel.style.transform = 'translateX(' + (-index * 100) + '%)';
            currentIndex = index;
        };

        carousel.style.display = 'flex';
        carousel.style.transition = 'transform 0.4s ease-in-out';

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });

        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextButton.click();
            if (touchendX > touchstartX) prevButton.click();
        });
    }

    // --- FAQ Accordion ---
    const detailsElements = document.querySelectorAll('.faq-list-full .faq-item');
    if(detailsElements.length > 0) {
        detailsElements.forEach(details => {
            const summary = details.querySelector('summary');
            const answer = details.querySelector('.faq-answer');
            summary.addEventListener('click', (e) => {
                e.preventDefault();
                if (details.hasAttribute('open')) {
                    details.removeAttribute('open');
                } else {
                    detailsElements.forEach(d => d.removeAttribute('open'));
                    details.setAttribute('open', '');
                }
            });
        });
    }

    // --- Lightbox (Skeleton) ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
        };

        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        document.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // --- Contact Form Placeholder ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});