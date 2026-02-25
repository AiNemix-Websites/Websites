document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Sticky Header
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

    // 2. Mobile Navigation
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('open');
            mainNav.classList.toggle('mobile-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });

        mainNav.addEventListener('click', (e) => {
            if (e.target === mainNav) { // Click on backdrop
                navToggle.click();
            }
        });
    }

    // 3. Scroll Reveal Animations
    if (!isReducedMotion) {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => i.classList.remove('open'));
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    });

    // 5. Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        } else {
            cookieBanner.classList.add('hidden');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.add('hidden');
        });
    }

    // 6. Before/After Comparison Slider
    const comparisonSlider = document.querySelector('.comparison-slider');
    if (comparisonSlider) {
        const sliderAfter = comparisonSlider.querySelector('.comparison-slider__after');
        const sliderHandle = comparisonSlider.querySelector('.comparison-slider__handle');
        const sliderInput = comparisonSlider.querySelector('.comparison-slider__range');

        const moveSlider = (value) => {
            sliderAfter.style.width = value + '%';
            sliderHandle.style.left = value + '%';
        };

        sliderInput.addEventListener('input', (e) => {
            moveSlider(e.target.value);
        });

        // For touch devices
        sliderInput.addEventListener('touchstart', () => {}, { passive: true });
        sliderInput.addEventListener('touchmove', (e) => {
            const rect = comparisonSlider.getBoundingClientRect();
            let x = e.touches[0].clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            sliderInput.value = percentage;
            moveSlider(percentage);
        }, { passive: true });
    }

    // 7. Sticky CTA
    const stickyCTA = document.querySelector('.sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        ctaObserver.observe(heroSection);
    }

    // 8. Global Lightbox
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox__close');
        const prevBtn = lightbox.querySelector('.lightbox__prev');
        const nextBtn = lightbox.querySelector('.lightbox__next');
        const triggers = document.querySelectorAll('[data-lightbox-trigger]');
        let gallery = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            lightboxImg.src = gallery[currentIndex].href;
            lightboxImg.alt = gallery[currentIndex].querySelector('img')?.alt || 'Galeriebild';
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            updateNavButtons();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 200);
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => {
            if (currentIndex > 0) {
                openLightbox(currentIndex - 1);
            }
        };

        const showNext = () => {
            if (currentIndex < gallery.length - 1) {
                openLightbox(currentIndex + 1);
            }
        };

        const updateNavButtons = () => {
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < gallery.length - 1 ? 'block' : 'none';
        };

        triggers.forEach((trigger, index) => {
            gallery.push(trigger);
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

});