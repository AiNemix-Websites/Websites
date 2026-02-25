document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.initMobileNav();
            this.initStickyHeader();
            this.initScrollReveal();
            this.initCookieBanner();
            this.initFaqAccordion();
            this.initTestimonialCarousel();
            this.initStickyCTA();
        },

        initMobileNav() {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');

            if (!navToggle || !navMenu) return;

            navToggle.addEventListener('click', () => {
                const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isOpen);
                navMenu.classList.toggle('is-open');
                document.body.classList.toggle('scroll-lock', !isOpen);
            });
        },

        initStickyHeader() {
            const header = document.querySelector('.site-header');
            if (!header) return;

            const observer = new IntersectionObserver(([entry]) => {
                header.classList.toggle('scrolled', !entry.isIntersecting);
            }, { rootMargin: '100px 0px 0px 0px', threshold: 0 });

            observer.observe(document.body);
        },

        initScrollReveal() {
            const revealItems = document.querySelectorAll('.reveal-item');
            if (revealItems.length === 0) return;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            revealItems.forEach(item => {
                observer.observe(item);
            });
        },

        initCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');

            if (!banner || !acceptBtn) return;

            if (!localStorage.getItem('cookieConsent')) {
                banner.hidden = false;
                setTimeout(() => banner.classList.add('visible'), 100);
            }

            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                banner.classList.remove('visible');
                setTimeout(() => banner.hidden = true, 400);
            });
        },

        initFaqAccordion() {
            const accordionItems = document.querySelectorAll('.accordion-item');
            accordionItems.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');

                if (!header || !content) return;

                header.addEventListener('click', () => {
                    const isExpanded = header.getAttribute('aria-expanded') === 'true';
                    header.setAttribute('aria-expanded', !isExpanded);
                    content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
                });
            });
        },

        initTestimonialCarousel() {
            const carousel = document.querySelector('.testimonial-carousel');
            const prevBtn = document.querySelector('.carousel-prev');
            const nextBtn = document.querySelector('.carousel-next');

            if (!carousel || !prevBtn || !nextBtn) return;

            const slides = Array.from(carousel.children);
            let currentIndex = 0;

            const goToSlide = (index) => {
                carousel.style.transform = `translateX(-${index * 100}%)`;
                currentIndex = index;
            };

            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % slides.length;
                goToSlide(nextIndex);
            });

            prevBtn.addEventListener('click', () => {
                const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                goToSlide(prevIndex);
            });
            
            carousel.style.transition = 'transform 0.4s ease-in-out';
        },

        initStickyCTA() {
            const cta = document.getElementById('sticky-cta');
            if (!cta) return;

            const scrollObserver = new IntersectionObserver(([entry]) => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                cta.classList.toggle('visible', !entry.isIntersecting);
            }, { threshold: 0 });

            const hero = document.querySelector('.hero');
            if (hero) {
                scrollObserver.observe(hero);
            }
        }
    };

    App.init();
});