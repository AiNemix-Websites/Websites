document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.cacheDOMElements();
            this.addEventListeners();
            this.observeElements();
            this.initModules();
        },

        cacheDOMElements() {
            this.header = document.querySelector('.site-header');
            this.mobileNavToggle = document.querySelector('.mobile-nav-toggle');
            this.mobileNavContainer = document.querySelector('.mobile-nav-container');
            this.revealItems = document.querySelectorAll('.reveal-item');
            this.cookieBanner = document.getElementById('cookie-banner');
            this.cookieAccept = document.getElementById('cookie-accept');
            this.cookieDecline = document.getElementById('cookie-decline');
            this.stickyCTA = document.getElementById('sticky-cta');
        },

        addEventListeners() {
            window.addEventListener('scroll', this.handleScroll.bind(this));
            if (this.mobileNavToggle) {
                this.mobileNavToggle.addEventListener('click', this.toggleMobileNav.bind(this));
            }
            if (this.mobileNavContainer) {
                this.mobileNavContainer.addEventListener('click', (e) => {
                    if (e.target === this.mobileNavContainer) this.closeMobileNav();
                });
            }
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.mobileNavContainer.classList.contains('open')) {
                    this.closeMobileNav();
                }
            });
            if (this.cookieAccept) this.cookieAccept.addEventListener('click', () => this.handleCookie(true));
            if (this.cookieDecline) this.cookieDecline.addEventListener('click', () => this.handleCookie(false));
        },

        handleScroll() {
            if (this.header) {
                this.header.classList.toggle('scrolled', window.scrollY > 50);
            }
            if (this.stickyCTA) {
                const showCTA = window.scrollY > 400 && (document.body.scrollHeight - window.scrollY - window.innerHeight) > 400;
                this.stickyCTA.classList.toggle('visible', showCTA);
            }
        },

        toggleMobileNav() {
            const isExpanded = this.mobileNavToggle.getAttribute('aria-expanded') === 'true';
            this.mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            this.mobileNavContainer.style.display = 'block';
            document.body.classList.toggle('scroll-locked');
            setTimeout(() => {
                this.mobileNavContainer.classList.toggle('open');
            }, 10);
        },

        closeMobileNav() {
            this.mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
            this.mobileNavContainer.classList.remove('open');
            setTimeout(() => {
                this.mobileNavContainer.style.display = 'none';
            }, 300);
        },

        observeElements() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });
                this.revealItems.forEach(item => observer.observe(item));
            } else {
                this.revealItems.forEach(item => item.classList.add('is-visible'));
            }
        },

        initModules() {
            this.initCookieBanner();
            this.initBeforeAfterSlider();
            this.initTestimonialCarousel();
            this.initLightbox();
        },

        initCookieBanner() {
            if (!this.cookieBanner) return;
            const cookieConsent = localStorage.getItem('cookieConsent');
            if (cookieConsent === null) {
                setTimeout(() => {
                    this.cookieBanner.classList.add('visible');
                }, 1000);
            }
        },

        handleCookie(accepted) {
            localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
            this.cookieBanner.classList.remove('visible');
        },

        initBeforeAfterSlider() {
            const sliders = document.querySelectorAll('.before-after-slider');
            sliders.forEach(slider => {
                const input = slider.querySelector('.ba-slider');
                const afterImage = slider.querySelector('.ba-after');
                if (input && afterImage) {
                    input.addEventListener('input', (e) => {
                        afterImage.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
                    });
                }
            });
        },

        initTestimonialCarousel() {
            const carousels = document.querySelectorAll('.testimonial-carousel-wrapper');
            carousels.forEach(wrapper => {
                const carousel = wrapper.querySelector('.testimonial-carousel');
                const slides = carousel.querySelectorAll('.testimonial-slide');
                const prevBtn = wrapper.querySelector('.prev');
                const nextBtn = wrapper.querySelector('.next');
                const dotsContainer = wrapper.querySelector('.dots');
                if (!carousel || slides.length === 0) return;

                let currentIndex = 0;

                const updateCarousel = () => {
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                    carousel.style.transition = 'transform 0.5s ease-in-out';
                    updateDots();
                };

                const updateDots = () => {
                    dotsContainer.innerHTML = '';
                    slides.forEach((_, index) => {
                        const dot = document.createElement('button');
                        dot.classList.add('dot');
                        if (index === currentIndex) dot.classList.add('active');
                        dot.addEventListener('click', () => {
                            currentIndex = index;
                            updateCarousel();
                        });
                        dotsContainer.appendChild(dot);
                    });
                };

                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        currentIndex = (currentIndex + 1) % slides.length;
                        updateCarousel();
                    });
                }

                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                        updateCarousel();
                    });
                }

                updateDots();
            });
        },

        initLightbox() {
            const lightbox = document.getElementById('km-lightbox');
            if (!lightbox) return;

            const lightboxImage = lightbox.querySelector('img');
            const lightboxCaption = lightbox.querySelector('.lightbox-caption');
            const closeBtn = lightbox.querySelector('.lightbox-close');
            const prevBtn = lightbox.querySelector('.lightbox-prev');
            const nextBtn = lightbox.querySelector('.lightbox-next');
            const backdrop = lightbox.querySelector('.lightbox-backdrop');

            let galleryItems = [];
            let currentIndex = 0;

            const openLightbox = (index, gallery) => {
                galleryItems = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${gallery}']`));
                currentIndex = index;
                updateLightboxContent();
                lightbox.setAttribute('aria-hidden', 'false');
                lightbox.classList.add('open');
                document.body.classList.add('scroll-locked');
                document.addEventListener('keydown', handleKeydown);
            };

            const closeLightbox = () => {
                lightbox.setAttribute('aria-hidden', 'true');
                lightbox.classList.remove('open');
                document.body.classList.remove('scroll-locked');
                document.removeEventListener('keydown', handleKeydown);
            };

            const updateLightboxContent = () => {
                const item = galleryItems[currentIndex];
                const imageSrc = item.getAttribute('href');
                const captionText = item.dataset.caption || '';
                lightboxImage.src = imageSrc;
                lightboxImage.alt = item.querySelector('img')?.alt || 'Projektbild';
                lightboxCaption.textContent = captionText;
                prevBtn.style.display = galleryItems.length > 1 ? 'block' : 'none';
                nextBtn.style.display = galleryItems.length > 1 ? 'block' : 'none';
            };

            const showPrev = () => {
                currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                updateLightboxContent();
            };

            const showNext = () => {
                currentIndex = (currentIndex + 1) % galleryItems.length;
                updateLightboxContent();
            };

            const handleKeydown = (e) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            };

            document.querySelectorAll('[data-lightbox-trigger]').forEach((trigger, index) => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const gallery = trigger.dataset.lightboxTrigger;
                    const galleryTriggers = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${gallery}']`));
                    const clickedIndex = galleryTriggers.indexOf(trigger);
                    openLightbox(clickedIndex, gallery);
                });
            });

            closeBtn.addEventListener('click', closeLightbox);
            backdrop.addEventListener('click', closeLightbox);
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
        }
    };

    App.init();
});