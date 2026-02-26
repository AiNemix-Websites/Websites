document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');

    const openMobileMenu = () => {
        mobileNavMenu.classList.add('is-open');
        mobileNavMenu.setAttribute('aria-hidden', 'false');
        mobileNavToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('no-scroll');
    };

    const closeMobileMenu = () => {
        mobileNavMenu.classList.remove('is-open');
        mobileNavMenu.setAttribute('aria-hidden', 'true');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.display = isExpanded ? 'none' : 'block';
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const handleCtaScroll = () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('is-visible');
            } else {
                stickyCta.classList.remove('is-visible');
            }
        };
        window.addEventListener('scroll', handleCtaScroll, { passive: true });
    }

    // --- Contact Form --- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // This is a placeholder for form submission logic.
            // In a real project, this would send data to a server.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }

});