document.addEventListener('DOMContentLoaded', function() {

    // --- Helper function to trap focus ---
    function trapFocus(element) {
        const focusableEls = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        const firstFocusableEl = focusableEls[0];
        const lastFocusableEl = focusableEls[focusableEls.length - 1];
        const KEYCODE_TAB = 9;

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' || e.keyCode === KEYCODE_TAB) {
                if (e.shiftKey) { /* shift + tab */
                    if (document.activeElement === firstFocusableEl) {
                        lastFocusableEl.focus();
                        e.preventDefault();
                    }
                } else { /* tab */
                    if (document.activeElement === lastFocusableEl) {
                        firstFocusableEl.focus();
                        e.preventDefault();
                    }
                }
            }
        });
        if (firstFocusableEl) firstFocusableEl.focus();
    }

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

    // --- Mobile Menu ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');

    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('is-open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('no-scroll');
            trapFocus(mobileMenu);
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('is-open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
            menuToggle.focus();
        };

        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Accordion (FAQ) ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- Scroll Animations ---
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

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'block';
                setTimeout(() => cookieBanner.classList.add('is-visible'), 10);
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('is-visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Sticky CTA ---
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formMessage = document.getElementById('form-message');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formMessage.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formMessage.className = 'form-message success';
            contactForm.reset();
            setTimeout(() => { formMessage.textContent = ''; }, 5000);
        });
    }

    // --- FAQ Search/Filter ---
    const faqSearch = document.getElementById('faq-search');
    const faqAccordion = document.getElementById('faq-accordion');
    if (faqSearch && faqAccordion) {
        const faqItems = faqAccordion.querySelectorAll('.accordion-item');
        const noResults = document.getElementById('faq-no-results');

        faqSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let visibleCount = 0;
            faqItems.forEach(item => {
                const question = item.querySelector('.accordion-header').textContent.toLowerCase();
                const answer = item.querySelector('.accordion-content').textContent.toLowerCase();
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        });
    }
});