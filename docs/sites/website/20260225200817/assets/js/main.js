document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        header.insertAdjacentElement('afterend', sentinel);
        scrollObserver.observe(sentinel);
    }

    // --- Mobile Navigation --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNavContainer = document.getElementById('mobile-nav-container');
    if (mobileMenuToggle && mobileNavContainer) {
        const mobileNav = mobileNavContainer.querySelector('.mobile-nav');
        const focusableElements = mobileNav.querySelectorAll('a[href], button');
        const firstFocusableEl = focusableElements[0];
        const lastFocusableEl = focusableElements[focusableElements.length - 1];

        const toggleMenu = (isOpen) => {
            const open = typeof isOpen === 'boolean' ? isOpen : !mobileNavContainer.classList.contains('is-open');
            mobileNavContainer.classList.toggle('is-open', open);
            mobileMenuToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('scroll-locked', open);
            if (open) {
                firstFocusableEl.focus();
            }
        };

        mobileMenuToggle.addEventListener('click', () => toggleMenu());
        mobileNavContainer.querySelector('.mobile-nav-backdrop').addEventListener('click', () => toggleMenu(false));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavContainer.classList.contains('is-open')) {
                toggleMenu(false);
            }
            if (e.key === 'Tab' && mobileNavContainer.classList.contains('is-open')) {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.revealDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('is-visible'), 100);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('is-visible');
        });
    }
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentGallery = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= currentGallery.length) return;
            currentIndex = index;
            const item = currentGallery[currentIndex];
            lightboxImage.src = item.href;
            lightboxImage.alt = item.querySelector('img')?.alt || 'Großansicht';
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'block' : 'none';
        };

        const openLightbox = (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                const galleryContainer = galleryItem.closest('.gallery-grid');
                currentGallery = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
                const index = currentGallery.indexOf(galleryItem);
                document.body.classList.add('scroll-locked');
                lightbox.classList.add('is-visible');
                lightbox.setAttribute('aria-hidden', 'false');
                showImage(index);
                closeBtn.focus();
            }
        };

        const closeLightbox = () => {
            document.body.classList.remove('scroll-locked');
            lightbox.classList.remove('is-visible');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImage.src = ''; // Clear src to stop loading
        };

        document.querySelectorAll('.gallery-grid').forEach(grid => {
            grid.addEventListener('click', openLightbox);
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCta.classList.toggle('is-visible', !entry.isIntersecting);
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});