document.addEventListener('DOMContentLoaded', function() {

    // Sticky Header
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('no-scroll');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
        // Close on nav link click
        mainNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                 document.body.classList.remove('mobile-menu-open');
                 document.body.classList.remove('no-scroll');
                 menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 100}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // Sticky Context CTA
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateCtaVisibility = () => {
            if (window.scrollY > 300 && window.scrollY > lastScrollY) {
                contextCta.classList.add('show');
            } else if (window.scrollY < lastScrollY) {
                contextCta.classList.remove('show');
            }
            lastScrollY = window.scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateCtaVisibility);
                ticking = true;
            }
        });
    }

    // Prevent form submission for demo
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Vielen Dank für Ihre Nachricht! Dies ist eine Demo, Ihre Daten wurden nicht gesendet.');
            contactForm.reset();
        });
    }
});