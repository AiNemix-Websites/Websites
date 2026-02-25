document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !menuToggle.classList.contains('open');
            menuToggle.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        menuToggle.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- ACCORDION --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
        });
    });

    // --- TESTIMONIALS CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-controls .prev');
        const nextButton = document.querySelector('.carousel-controls .next');
        const slides = document.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.scrollTo({ left: currentIndex * slideWidth, behavior: 'smooth' });
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

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('show');
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- STICKY CTA & BACK TO TOP --- //
    const stickyCta = document.getElementById('sticky-cta');
    const backToTopBtn = document.getElementById('back-to-top');
    if (stickyCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 300;
            if (stickyCta) stickyCta.classList.toggle('show', show);
            if (backToTopBtn) backToTopBtn.classList.toggle('show', show);
        });
    }
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});