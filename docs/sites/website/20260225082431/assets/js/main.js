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
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.hidden = false;
            setTimeout(() => {
                mobileMenu.classList.add('is-open');
                document.body.classList.add('scroll-locked');
                menuToggle.setAttribute('aria-expanded', 'true');
            }, 10);
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('is-open');
            document.body.classList.remove('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                mobileMenu.hidden = true;
            }, 400);
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.hidden = false;
        }

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.hidden = true;
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.hidden = false;
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
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
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const statusEl = document.getElementById('form-status');
            statusEl.textContent = 'Nachricht wird gesendet...';
            // This is a dummy form handler. In a real project, this would send data to a server.
            setTimeout(() => {
                statusEl.textContent = 'Vielen Dank! Ihre Nachricht wurde empfangen.';
                contactForm.reset();
            }, 1000);
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImage = document.getElementById('km-lightbox-image');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    if (lightbox && lightboxImage && galleryItems.length > 0) {
        const images = Array.from(galleryItems).map(item => ({
            src: item.dataset.src,
            alt: item.dataset.alt
        }));

        const showImage = (index) => {
            const img = images[index];
            if (img) {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                currentIndex = index;
            }
        };

        const openLightbox = (index) => {
            lightbox.hidden = false;
            document.body.classList.add('scroll-locked');
            setTimeout(() => lightbox.classList.add('is-visible'), 10);
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('is-visible');
            document.body.classList.remove('scroll-locked');
            setTimeout(() => lightbox.hidden = true, 300);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        document.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.querySelector('.km-lightbox-next').addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        });

        document.querySelector('.km-lightbox-prev').addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('is-visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') document.querySelector('.km-lightbox-next').click();
                if (e.key === 'ArrowLeft') document.querySelector('.km-lightbox-prev').click();
            }
        });
    }
});