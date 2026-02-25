document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITIES ---
    const select = (selector, scope = document) => scope.querySelector(selector);
    const selectAll = (selector, scope = document) => scope.querySelectorAll(selector);

    // --- HEADER SCROLL EFFECT ---
    const header = select('#main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- MOBILE MENU ---
    const mobileMenuToggle = select('#mobile-menu-toggle');
    const mobileMenu = select('#mobile-menu');
    const mobileMenuClose = select('#mobile-menu-close');

    const toggleMenu = (open) => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        if (open === isExpanded) return;

        mobileMenuToggle.setAttribute('aria-expanded', open);
        mobileMenu.classList.toggle('open', open);
        document.body.classList.toggle('scroll-locked', open);
    };

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => toggleMenu(true));
        mobileMenuClose.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('keydown', (e) => e.key === 'Escape' && toggleMenu(false));
    }

    // --- FAQ ACCORDION ---
    const faqItems = selectAll('.faq-item');
    faqItems.forEach(item => {
        const question = select('.faq-question', item);
        const answer = select('.faq-answer', item);

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
        });
    });

    // --- SCROLL REVEAL ANIMATION ---
    const revealElements = selectAll('[data-reveal]');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Staggered children animation
                if (entry.target.dataset.reveal === 'stagger') {
                    const children = selectAll('[data-reveal="stagger-child"]', entry.target);
                    children.forEach((child, index) => {
                        child.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const cookieAcceptBtn = select('#cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (cookieAcceptBtn) {
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- STICKY CTA ---
    const stickyCTA = select('#sticky-cta');
    const stickyCTAClose = select('#sticky-cta-close');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '0px 0px -100% 0px' });
        const hero = select('.hero');
        if (hero) ctaObserver.observe(hero);

        stickyCTAClose.addEventListener('click', () => {
            stickyCTA.style.display = 'none';
        });
    }

    // --- CURRENT YEAR IN FOOTER ---
    const yearSpan = select('#current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- PROJECT FILTERING ---
    const filtersContainer = select('#project-filters');
    const projects = selectAll('.project-card');

    if (filtersContainer && projects.length > 0) {
        filtersContainer.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;

            selectAll('.button-filter', filtersContainer).forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;

            projects.forEach(project => {
                const categories = project.dataset.category;
                if (filter === 'Alle' || categories.includes(filter)) {
                    project.style.display = 'block';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    }

    // --- CONTACT FORM (Placeholder) ---
    const contactForm = select('#contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const statusDiv = select('#form-status');
            statusDiv.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            // In a real scenario, you would handle form submission here (e.g., via fetch).
            setTimeout(() => {
                statusDiv.textContent = 'Nachricht erfolgreich gesendet!';
                contactForm.reset();
            }, 2000);
             setTimeout(() => {
                statusDiv.textContent = '';
            }, 5000);
        });
    }

});