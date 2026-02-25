document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('#nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navMenu.classList.toggle('open');
            document.body.classList.toggle('nav-open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-controls .next');
        const prevButton = document.querySelector('.carousel-controls .prev');
        const dotsNav = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
        };
        slides.forEach(setSlidePosition);

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = `translateX(-${targetIndex * 100}%)`;
            currentIndex = targetIndex;
            updateDots();
        };

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsNav.appendChild(dot);
        });

        const dots = Array.from(dotsNav.children);
        const updateDots = () => {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });
        
        // Auto-play
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        }, 7000);

        // Touch/Swipe functionality
        let startX = 0;
        let endX = 0;
        carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            if (startX > endX + 50) {
                moveToSlide((currentIndex + 1) % slides.length);
            } else if (startX < endX - 50) {
                moveToSlide((currentIndex - 1 + slides.length) % slides.length);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 50}ms`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 10);
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineCookies) {
        declineCookies.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Context CTA & Back to Top Button --- //
    const contextCta = document.getElementById('context-cta');
    const backToTopButton = document.getElementById('back-to-top');
    const showOnPx = 300;

    const scrollContainer = () => {
        return document.documentElement || document.body;
    };

    if (contextCta || backToTopButton) {
        document.addEventListener('scroll', () => {
            if (scrollContainer().scrollTop > showOnPx) {
                if(contextCta) contextCta.classList.add('show');
                if(backToTopButton) backToTopButton.classList.add('show');
            } else {
                if(contextCta) contextCta.classList.remove('show');
                if(backToTopButton) backToTopButton.classList.remove('show');
            }
        });
    }

    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
            document.documentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});