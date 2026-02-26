document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
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

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        const toggleMenu = () => {
            const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpen);
            mobileNavMenu.classList.toggle('is-open');
            mobileNavMenu.setAttribute('aria-hidden', isOpen);
            document.body.classList.toggle('scroll-locked');
        };

        mobileNavToggle.addEventListener('click', toggleMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                toggleMenu();
            }
        });
    }

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.dataset.reveal === 'stagger') {
                    const children = entry.target.querySelectorAll('[data-reveal="stagger-child"]');
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieConsent = localStorage.getItem('cookie_consent');

    if (!cookieConsent && cookieBanner) {
        cookieBanner.hidden = false;
        setTimeout(() => cookieBanner.classList.add('visible'), 1000);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.hidden = true, 500);
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
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

    // --- Lightbox (Global Singleton) ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const lightboxImg = lightbox.querySelector('img');

        const openLightbox = (imgSrc, altText) => {
            if (!imgSrc) return;
            lightboxImg.src = imgSrc;
            lightboxImg.alt = altText || '';
            lightbox.style.display = 'flex';
            document.body.classList.add('scroll-locked');
            setTimeout(() => lightbox.classList.add('visible'), 10);
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
                lightboxImg.alt = '';
            }, 300);
        };

        document.body.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-km-image]');
            if (trigger) {
                e.preventDefault();
                const imgSrc = trigger.dataset.kmImage;
                const altText = trigger.querySelector('img')?.alt || '';
                openLightbox(imgSrc, altText);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('visible')) {
                closeLightbox();
            }
        });
    }
});