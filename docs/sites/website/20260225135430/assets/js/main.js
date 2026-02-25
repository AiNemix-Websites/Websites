document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE NAVIGATION ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isOpen);
            mobileNav.classList.toggle('is-open');
            mobileNav.setAttribute('aria-hidden', isOpen);
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- STICKY HEADER ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- FAQ ACCORDION ---
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

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('reveal-stagger')) {
                    const items = entry.target.querySelectorAll(':scope > *');
                    items.forEach((item, index) => {
                        item.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1000);
        }

        const handleConsent = (value) => {
            localStorage.setItem('cookie_consent', value);
            cookieBanner.classList.remove('is-visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- CONTEXTUAL STICKY CTA ---
    const contextCta = document.getElementById('context-cta');
    const closeCtaBtn = document.getElementById('context-cta-close');
    if (contextCta && closeCtaBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400 && !contextCta.classList.contains('is-hidden')) {
                contextCta.classList.add('is-visible');
            } else {
                contextCta.classList.remove('is-visible');
            }
        });
        closeCtaBtn.addEventListener('click', () => {
            contextCta.classList.remove('is-visible');
            contextCta.classList.add('is-hidden');
        });
    }

    // --- LIGHTBOX (Singleton Pattern) ---
    // NOTE: This is implemented but will not be triggered as there are no images.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const content = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-btn');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imgData = galleryImages[index];
            // Create image element on the fly
            const img = document.createElement('img');
            img.src = imgData.src;
            img.alt = imgData.alt;
            content.innerHTML = ''; // Clear previous content
            content.appendChild(img);
            lightbox.classList.add('is-visible');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-km-image]')) {
                e.preventDefault();
                galleryImages = Array.from(document.querySelectorAll('[data-km-image]')).map(el => ({
                    src: el.dataset.kmImage, 
                    alt: el.alt
                }));
                const clickedIndex = galleryImages.findIndex(img => img.src === e.target.dataset.kmImage);
                openLightbox(clickedIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('is-visible')) {
                closeLightbox();
            }
        });
    }
});