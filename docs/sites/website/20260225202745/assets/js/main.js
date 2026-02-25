document.addEventListener('DOMContentLoaded', function() {

    // --- HEADER & MOBILE MENU --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Sticky header shrink
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpened = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isOpened);
            mobileMenuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
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

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;
        let slideWidth = slides[0].offsetWidth;

        // Create dots
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
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

        window.addEventListener('resize', () => {
            slideWidth = slides[0].offsetWidth;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookieConsent', 'true');
        });
    }
    
    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if(stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

});