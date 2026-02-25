document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- MOBILE MENU --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = () => {
            const isOpen = menuToggle.classList.toggle('is-active');
            mobileMenu.classList.toggle('is-open');
            mobileMenu.setAttribute('aria-hidden', !isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('body-lock', isOpen);
        };

        menuToggle.addEventListener('click', toggleMenu);
        
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                toggleMenu();
            }
        });
    }

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for grouped items
                    if (entry.target.dataset.reveal === 'group') {
                        entry.target.querySelectorAll(':scope > *').forEach((child, i) => {
                            child.style.transitionDelay = `${i * 100}ms`;
                        });
                    }
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- FAQ ACCORDION --- //
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
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
    }

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
            setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.hidden = true, 300);
        });
    }

    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero');
    if (stickyCTA && heroSection) {
        const observer = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('is-visible', !entry.isIntersecting);
        }, { threshold: 0 });
        observer.observe(heroSection);
    }

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryItems = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryItems.length) return;
            currentIndex = index;
            const item = galleryItems[currentIndex];
            const src = item.dataset.lightboxSrc;
            const alt = item.dataset.lightboxAlt || 'Galeriebild';
            const pathPrefix = lightbox.closest('body').querySelector('header .logo').href.endsWith('/') ? './' : '../';
            lightboxImage.src = pathPrefix + src;
            lightboxImage.alt = alt;
            lightbox.hidden = false;
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            document.body.classList.add('body-lock');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            setTimeout(() => {
                lightbox.hidden = true;
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('body-lock');
        };

        const showPrev = () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => openLightbox((currentIndex + 1) % galleryItems.length);

        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-lightbox-src]');
            if (trigger) {
                e.preventDefault();
                galleryItems = Array.from(document.querySelectorAll('[data-lightbox-src]'));
                const index = galleryItems.indexOf(trigger);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
});