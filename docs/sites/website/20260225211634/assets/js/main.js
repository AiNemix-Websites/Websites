document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuButton = document.querySelector('.close-mobile-menu');

    const toggleMenu = (open) => {
        const isExpanded = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') === 'false';
        menuToggle.setAttribute('aria-expanded', isExpanded);
        mobileMenu.classList.toggle('open', isExpanded);
        document.body.classList.toggle('no-scroll', isExpanded);
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => toggleMenu());
        if(closeMenuButton) closeMenuButton.addEventListener('click', () => toggleMenu(false));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- 2. Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- 3. Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. FAQ Accordion --- //
    const faqAccordions = document.querySelectorAll('.faq-accordion');
    faqAccordions.forEach(accordion => {
        accordion.addEventListener('click', (e) => {
            const questionButton = e.target.closest('.faq-question');
            if (!questionButton) return;

            const item = questionButton.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

            questionButton.setAttribute('aria-expanded', !isExpanded);
            answer.hidden = isExpanded;
        });
    });

    // --- 5. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    const cookiesAccepted = localStorage.getItem('km_cookies_accepted');

    if (!cookiesAccepted && cookieBanner) {
        cookieBanner.hidden = false;
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('km_cookies_accepted', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- 6. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const ctaTrigger = document.querySelector('.hero'); // Show CTA after hero
    if (stickyCTA && ctaTrigger) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the trigger element is NOT intersecting (i.e., scrolled past)
                stickyCTA.hidden = entry.isIntersecting;
            });
        }, { threshold: 0 });
        ctaObserver.observe(ctaTrigger);
    }

    // --- 7. Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedback = document.getElementById('form-feedback');
            feedback.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            feedback.hidden = false;
            // In a real application, you would send the data here.
            setTimeout(() => { contactForm.reset(); feedback.hidden = true; }, 4000);
        });
    }
    
    // --- 8. Global Lightbox (Singleton Pattern) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300); // Match CSS transition
            document.body.classList.remove('no-scroll');
        };

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Click on backdrop
                closeLightbox();
            }
        });

        const closeButton = lightbox.querySelector('.close-lightbox');
        if(closeButton) closeButton.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) {
                closeLightbox();
            }
        });

        // This part would be used to open the lightbox.
        // Since there are no images, it won't be called, but the structure is here.
        // document.querySelectorAll('[data-lightbox-src]').forEach(el => {
        //     el.addEventListener('click', () => {
        //         const src = el.dataset.lightboxSrc;
        //         const content = lightbox.querySelector('.lightbox-content');
        //         content.innerHTML = `<img src='${src}' alt=''>`;
        //         lightbox.style.display = 'flex';
        //         setTimeout(() => { lightbox.classList.add('show'); }, 10); // allow display change to register
        //         document.body.classList.add('no-scroll');
        //     });
        // });
    }
});