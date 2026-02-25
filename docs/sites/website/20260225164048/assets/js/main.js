document.addEventListener('DOMContentLoaded', function() {

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
        const navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);

        const toggleMenu = (isOpen) => {
            const show = typeof isOpen === 'boolean' ? isOpen : !mainNav.classList.contains('is-open');
            menuToggle.setAttribute('aria-expanded', show);
            menuToggle.classList.toggle('is-active', show);
            mainNav.classList.toggle('is-open', show);
            navOverlay.classList.toggle('is-visible', show);
            document.body.classList.toggle('no-scroll', show);
            if(show) {
                mainNav.classList.add('animate-in');
            } else {
                mainNav.classList.remove('animate-in');
            }
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        navOverlay.addEventListener('click', () => toggleMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Animations --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        goToSlide(0); // Initialize
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const declineBtn = document.getElementById('decline-cookies');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('is-visible'), 1000);
        }

        const handleConsent = (consent) => {
            localStorage.setItem('cookieConsent', consent);
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const footer = document.querySelector('.main-footer');
        const showAt = 400;

        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyCTA.classList.remove('is-visible');
                } else if (window.scrollY > showAt) {
                    stickyCTA.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        if (footer) {
            ctaObserver.observe(footer);
        }

        window.addEventListener('scroll', () => {
            if (window.scrollY > showAt && !footer.isIntersecting) {
                 stickyCTA.classList.add('is-visible');
            } else if (window.scrollY <= showAt) {
                stickyCTA.classList.remove('is-visible');
            }
        }, { passive: true });
    }
});