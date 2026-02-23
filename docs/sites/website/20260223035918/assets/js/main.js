document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HEADER & NAVIGATION --- //
    const header = document.getElementById('site-header');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mainMenu = document.getElementById('main-menu');

    // Sticky Header
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile Navigation
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('nav-open');
        });

        // Close nav on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
                mobileNavToggle.click();
            }
        });

        // Close nav on backdrop click
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('nav-open') && !mainMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                mobileNavToggle.click();
            }
        });
    }

    // --- 2. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');
        goToSlide(0); // Initial state

        nextBtn.addEventListener('click', () => {
            goToSlide((currentIndex + 1) % slides.length);
        });

        prevBtn.addEventListener('click', () => {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        });
        
        // Touch swipe support
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    }

    // --- 4. FAQ ACCORDION --- //
    const faqAccordions = document.querySelectorAll('.faq-accordion');
    faqAccordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.faq-item');
        items.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        });
    });

    // --- 5. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                stickyCTA.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- 7. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImageContainer = lightbox.querySelector('.lightbox-image-container');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            const imgElement = document.createElement('img');
            const imagePath = galleryImages[currentIndex].dataset.kmImage;
            const relativePath = document.body.dataset.depth === 'sub' ? `../${imagePath}` : imagePath;
            imgElement.src = relativePath;
            imgElement.alt = galleryImages[currentIndex].alt;
            lightboxImageContainer.innerHTML = '';
            lightboxImageContainer.appendChild(imgElement);
            lightbox.hidden = false;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.hidden = true;
            document.body.style.overflow = '';
        };

        const showPrev = () => openLightbox((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => openLightbox((currentIndex + 1) % galleryImages.length);

        document.querySelectorAll('.lightbox-trigger').forEach((img, index) => {
            galleryImages.push(img);
            img.addEventListener('click', () => openLightbox(index));
        });

        // Set body data-depth for correct pathing
        if (window.location.pathname.split('/').filter(Boolean).length > 0 && !window.location.pathname.endsWith('/')) {
             document.body.dataset.depth = 'sub';
        }
        if (window.location.pathname.includes('/leistungen/') || window.location.pathname.includes('/ueber-uns/') || window.location.pathname.includes('/faq/') || window.location.pathname.includes('/kontakt/') || window.location.pathname.includes('/impressum/') || window.location.pathname.includes('/datenschutz/')) {
            document.body.dataset.depth = 'sub';
        }

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        document.addEventListener('keydown', (e) => {
            if (!lightbox.hidden) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- 8. CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy submission for the static site.
            // In a real project, this would be an AJAX call.
            formStatus.textContent = 'Vielen Dank! Ihre Anfrage wurde versendet.';
            formStatus.style.color = 'green';
            contactForm.reset();
            setTimeout(() => { formStatus.textContent = ''; }, 5000);
        });
    }
});