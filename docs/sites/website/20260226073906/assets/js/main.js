document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    if (mobileNavToggle && mobileNavContainer) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            document.body.classList.toggle('mobile-nav-open');
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        });
        mobileNavContainer.addEventListener('click', (e) => {
            if (e.target === mobileNavContainer) {
                document.body.classList.remove('mobile-nav-open');
                mobileNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
        scrollObserver.observe(document.body);
        window.addEventListener('scroll', () => {
             header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => revealObserver.observe(el));
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
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === index);
            });
            if (dotsContainer) {
                Array.from(dotsContainer.children).forEach((dot, i) => {
                    dot.classList.toggle('is-active', i === index);
                });
            }
            currentIndex = index;
        };

        const nextSlide = () => showSlide((currentIndex + 1) % slides.length);
        const prevSlide = () => showSlide((currentIndex - 1 + slides.length) % slides.length);

        if (nextButton) nextButton.addEventListener('click', nextSlide);
        if (prevButton) prevButton.addEventListener('click', prevSlide);

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `Gehe zu Zitat ${i + 1}`);
                dot.addEventListener('click', () => showSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        showSlide(0);
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 300);
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            // Show when the hero section is NOT intersecting (i.e., scrolled past it)
            stickyCta.classList.toggle('is-visible', !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Lightbox (Structure only, no triggers available) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeButton = lightbox.querySelector('.km-lightbox-close');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            // Remove keydown listener after closing
            document.removeEventListener('keydown', handleKeydown);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };

        const openLightbox = () => {
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            // Add keydown listener when opening
            document.addEventListener('keydown', handleKeydown);
        };

        if(closeButton) closeButton.addEventListener('click', closeLightbox);
        if(backdrop) backdrop.addEventListener('click', closeLightbox);
        // Note: No open triggers are wired up as no images are present in the project.
    }

});