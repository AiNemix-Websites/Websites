document.addEventListener('DOMContentLoaded', () => {

    // --- Helper to handle transitions ---
    const safeRun = (element, callback) => {
        if (element) callback(element);
    };

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    safeRun(header, el => {
        const scrollHandler = () => {
            if (window.scrollY > 50) {
                el.classList.add('scrolled');
            } else {
                el.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    });

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    safeRun(mobileNavToggle, toggle => {
        toggle.addEventListener('click', () => {
            const isOpen = toggle.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
            safeRun(mobileNavDrawer, drawer => drawer.classList.toggle('open'));
            document.body.classList.toggle('no-scroll', isOpen);
        });
    });
    
    // Mobile dropdowns
    document.querySelectorAll('.dropdown-toggle-mobile').forEach(button => {
        button.addEventListener('click', () => {
            const dropdown = button.nextElementSibling;
            const isExpanded = dropdown.style.display === 'block';
            dropdown.style.display = isExpanded ? 'none' : 'block';
            button.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    safeRun(carousel, el => {
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const scrollStep = () => el.querySelector('.testimonial-slide').offsetWidth + parseInt(getComputedStyle(el).gap, 10);

        safeRun(nextBtn, btn => btn.addEventListener('click', () => {
            el.scrollBy({ left: scrollStep(), behavior: 'smooth' });
        }));
        safeRun(prevBtn, btn => btn.addEventListener('click', () => {
            el.scrollBy({ left: -scrollStep(), behavior: 'smooth' });
        }));
    });

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    safeRun(acceptBtn, btn => btn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        safeRun(cookieBanner, banner => banner.classList.remove('show'));
    }));

    safeRun(declineBtn, btn => btn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        safeRun(cookieBanner, banner => banner.classList.remove('show'));
    }));

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const galleryItems = document.querySelectorAll('[data-lightbox-src]');
    let currentImageIndex = 0;

    const updateLightboxImage = (index) => {
        if (lightboxImg && galleryItems[index]) {
            const item = galleryItems[index];
            lightboxImg.src = item.dataset.lightboxSrc;
            lightboxImg.alt = item.querySelector('img')?.alt || 'Lightbox image';
            currentImageIndex = index;
        }
    };

    const openLightbox = (index) => {
        if (lightbox) {
            lightbox.classList.add('open');
            document.body.classList.add('no-scroll');
            updateLightboxImage(index);
        }
    };

    const closeLightbox = () => {
        if (lightbox) {
            lightbox.classList.remove('open');
            document.body.classList.remove('no-scroll');
        }
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            updateLightboxImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % galleryItems.length;
            updateLightboxImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    safeRun(stickyCTA, el => {
        const scrollHandler = () => {
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 400;
            if (window.scrollY > heroHeight) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        };
        window.addEventListener('scroll', scrollHandler, { passive: true });
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});