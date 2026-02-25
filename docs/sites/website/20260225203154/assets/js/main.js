document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Header --- //
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

    // --- 2. Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('is-open');
            menuToggle.classList.toggle('is-active', isOpen);
            mobileMenu.classList.toggle('is-open', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        };

        menuToggle.addEventListener('click', () => toggleMenu());
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) toggleMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
                toggleMenu(false);
            }
        });
    }

    // --- 3. Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
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
    }

    // --- 4. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            // Use a timeout to avoid layout shift issues and let the page render first
            setTimeout(() => {
                cookieBanner.innerHTML = `
                    <div class='cookie-content'>
                        <p>Wir verwenden Cookies, um die Funktionalität der Website zu gewährleisten. Weitere Informationen finden Sie in unserer <a href='datenschutz/'>Datenschutzerklärung</a>.</p>
                        <div class='cookie-buttons'>
                            <button id='cookie-decline' class='btn btn-ghost'>Ablehnen</button>
                            <button id='cookie-accept' class='btn btn-primary'>Akzeptieren</button>
                        </div>
                    </div>`;
                document.getElementById('cookie-accept').addEventListener('click', () => handleConsent(true));
                document.getElementById('cookie-decline').addEventListener('click', () => handleConsent(false));
                cookieBanner.classList.add('show');
            }, 1000);
        }

        const handleConsent = (accepted) => {
            localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'declined');
            cookieBanner.classList.remove('show');
        };
    }

    // --- 5. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryImages = document.querySelectorAll('.gallery-image');
        let currentIndex = 0;

        const updateLightboxImage = (index) => {
            const imgElement = lightbox.querySelector('img');
            const image = galleryImages[index];
            if (imgElement && image) {
                imgElement.src = image.src;
                imgElement.alt = image.alt;
            }
        };

        const showLightbox = (index) => {
            currentIndex = index;
            updateLightboxImage(currentIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
        };

        const hideLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }, 300);
        };

        galleryImages.forEach((image, index) => {
            image.addEventListener('click', () => showLightbox(index));
        });

        lightbox.querySelector('.lightbox-close').addEventListener('click', hideLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hideLightbox(); });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightboxImage(currentIndex);
        });

        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage(currentIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
            }
        });
    }

    // --- 6. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    const footer = document.querySelector('.main-footer');
    if (stickyCTA && footer) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA if footer is NOT intersecting (i.e., not visible)
                if (!entry.isIntersecting && window.scrollY > 400) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0 });

        ctaObserver.observe(footer);
    }

});