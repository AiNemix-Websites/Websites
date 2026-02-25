document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    function openMobileNav() {
        mobileNav.classList.add('is-open');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('scroll-locked');
        mobileNavClose.focus();
    }

    function closeMobileNav() {
        mobileNav.classList.remove('is-open');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
        mobileNavToggle.focus();
    }

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', openMobileNav);
        mobileNavClose.addEventListener('click', closeMobileNav);

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeMobileNav();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMobileNav();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });
        };

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
        
        // Basic touch swipe
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', function(event) {
            touchstartX = event.changedTouches[0].screenX;
        }, false);

        carousel.addEventListener('touchend', function(event) {
            touchendX = event.changedTouches[0].screenX;
            handleSwipe();
        }, false); 

        function handleSwipe() {
            if (touchendX < touchstartX) {
                nextButton.click();
            }
            if (touchendX > touchstartX) {
                prevButton.click();
            }
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('is-visible');
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('is-visible');
                } else {
                    stickyCta.classList.remove('is-visible');
                }
            });
        }, { threshold: 0 });

        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});