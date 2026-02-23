document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.initStickyHeader();
            this.initMobileNav();
            this.initScrollReveal();
            this.initFaqAccordion();
            this.initCarousel();
            this.initLightbox();
            this.initCookieBanner();
            this.initStickyCta();
        },

        initStickyHeader() {
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
        },

        initMobileNav() {
            const toggleBtn = document.getElementById('mobile-nav-toggle');
            const nav = document.querySelector('.main-nav');
            if (!toggleBtn || !nav) return;

            const toggleNav = (isOpen) => {
                const open = typeof isOpen === 'boolean' ? isOpen : !nav.classList.contains('is-open');
                nav.classList.toggle('is-open', open);
                toggleBtn.classList.toggle('is-active', open);
                toggleBtn.setAttribute('aria-expanded', open);
                document.body.classList.toggle('scroll-lock', open);
            };

            toggleBtn.addEventListener('click', () => toggleNav());

            nav.addEventListener('click', (e) => {
                if (e.target === nav) {
                    toggleNav(false);
                }
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                    toggleNav(false);
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
                                child.style.setProperty('--stagger-index', index);
                            });
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            revealElements.forEach(el => observer.observe(el));
        },

        initFaqAccordion() {
            const faqItems = document.querySelectorAll('.faq-item');
            if (faqItems.length === 0) return;

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
        },

        initCarousel() {
            const carousel = document.getElementById('references-carousel');
            if (!carousel) return;

            const prevBtn = carousel.parentElement.querySelector('.prev');
            const nextBtn = carousel.parentElement.querySelector('.next');
            const slides = carousel.querySelectorAll('.carousel-slide');
            let currentIndex = 0;

            const goToSlide = (index) => {
                carousel.scrollTo({
                    left: slides[index].offsetLeft,
                    behavior: 'smooth'
                });
                currentIndex = index;
            };

            prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(newIndex);
            });

            nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % slides.length;
                goToSlide(newIndex);
            });
        },

        initLightbox() {
            const lightbox = document.getElementById('km-lightbox');
            const galleryContainer = document.getElementById('gallery-container');
            if (!lightbox || !galleryContainer) return;

            const galleryItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
            const lightboxImg = lightbox.querySelector('.lightbox-image');
            const closeBtn = lightbox.querySelector('.lightbox-close');
            const prevBtn = lightbox.querySelector('.lightbox-prev');
            const nextBtn = lightbox.querySelector('.lightbox-next');
            let currentIndex = 0;

            const showImage = (index) => {
                const item = galleryItems[index];
                const imgSrc = item.src.replace('../', ''); // Ensure correct path for lightbox
                const imgAlt = item.alt;
                lightboxImg.src = imgSrc;
                lightboxImg.alt = imgAlt;
                currentIndex = index;
            };

            const openLightbox = (index) => {
                showImage(index);
                lightbox.hidden = false;
                document.body.classList.add('scroll-lock');
                document.addEventListener('keydown', handleKeydown);
            };

            const closeLightbox = () => {
                lightbox.hidden = true;
                document.body.classList.remove('scroll-lock');
                document.removeEventListener('keydown', handleKeydown);
            };

            const handleKeydown = (e) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            };

            const showPrev = () => {
                const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                showImage(newIndex);
            };

            const showNext = () => {
                const newIndex = (currentIndex + 1) % galleryItems.length;
                showImage(newIndex);
            };

            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => openLightbox(index));
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
        },

        initCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');
            if (!banner || !acceptBtn) return;

            const cookieAccepted = localStorage.getItem('cookie_accepted');

            if (!cookieAccepted) {
                banner.hidden = false;
            }

            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookie_accepted', 'true');
                banner.hidden = true;
            });
        },

        initStickyCta() {
            const ctaBar = document.getElementById('sticky-cta-bar');
            if (!ctaBar) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Show when hero is NOT intersecting (scrolled past)
                    ctaBar.hidden = entry.isIntersecting;
                });
            }, { threshold: 0.1 });

            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                observer.observe(heroSection);
            }
        }
    };

    App.init();
});