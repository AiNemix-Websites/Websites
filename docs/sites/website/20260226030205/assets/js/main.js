document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            body.classList.toggle('mobile-menu-open');
            body.classList.toggle('no-scroll');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && body.classList.contains('mobile-menu-open')) {
                menuToggle.click();
            }
        });
    }

    // --- Sticky Header --- //
    const header = document.getElementById('main-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // Initial check
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if(question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && acceptButton && declineButton) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('show');
            }
        }, 1000);

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Sticky Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        const showCtaThreshold = 300; // Pixels from top to show CTA
        const footer = document.querySelector('.main-footer');
        let footerObserver;

        const handleScroll = () => {
            if (window.scrollY > showCtaThreshold) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Hide CTA when footer is visible
        if (footer) {
             footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        contextCta.classList.remove('visible');
                    } else if (window.scrollY > showCtaThreshold) {
                        contextCta.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            footerObserver.observe(footer);
        }
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formStatus = document.getElementById('form-status');
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            formStatus.style.color = 'green';
            
            // In a real application, you would send the data to a server here.
            // For this static site, we just show a success message and reset the form.
            setTimeout(() => {
                formStatus.textContent = 'Nachricht erfolgreich gesendet!';
                contactForm.reset();
                setTimeout(() => { formStatus.textContent = ''; }, 3000);
            }, 1000);
        });
    }

});