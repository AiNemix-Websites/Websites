document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---
    const select = (selector) => document.querySelector(selector);
    const selectAll = (selector) => document.querySelectorAll(selector);

    // --- STICKY HEADER ---
    const header = select('#main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- MOBILE MENU ---
    const menuToggle = select('#mobile-menu-toggle');
    const menuClose = select('#mobile-menu-close');
    const mobileMenu = select('#mobile-nav-menu');

    const toggleMenu = (isOpen) => {
        document.body.classList.toggle('mobile-menu-open', isOpen);
        mobileMenu.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => toggleMenu(true));
        menuClose.addEventListener('click', () => toggleMenu(false));
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('mobile-menu-open') && e.target === document.body) {
                toggleMenu(false);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- SCROLL REVEAL ---
    const revealElements = selectAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- FAQ ACCORDION ---
    const faqItems = selectAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = selectAll('.testimonial-slide');
        const prevBtn = select('.carousel-prev');
        const nextBtn = select('.carousel-next');
        const dotsContainer = select('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            selectAll('.carousel-dots .dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        if (slides.length > 0) {
            slides.forEach(s => s.style.flex = '0 0 100%');
            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.5s ease';
            goToSlide(0);
        }

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
    }

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const acceptCookiesBtn = select('#accept-cookies');
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.hidden = false;
            cookieBanner.classList.add('visible');
        }, 1000);
    }
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }
    
    // --- STICKY CTA & BACK TO TOP ---
    const stickyCta = select('#sticky-cta');
    const backToTopBtn = select('#back-to-top');
    const showOnScroll = () => {
        const scrollY = window.scrollY;
        const showSticky = scrollY > (window.innerHeight * 0.8);
        const showBackToTop = scrollY > (window.innerHeight * 1.2);
        
        if (stickyCta) {
            stickyCta.hidden = !showSticky;
            stickyCta.classList.toggle('visible', showSticky);
        }
        if (backToTopBtn) {
            backToTopBtn.hidden = !showBackToTop;
            backToTopBtn.classList.toggle('visible', showBackToTop);
        }
    };
    window.addEventListener('scroll', showOnScroll, { passive: true });
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- CONTACT FORM ---
    const contactForm = select('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusEl = select('#form-status');
            statusEl.textContent = 'Nachricht wird gesendet...';
            // This is a dummy handler. In a real project, this would send data to a server.
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                contactForm.reset();
            }, 1500);
        });
    }

    // --- GLOBAL LIGHTBOX (Code is present but will not be triggered without images) ---
    const lightbox = select('#km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imageSrc = galleryImages[index].dataset.kmImage;
            lightboxImg.src = imageSrc;
            lightboxImg.dataset.kmImage = imageSrc;
            lightbox.classList.add('is-open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = '';
        };

        const showPrev = () => openLightbox((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => openLightbox((currentImageIndex + 1) % galleryImages.length);

        document.body.addEventListener('click', (e) => {
            if (e.target.matches('[data-km-image]')) {
                galleryImages = Array.from(selectAll(`[data-km-image]`));
                const clickedIndex = galleryImages.indexOf(e.target);
                openLightbox(clickedIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});