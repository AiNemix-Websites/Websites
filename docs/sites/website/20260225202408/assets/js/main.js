document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const navMenu = document.querySelector('#mobile-nav-menu');
        if (!navToggle || !navMenu) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('is-open');
            navMenu.classList.toggle('is-open', open);
            navToggle.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        navToggle.addEventListener('click', () => toggleMenu());

        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px', threshold: 1 });

        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        observer.observe(sentinel);
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
        if (revealElements.length === 0) return;

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

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevButton) prevButton.style.display = 'none';
            if(nextButton) nextButton.style.display = 'none';
            return;
        }

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        if (dotsContainer) {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                dot.setAttribute('aria-label', `Gehe zu Zitat ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        updateCarousel();
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const cookieAccepted = localStorage.getItem('cookie_consent_ym');
        if (!cookieAccepted) {
            banner.hidden = false;
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent_ym', 'true');
            banner.hidden = true;
        });
    };

    const initBackToTop = () => {
        const button = document.getElementById('back-to-top');
        if (!button) return;

        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                button.hidden = false;
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
                // Wait for transition to finish before hiding
                setTimeout(() => { if(window.scrollY <= 300) button.hidden = true; }, 300);
            }
        };

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', toggleVisibility);
        toggleVisibility(); // Initial check
    };

    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const observer = new IntersectionObserver(([entry]) => {
            const isVisible = !entry.isIntersecting && window.scrollY > 400;
            cta.hidden = !isVisible;
            if (isVisible) {
                 setTimeout(() => cta.classList.add('visible'), 10);
            } else {
                cta.classList.remove('visible');
            }
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            observer.observe(heroSection);
        }
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initTestimonialCarousel();
    initCookieBanner();
    initBackToTop();
    initStickyCta();
});