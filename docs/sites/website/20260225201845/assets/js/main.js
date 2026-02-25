document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.querySelector('.site-header');
    const stickyCTA = document.getElementById('sticky-cta');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
            if(stickyCTA) stickyCTA.classList.add('visible');
        } else {
            header.classList.remove('sticky');
            if(stickyCTA) stickyCTA.classList.remove('visible');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.mobile-nav-menu');
    const navClose = document.querySelector('.mobile-nav-close');

    const openMenu = () => {
        navMenu.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('scroll-locked');
        document.addEventListener('keydown', handleEscKey);
    };

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('scroll-locked');
        document.removeEventListener('keydown', handleEscKey);
    };

    const handleEscKey = (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    };

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', openMenu);
        if (navClose) navClose.addEventListener('click', closeMenu);
        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu) { // Click on backdrop
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.style.display = 'block';
                // Use another timeout to allow the display property to apply before transitioning
                setTimeout(() => {
                    cookieBanner.classList.add('show');
                }, 10);
            }
        }, 1500);

        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
             setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500); // Match transition duration
        });
    }
    
    // --- Contact Form --- //
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data.
            alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
            contactForm.reset();
        });
    }
});