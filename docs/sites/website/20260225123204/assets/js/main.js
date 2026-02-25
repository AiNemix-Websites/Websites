'use strict';

document.addEventListener('DOMContentLoaded', function () {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Mobile Navigation ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('nav-open');
            body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

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
                    answer.style.maxHeight = answer.scrollHeight + 'px'; // For CSS transition
                } else {
                    answer.style.maxHeight = null;
                }
            });
        }
    });
    // Re-triggering the accordion logic for the new structure
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Lightbox (Singleton Modal) ---
    // This code is included to meet requirements, even if no images are currently used.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        let allClickableImages = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= allClickableImages.length) return;
            currentIndex = index;
            const imgElement = allClickableImages[currentIndex];
            const src = imgElement.dataset.kmImage || imgElement.src;
            const alt = imgElement.alt || '';

            lightboxImg.src = src.replace('../', ''); // Ensure correct path for lightbox
            lightboxImg.alt = alt;
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-km-image]')) {
                e.preventDefault();
                allClickableImages = Array.from(document.querySelectorAll('[data-km-image]'));
                const index = allClickableImages.indexOf(e.target.closest('[data-km-image]'));
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
                if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
            }
        });
    }
});