document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.cacheDOMElements();
            this.initEventListeners();
            this.initScrollHeader();
            this.initScrollReveal();
            this.initCookieBanner();
            this.initLightbox();
            this.initFaqAccordion();
            this.initStickyCTA();
            this.initBackToTop();
        },

        cacheDOMElements() {
            this.header = document.getElementById('main-header');
            this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            this.mobileMenu = document.getElementById('mobile-menu');
            this.cookieBanner = document.getElementById('cookie-banner');
            this.cookieAcceptBtn = document.getElementById('cookie-accept');
            this.lightbox = document.getElementById('km-lightbox');
            this.lightboxImg = document.getElementById('lightbox-img');
            this.lightboxClose = this.lightbox.querySelector('.lightbox-close');
            this.lightboxPrev = this.lightbox.querySelector('.lightbox-prev');
            this.lightboxNext = this.lightbox.querySelector('.lightbox-next');
            this.faqQuestions = document.querySelectorAll('.faq-question');
            this.stickyCTA = document.getElementById('sticky-cta');
            this.backToTopBtn = document.getElementById('back-to-top');
            this.galleryImages = [];
            this.currentImageIndex = 0;
        },

        initEventListeners() {
            if (this.mobileMenuToggle) {
                this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
            }
            if (this.cookieAcceptBtn) {
                this.cookieAcceptBtn.addEventListener('click', () => this.acceptCookies());
            }
        },

        toggleMobileMenu() {
            this.mobileMenuToggle.classList.toggle('active');
            this.mobileMenu.classList.toggle('open');
            const isExpanded = this.mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            this.mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            document.body.classList.toggle('no-scroll');
        },

        initScrollHeader() {
            if (!this.header) return;
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    this.header.classList.add('scrolled');
                } else {
                    this.header.classList.remove('scrolled');
                }
            });
        },

        initScrollReveal() {
            const revealElements = document.querySelectorAll('.reveal-on-scroll');
            if (revealElements.length === 0) return;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        if (entry.target.classList.contains('stagger-children')) {
                            const children = entry.target.querySelectorAll(':scope > *');
                            children.forEach((child, index) => {
                                child.style.setProperty('--stagger-order', index);
                            });
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            revealElements.forEach(el => observer.observe(el));
        },

        initCookieBanner() {
            if (!this.cookieBanner) return;
            setTimeout(() => {
                if (!localStorage.getItem('cookieConsent')) {
                    this.cookieBanner.classList.add('show');
                }
            }, 2000);
        },

        acceptCookies() {
            localStorage.setItem('cookieConsent', 'true');
            this.cookieBanner.classList.remove('show');
        },

        initLightbox() {
            if (!this.lightbox) return;

            const triggers = document.querySelectorAll('.lightbox-trigger');
            if (triggers.length === 0) return;
            
            this.galleryImages = Array.from(triggers).map(trigger => ({
                src: trigger.dataset.kmImage,
                alt: trigger.alt
            }));

            triggers.forEach((trigger, index) => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openLightbox(index);
                });
            });

            this.lightboxClose.addEventListener('click', () => this.closeLightbox());
            this.lightbox.addEventListener('click', (e) => {
                if (e.target === this.lightbox) this.closeLightbox();
            });
            this.lightboxPrev.addEventListener('click', () => this.showPrevImage());
            this.lightboxNext.addEventListener('click', () => this.showNextImage());

            document.addEventListener('keydown', (e) => {
                if (this.lightbox.classList.contains('show')) {
                    if (e.key === 'Escape') this.closeLightbox();
                    if (e.key === 'ArrowLeft') this.showPrevImage();
                    if (e.key === 'ArrowRight') this.showNextImage();
                }
            });
        },

        openLightbox(index) {
            this.currentImageIndex = index;
            this.updateLightboxImage();
            this.lightbox.classList.add('show');
            this.lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('no-scroll');
            this.lightboxClose.focus();
        },

        closeLightbox() {
            this.lightbox.classList.remove('show');
            this.lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
        },

        updateLightboxImage() {
            const image = this.galleryImages[this.currentImageIndex];
            let path = this.lightbox.dataset.isSubpage === 'true' ? '../' : '';
            this.lightboxImg.src = path + image.src;
            this.lightboxImg.alt = image.alt;
        },

        showPrevImage() {
            this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
            this.updateLightboxImage();
        },

        showNextImage() {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
            this.updateLightboxImage();
        },

        initFaqAccordion() {
            if (this.faqQuestions.length === 0) return;
            this.faqQuestions.forEach(question => {
                question.addEventListener('click', () => {
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';
                    question.setAttribute('aria-expanded', !isExpanded);
                    const answer = question.nextElementSibling;
                    answer.style.display = 'block'; // Needed for transition
                });
            });
        },

        initStickyCTA() {
            if (!this.stickyCTA) return;
            window.addEventListener('scroll', () => {
                if (window.scrollY > 600) {
                    this.stickyCTA.classList.add('show');
                } else {
                    this.stickyCTA.classList.remove('show');
                }
            });
        },

        initBackToTop() {
            if (!this.backToTopBtn) return;
            window.addEventListener('scroll', () => {
                if (window.scrollY > 600) {
                    this.backToTopBtn.classList.add('show');
                } else {
                    this.backToTopBtn.classList.remove('show');
                }
            });
            this.backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    };

    App.init();
});