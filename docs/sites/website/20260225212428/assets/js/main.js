document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    // --- Mobile Navigation --- //
    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const menu = document.getElementById('mobile-nav-menu');

        if (!toggleBtn || !menu || !closeBtn) return;

        const openMenu = () => {
            menu.classList.add('is-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            closeBtn.focus();
        };

        const closeMenu = () => {
            menu.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            toggleBtn.focus();
        };

        toggleBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    };

    // --- Scroll Animations --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    };

    // --- FAQ Accordion --- //
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        });
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');

        if (!banner || !acceptBtn || !declineBtn) return;

        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            banner.classList.add('show');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            banner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            banner.classList.remove('show');
        });
    };

    // --- Global Lightbox --- //
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const img = lightbox.querySelector('img');
        let galleryImages = [];
        let currentIndex = -1;

        const openLightbox = (index) => {
            currentIndex = index;
            img.src = galleryImages[currentIndex].dataset.kmImage || galleryImages[currentIndex].src;
            img.alt = galleryImages[currentIndex].alt;
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            img.src = ''; // Clear src to stop loading
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
            img.src = galleryImages[currentIndex].dataset.kmImage || galleryImages[currentIndex].src;
            img.alt = galleryImages[currentIndex].alt;
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
            img.src = galleryImages[currentIndex].dataset.kmImage || galleryImages[currentIndex].src;
            img.alt = galleryImages[currentIndex].alt;
        };

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-trigger')) {
                e.preventDefault();
                galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
                const index = galleryImages.indexOf(e.target);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    };

    // --- Sticky CTA --- //
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const footer = document.querySelector('.site-footer');
        if (!footer) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when footer is NOT visible
                if (!entry.isIntersecting) {
                    cta.classList.add('is-visible');
                } else {
                    cta.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);
    };
    
    // --- Contact Form --- //
    const initContactForm = () => {
        const form = document.getElementById('contact-form');
        const statusDiv = document.getElementById('form-status');
        if (!form || !statusDiv) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data to a server.
            statusDiv.textContent = 'Vielen Dank für Ihre Nachricht! Sie wird in Kürze bearbeitet.';
            statusDiv.style.color = 'var(--color-accent)';
            form.reset();
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 5000);
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initLightbox();
    initStickyCta();
    initContactForm();
});