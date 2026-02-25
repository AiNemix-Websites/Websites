document.addEventListener('DOMContentLoaded', () => {

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

    const initMobileMenu = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const menu = document.querySelector('.main-menu');
        if (!toggleBtn || !menu) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isOpen);
            menu.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    };

    const initScrollReveal = () => {
        const animatedElements = document.querySelectorAll('.animate-in');
        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
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

        animatedElements.forEach(el => observer.observe(el));
    };

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

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const declineBtn = document.getElementById('decline-cookies');
        if (!banner || !acceptBtn || !declineBtn) return;

        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            banner.hidden = false;
            setTimeout(() => banner.classList.add('visible'), 100);
        }

        const handleConsent = (consentType) => {
            localStorage.setItem('cookie_consent', consentType);
            banner.classList.remove('visible');
            setTimeout(() => banner.hidden = true, 500);
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    };

    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        if (galleryItems.length === 0) return;

        const img = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            const imagePath = item.getAttribute('href');
            img.setAttribute('src', imagePath);
            currentIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const itemIndex = galleryItems.indexOf(e.currentTarget);
            showImage(itemIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                img.setAttribute('src', '');
            }, 300);
            document.body.classList.remove('no-scroll');
            removeLightboxEventListeners();
        };

        const showPrev = () => showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNext = () => showImage((currentIndex + 1) % galleryItems.length);

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        
        const handleBackdropClick = (e) => {
            if (e.target === lightbox) closeLightbox();
        }

        function addLightboxEventListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
            document.addEventListener('keydown', handleKeyDown);
            lightbox.addEventListener('click', handleBackdropClick);
        }

        function removeLightboxEventListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            prevBtn.removeEventListener('click', showPrev);
            nextBtn.removeEventListener('click', showNext);
            document.removeEventListener('keydown', handleKeyDown);
            lightbox.removeEventListener('click', handleBackdropClick);
        }

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;
        const scrollThreshold = window.innerHeight * 0.5;

        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                cta.hidden = false;
                cta.classList.add('visible');
            } else {
                cta.classList.remove('visible');
            }
        });
    };

    // Initialize all modules
    initStickyHeader();
    initMobileMenu();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initLightbox();
    initStickyCTA();
});