document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('is-scrolled', e.boundingClientRect.top < -100),
            { threshold: [1] }
        );
        // Use a dummy element at the top of the body to observe
        const sentinel = document.createElement('div');
        sentinel.style.position = 'absolute';
        sentinel.style.height = '100px';
        sentinel.style.top = '0';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- 2. Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNav) {
        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileNav.classList.contains('is-open');
            mobileNav.classList.toggle('is-open', open);
            mobileNavToggle.setAttribute('aria-expanded', open);
            mobileNav.setAttribute('aria-hidden', !open);
            document.body.classList.toggle('scroll-locked', open);
        };

        mobileNavToggle.addEventListener('click', () => toggleMenu());

        const closeButton = mobileNav.querySelector('.mobile-nav-close');
        if(closeButton) closeButton.addEventListener('click', () => toggleMenu(false));

        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) toggleMenu(false);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stagger children if it's a container
                    if (entry.target.classList.contains('card-container')) {
                        const cards = entry.target.querySelectorAll('.card');
                        cards.forEach((card, index) => {
                            card.style.setProperty('--stagger-index', index);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('is-visible');
                cookieBanner.setAttribute('aria-hidden', 'false');
            }
        }, 1500);

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            cookieBanner.setAttribute('aria-hidden', 'true');
        });
    }

    // --- 5. Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver(([e]) => {
            stickyCta.classList.toggle('is-visible', e.intersectionRatio < 1);
             stickyCta.setAttribute('aria-hidden', e.intersectionRatio === 1);
        }, { threshold: [1] });
        // Observe the hero section to show CTA when it's scrolled past
        const heroSection = document.querySelector('main > section:first-of-type');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- 6. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const wrapper = carousel.querySelector('.carousel-wrapper');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.carousel-button.prev');
        const nextBtn = carousel.querySelector('.carousel-button.next');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
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

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- 7. Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            if (statusEl && submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sende...';
                statusEl.textContent = 'Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Nachricht senden';
                }, 3000);
            }
        });
    }

});