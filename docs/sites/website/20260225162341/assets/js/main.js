document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            mobileNavMenu.addEventListener('keydown', trapFocus);
        };

        const closeMenu = () => {
            mobileNavMenu.classList.remove('open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            mobileNavMenu.removeEventListener('keydown', trapFocus);
        };

        mobileNavToggle.addEventListener('click', openMenu);
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('open')) {
                closeMenu();
            }
        });
        
        // Focus trapping for accessibility
        const focusableElements = mobileNavMenu.querySelectorAll('a[href], button');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        function trapFocus(e) {
            let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            if (!isTabPressed) return;

            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const dotsContainer = document.querySelector('.carousel-dots');
        const slides = Array.from(carousel.children);
        const slidesCount = slides.length;

        if (slidesCount > 1) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    carousel.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.dot');
            const updateDots = () => {
                const scrollLeft = carousel.scrollLeft;
                const slideWidth = slides[0].offsetWidth;
                const currentIndex = Math.round(scrollLeft / slideWidth);
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            carousel.addEventListener('scroll', updateDots);
        }
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptBtn = document.querySelector('.cookie-accept');
    const declineBtn = document.querySelector('.cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    const handleConsent = (consent) => {
        localStorage.setItem('cookieConsent', consent);
        cookieBanner.classList.remove('visible');
    };

    if (acceptBtn) acceptBtn.addEventListener('click', () => handleConsent('accepted'));
    if (declineBtn) declineBtn.addEventListener('click', () => handleConsent('declined'));

    // --- Sticky CTA & Back to Top --- //
    const stickyCta = document.querySelector('.sticky-cta');
    const backToTopBtn = document.querySelector('.back-to-top');

    if (stickyCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const viewportHeight = window.innerHeight;

            if (stickyCta) {
                if (scrollPosition > viewportHeight * 0.8) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            }

            if (backToTopBtn) {
                if (scrollPosition > viewportHeight) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }
        });
    }
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});