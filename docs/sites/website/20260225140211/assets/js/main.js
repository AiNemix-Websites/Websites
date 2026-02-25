document.addEventListener('DOMContentLoaded', function() {

    // --- UTILITY FUNCTIONS ---
    const select = (el, all = false) => {
        el = el.trim();
        if (all) {
            return [...document.querySelectorAll(el)];
        } else {
            return document.querySelector(el);
        }
    };

    // --- STICKY HEADER ---
    const header = select('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
    }

    // --- MOBILE NAVIGATION ---
    const mobileMenuToggle = select('.mobile-menu-toggle');
    const mobileNavDrawer = select('.mobile-nav-drawer');
    if (mobileMenuToggle && mobileNavDrawer) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = header.classList.toggle('open');
            mobileNavDrawer.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        });
    }
    
    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = select('.reveal-on-scroll', true);
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- ACCORDION (FAQ) ---
    const accordionItems = select('.accordion-item', true);
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.padding = '0 0 var(--spacing-md) 0';
            } else {
                content.style.maxHeight = '0';
                content.style.padding = '0';
            }
        });
    });

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = select('.testimonial-slide', true);
        const dotsContainer = select('.dots');
        const prevBtn = select('.carousel-controls .prev');
        const nextBtn = select('.carousel-controls .next');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = select('.dot', true);
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0); // Initialize
    }

    // --- ANIMATED COUNTERS ---
    const statValues = select('.stat-value', true);
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = +el.getAttribute('data-target');
                let current = 0;
                const increment = target / 100;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        el.innerText = Math.ceil(current).toLocaleString('de-DE');
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.innerText = target.toLocaleString('de-DE');
                    }
                };
                updateCounter();
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.8 });
    statValues.forEach(el => counterObserver.observe(el));

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const acceptCookiesBtn = select('#accept-cookies');
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }
    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- BACK TO TOP & STICKY CTA ---
    const backToTopBtn = select('#back-to-top');
    const stickyCta = select('#sticky-cta');
    if (backToTopBtn) {
        const toggleVisibility = () => {
            const show = window.scrollY > 300;
            backToTopBtn.classList.toggle('show', show);
            if(stickyCta) stickyCta.classList.toggle('show', window.scrollY > window.innerHeight * 0.8);
        };
        window.addEventListener('scroll', toggleVisibility);
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- FOOTER CURRENT YEAR ---
    const currentYearSpan = select('#current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});