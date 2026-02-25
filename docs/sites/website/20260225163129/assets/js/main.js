document.addEventListener('DOMContentLoaded', () => {

    class EpiArtTheme {
        constructor() {
            this.initStickyHeader();
            this.initMobileMenu();
            this.initScrollReveal();
            this.initFaqAccordion();
            this.initTestimonialCarousel();
            this.initCookieBanner();
            this.initContextualCta();
        }

        initStickyHeader() {
            const header = document.getElementById('main-header');
            if (!header) return;

            const observer = new IntersectionObserver(([entry]) => {
                header.classList.toggle('scrolled', !entry.isIntersecting);
            }, { rootMargin: '-1px 0px 0px 0px', threshold: [1] });

            const sentinel = document.createElement('div');
            sentinel.style.height = '1px';
            header.insertAdjacentElement('afterend', sentinel);
            observer.observe(sentinel);
        }

        initMobileMenu() {
            const toggleBtn = document.getElementById('mobile-menu-toggle');
            const closeBtn = document.getElementById('mobile-menu-close');
            const menu = document.getElementById('mobile-menu');
            const backdrop = document.getElementById('menu-backdrop');

            if (!toggleBtn || !menu || !closeBtn || !backdrop) return;

            const openMenu = () => {
                menu.classList.add('open');
                backdrop.classList.add('visible');
                document.body.classList.add('scroll-locked');
                toggleBtn.setAttribute('aria-expanded', 'true');
            };

            const closeMenu = () => {
                menu.classList.remove('open');
                backdrop.classList.remove('visible');
                document.body.classList.remove('scroll-locked');
                toggleBtn.setAttribute('aria-expanded', 'false');
            };

            toggleBtn.addEventListener('click', openMenu);
            closeBtn.addEventListener('click', closeMenu);
            backdrop.addEventListener('click', closeMenu);

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menu.classList.contains('open')) {
                    closeMenu();
                }
            });
        }

        initScrollReveal() {
            const revealItems = document.querySelectorAll('.reveal-item');
            if (revealItems.length === 0) return;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const staggerContainer = entry.target.dataset.stagger ? entry.target : entry.target.closest('[data-stagger]');
                        if (staggerContainer) {
                            const itemsToStagger = entry.target.querySelectorAll(':scope > div');
                            const delay = parseInt(staggerContainer.dataset.stagger) || 100;
                            itemsToStagger.forEach((item, index) => {
                                item.style.transitionDelay = `${index * delay}ms`;
                                item.classList.add('visible');
                            });
                        } else {
                            entry.target.classList.add('visible');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            revealItems.forEach(item => {
                if(item.dataset.stagger) {
                    Array.from(item.children).forEach(child => child.classList.add('reveal-item'));
                }
                observer.observe(item);
            });
        }

        initFaqAccordion() {
            const faqItems = document.querySelectorAll('.faq-item');
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const isOpen = item.classList.contains('open');
                    faqItems.forEach(i => i.classList.remove('open'));
                    if (!isOpen) {
                        item.classList.add('open');
                    }
                });
            });
        }

        initTestimonialCarousel() {
            const carousel = document.getElementById('testimonial-carousel');
            if (!carousel) return;

            const slides = carousel.querySelectorAll('.testimonial-slide');
            const prevBtn = document.getElementById('carousel-prev');
            const nextBtn = document.getElementById('carousel-next');
            let currentIndex = 0;

            function updateCarousel() {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        initCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');

            if (!banner || !acceptBtn) return;

            if (!localStorage.getItem('cookieConsent')) {
                setTimeout(() => banner.classList.add('visible'), 1000);
            }

            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                banner.classList.remove('visible');
            });
        }

        initContextualCta() {
            const cta = document.getElementById('context-cta');
            if (!cta) return;

            const observer = new IntersectionObserver(([entry]) => {
                cta.classList.toggle('visible', !entry.isIntersecting);
            }, { threshold: [0] });

            const heroSection = document.querySelector('.hero');
            if(heroSection) {
                 observer.observe(heroSection);
            }
        }
    }

    new EpiArtTheme();

});