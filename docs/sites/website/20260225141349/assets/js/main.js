document.addEventListener('DOMContentLoaded', () => {

    const initMobileMenu = () => {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (!navToggle || !navMenu) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !body.classList.contains('nav-open');
            body.classList.toggle('nav-open', open);
            navToggle.setAttribute('aria-expanded', open);
            body.classList.toggle('no-scroll', open);
        };

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        document.addEventListener('click', (e) => {
            if (body.classList.contains('nav-open') && !navMenu.contains(e.target)) {
                toggleMenu(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('nav-open')) {
                toggleMenu(false);
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    const initScrollAnimations = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 50}ms`;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;
            
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
            });
        });
    };

    const initCarousel = () => {
        const carousel = document.getElementById('pillars-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            document.querySelector('.carousel-controls').style.display = 'none';
            return;
        }

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Gehe zu Folie ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
        
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });

        updateCarousel();
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');

        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.style.display = 'block';
            setTimeout(() => banner.classList.add('show'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            banner.classList.remove('show');
            localStorage.setItem('cookieConsent', 'true');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initFaqAccordion();
    initCarousel();
    initCookieBanner();
    initStickyCTA();

});