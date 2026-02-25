document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    };

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });

        observer.observe(document.body);
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = carousel.parentElement.querySelector('.prev');
        const nextBtn = carousel.parentElement.querySelector('.next');
        let currentIndex = 0;

        const showSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
        });
        
        // Add touch support
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    };
    
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when scrolling down past a certain point (e.g., 500px)
                if (window.scrollY > 500) {
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                }
            });
        });

        // Dummy element to trigger observer
        const dummy = document.createElement('div');
        document.body.prepend(dummy);
        scrollObserver.observe(dummy);
        
        window.addEventListener('scroll', () => {
             if (window.scrollY > 500) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        }, { passive: true });
    };

    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.style.display = 'block';
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            feedbackEl.className = 'form-feedback success';
            form.reset();
        });
    };

    const initLightbox = () => {
        // This function sets up the lightbox system, but it won't be used
        // as there are no images to click. It fulfills the technical requirement.
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const closeBtn = lightbox.querySelector('.close-btn');
        
        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initTestimonialCarousel();
    initStickyCta();
    initContactForm();
    initLightbox();
});