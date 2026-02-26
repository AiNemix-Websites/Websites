document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('#nav-list');

    if (navToggle && navList) {
        const navBackdrop = document.createElement('div');
        navBackdrop.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; display: none;';
        document.body.appendChild(navBackdrop);

        const openMenu = () => {
            navList.classList.add('is-open');
            navToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            navBackdrop.style.display = 'block';
        };

        const closeMenu = () => {
            navList.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            navBackdrop.style.display = 'none';
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navList.classList.contains('is-open');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        navBackdrop.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navList.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
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

    // --- Testimonials Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelector('.testimonial-slides');
        const slideItems = slides.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            slides.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slideItems.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Gehe zu Stimme ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slideItems.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slideItems.length) % slideItems.length;
            updateCarousel();
        });

        updateDots();
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

    // --- Sticky Context CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        let lastScrollY = window.scrollY;
        let isVisible = false;
        
        window.addEventListener('scroll', () => {
            const shouldBeVisible = window.scrollY > 400 && window.scrollY < (document.body.scrollHeight - window.innerHeight - 400);
            if (shouldBeVisible && !isVisible) {
                contextCta.style.display = 'block';
                contextCta.classList.remove('is-hidden');
                contextCta.classList.add('is-visible');
                isVisible = true;
            } else if (!shouldBeVisible && isVisible) {
                contextCta.classList.remove('is-visible');
                contextCta.classList.add('is-hidden');
                isVisible = false;
            }
        });
    }
});