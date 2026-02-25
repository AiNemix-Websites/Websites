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

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mainNav.classList.toggle('is-open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel ---
    const carousels = document.querySelectorAll('.testimonial-carousel-wrapper');
    carousels.forEach(wrapper => {
        const carousel = wrapper.querySelector('.testimonial-carousel');
        const slides = wrapper.querySelectorAll('.testimonial-slide');
        const prevButton = wrapper.querySelector('.carousel-prev');
        const nextButton = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        if (!carousel || slides.length === 0) return;

        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        const goNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const goPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        if (prevButton) prevButton.addEventListener('click', goPrev);
        if (nextButton) nextButton.addEventListener('click', goNext);

        updateCarousel();
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
            });
        }
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

});