document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !menuToggle.classList.contains('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        menuToggle.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            // Optional: Close other items
            // accordionItems.forEach(i => i.classList.remove('active'));
            item.classList.toggle('active', !isActive);
            header.setAttribute('aria-expanded', !isActive);
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        let currentIndex = 0;

        const goToSlide = (index) => {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        
        // Basic swipe detection
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) goToSlide(currentIndex + 1);
            if (touchendX > touchstartX) goToSlide(currentIndex - 1);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.classList.add('visible');
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
    
    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

});