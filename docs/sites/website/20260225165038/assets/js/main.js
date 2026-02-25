document.addEventListener('DOMContentLoaded', () => {

    const initHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const mobileMenu = document.querySelector('.mobile-nav-menu');
        if (!toggleBtn || !mobileMenu) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileMenu.classList.contains('is-open');
            mobileMenu.classList.toggle('is-open', open);
            toggleBtn.classList.toggle('is-active', open);
            toggleBtn.setAttribute('aria-expanded', open);
            document.body.classList.toggle('nav-open', open);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
        
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMenu(false);
            }
        });
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-stagger-group');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('reveal-stagger-group')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            setTimeout(() => {
                                children[i].classList.add('is-visible');
                            }, i * 150);
                        }
                    } else {
                        entry.target.classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const initAccordions = () => {
        const accordions = document.querySelectorAll('.faq-accordion');
        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.faq-item');
            items.forEach(item => {
                const question = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                if (!question || !answer) return;

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
        });
    };

    const initTestimonialCarousel = () => {
        const wrapper = document.querySelector('.testimonial-carousel-wrapper');
        if (!wrapper) return;

        const carousel = wrapper.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = wrapper.querySelector('.carousel-prev');
        const nextBtn = wrapper.querySelector('.carousel-next');
        const dotsContainer = wrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const cookieAccepted = localStorage.getItem('cookie_consent_pl');
        if (!cookieAccepted) {
            banner.style.display = 'flex';
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent_pl', 'true');
            banner.style.display = 'none';
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                cta.style.display = 'inline-block';
                setTimeout(() => cta.classList.add('visible'), 10);
            } else {
                cta.classList.remove('visible');
            }
        });
    };

    // Initialize all modules
    initHeader();
    initMobileMenu();
    initScrollReveal();
    initAccordions();
    initTestimonialCarousel();
    initCookieBanner();
    initStickyCTA();
});