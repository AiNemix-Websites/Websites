document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

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

    // --- Scroll Reveal --- //
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
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
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.style.display = 'flex';
                setTimeout(() => cookieBanner.classList.add('visible'), 10);
            }
        }, 2000);

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        let currentTriggers = [];
        let currentIndex = -1;

        const updateLightboxNav = () => {
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < currentTriggers.length - 1 ? 'block' : 'none';
        };

        const showImage = (index) => {
            if (index < 0 || index >= currentTriggers.length) return;
            const trigger = currentTriggers[index];
            lightboxImg.src = trigger.href;
            lightboxImg.alt = trigger.querySelector('img')?.alt || 'Projektbild';
            currentIndex = index;
            updateLightboxNav();
        };

        document.body.addEventListener('click', e => {
            const trigger = e.target.closest('[data-lightbox-trigger]');
            if (trigger) {
                e.preventDefault();
                const galleryId = trigger.dataset.lightboxTrigger;
                currentTriggers = Array.from(document.querySelectorAll(`[data-lightbox-trigger='${galleryId}']`));
                const index = currentTriggers.indexOf(trigger);
                
                document.body.classList.add('no-scroll');
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('visible'), 10);
                showImage(index);
            }
        });

        const closeLightbox = () => {
            document.body.classList.remove('no-scroll');
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 350);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', e => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', e => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting && window.scrollY > 200) {
                    stickyCTA.style.display = 'block';
                    setTimeout(() => stickyCTA.classList.add('visible'), 10);
                } else {
                    stickyCTA.classList.remove('visible');
                    setTimeout(() => stickyCTA.style.display = 'none', 350);
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data to a server.
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formStatus.style.color = 'var(--color-primary)';
            contactForm.reset();
            setTimeout(() => formStatus.textContent = '', 5000);
        });
    }
});