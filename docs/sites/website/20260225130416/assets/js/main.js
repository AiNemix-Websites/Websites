document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = (show) => {
            menuToggle.setAttribute('aria-expanded', show);
            mobileMenu.setAttribute('aria-hidden', !show);
            document.body.classList.toggle('no-scroll', show);
        };

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
                toggleMenu(false);
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

        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });

            // Set initial max-height for transition
            answer.style.maxHeight = '0';
            answer.style.transition = 'max-height 0.3s ease-in-out';
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('visible');
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Contextual Sticky CTA --- //
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        window.addEventListener('scroll', () => {
            const heroHeight = window.innerHeight * 0.8;
            if (window.scrollY > heroHeight) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

    // --- Signature House Interaction --- //
    const houseParts = document.querySelectorAll('.house-part');
    const popup = document.getElementById('interaction-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupText = document.getElementById('popup-text');

    if (houseParts.length > 0 && popup) {
        houseParts.forEach(part => {
            part.addEventListener('click', (e) => {
                e.stopPropagation();
                const title = part.dataset.title;
                const text = part.dataset.text;
                
                if (popupTitle.textContent === title && popup.classList.contains('visible')) {
                    popup.classList.remove('visible');
                } else {
                    popupTitle.textContent = title;
                    popupText.textContent = text;
                    popup.classList.add('visible');
                }
            });
        });

        document.addEventListener('click', () => {
            popup.classList.remove('visible');
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formStatus = document.getElementById('form-status');
            formStatus.textContent = 'Nachricht wird gesendet...';
            formStatus.className = 'form-status';

            // This is a dummy timeout to simulate a form submission
            setTimeout(() => {
                formStatus.textContent = 'Vielen Dank! Ihre Nachricht wurde erhalten.';
                formStatus.classList.add('success');
                contactForm.reset();
            }, 1000);
        });
    }
});