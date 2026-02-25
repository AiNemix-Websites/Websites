document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
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
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavBackdrop = document.querySelector('.mobile-nav-backdrop');

    const toggleMobileMenu = (isOpen) => {
        if (isOpen) {
            mobileNavMenu.classList.add('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        } else {
            mobileNavMenu.classList.remove('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => toggleMobileMenu(true));
        mobileNavClose.addEventListener('click', () => toggleMobileMenu(false));
        mobileNavBackdrop.addEventListener('click', () => toggleMobileMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                toggleMobileMenu(false);
            }
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
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

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
        
        updateCarousel(); // Initial call
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 400;
            if (window.scrollY > heroHeight) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Show banner if consent not given
        if (!localStorage.getItem('cookie_consent_given')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000); // Delay for effect
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent_given', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => {
                 cookieBanner.style.display = 'none';
            }, 500);
        });
    }

});