document.addEventListener('DOMContentLoaded', () => {

    'use strict';

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Sticky Header
    const initStickyHeader = () => {
        const header = document.getElementById('site-header');
        if (!header) return;

        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    };

    // 2. Mobile Navigation
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const closeBtn = document.querySelector('.mobile-nav-close');
        const navDrawer = document.getElementById('mobile-nav');
        if (!toggleBtn || !navDrawer || !closeBtn) return;

        const openNav = () => {
            navDrawer.classList.add('is-open');
            document.body.classList.add('mobile-nav-open', 'no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'true');
            navDrawer.querySelector('a').focus();
        };

        const closeNav = () => {
            navDrawer.classList.remove('is-open');
            document.body.classList.remove('mobile-nav-open', 'no-scroll');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        };

        toggleBtn.addEventListener('click', openNav);
        closeBtn.addEventListener('click', closeNav);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navDrawer.classList.contains('is-open')) {
                closeNav();
            }
        });

        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('mobile-nav-open') && !e.target.closest('.mobile-nav-drawer') && !e.target.closest('.mobile-nav-toggle')) {
                closeNav();
            }
        });
    };

    // 3. Scroll Animations
    const initScrollReveal = () => {
        if (isReducedMotion) return;
        const elements = document.querySelectorAll('.scroll-reveal, .animate-in');
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || (index % 5 * 100); // Stagger
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => observer.observe(el));
    };

    // 4. Accordion
    const initAccordion = () => {
        const accordions = document.querySelectorAll('.accordion');
        accordions.forEach(accordion => {
            const items = accordion.querySelectorAll('.accordion-item');
            items.forEach(item => {
                const header = item.querySelector('.accordion-header');
                const content = item.querySelector('.accordion-content');

                header.addEventListener('click', () => {
                    const isExpanded = header.getAttribute('aria-expanded') === 'true';
                    header.setAttribute('aria-expanded', !isExpanded);
                    content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
                });
            });
        });
    };
    
    // 5. Carousel
    const initCarousel = () => {
        const carousels = document.querySelectorAll('.carousel-wrapper');
        carousels.forEach(wrapper => {
            const carousel = wrapper.querySelector('.carousel');
            const slides = carousel.querySelectorAll('.carousel-slide');
            const prevBtn = wrapper.querySelector('.carousel-prev');
            const nextBtn = wrapper.querySelector('.carousel-next');
            const dotsContainer = wrapper.querySelector('.carousel-dots');
            if (slides.length <= 1) return;

            let currentIndex = 0;

            const updateCarousel = () => {
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === slides.length - 1;
                if(dotsContainer) {
                    Array.from(dotsContainer.children).forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }
            };

            if(dotsContainer) {
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                    dot.addEventListener('click', () => {
                        currentIndex = index;
                        updateCarousel();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            updateCarousel();
        });
    };

    // 6. Cookie Banner
    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.style.display = 'block';
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.style.display = 'none';
        });
    };

    // 7. Back to Top & Sticky CTA
    const initScrollFeatures = () => {
        const backToTopBtn = document.getElementById('back-to-top');
        const stickyCta = document.getElementById('sticky-cta');
        if (!backToTopBtn && !stickyCta) return;

        const progressRing = backToTopBtn ? backToTopBtn.querySelector('.progress-ring-circle') : null;
        const radius = progressRing ? progressRing.r.baseVal.value : 0;
        const circumference = radius * 2 * Math.PI;

        if (progressRing) {
            progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
            progressRing.style.strokeDashoffset = circumference;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const progress = scrollPosition / (docHeight - windowHeight);

            if (scrollPosition > 300) {
                if (backToTopBtn) backToTopBtn.classList.add('visible');
                if (stickyCta) stickyCta.classList.add('visible');
            } else {
                if (backToTopBtn) backToTopBtn.classList.remove('visible');
                if (stickyCta) stickyCta.classList.remove('visible');
            }
            
            if (progressRing && !isReducedMotion) {
                const offset = circumference - progress * circumference;
                progressRing.style.strokeDashoffset = offset;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: isReducedMotion ? 'auto' : 'smooth' });
            });
        }
    };

    // Initialize all modules
    initStickyHeader();
    initMobileNav();
    initScrollReveal();
    initAccordion();
    initCarousel();
    initCookieBanner();
    initScrollFeatures();
});