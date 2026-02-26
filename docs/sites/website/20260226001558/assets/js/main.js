document.addEventListener('DOMContentLoaded', () => {

    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const drawer = document.querySelector('.mobile-nav-drawer');
        if (!toggleBtn || !drawer) return;

        toggleBtn.addEventListener('click', () => {
            const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isOpen);
            drawer.classList.toggle('open');
            document.body.classList.toggle('scroll-lock');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('open')) {
                toggleBtn.click();
            }
        });
    };

    const initStickyHeader = () => {
        const header = document.querySelector('.site-header.sticky');
        if (!header) return;

        const observer = new IntersectionObserver(
            ([e]) => header.classList.toggle('scrolled', e.intersectionRatio < 1),
            { threshold: [1] }
        );
        observer.observe(header);
    };

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger-group');
        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('reveal-stagger-group')) {
                        const children = entry.target.querySelectorAll(':scope > *');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    } else {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
    };

    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            if (!question || !answer) return;

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
    };

    const initCookieBanner = () => {
        const banner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('cookie-accept');
        if (!banner || !acceptBtn) return;

        if (!localStorage.getItem('cookieConsent')) {
            banner.style.display = 'block';
            setTimeout(() => banner.classList.add('visible'), 100);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            banner.classList.remove('visible');
            setTimeout(() => banner.style.display = 'none', 300);
        });
    };

    const initTestimonialCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        if (slides.length <= 1) return;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Gehe zu Testimonial ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        };

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    };

    const initInteractiveSecurityCheck = () => {
        const areas = document.querySelectorAll('.interactive-house .interactive-area');
        const tipBox = document.getElementById('security-tip');
        if (!areas.length || !tipBox) return;

        const tips = {
            'house-door': 'Tipp für Türen: Ein stabiles Zusatzschloss oder ein Panzerriegel erhöht den Schutz erheblich. Achten Sie auf einen Zylinder mit Aufbohrschutz.',
            'house-window': 'Tipp für Fenster: Abschließbare Fenstergriffe und Pilzkopfverriegelungen erschweren das Aufhebeln. Besonders im Erdgeschoss wichtig.',
            'house-basement': 'Tipp für Keller: Sichern Sie Kellerfenster und Lichtschächte mit stabilen Gittern. Oft wird dieser Zugang vernachlässigt.'
        };

        areas.forEach(area => {
            area.addEventListener('click', () => {
                areas.forEach(a => a.classList.remove('active'));
                area.classList.add('active');
                tipBox.textContent = tips[area.id] || 'Wählen Sie einen Bereich.';
                tipBox.style.fontStyle = 'normal';
                tipBox.style.color = 'var(--colors-text)';
            });
        });
    };

    const initStickyCTA = () => {
        const cta = document.getElementById('sticky-cta');
        if (!cta) return;

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    cta.classList.add('visible');
                } else {
                    cta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const hero = document.querySelector('.hero');
        if (hero) {
            scrollObserver.observe(hero);
        }
    };

    // Initialize all modules
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initFaqAccordion();
    initCookieBanner();
    initTestimonialCarousel();
    initInteractiveSecurityCheck();
    initStickyCTA();
});