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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNav = document.querySelector('.mobile-nav');

    const openMenu = () => {
        if (mobileNavOverlay && mobileNav) {
            mobileNavOverlay.classList.add('open');
            mobileNav.classList.add('open');
            document.body.classList.add('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMenu = () => {
        if (mobileNavOverlay && mobileNav) {
            mobileNavOverlay.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.classList.remove('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (menuToggle && menuClose && mobileNavOverlay) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('visible');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const gallery = document.getElementById('image-gallery');
    let galleryItems = [];
    let currentIndex = 0;

    if (gallery && lightbox) {
        galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));

        const showImage = (index) => {
            if (index >= 0 && index < galleryItems.length) {
                currentIndex = index;
                const item = galleryItems[index];
                lightboxImage.src = item.href;
                lightboxImage.alt = item.querySelector('img').alt;
            }
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedItem = e.target.closest('.gallery-item');
            if (clickedItem) {
                const index = galleryItems.indexOf(clickedItem);
                showImage(index);
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('open'), 10);
                document.body.classList.add('scroll-locked');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('scroll-locked');
        };

        gallery.addEventListener('click', openLightbox);

        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightbox.querySelector('.km-lightbox-prev').addEventListener('click', () => {
            showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
        });

        lightbox.querySelector('.km-lightbox-next').addEventListener('click', () => {
            showImage((currentIndex + 1) % galleryItems.length);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage((currentIndex - 1 + galleryItems.length) % galleryItems.length);
                if (e.key === 'ArrowRight') showImage((currentIndex + 1) % galleryItems.length);
            }
            if (mobileNav.classList.contains('open')) {
                if (e.key === 'Escape') closeMenu();
            }
        });
    }
});