'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.initMobileNav();
            this.initStickyHeader();
            this.initFaqAccordion();
            this.initTestimonialCarousel();
            this.initScrollReveal();
            this.initCookieBanner();
            this.initLightbox();
            this.initStickyCta();
        },

        initMobileNav() {
            const toggleBtn = document.querySelector('.mobile-nav-toggle');
            const closeBtn = document.querySelector('.mobile-nav-close');
            const overlay = document.querySelector('.mobile-nav-overlay');
            const nav = document.querySelector('.mobile-nav');

            if (!toggleBtn || !overlay || !nav) return;

            const openNav = () => {
                toggleBtn.setAttribute('aria-expanded', 'true');
                overlay.classList.add('open');
                nav.classList.add('open');
                document.body.classList.add('no-scroll');
                nav.querySelector('a').focus();
            };

            const closeNav = () => {
                toggleBtn.setAttribute('aria-expanded', 'false');
                overlay.classList.remove('open');
                nav.classList.remove('open');
                document.body.classList.remove('no-scroll');
            };

            toggleBtn.addEventListener('click', () => {
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                isExpanded ? closeNav() : openNav();
            });

            closeBtn.addEventListener('click', closeNav);
            overlay.addEventListener('click', closeNav);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && nav.classList.contains('open')) {
                    closeNav();
                }
            });
        },

        initStickyHeader() {
            const header = document.querySelector('.site-header.sticky');
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

        initFaqAccordion() {
            const faqItems = document.querySelectorAll('.faq-item');
            if (!faqItems.length) return;

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

        initTestimonialCarousel() {
            const carousel = document.querySelector('.testimonial-carousel');
            if (!carousel) return;

            const slides = Array.from(carousel.children);
            const nextBtn = document.querySelector('.carousel-controls .next');
            const prevBtn = document.querySelector('.carousel-controls .prev');
            const dotsContainer = document.querySelector('.dots');
            let currentIndex = 0;

            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.5s ease-in-out';

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            };

            const createDots = () => {
                slides.forEach((_, i) => {
                    const dot = document.createElement('button');
                    dot.classList.add('dot');
                    dot.addEventListener('click', () => {
                        currentIndex = i;
                        updateCarousel();
                    });
                    dotsContainer.appendChild(dot);
                });
            };

            const updateDots = () => {
                const dots = dotsContainer.children;
                Array.from(dots).forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            };

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });

            createDots();
            updateCarousel();
        },

        initScrollReveal() {
            const revealElements = document.querySelectorAll('.reveal-on-scroll');
            if (!revealElements.length) return;

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            revealElements.forEach(el => observer.observe(el));
        },

        initCookieBanner() {
            const banner = document.getElementById('cookie-banner');
            const acceptBtn = document.getElementById('cookie-accept');
            const declineBtn = document.getElementById('cookie-decline');

            if (!banner) return;

            if (!localStorage.getItem('cookieConsent')) {
                banner.classList.add('visible');
            }

            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                banner.classList.remove('visible');
            });

            declineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                banner.classList.remove('visible');
            });
        },

        initLightbox() {
            const lightbox = document.getElementById('km-lightbox');
            if (!lightbox) return;

            const triggers = Array.from(document.querySelectorAll('[data-km-lightbox-trigger]'));
            if (!triggers.length) return;

            const closeBtn = lightbox.querySelector('.close-lightbox');
            const prevBtn = lightbox.querySelector('.prev-lightbox');
            const nextBtn = lightbox.querySelector('.next-lightbox');
            const imgEl = lightbox.querySelector('img');
            let currentIndex = 0;

            const showImage = (index) => {
                const trigger = triggers[index];
                const imagePath = trigger.dataset.kmImage || trigger.src;
                imgEl.src = trigger.src.includes('../') ? `../${imagePath}` : imagePath;
                imgEl.alt = trigger.alt || 'Projektbild';
                currentIndex = index;
            };

            const openLightbox = (index) => {
                showImage(index);
                lightbox.classList.add('visible');
                document.body.classList.add('no-scroll');
                document.addEventListener('keydown', handleKeydown);
            };

            const closeLightbox = () => {
                lightbox.classList.remove('visible');
                document.body.classList.remove('no-scroll');
                imgEl.src = '';
                document.removeEventListener('keydown', handleKeydown);
            };
            
            const showPrev = () => showImage((currentIndex - 1 + triggers.length) % triggers.length);
            const showNext = () => showImage((currentIndex + 1) % triggers.length);

            const handleKeydown = (e) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            };

            triggers.forEach((trigger, index) => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(index);
                });
            });

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
            prevBtn.addEventListener('click', showPrev);
            nextBtn.addEventListener('click', showNext);
        },

        initStickyCta() {
            const cta = document.getElementById('sticky-cta');
            if (!cta) return;

            const onScroll = () => {
                if (window.scrollY > window.innerHeight * 0.5) {
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                }
            };

            window.addEventListener('scroll', onScroll, { passive: true });
        }
    };

    App.init();

});