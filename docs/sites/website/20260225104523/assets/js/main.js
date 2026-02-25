document.addEventListener('DOMContentLoaded', () => {

    const initApp = () => {
        handleStickyHeader();
        handleMobileMenu();
        handleFaqAccordion();
        handleScrollReveal();
        handleCookieBanner();
        handleTestimonialCarousel();
        handleContactForm();
        handleStickyCTA();
        handleSmoothScroll();
    };

    const handleStickyHeader = () => {
        const header = document.getElementById('site-header');
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

    const handleMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const mobileNav = document.getElementById('mobile-nav');
        if (!toggleBtn || !mobileNav || !closeBtn) return;

        const openMenu = () => {
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) closeMenu();
        });
    };

    const handleFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

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
    };

    const handleScrollReveal = () => {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.reveal === 'stagger' ? index * 100 : 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    const handleCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (localStorage.getItem('cookieConsent') !== 'true') {
            banner.style.display = 'flex';
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.style.display = 'none';
        });
    };

    const handleTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
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
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
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
    };

    const handleContactForm = () => {
        const form = document.getElementById('contact-form');
        const statusEl = document.getElementById('form-status');
        if (!form || !statusEl) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusEl.textContent = 'Nachricht wird gesendet...';
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                form.reset();
            }, 1000);
        });
    };

    const handleStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        const footer = document.querySelector('.site-footer-main');
        if (!cta || !footer) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                cta.classList.remove('visible');
            } else if (window.scrollY > window.innerHeight / 2) {
                cta.classList.add('visible');
            }
        }, { threshold: 0.1 });

        observer.observe(footer);
        
        window.addEventListener('scroll', () => {
             if (window.scrollY <= window.innerHeight / 2) {
                 cta.classList.remove('visible');
             }
        }, { passive: true });
    };

    const handleSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    initApp();
});