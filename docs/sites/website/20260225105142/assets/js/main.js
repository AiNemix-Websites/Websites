document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
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

    // Mobile Menu
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                menuToggle.click();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                menuToggle.click();
            }
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
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

    // Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const slides = document.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        if(prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateCarousel();
            });

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            });
        }
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // Sticky CTA
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

});