document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    if (header) {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
        scrollHandler(); // Initial check
    }

    // --- Mobile Navigation ---
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('#mobile-menu');
    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-up');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }

        const handleConsent = (consentValue) => {
            localStorage.setItem('cookieConsent', consentValue);
            cookieBanner.classList.remove('visible');
        };

        acceptBtn.addEventListener('click', () => handleConsent('accepted'));
        declineBtn.addEventListener('click', () => handleConsent('declined'));
    }

    // --- Contextual CTA ---
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        const ctaScrollHandler = () => {
            if (window.scrollY > 400) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', ctaScrollHandler, { passive: true });
    }

    // --- Interactive House SVG ---
    const houseSvg = document.getElementById('interactive-house');
    const infoBox = document.getElementById('interaction-info');
    if (houseSvg && infoBox) {
        const houseParts = houseSvg.querySelectorAll('.house-part');
        const defaultInfo = infoBox.innerHTML;

        houseParts.forEach(part => {
            part.addEventListener('click', () => {
                houseParts.forEach(p => p.classList.remove('active'));
                part.classList.add('active');
                infoBox.innerHTML = `<p>${part.dataset.info}</p>`;
            });

            part.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    part.click();
                }
            });
        });
    }

    // --- Contact Form (Placeholder) ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird simuliert gesendet.';
            setTimeout(() => {
                formStatus.textContent = '';
                contactForm.reset();
            }, 4000);
        });
    }
});