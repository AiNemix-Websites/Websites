document.addEventListener('DOMContentLoaded', () => {

    // --- Global Init --- //
    const init = () => {
        setupStickyHeader();
        setupMobileNav();
        setupFaqAccordion();
        setupScrollReveal();
        setupCookieBanner();
        setupLightbox();
        setupTestimonialCarousel();
        setupContactForm();
        setupStickyCTA();
    };

    // --- Sticky Header --- //
    const setupStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;
        const scrollThreshold = 50;

        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Mobile Navigation --- //
    const setupMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const mobileNav = document.getElementById('mobile-nav');
        if (!toggleBtn || !mobileNav || !closeBtn) return;

        const openMenu = () => {
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeMenu();
            }
        });
    };

    // --- FAQ Accordion --- //
    const setupFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';
                    question.setAttribute('aria-expanded', !isExpanded);
                });
            }
        });
    };

    // --- Scroll Reveal --- //
    const setupScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- Cookie Banner --- //
    const setupCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const rejectBtn = document.getElementById('cookie-reject');
        if (!banner || !acceptBtn || !rejectBtn) return;

        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            banner.classList.add('visible');
        }

        const handleConsent = () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', handleConsent);
        rejectBtn.addEventListener('click', handleConsent);
    };

    // --- Lightbox --- //
    const setupLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
        let currentIndex = 0;

        if (!lightbox || !lightboxImg || galleryItems.length === 0) return;

        const showImage = (index) => {
            const item = galleryItems[index];
            const src = item.getAttribute('data-lightbox-src');
            const alt = item.querySelector('img')?.alt || 'Galeriebild';
            lightboxImg.src = src;
            lightboxImg.alt = alt;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const index = galleryItems.indexOf(e.currentTarget);
            showImage(index);
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        };

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    };

    // --- Testimonial Carousel --- //
    const setupTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(nextBtn) nextBtn.style.display = 'none';
            if(prevBtn) prevBtn.style.display = 'none';
            return;
        }

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        slides.forEach((slide, i) => {
            if (i !== 0) slide.style.transition = 'transform 0.5s ease';
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    };

    // --- Contact Form --- //
    const setupContactForm = () => {
        const form = document.getElementById('contact-form');
        const feedbackEl = document.getElementById('form-feedback');
        if (!form || !feedbackEl) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wurde (simuliert) gesendet.';
            feedbackEl.className = 'form-feedback success';
            feedbackEl.style.display = 'block';
            form.reset();
            setTimeout(() => { feedbackEl.style.display = 'none'; }, 5000);
        });
    };

    // --- Sticky CTA --- //
    const setupStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(hero);
    };

    // --- Run Everything --- //
    init();
});