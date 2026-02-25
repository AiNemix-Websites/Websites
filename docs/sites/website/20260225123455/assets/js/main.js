document.addEventListener('DOMContentLoaded', () => {

    // --- Helper Functions ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- Sticky Header ---
    const header = select('#main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Mobile Navigation ---
    const mobileMenuToggle = select('#mobile-menu-toggle');
    const mobileMenu = select('#mobile-menu');
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('scroll-lock');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealItems = selectAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => revealObserver.observe(item));

    // --- FAQ Accordion ---
    const faqItems = selectAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const nextBtn = select('.carousel-btn.next');
        const prevBtn = select('.carousel-btn.prev');
        const dotsContainer = select('.carousel-dots');
        let currentIndex = 0;
        let slideInterval;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = selectAll('.carousel-dots .dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        const createDots = () => {
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            });
            updateDots();
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }, 5000);
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
            resetInterval();
        });

        createDots();
        resetInterval();
    }

    // --- Cookie Banner ---
    const cookieBanner = select('#cookie-banner');
    const acceptBtn = select('#cookie-accept');
    const declineBtn = select('#cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = select('#sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the footer is NOT visible
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        const footer = select('.main-footer');
        if (footer) {
            ctaObserver.observe(footer);
        }
    }
    
    // --- Contact Form --- 
    const contactForm = select('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formStatus = select('#form-status');
            formStatus.textContent = 'Nachricht wird gesendet...';
            // This is a dummy handler. In a real project, this would be an AJAX call.
            setTimeout(() => {
                formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                contactForm.reset();
            }, 1500);
        });
    }

});