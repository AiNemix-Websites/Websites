document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        if (!menuToggle || !mainNav) return;

        const toggleMenu = () => {
            const isOpen = mainNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
        };

        menuToggle.addEventListener('click', toggleMenu);
    };

    // --- Sticky Header --- //
    const initStickyHeader = () => {
        const header = document.getElementById('main-header');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // --- Scroll Reveal Animation --- //
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-text, .reveal-card, .reveal-image');
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
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- FAQ Accordion --- //
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

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
    };

    // --- Cookie Banner --- //
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        if (!banner || !acceptBtn || !declineBtn) return;

        const cookieStatus = localStorage.getItem('cookie_status');
        if (!cookieStatus) {
            banner.classList.add('show');
        }

        const handleConsent = (status) => {
            localStorage.setItem('cookie_status', status);
            banner.classList.remove('show');
        }

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    };

    // --- Lightbox --- //
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        let currentIndex = 0;

        if (galleryItems.length === 0) return;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imagePath = item.dataset.kmImagePath;
            const imageAlt = item.dataset.kmImageAlt;
            lightboxImage.src = document.body.classList.contains('is-subpage') ? `../${imagePath}` : imagePath;
            lightboxImage.alt = imageAlt;
            currentIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
        };

        const showPrev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
            showImage(currentIndex);
        };

        const showNext = () => {
            currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
            showImage(currentIndex);
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    };

    // --- Sticky CTA --- //
    const initStickyCta = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        
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

        const heroSection = document.querySelector('.hero, .page-header');
        if (heroSection) {
            observer.observe(heroSection);
        }
    };

    // --- Check if it's a subpage for asset paths --- //
    const checkSubpage = () => {
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            document.body.classList.add('is-subpage');
        }
    };

    // Initialize all modules
    checkSubpage();
    initMobileMenu();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initLightbox();
    initStickyCta();
});