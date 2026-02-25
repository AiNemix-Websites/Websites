document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Header & Mobile Navigation --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Sticky Header Shrink
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile Menu Toggle
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll');

            if (!mainNav.classList.contains('mobile-active')) {
                mainNav.classList.add('mobile-active');
                setTimeout(() => mainNav.classList.add('mobile-visible'), 10);
            } else {
                mainNav.classList.remove('mobile-visible');
                mainNav.addEventListener('transitionend', () => {
                    mainNav.classList.remove('mobile-active');
                }, { once: true });
            }
        });
    }

    // --- 2. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay, 10) || 0;
                const staggerChildren = element.querySelectorAll('[data-stagger] > *');

                if (staggerChildren.length > 0) {
                    const staggerDelay = parseInt(element.dataset.stagger, 10) || 100;
                    staggerChildren.forEach((child, index) => {
                        child.style.transitionDelay = `${index * staggerDelay}ms`;
                        child.classList.add('revealed');
                    });
                } else {
                    element.style.transitionDelay = `${delay}ms`;
                    element.classList.add('revealed');
                }
                observer.unobserve(element);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. Accordion (FAQ) --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            // Optional: Close other items
            // accordionItems.forEach(i => i.classList.remove('active'));
            if (!wasActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // --- 4. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = Array.from(dotsContainer.children);

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = `translateX(-${targetIndex * 100}%)`;
            dots[currentIndex].classList.remove('active');
            slides[currentIndex].style.opacity = 0;
            currentIndex = targetIndex;
            dots[currentIndex].classList.add('active');
            slides[currentIndex].style.opacity = 1;
        };

        const initCarousel = () => {
            carousel.style.display = 'flex';
            carousel.style.transition = 'transform 0.5s ease-in-out';
            slides.forEach((slide, index) => {
                slide.style.flex = '0 0 100%';
                slide.style.transition = 'opacity 0.5s ease-in-out';
                slide.style.opacity = index === 0 ? 1 : 0;
            });
        };

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            moveToSlide(prevIndex);
        });
        
        initCarousel();
    }

    // --- 5. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 6. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0.1 });

        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 7. Smooth scroll for anchor links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});