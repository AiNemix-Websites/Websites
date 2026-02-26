document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuClose = document.querySelector('.mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.style.display = 'block';
            setTimeout(() => {
                mobileMenu.classList.add('open');
                document.body.classList.add('scroll-locked');
                menuToggle.setAttribute('aria-expanded', 'true');
            }, 10);
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.classList.remove('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                mobileMenu.style.display = 'none';
            }, 300);
        };

        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        }, { threshold: 0.1 });
        const footerCTA = document.querySelector('.footer-cta');
        if (footerCTA) observer.observe(footerCTA);
    }

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100); // Stagger effect
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- FAQ Accordion --- //
    const accordions = document.querySelectorAll('.faq-accordion');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', (e) => {
            const question = e.target.closest('.faq-question');
            if (question) {
                const item = question.parentElement;
                const answer = question.nextElementSibling;
                const isExpanded = question.getAttribute('aria-expanded') === 'true';

                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            }
        });
    });

    // --- Testimonials Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        const goToSlide = (index) => {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        };

        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

        goToSlide(0); // Initialize
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'flex';
        }
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let galleryImages = [];
        let currentIndex = -1;

        const updateImage = () => {
            if (currentIndex >= 0 && currentIndex < galleryImages.length) {
                const newSrc = galleryImages[currentIndex].dataset.kmImage;
                const newAlt = galleryImages[currentIndex].alt;
                lightboxImg.src = newSrc.startsWith('..') ? newSrc : `../${newSrc}`.replace('../assets', 'assets');
                lightboxImg.alt = newAlt;
            }
        };
        
        const fixImagePath = (path, depth) => {
            if (depth === 0) return path;
            return '../' + path;
        }

        const openLightbox = (e) => {
            e.preventDefault();
            const trigger = e.currentTarget;
            const pageDepth = window.location.pathname.split('/').length - 2;

            const galleryTriggers = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${trigger.dataset.lightboxTrigger}']`));
            galleryImages = galleryTriggers.map(t => t.querySelector('img'));
            currentIndex = galleryImages.indexOf(trigger.querySelector('img'));

            const imagePath = galleryImages[currentIndex].dataset.kmImage;
            lightboxImg.src = fixImagePath(imagePath, pageDepth);
            lightboxImg.alt = galleryImages[currentIndex].alt;
            
            lightbox.classList.add('open');
            document.body.classList.add('scroll-locked');
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.classList.remove('scroll-locked');
            removeLightboxListeners();
            lightboxImg.src = ''; // Clear src to stop loading
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        const addLightboxListeners = () => {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
            lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', handleKeydown);
        };

        const removeLightboxListeners = () => {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrev);
            nextBtn.removeEventListener('click', showNext);
            lightbox.removeEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });
            document.removeEventListener('keydown', handleKeydown);
        };

        document.querySelectorAll('[data-lightbox-trigger]').forEach(trigger => {
            trigger.addEventListener('click', openLightbox);
        });
    }
});