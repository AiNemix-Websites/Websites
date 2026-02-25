document.addEventListener('DOMContentLoaded', function() {

    // --- Header Scroll Effect ---
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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    if (menuToggle && mobileNavContainer) {
        const toggleMenu = (forceClose = false) => {
            const isActive = menuToggle.classList.contains('is-active');
            if (forceClose || isActive) {
                menuToggle.classList.remove('is-active');
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNavContainer.classList.remove('is-active');
                document.body.classList.remove('no-scroll');
            } else {
                menuToggle.classList.add('is-active');
                menuToggle.setAttribute('aria-expanded', 'true');
                mobileNavContainer.classList.add('is-active');
                document.body.classList.add('no-scroll');
            }
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                toggleMenu(true);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.classList.contains('is-active')) {
                toggleMenu(true);
            }
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        // Swipe functionality
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    }

    // --- FAQ Accordion ---
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

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

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
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wurde versendet.';
            feedbackEl.style.color = 'green';
            contactForm.reset();
            setTimeout(() => { feedbackEl.textContent = ''; }, 5000);
        });
    }

});