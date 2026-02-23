document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER & CONTEXT CTA --- //
    const header = document.getElementById('main-header');
    const contextCta = document.getElementById('context-cta');
    const scrollThreshold = 50;
    const ctaThreshold = 400;

    const handleScroll = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (window.scrollY > ctaThreshold) {
            contextCta.classList.add('visible');
        } else {
            contextCta.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- 2. MOBILE NAVIGATION --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    const toggleMenu = () => {
        const isActive = menuToggle.classList.toggle('active');
        mainNav.classList.toggle('mobile-active');
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.classList.toggle('no-scroll', isActive);
    };

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const createDots = () => {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            const offset = slides[currentIndex].offsetLeft - carousel.offsetLeft;
            carousel.scrollTo({ left: offset, behavior: 'smooth' });
            updateDots();
        };

        const showNext = () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        };

        const showPrev = () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        };

        createDots();
        goToSlide(0);

        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        
        // Touch/Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) showNext();
            if (touchendX > touchstartX) showPrev();
        });
    }

    // --- 5. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    const handleCookieChoice = (accepted) => {
        localStorage.setItem('cookie_consent', accepted ? 'true' : 'false');
        cookieBanner.classList.remove('visible');
    };

    if (cookieBanner && !localStorage.getItem('cookie_consent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        acceptBtn.addEventListener('click', () => handleCookieChoice(true));
        declineBtn.addEventListener('click', () => handleCookieChoice(false));
    }

    // --- 6. GLOBAL LIGHTBOX --- //
    // This is a placeholder for a full implementation. For now, it's not wired up.
    // In a real project, you would add click listeners to gallery images.

    // --- 7. FORM SUBMISSION --- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // In a real scenario, you'd send this data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});