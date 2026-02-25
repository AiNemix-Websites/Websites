document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavMenu.classList.toggle('is-open');
            mobileNavMenu.setAttribute('aria-hidden', isExpanded);
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('visible'), 10);
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 300);
        });
    }
    
    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    const heroSection = document.querySelector('.hero, .hero-subpage');
    if (stickyCTA && heroSection) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0 });
        ctaObserver.observe(heroSection);
    }

    // --- Form Submission Prevention (Demo) ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Dieses Formular ist eine Demo. Bitte kontaktieren Sie uns telefonisch.');
        });
    }
});