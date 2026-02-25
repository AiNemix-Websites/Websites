document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpened = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpened);
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            body.classList.toggle('no-scroll');
        });

        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                menuToggle.click();
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header.sticky');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); 
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
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

    // --- Sticky CTA Bar --- //
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        const showCtaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting && window.scrollY > 300) {
                    stickyCtaBar.classList.add('show');
                } else {
                    stickyCtaBar.classList.remove('show');
                }
            });
        }, { threshold: 0 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            showCtaObserver.observe(heroSection);
        }
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formStatus = document.getElementById('form-status');
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet...';
            formStatus.style.color = 'var(--color-primary)';

            // This is a dummy handler. In a real project, you would send the data to a server.
            setTimeout(() => {
                formStatus.textContent = 'Nachricht erfolgreich gesendet! Wir melden uns in Kürze.';
                formStatus.style.color = 'green';
                contactForm.reset();
            }, 2000);
        });
    }

});