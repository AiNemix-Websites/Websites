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
            const isActive = menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
        });
    }

    // --- Scroll Reveal --- //
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
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    contextCta.classList.remove('visible');
                } else {
                    contextCta.classList.add('visible');
                }
            });
        }, { rootMargin: '0px 0px -200px 0px' });

        const heroSection = document.querySelector('.hero, .page-hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Form Label Animation --- //
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        if (input && label) {
            input.addEventListener('input', () => {
                if (input.value) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
    });

    // --- Lightbox (Structure only, as no images are present) --- //
    // This code provides the required functionality but won't be triggered.
    const lightbox = document.createElement('div');
    lightbox.id = 'km-lightbox';
    lightbox.style.display = 'none'; // Initially hidden
    lightbox.innerHTML = `
        <div class='lightbox-backdrop'></div>
        <div class='lightbox-content'>
            <button class='lightbox-close'>&times;</button>
            <button class='lightbox-prev'>&lsaquo;</button>
            <button class='lightbox-next'>&rsaquo;</button>
            <div class='lightbox-image-container'></div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.classList.remove('no-scroll');
    };

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display !== 'none') {
            closeLightbox();
        }
    });
});