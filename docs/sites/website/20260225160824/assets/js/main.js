document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navWrapper = document.querySelector('.main-menu-wrapper');
    const navMenu = document.querySelector('.main-menu');

    if (navToggle && navWrapper) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });

        navWrapper.addEventListener('click', (e) => {
            if (e.target === navWrapper) {
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('is-scrolled', !entry.isIntersecting);
        }, { rootMargin: '200px 0px 0px 0px' });
        scrollObserver.observe(document.body);

        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
            lastScrollY = window.scrollY;
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-stagger');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = entry.target.classList.contains('reveal-stagger') ? index * 100 : 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // Staggered items need to be handled individually for correct delay
    const staggerContainers = document.querySelectorAll('.pillars-grid, .cards-grid, .process-steps, .faq-accordion, .projects-grid');
    staggerContainers.forEach(container => {
        const items = container.querySelectorAll('.reveal-stagger');
        items.forEach((item, index) => {
            const itemObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('is-visible');
                        }, index * 120);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            itemObserver.observe(item);
        });
    });

    // --- FAQ Accordion --- //
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

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
        
        let touchStartX = 0;
        carousel.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            let touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) nextBtn.click();
            if (touchEndX - touchStartX > 50) prevBtn.click();
        });

        updateCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookie_accepted')) {
            cookieBanner.style.display = 'block';
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookie_accepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            // Show when hero is NOT visible
            if (document.body.contains(document.querySelector('.hero'))) {
                stickyCTA.style.display = entry.isIntersecting ? 'none' : 'block';
            }
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
             ctaObserver.observe(heroSection);
        }
        // Hide on contact page
        if (window.location.pathname.includes('/kontakt')) {
            stickyCTA.style.display = 'none';
        }
    }
    
    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            statusEl.style.color = 'green';
            contactForm.reset();
            setTimeout(() => { statusEl.textContent = ''; }, 5000);
        });
    }
});