document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const onScroll = () => {
            header.classList.toggle('sticky', window.scrollY > 50);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    if (mobileNavToggle && mobileNavContainer) {
        const toggleNav = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileNavContainer.classList.contains('is-open');
            mobileNavToggle.classList.toggle('is-open', open);
            mobileNavToggle.setAttribute('aria-expanded', open);
            mobileNavContainer.classList.toggle('is-open', open);
            document.body.classList.toggle('body-no-scroll', open);
        };

        mobileNavToggle.addEventListener('click', () => toggleNav());
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) toggleNav(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) toggleNav(false);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger-group');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('reveal-stagger-group')) {
                        const children = entry.target.children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].style.transitionDelay = `${i * 100}ms`;
                            children[i].classList.add('is-visible');
                        }
                    } else {
                        entry.target.classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        }
    });

    // --- Testimonial Carousel ---
    const carouselWrapper = document.querySelector('.testimonial-carousel-wrapper');
    if (carouselWrapper) {
        const carousel = carouselWrapper.querySelector('.testimonial-carousel');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = carouselWrapper.querySelector('.carousel-prev');
        const nextBtn = carouselWrapper.querySelector('.carousel-next');
        const dotsContainer = carouselWrapper.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length > 1) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                const dots = dotsContainer.querySelectorAll('button');
                dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            };

            const goToSlide = (index) => {
                currentIndex = (index + slides.length) % slides.length;
                updateCarousel();
            };

            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

            updateCarousel();
        }
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('is-visible');
    }
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Back to Top Button & Sticky CTA ---
    const backToTopBtn = document.getElementById('back-to-top');
    const stickyCtaBar = document.querySelector('.sticky-cta-bar');
    if (backToTopBtn) {
        const progressCircle = backToTopBtn.querySelector('.progress-ring-circle');
        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        const setProgress = (percent) => {
            const offset = circumference - percent / 100 * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollY / docHeight) * 100;

            if (scrollY > 300) {
                backToTopBtn.classList.add('is-visible');
                if (stickyCtaBar) stickyCtaBar.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
                if (stickyCtaBar) stickyCtaBar.classList.remove('is-visible');
            }
            setProgress(scrollPercent);
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Project Filter ---
    const filterContainer = document.getElementById('project-filters');
    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('button');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('is-hidden');
                    } else {
                        card.classList.add('is-hidden');
                    }
                });
            });
        });
    }
    
    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Nachricht wird gesendet...';
            statusEl.className = '';

            // This is a dummy handler. In a real project, this would be an AJAX call.
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                statusEl.classList.add('success');
                contactForm.reset();
            }, 1000);
        });
    }

});