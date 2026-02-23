document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER ---
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

    // --- MOBILE NAVIGATION ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpen);
            menuToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll', !isOpen);
        });
    }

    // --- SCROLL REVEAL ANIMATION ---
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

    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });

    // --- COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxClose = lightbox.querySelector('.lightbox-close');
        const lightboxPrev = lightbox.querySelector('.lightbox-prev');
        const lightboxNext = lightbox.querySelector('.lightbox-next');
        const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const updateLightboxImage = (index) => {
            if (index >= 0 && index < galleryImages.length) {
                const imgElement = galleryImages[index];
                const imagePath = imgElement.dataset.kmImage;
                const altText = imgElement.alt || 'Großansicht';
                lightboxImg.src = (imgElement.src.includes('../') ? '../' : './') + imagePath;
                lightboxImg.alt = altText;
                currentIndex = index;
                lightboxPrev.style.display = (index === 0) ? 'none' : 'block';
                lightboxNext.style.display = (index === galleryImages.length - 1) ? 'none' : 'block';
            }
        };

        const openLightbox = (e) => {
            if (e.target.classList.contains('lightbox-trigger')) {
                galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
                const clickedIndex = galleryImages.indexOf(e.target);
                updateLightboxImage(clickedIndex);
                lightbox.classList.add('show');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.classList.add('no-scroll');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('no-scroll');
            lightboxImg.src = ''; // Clear src to stop loading
        };

        document.addEventListener('click', openLightbox);
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxBackdrop.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => updateLightboxImage(currentIndex - 1));
        lightboxNext.addEventListener('click', () => updateLightboxImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') updateLightboxImage(currentIndex - 1);
                if (e.key === 'ArrowRight') updateLightboxImage(currentIndex + 1);
            }
        });
    }

    // --- STICKY CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- CONTACT FORM HANDLING ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Check for URL params to pre-fill subject
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('source') === 'rechner') {
            const subjectField = document.getElementById('subject');
            if(subjectField) {
                subjectField.value = 'Anfrage zum Modernisierungs-Check';
            }
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Nachricht wird gesendet...';
            statusEl.className = 'form-status';

            // This is a dummy handler. In a real project, this would be an AJAX call.
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.';
                statusEl.classList.add('success');
                contactForm.reset();
            }, 1000);
        });
    }
});