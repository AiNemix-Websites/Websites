document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation --- //
    const initMobileNav = () => {
        const navToggle = document.querySelector('.mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');
        if (!navToggle || !mainNav) return;

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpen);
            mainNav.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    };

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        const scrollThreshold = 50;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    };

    // --- Scroll Reveal Animation --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- Accordion --- //
    const initAccordion = () => {
        const accordions = document.querySelectorAll('.accordion');
        accordions.forEach(accordion => {
            accordion.addEventListener('click', (e) => {
                const header = e.target.closest('.accordion-header');
                if (!header) return;

                const item = header.parentElement;
                const content = header.nextElementSibling;
                const isExpanded = header.getAttribute('aria-expanded') === 'true';

                // Optional: Close other items
                if (accordion.id !== 'services-accordion') { // Allow multiple open for services
                    item.parentElement.querySelectorAll('.accordion-item').forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                            otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        }
                    });
                }

                header.setAttribute('aria-expanded', !isExpanded);
                content.style.maxHeight = !isExpanded ? content.scrollHeight + 'px' : null;
            });
        });
    };

    // --- Testimonial Carousel --- //
    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            goToSlide(prevIndex);
        });

        // Basic swipe functionality
        let touchstartX = 0;
        let touchendX = 0;

        carousel.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) nextBtn.click();
            if (touchendX > touchstartX) prevBtn.click();
        });
    };

    // --- Lightbox --- //
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let galleryItems = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            const item = galleryItems[index];
            const src = item.getAttribute('data-lightbox-src');
            lightboxImg.setAttribute('src', src);
            lightboxImg.setAttribute('alt', item.querySelector('img')?.alt || 'Galeriebild');
        };

        const openLightbox = (e) => {
            const clickedItem = e.target.closest('[data-lightbox-src]');
            if (!clickedItem) return;
            e.preventDefault();

            galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
            const clickedIndex = galleryItems.indexOf(clickedItem);
            
            showImage(clickedIndex);
            lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscKey);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.style.overflow = '';
            lightboxImg.setAttribute('src', ''); // Stop image loading
            document.removeEventListener('keydown', handleEscKey);
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
        };

        document.body.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.style.display = 'flex';
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.style.display = 'none';
        });
    };

    // --- Sticky CTA --- //
    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const showThreshold = 600; // Show after scrolling 600px

        window.addEventListener('scroll', () => {
            if (window.scrollY > showThreshold) {
                cta.style.display = 'block';
                setTimeout(() => cta.classList.add('visible'), 10);
            } else {
                cta.classList.remove('visible');
                 setTimeout(() => { if(!cta.classList.contains('visible')) cta.style.display = 'none'; }, 300);
            }
        }, { passive: true });
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initAccordion();
    initTestimonialCarousel();
    initLightbox();
    initCookieBanner();
    initStickyCTA();

});