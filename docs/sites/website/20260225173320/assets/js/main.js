document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu && menuClose) {
        const openMenu = () => {
            mobileMenu.style.display = 'flex';
            setTimeout(() => mobileMenu.classList.add('open'), 10);
            document.body.classList.add('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'true');
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'false');
            setTimeout(() => { mobileMenu.style.display = 'none'; }, 400);
        };

        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
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
    }

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.getElementById('carousel-next');
        const prevBtn = document.getElementById('carousel-prev');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            goToSlide(prevIndex);
        });
        
        // Set transition style after initial load
        setTimeout(() => {
            carousel.style.transition = 'transform 0.5s ease-in-out';
        }, 10);
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

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 10);
        }

        const handleConsent = (value) => {
            localStorage.setItem('cookieConsent', value);
            cookieBanner.classList.remove('show');
            setTimeout(() => { cookieBanner.style.display = 'none'; }, 400);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) {
            const showCta = () => {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                if (heroBottom < 0) {
                    stickyCta.classList.add('show');
                } else {
                    stickyCta.classList.remove('show');
                }
            };
            window.addEventListener('scroll', showCta);
        }
    }

});