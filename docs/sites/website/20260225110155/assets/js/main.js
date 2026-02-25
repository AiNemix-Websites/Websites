document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const scrollThreshold = 50;
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    };

    // --- Mobile Navigation --- //
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        if (!toggleBtn || !mobileNav) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', open);
            mobileNav.setAttribute('aria-hidden', !open);
            if (open) {
                mobileNav.classList.add('is-open');
                document.body.classList.add('no-scroll');
            } else {
                mobileNav.classList.remove('is-open');
                document.body.classList.remove('no-scroll');
            }
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    };

    // --- Scroll Reveal Animations --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-fade-up');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    // --- Testimonial Carousel --- //
    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(nextBtn) nextBtn.style.display = 'none';
            if(prevBtn) prevBtn.style.display = 'none';
            return;
        }

        carousel.style.display = 'flex';

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
        
        // Touch swipe
        let touchstartX = 0;
        let touchendX = 0;
        
        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, {passive: true});
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            banner.classList.add('is-visible');
        }

        const setConsent = (value) => {
            localStorage.setItem('cookie_consent', value);
            banner.classList.remove('is-visible');
        };

        acceptBtn.addEventListener('click', () => setConsent('accepted'));
        declineBtn.addEventListener('click', () => setConsent('declined'));
    };

    // --- Lightbox --- //
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        const imgElement = lightbox.querySelector('img');
        const triggers = document.querySelectorAll('[data-lightbox-trigger]');
        let gallery = [];
        let currentIndex = -1;

        if (triggers.length === 0) return;

        const openLightbox = (galleryName, imageSrc) => {
            gallery = Array.from(triggers).filter(t => t.dataset.lightboxTrigger === galleryName);
            const currentTrigger = gallery.find(t => t.dataset.kmImage === imageSrc);
            currentIndex = gallery.indexOf(currentTrigger);
            updateImage();
            lightbox.classList.add('is-visible');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateImage = () => {
            if (currentIndex > -1 && currentIndex < gallery.length) {
                const trigger = gallery[currentIndex];
                imgElement.src = trigger.dataset.kmImage || trigger.src;
                imgElement.alt = trigger.alt || 'Großansicht';
            }
            prevBtn.style.display = currentIndex > 0 ? 'grid' : 'none';
            nextBtn.style.display = currentIndex < gallery.length - 1 ? 'grid' : 'none';
        };

        const showPrev = () => { if (currentIndex > 0) { currentIndex--; updateImage(); } };
        const showNext = () => { if (currentIndex < gallery.length - 1) { currentIndex++; updateImage(); } };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(trigger.dataset.lightboxTrigger, trigger.dataset.kmImage || trigger.src);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    };

    // --- Sticky CTA --- //
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const showThreshold = window.innerHeight * 0.5;
        const hideThreshold = document.body.scrollHeight - window.innerHeight * 1.5;

        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold && window.scrollY < hideThreshold) {
                cta.classList.add('is-visible');
            } else {
                cta.classList.remove('is-visible');
            }
        });
    };

    // --- Contact Form --- //
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        if (!form) return;
        const statusEl = document.getElementById('form-status');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusEl.textContent = 'Nachricht wird gesendet...';
            statusEl.style.color = 'var(--color-text)';
            
            // Simulate form submission
            setTimeout(() => {
                form.reset();
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                statusEl.style.color = 'green';
            }, 1000);
        });
    };

    // --- Initialize all modules ---
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initTestimonialCarousel();
    initCookieBanner();
    initLightbox();
    initStickyCTA();
    initContactForm();
});