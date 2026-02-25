document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { threshold: 0.9 });

        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        document.body.prepend(sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                closeMobileNav();
            }
        });

        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileNav();
            }
        });

        function closeMobileNav() {
            mainNav.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger')) {
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, index * 100);
                } else {
                    entry.target.classList.add('is-visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- FAQ Accordion --- //
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

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox (Singleton) --- //
    // This code is ready but will only work if images are added with the correct attributes.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const content = lightbox.querySelector('.km-lightbox-content');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let galleryImages = [];
        let currentIndex = 0;

        document.body.addEventListener('click', e => {
            const trigger = e.target.closest('[data-km-image]');
            if (trigger) {
                e.preventDefault();
                const gallery = trigger.closest('[data-km-gallery]');
                if (gallery) {
                    galleryImages = Array.from(gallery.querySelectorAll('[data-km-image]'));
                    currentIndex = galleryImages.indexOf(trigger);
                } else {
                    galleryImages = [trigger];
                    currentIndex = 0;
                }
                openLightbox();
            }
        });

        function openLightbox() {
            updateImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('open'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            setTimeout(() => {
                lightbox.style.display = 'none';
                content.innerHTML = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        }

        function updateImage() {
            const imgElement = galleryImages[currentIndex];
            const src = imgElement.dataset.kmImage;
            const alt = imgElement.alt || 'Galeriebild';
            content.innerHTML = `<img src='${imgElement.src}' alt='${alt}'>`;
            prevBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
            nextBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateImage();
        }

        function handleKeydown(e) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    // --- Sticky CTA Bar --- //
    const stickyCta = document.getElementById('sticky-cta-bar');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCta.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});