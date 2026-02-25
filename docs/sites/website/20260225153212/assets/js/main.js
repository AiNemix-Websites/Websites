document.addEventListener('DOMContentLoaded', () => {

    // --- Site-wide Initializations ---
    handleStickyHeader();
    handleMobileMenu();
    handleScrollReveal();
    handleCookieBanner();
    handleBackToTop();
    handleStickyCTA();
    handleLightbox();
    handleContactForm();

    // --- Sticky Header --- 
    function handleStickyHeader() {
        const header = document.getElementById('site-header');
        if (!header) return;

        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // --- Mobile Menu --- 
    function handleMobileMenu() {
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (!toggleBtn || !mobileMenu) return;

        const toggleMenu = (isOpen) => {
            const expanded = isOpen === undefined ? toggleBtn.getAttribute('aria-expanded') === 'false' : isOpen;
            toggleBtn.setAttribute('aria-expanded', expanded);
            mobileMenu.setAttribute('aria-hidden', !expanded);
            document.body.classList.toggle('no-scroll', expanded);
            mobileMenu.classList.toggle('is-open', expanded);
        };

        toggleBtn.addEventListener('click', () => toggleMenu());

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal --- 
    function handleScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-text, .reveal-item');
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

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Cookie Banner --- 
    function handleCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookies_accepted')) {
            banner.style.display = 'block';
            setTimeout(() => banner.classList.add('show'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            banner.classList.remove('show');
            localStorage.setItem('cookies_accepted', 'true');
            setTimeout(() => banner.style.display = 'none', 500);
        });
    }

    // --- Back to Top Button ---
    function handleBackToTop() {
        const button = document.getElementById('back-to-top');
        if (!button) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        }, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Sticky CTA ---
    function handleStickyCTA() {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateCTA = () => {
            const footer = document.querySelector('.site-footer');
            const footerOffset = footer ? footer.offsetTop : document.body.scrollHeight;
            const ctaHeight = cta.offsetHeight;

            if (window.scrollY > 500 && (window.scrollY + window.innerHeight) < (footerOffset - ctaHeight)) {
                cta.classList.add('show');
            } else {
                cta.classList.remove('show');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(updateCTA);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- Lightbox --- 
    function handleLightbox() {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const lightboxImage = document.getElementById('km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const galleries = document.querySelectorAll('.lightbox-gallery');
        let currentImageIndex;
        let currentGalleryItems = [];

        const showLightbox = (index) => {
            if (index < 0 || index >= currentGalleryItems.length) return;
            currentImageIndex = index;
            const item = currentGalleryItems[index];
            const imagePath = item.href;
            const altText = item.querySelector('img')?.alt || 'Galeriebild';
            lightboxImage.src = imagePath;
            lightboxImage.alt = altText;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            prevBtn.style.display = currentGalleryItems.length > 1 ? 'block' : 'none';
            nextBtn.style.display = currentGalleryItems.length > 1 ? 'block' : 'none';
        };

        const hideLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        const showPrev = () => showLightbox((currentImageIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length);
        const showNext = () => showLightbox((currentImageIndex + 1) % currentGalleryItems.length);

        galleries.forEach(gallery => {
            const items = Array.from(gallery.querySelectorAll('.gallery-item'));
            gallery.addEventListener('click', (e) => {
                const clickedItem = e.target.closest('.gallery-item');
                if (clickedItem) {
                    e.preventDefault();
                    currentGalleryItems = items;
                    const index = currentGalleryItems.indexOf(clickedItem);
                    showLightbox(index);
                }
            });
        });

        closeBtn.addEventListener('click', hideLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }

    // --- Contact Form --- 
    function handleContactForm() {
        const form = document.getElementById('contact-form');
        const statusEl = document.getElementById('form-status');
        if (!form || !statusEl) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a simulation. In a real project, this would be an AJAX call.
            statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde versendet.';
            statusEl.className = 'form-status success';
            statusEl.style.display = 'block';
            form.reset();

            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 5000);
        });
    }
});