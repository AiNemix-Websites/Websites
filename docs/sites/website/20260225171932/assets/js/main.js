document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        const scrollObserver = new IntersectionObserver(([entry]) => {
            header.classList.toggle('scrolled', !entry.isIntersecting);
        }, { rootMargin: '100px 0px 0px 0px' });
        scrollObserver.observe(document.body);
    }

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('open');
            menuToggle.classList.toggle('open', isOpen);
            mobileMenu.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('scroll-locked', isOpen);
        };

        menuToggle.addEventListener('click', () => toggleMenu());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    const children = entry.target.children;
                    if (delay > 0 && children.length > 1) {
                        Array.from(children).forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('is-visible');
                            }, index * delay);
                        });
                    } else {
                        entry.target.classList.add('is-visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Accordion (for Philosophy section) --- //
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            if (header && content) {
                header.addEventListener('click', () => {
                    const isExpanded = header.getAttribute('aria-expanded') === 'true';
                    header.setAttribute('aria-expanded', !isExpanded);
                    content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
                });
                // Set initial state for open accordions
                if(header.getAttribute('aria-expanded') === 'true') {
                     content.style.maxHeight = content.scrollHeight + 'px';
                }
            }
        });
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        if (dotsContainer) {
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
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('show'), 10);
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
            setTimeout(() => cookieBanner.style.display = 'none', 300);
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver(([entry]) => {
             // Show when hero is NOT intersecting (user has scrolled down)
            stickyCTA.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0.1 });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});