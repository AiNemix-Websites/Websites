document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    const toggleMobileNav = (forceClose = false) => {
        if (forceClose || mobileNavMenu.classList.contains('open')) {
            mobileNavMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        } else {
            mobileNavMenu.classList.add('open');
            document.body.classList.add('no-scroll');
        }
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => toggleMobileNav());
        mobileNavClose.addEventListener('click', () => toggleMobileNav(true));
        mobileNavMenu.addEventListener('click', (e) => {
            if (e.target === mobileNavMenu) {
                toggleMobileNav(true);
            }
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
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
            const isOpen = item.classList.contains('open');
            faqItems.forEach(i => {
                i.classList.remove('open');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        let galleryImages = [];
        let currentIndex = 0;

        const updateLightbox = () => {
            const imagePath = galleryImages[currentIndex];
            const relativePath = lightbox.dataset.basePath + imagePath;
            lightboxImg.src = relativePath;
            lightboxImg.alt = `Galeriebild ${currentIndex + 1}`;
        };

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightbox();
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
        };

        const prevImage = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightbox();
        };

        const nextImage = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightbox();
        };

        document.addEventListener('click', e => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const galleryContainer = trigger.closest('.gallery-grid, .gallery-teaser-grid');
                const triggers = Array.from(galleryContainer.querySelectorAll('[data-lightbox-trigger]'));
                galleryImages = triggers.map(t => t.getAttribute('data-lightbox-trigger'));
                const index = triggers.indexOf(trigger);
                
                // Determine base path for assets
                const pathDepth = window.location.pathname.split('/').filter(Boolean).length;
                lightbox.dataset.basePath = pathDepth > 1 ? '../' : '';

                openLightbox(index);
            }
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
        lightboxPrev.addEventListener('click', prevImage);
        lightboxNext.addEventListener('click', nextImage);

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    // Prevent form submission for demo
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }

});