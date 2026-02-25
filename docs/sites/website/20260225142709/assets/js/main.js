document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrapper = document.getElementById('mobile-nav-menu');
    if (navToggle && navMenuWrapper) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            navToggle.classList.toggle('is-open');
            navMenuWrapper.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('stagger-children')) {
                    const children = entry.target.querySelectorAll(':scope > *');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- 4. FAQ Accordion --- //
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

    // --- 5. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- 6. Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.ariaLabel = `Go to slide ${index + 1}`;
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- 7. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex;
        let imageTriggers = [];

        const updateTriggers = () => {
            imageTriggers = Array.from(document.querySelectorAll('.lightbox-trigger, [data-km-image]'));
        };

        const showLightbox = (index) => {
            currentImageIndex = index;
            const trigger = imageTriggers[index];
            const imagePath = trigger.dataset.kmImage || trigger.src;
            const altText = trigger.alt || 'Großansicht';
            lightboxImage.src = imagePath.startsWith('..') ? imagePath : `../${imagePath}`.replace('../assets', 'assets');
            if(document.body.contains(document.querySelector('h1.hero-headline'))) { // is homepage
                 lightboxImage.src = imagePath;
            }
            lightboxImage.alt = altText;
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        };

        const hideLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imageTriggers.length) % imageTriggers.length;
            showLightbox(currentImageIndex);
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imageTriggers.length;
            showLightbox(currentImageIndex);
        };

        document.body.addEventListener('click', (e) => {
            updateTriggers();
            const triggerIndex = imageTriggers.indexOf(e.target);
            if (triggerIndex !== -1) {
                e.preventDefault();
                showLightbox(triggerIndex);
            }
        });

        closeBtn.addEventListener('click', hideLightbox);
        backdrop.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }

    // --- 8. Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- 9. Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});