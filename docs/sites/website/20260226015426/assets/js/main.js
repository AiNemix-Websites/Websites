document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE MENU --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
            document.body.classList.toggle('no-scroll');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });

        mainNav.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                document.body.classList.remove('mobile-menu-open', 'no-scroll');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-group, .reveal-text');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.revealDelay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                    if (entry.target.classList.contains('reveal-group')) {
                        const children = entry.target.querySelectorAll('*');
                        children.forEach((child, index) => {
                           child.style.transitionDelay = `${index * 100}ms`;
                        });
                    }
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookie_consent');
        if (!cookieConsent) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- 5. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const galleryLinks = document.querySelectorAll('.lightbox-gallery a');
    let currentIndex = 0;

    if (lightbox && lightboxImg && galleryLinks.length > 0) {
        const images = Array.from(galleryLinks).map(link => link.href);

        const showImage = (index) => {
            currentIndex = index;
            lightboxImg.src = images[index];
            lightboxImg.alt = galleryLinks[index].querySelector('img').alt;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = images.indexOf(e.currentTarget.href);
            showImage(clickedIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            removeLightboxEventListeners();
        };

        const showNext = () => showImage((currentIndex + 1) % images.length);
        const showPrev = () => showImage((currentIndex - 1 + images.length) % images.length);

        galleryLinks.forEach(link => link.addEventListener('click', openLightbox));

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        };

        function addLightboxEventListeners() {
            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });
            lightbox.querySelector('.close-button').addEventListener('click', closeLightbox);
            lightbox.querySelector('.next-button').addEventListener('click', showNext);
            lightbox.querySelector('.prev-button').addEventListener('click', showPrev);
            document.addEventListener('keydown', handleKeydown);
        }

        function removeLightboxEventListeners() {
            document.removeEventListener('keydown', handleKeydown);
        }
    }

    // --- 6. STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
    
    // --- 7. CONTACT FORM --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formStatus = document.getElementById('form-status');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a dummy handler. In a real project, this would send data to a server.
            formStatus.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet.';
            formStatus.className = 'form-status success';
            contactForm.reset();
            setTimeout(() => { formStatus.textContent = ''; }, 5000);
        });
    }
});