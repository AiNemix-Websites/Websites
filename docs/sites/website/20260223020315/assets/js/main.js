document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const navWrapper = document.querySelector('.nav-menu-wrapper');
        if (!toggleBtn || !navWrapper) return;

        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            toggleBtn.classList.toggle('open');
            navWrapper.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    };

    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const observer = new IntersectionObserver(([entry]) => {
            // Dummy element to observe, placed after the header
        }, { rootMargin: '-50px 0px 0px 0px' });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
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
    };

    const initFaqAccordion = () => {
        const accordions = document.querySelectorAll('.faq-accordion');
        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.faq-item');
            items.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');

                question.addEventListener('click', () => {
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';
                    question.setAttribute('aria-expanded', !isExpanded);
                    answer.hidden = isExpanded;
                });
            });
        });
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.hidden = false;
            setTimeout(() => banner.classList.add('visible'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
            setTimeout(() => banner.hidden = true, 500);
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const heroSection = document.querySelector('.hero');
        if (!cta || !heroSection) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    cta.hidden = false;
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                    cta.hidden = true;
                }
            });
        }, { threshold: 0 });

        observer.observe(heroSection);
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initTestimonialCarousel();
    initFaqAccordion();
    initCookieBanner();
    initStickyCTA();
});