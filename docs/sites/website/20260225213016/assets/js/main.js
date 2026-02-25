document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const body = document.body;

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('nav-open');
            body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Sticky Header --- //
    const siteHeader = document.getElementById('site-header');
    if (siteHeader) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                const children = entry.target.children;
                if (children.length > 0 && delay > 0) {
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * delay);
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const updateCarousel = () => {
            const slideWidth = slides[0].offsetWidth;
            carousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            carousel.scrollBy({ left: slides[0].clientWidth, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            carousel.scrollBy({ left: -slides[0].clientWidth, behavior: 'smooth' });
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const contactPageIdentifier = document.querySelector('.contact-section');
        
        if (!contactPageIdentifier) { // Don't show on contact page
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show when hero is NOT intersecting (i.e., scrolled past it)
                    if (!entry.isIntersecting) {
                        stickyCTA.hidden = false;
                        stickyCTA.classList.add('visible');
                    } else {
                        stickyCTA.classList.remove('visible');
                    }
                });
            }, { threshold: 0 });

            if (heroSection) {
                ctaObserver.observe(heroSection);
            }
        }
    }

});