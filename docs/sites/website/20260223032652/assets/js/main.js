document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isOpen = item.classList.toggle('open');
            question.setAttribute('aria-expanded', isOpen);
        });
    });

    // --- Testimonial Carousel --- //
    const carousels = document.querySelectorAll('.testimonial-carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.testimonial-carousel');
        const slides = wrapper.querySelectorAll('.testimonial-slide');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel || slides.length === 0) return;

        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = Array.from(dotsContainer.children);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }

        updateCarousel();
    });

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let currentGroup = [];
        let currentIndex = -1;

        const openLightbox = (group, index) => {
            currentGroup = group;
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateLightboxImage = () => {
            if (currentIndex >= 0 && currentIndex < currentGroup.length) {
                const item = currentGroup[currentIndex];
                lightboxImg.src = item.href;
                lightboxImg.alt = item.querySelector('img')?.alt || 'Galeriebild';
            }
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : currentGroup.length - 1;
            updateLightboxImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex < currentGroup.length - 1) ? currentIndex + 1 : 0;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const groupName = trigger.dataset.lightboxTrigger;
                const groupElements = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${groupName}']`));
                const clickedIndex = groupElements.indexOf(trigger);
                openLightbox(groupElements, clickedIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const footer = document.querySelector('.main-footer');
    if (stickyCTA && footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when footer is NOT visible
                stickyCTA.classList.toggle('show', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        observer.observe(footer);
    }

    // --- Modernisierungsrechner --- //
    const rechner = document.querySelector('.rechner-ui');
    if (rechner) {
        const steps = rechner.querySelectorAll('.rechner-step');
        const options = rechner.querySelectorAll('.rechner-option');

        options.forEach(option => {
            option.addEventListener('click', () => {
                const currentStepElem = option.closest('.rechner-step');
                const nextStep = option.dataset.next;
                const nextStepElem = rechner.querySelector(`[data-step='${nextStep}']`);

                if (currentStepElem) currentStepElem.classList.remove('active');
                if (nextStepElem) nextStepElem.classList.add('active');
            });
        });
    }
});