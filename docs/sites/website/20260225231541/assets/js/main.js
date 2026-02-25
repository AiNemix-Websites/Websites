document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        const toggleNav = () => {
            document.body.classList.toggle('nav-open');
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
        };

        navToggle.addEventListener('click', toggleNav);

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                toggleNav();
            }
        });

        // Close on backdrop click
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('nav-open') && e.target === document.body) {
                toggleNav();
            }
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slider = carousel.querySelector('.testimonial-slider');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        const dotsContainer = carousel.querySelector('.dots');
        let currentIndex = 0;

        if (slides.length > 1) {
            // Create dots
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });

            const dots = dotsContainer.querySelectorAll('.dot');

            const updateCarousel = () => {
                slider.style.transform = `translateX(-${currentIndex * 100}%)`;
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            const goToSlide = (index) => {
                currentIndex = index;
                updateCarousel();
            };

            const showNext = () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            };

            const showPrev = () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            };

            nextBtn.addEventListener('click', showNext);
            prevBtn.addEventListener('click', showPrev);

            // Autoplay
            let autoPlayInterval = setInterval(showNext, 7000);
            carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
            carousel.addEventListener('mouseleave', () => autoPlayInterval = setInterval(showNext, 7000));
        }
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        const handleConsent = (value) => {
            localStorage.setItem('cookieConsent', value);
            cookieBanner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const handleScrollCta = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScrollCta, { passive: true });
    }

    // --- CONTACT FORM SUBMISSION (PREVENT DEFAULT) --- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }

});