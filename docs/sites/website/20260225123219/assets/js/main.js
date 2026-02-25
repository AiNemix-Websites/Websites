document.addEventListener('DOMContentLoaded', () => {

    // --- APP INITIALIZATION ---
    const App = {
        init() {
            this.cacheDOMElements();
            this.initHeader();
            this.initMobileMenu();
            this.initScrollReveal();
            this.initFaqAccordion();
            this.initTestimonialCarousel();
            this.initCookieBanner();
            this.initStickyCTA();
            this.initContactForm();
        },

        cacheDOMElements() {
            this.header = document.getElementById('main-header');
            this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.cookieBanner = document.getElementById('cookie-banner');
            this.cookieAcceptBtn = document.getElementById('cookie-accept');
            this.stickyCTA = document.getElementById('sticky-cta');
            this.contactForm = document.getElementById('contact-form');
        },

        // --- HEADER LOGIC ---
        initHeader() {
            if (!this.header) return;
            const scrollHandler = () => {
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
        },

        // --- MOBILE MENU LOGIC ---
        initMobileMenu() {
            if (!this.mobileMenuToggle || !this.mobileMenu) return;

            const toggleMenu = (isOpen) => {
                const isExpanded = isOpen === undefined ? this.mobileMenuToggle.getAttribute('aria-expanded') === 'false' : isOpen;
                this.mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
                this.mobileMenuToggle.classList.toggle('is-active', isExpanded);
                this.mobileMenu.classList.toggle('is-open', isExpanded);
                document.body.classList.toggle('no-scroll', isExpanded);
            };

            this.mobileMenuToggle.addEventListener('click', () => toggleMenu());

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.mobileMenu.classList.contains('is-open')) {
                    toggleMenu(false);
                }
            });
        },

        // --- SCROLL REVEAL ANIMATION ---
        initScrollReveal() {
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
        },

        // --- FAQ ACCORDION ---
        initFaqAccordion() {
            const faqItems = document.querySelectorAll('.faq-item');
            if (faqItems.length === 0) return;

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
        },

        // --- TESTIMONIAL CAROUSEL ---
        initTestimonialCarousel() {
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

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            };

            const updateDots = () => {
                const dots = dotsContainer.querySelectorAll('button');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            };

            slides.forEach((_, index) => {
                const dot = document.createElement('button');
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
        },

        // --- COOKIE BANNER ---
        initCookieBanner() {
            if (!this.cookieBanner || !this.cookieAcceptBtn) return;

            setTimeout(() => {
                if (!localStorage.getItem('cookieConsent')) {
                    this.cookieBanner.classList.add('show');
                }
            }, 1000);

            this.cookieAcceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                this.cookieBanner.classList.remove('show');
            });
        },

        // --- STICKY CTA ---
        initStickyCTA() {
            if (!this.stickyCTA) return;
            const ctaHandler = () => {
                if (window.scrollY > window.innerHeight * 0.5) {
                    this.stickyCTA.classList.add('visible');
                } else {
                    this.stickyCTA.classList.remove('visible');
                }
            };
            window.addEventListener('scroll', ctaHandler, { passive: true });
        },
        
        // --- CONTACT FORM ---
        initContactForm() {
            if (!this.contactForm) return;

            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const statusEl = this.contactForm.querySelector('#form-status');
                if (!statusEl) return;
                
                statusEl.textContent = 'Nachricht wird gesendet...';
                statusEl.style.color = 'var(--color-text)';

                setTimeout(() => {
                    statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                    statusEl.style.color = 'green';
                    this.contactForm.reset();
                }, 1000);
            });
        }
    };

    App.init();

});