document.addEventListener('DOMContentLoaded', function() {

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
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                menuToggle.click();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
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
                if (!isExpanded) {
                    answer.style.gridTemplateRows = '1fr';
                } else {
                    answer.style.gridTemplateRows = '0fr';
                }
            });
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    if(contactForm && formFeedback) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            formFeedback.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formFeedback.style.color = 'var(--color-primary)';
            contactForm.reset();
            setTimeout(() => {
                formFeedback.textContent = '';
            }, 5000);
        });
    }

    // --- Lightbox Logic (as required, even without images) --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeLightbox = lightbox.querySelector('.close-lightbox');
        const prevButton = lightbox.querySelector('.prev-lightbox');
        const nextButton = lightbox.querySelector('.next-lightbox');
        let currentImageIndex = -1;
        let galleryImages = [];

        // This function would be called by clicking an image.
        // window.openLightbox = (index) => {
        //     currentImageIndex = index;
        //     updateLightboxImage();
        //     lightbox.classList.add('active');
        //     document.body.classList.add('no-scroll');
        // };

        const closeAction = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        };

        closeLightbox.addEventListener('click', closeAction);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Click on backdrop
                closeAction();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeAction();
                // if (e.key === 'ArrowLeft') prevButton.click();
                // if (e.key === 'ArrowRight') nextButton.click();
            }
        });
    }
});