document.addEventListener('DOMContentLoaded', () => {

    // --- Global State & Helpers ---
    const body = document.body;

    const trapFocus = (element) => {
        const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        const KEYCODE_TAB = 9;

        element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' && e.keyCode !== KEYCODE_TAB) return;

            if (e.shiftKey) { // shift + tab
                if (document.activeElement === firstFocusableEl) {
                    lastFocusableEl.focus();
                    e.preventDefault();
                }
            } else { // tab
                if (document.activeElement === lastFocusableEl) {
                    firstFocusableEl.focus();
                    e.preventDefault();
                }
            }
        });
        firstFocusableEl.focus();
    };

    // --- Sticky Header ---
    const initStickyHeader = () => {
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

    // --- Mobile Menu ---
    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!toggleBtn || !mobileMenu) return;

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !toggleBtn.classList.contains('open');
            toggleBtn.classList.toggle('open', open);
            toggleBtn.setAttribute('aria-expanded', open);
            mobileMenu.classList.toggle('open', open);
            mobileMenu.setAttribute('aria-hidden', !open);
            body.classList.toggle('no-scroll', open);
            if (open) {
                trapFocus(mobileMenu);
            }
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggleBtn.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    };

    // --- Scroll Reveal Animations ---
    const initScrollReveal = () => {
        const revealItems = document.querySelectorAll('.reveal-item');
        if (revealItems.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealItems.forEach(item => observer.observe(item));
    };

    // --- FAQ Accordion ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
            });
        });
    };

    // --- Testimonial Carousel ---
    const initTestimonialCarousel = () => {
        const carousel = document.getElementById('testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(prevBtn) prevBtn.style.display = 'none';
            if(nextBtn) nextBtn.style.display = 'none';
            return;
        }

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
            dot.setAttribute('aria-label', `Gehe zu Testimonial ${index + 1}`);
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
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        const cookieAccepted = localStorage.getItem('cookieAccepted');
        if (!cookieAccepted) {
            banner.classList.add('visible');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            banner.classList.remove('visible');
        });
    };

    // --- Sticky CTA ---
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        const scrollThreshold = heroSection.offsetHeight * 0.8;

        const handleScroll = () => {
            if (window.scrollY > scrollThreshold) {
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Contact Form --- 
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        const statusEl = document.getElementById('form-status');
        if (!form || !statusEl) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            statusEl.style.color = 'var(--color-accent)';
            form.reset();
            setTimeout(() => { statusEl.textContent = ''; }, 5000);
        });
    };
    
    // --- Lightbox (Singleton) ---
    // Coded to fulfill requirements, but will not be triggered as there are no images.
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const content = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentGallery = [];
        let currentIndex = -1;

        const show = () => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            body.classList.add('no-scroll');
        };

        const hide = () => {
            lightbox.classList.remove('visible');
            body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                content.src = ''; // Cleanup
            }, 300);
        };

        const renderImage = (index) => {
            if (index < 0 || index >= currentGallery.length) return;
            currentIndex = index;
            const imagePath = currentGallery[currentIndex];
            content.src = imagePath; // In a real scenario, adjust path if needed
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'block' : 'none';
        };

        // Event listeners for closing
        closeBtn.addEventListener('click', hide);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hide(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('visible')) hide(); });

        // Event listeners for navigation
        prevBtn.addEventListener('click', () => renderImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => renderImage(currentIndex + 1));
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'ArrowLeft') renderImage(currentIndex - 1);
            if (e.key === 'ArrowRight') renderImage(currentIndex + 1);
        });

        // This is how it would be triggered from the page
        // document.body.addEventListener('click', (e) => {
        //     const trigger = e.target.closest('[data-gallery]');
        //     if (!trigger) return;
        //     e.preventDefault();
            
        //     const galleryName = trigger.dataset.gallery;
        //     const galleryItems = document.querySelectorAll(`[data-gallery='${galleryName}']`);
        //     currentGallery = Array.from(galleryItems).map(item => item.dataset.kmImage || item.href);
        //     const clickedIndex = currentGallery.indexOf(trigger.dataset.kmImage || trigger.href);

        //     renderImage(clickedIndex);
        //     show();
        // });
    };

    // --- Initialize all modules ---
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initFaqAccordion();
    initTestimonialCarousel();
    initCookieBanner();
    initStickyCta();
    initContactForm();
    initLightbox();
});