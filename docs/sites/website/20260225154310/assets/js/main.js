document.addEventListener('DOMContentLoaded', () => {

    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const overlay = document.getElementById('mobile-nav-overlay');
        const menu = document.getElementById('mobile-nav-menu');

        if (!toggleBtn || !overlay || !menu) return;

        const openMenu = () => {
            overlay.classList.add('open');
            menu.classList.add('open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
            menu.querySelector('a, button').focus();
        };

        const closeMenu = () => {
            overlay.classList.remove('open');
            menu.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
            toggleBtn.focus();
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
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

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
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
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
            return;
        }

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookiesAccepted')) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            banner.classList.remove('visible');
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const handleScroll = () => {
            if (window.scrollY > 600) {
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
    initScrollReveal();
    initTestimonialCarousel();
    initCookieBanner();
    initStickyCTA();

});