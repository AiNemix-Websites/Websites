document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const initMobileMenu = () => {
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const navContainer = document.querySelector('.mobile-nav-container');
        if (!toggleButton || !navContainer) return;

        toggleButton.addEventListener('click', () => {
            const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
            toggleButton.setAttribute('aria-expanded', !isExpanded);
            toggleButton.classList.toggle('active');
            navContainer.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        navContainer.addEventListener('click', (e) => {
            if (e.target === navContainer) {
                toggleButton.click();
            }
        });
    };

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.querySelector('.site-header.sticky');
        if (!header) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    };

    // --- Scroll Animations --- //
    const initScrollReveal = () => {
        const animatedElements = document.querySelectorAll('.animate-in');
        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    };

    // --- Testimonial Carousel --- //
    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            document.querySelector('.carousel-controls').style.display = 'none';
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        };

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        goToSlide(0); // Initialize
    };

    // --- FAQ Accordion --- //
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                item.classList.toggle('active');
            });
        });
    };
    
    // --- Contact Form --- //
    const initContactForm = () => {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        const successMessage = form.querySelector('.form-success-message');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a simulation. In a real project, this would send data to a server.
            const formData = new FormData(form);
            const name = formData.get('name');
            
            // Simple validation check
            if (form.checkValidity()) {
                successMessage.textContent = `Vielen Dank, ${name}! Ihre Nachricht wurde empfangen.`;
                successMessage.style.display = 'block';
                form.reset();
                setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
            }
        });
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        if (!banner || !acceptBtn) return;

        const cookieAccepted = localStorage.getItem('cookieConsent');

        if (!cookieAccepted) {
            banner.style.display = 'block';
            setTimeout(() => banner.classList.add('show'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('show');
            setTimeout(() => banner.style.display = 'none', 500);
        });
    };

    // --- Sticky CTA Bar --- //
    const initStickyCtaBar = () => {
        const ctaBar = document.querySelector('.sticky-cta-bar');
        if (!ctaBar) return;
        const cookieBanner = document.getElementById('cookie-banner');

        const onScroll = () => {
            const isCookieBannerVisible = cookieBanner && getComputedStyle(cookieBanner).display !== 'none' && cookieBanner.classList.contains('show');
            if (window.scrollY > window.innerHeight * 0.5 && !isCookieBannerVisible) {
                ctaBar.classList.add('show');
            } else {
                ctaBar.classList.remove('show');
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        // Also check when cookie banner is dismissed
        const acceptBtn = document.getElementById('accept-cookies');
        if(acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                setTimeout(onScroll, 550); // Re-check after banner hides
            });
        }
    };

    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initScrollReveal();
    initTestimonialCarousel();
    initFaqAccordion();
    initContactForm();
    initCookieBanner();
    initStickyCtaBar();
});
