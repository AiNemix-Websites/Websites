document.addEventListener('DOMContentLoaded', function() {

    // --- Header & Mobile Menu --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Sticky Header
    const headerObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle('scrolled', !entry.isIntersecting);
    }, { rootMargin: '100px 0px 0px 0px' });
    headerObserver.observe(document.body);

    // Mobile Menu Toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // Close mobile menu with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            mobileMenuToggle.click();
        }
    });

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero, .hero-subpage');
        const ctaObserver = new IntersectionObserver(([entry]) => {
            stickyCTA.classList.toggle('visible', !entry.isIntersecting);
        }, { threshold: 0.1 });

        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const successMessage = document.getElementById('form-success-message');
            // In a real project, you would send the data to a server here.
            // For this static site, we just show a success message.
            contactForm.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
            }
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        summary.addEventListener('click', (e) => {
            // If the item is already open, the default behavior will close it.
            // If it's closed, we close all others before the default behavior opens it.
            if (!item.hasAttribute('open')) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });
});
