document.addEventListener('DOMContentLoaded', () => {

    const SITE = {
        header: document.getElementById('site-header'),
        navToggle: document.querySelector('.nav-toggle'),
        mainNav: document.getElementById('main-menu'),
        stickyCta: document.getElementById('sticky-cta'),
        cookieBanner: document.getElementById('cookie-banner'),
        cookieAcceptBtn: document.getElementById('cookie-accept'),
        lightbox: document.getElementById('km-lightbox'),
        lightboxImage: document.getElementById('km-lightbox-image'),
        lightboxClose: document.querySelector('.km-lightbox-close'),
        lightboxPrev: document.querySelector('.km-lightbox-prev'),
        lightboxNext: document.querySelector('.km-lightbox-next'),
        galleryItems: [],
        currentImageIndex: -1,

        init() {
            this.initStickyHeader();
            this.initMobileMenu();
            this.initScrollReveal();
            this.initStickyCta();
            this.initCookieBanner();
            this.initLightbox();
        },

        initStickyHeader() {
            if (!this.header) return;
            const scrollHandler = () => {
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
        },

        initMobileMenu() {
            if (!this.navToggle || !this.mainNav) return;
            this.navToggle.addEventListener('click', () => {
                const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
                this.navToggle.setAttribute('aria-expanded', !isExpanded);
                document.body.classList.toggle('nav-open');
                document.body.classList.toggle('body-no-scroll');
            });
        },

        initScrollReveal() {
            const revealElements = document.querySelectorAll('.reveal-on-scroll');
            if (revealElements.length === 0) return;

            const observer = new IntersectionObserver((entries, observer) => {
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

            revealElements.forEach(el => observer.observe(el));
        },

        initStickyCta() {
            if (!this.stickyCta) return;
            const scrollHandler = () => {
                if (window.scrollY > window.innerHeight * 0.8) {
                    this.stickyCta.classList.add('visible');
                } else {
                    this.stickyCta.classList.remove('visible');
                }
            };
            window.addEventListener('scroll', scrollHandler, { passive: true });
        },

        initCookieBanner() {
            if (!this.cookieBanner || !this.cookieAcceptBtn) return;
            if (localStorage.getItem('cookieConsent') !== 'true') {
                this.cookieBanner.classList.add('show');
            }
            this.cookieAcceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                this.cookieBanner.classList.remove('show');
            });
        },

        initLightbox() {
            if (!this.lightbox) return;
            const gallery = document.getElementById('project-gallery');
            if (!gallery) return;

            this.galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));

            gallery.addEventListener('click', e => {
                e.preventDefault();
                const link = e.target.closest('.gallery-item');
                if (link) {
                    this.currentImageIndex = this.galleryItems.indexOf(link);
                    this.openLightbox(link.href);
                }
            });

            const closeLightbox = () => {
                this.lightbox.classList.remove('show');
                document.body.classList.remove('body-no-scroll');
            };

            this.lightboxClose.addEventListener('click', closeLightbox);
            this.lightbox.addEventListener('click', e => {
                if (e.target === this.lightbox) closeLightbox();
            });

            this.lightboxPrev.addEventListener('click', () => this.showPrevImage());
            this.lightboxNext.addEventListener('click', () => this.showNextImage());

            document.addEventListener('keydown', e => {
                if (!this.lightbox.classList.contains('show')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') this.showPrevImage();
                if (e.key === 'ArrowRight') this.showNextImage();
            });
        },

        openLightbox(src) {
            this.lightboxImage.src = src;
            this.lightbox.classList.add('show');
            document.body.classList.add('body-no-scroll');
            this.updateNavButtons();
        },

        showPrevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
            this.lightboxImage.src = this.galleryItems[this.currentImageIndex].href;
            this.updateNavButtons();
        },

        showNextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryItems.length;
            this.lightboxImage.src = this.galleryItems[this.currentImageIndex].href;
            this.updateNavButtons();
        },
        
        updateNavButtons() {
             // This could be used to hide/show prev/next on first/last image if not looping
        }
    };

    SITE.init();
});