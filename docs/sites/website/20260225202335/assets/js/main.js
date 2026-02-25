document.addEventListener('DOMContentLoaded', () => {

    // --- Site Header Logic ---
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            const isOpen = mobileNavToggle.classList.toggle('open');
            mobileNavToggle.setAttribute('aria-expanded', isOpen);
            mobileNavDrawer.classList.toggle('open');
            document.body.classList.toggle('nav-open');
        });
    }

    // --- FAQ Accordion ---
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

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        if (prevBtn) prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0); // Initial setup
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('reveal-stagger')) {
                    const items = entry.target.querySelectorAll(':scope > *');
                    items.forEach((item, index) => {
                        item.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.close-btn');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');
    let currentImageIndex = -1;
    let galleryImages = [];

    const updateLightboxImage = (index) => {
        if (index >= 0 && index < galleryImages.length) {
            lightboxImg.src = galleryImages[index].dataset.lightboxSrc;
            lightboxImg.alt = galleryImages[index].alt;
            currentImageIndex = index;
        }
    };

    const openLightbox = (e) => {
        const clickedImage = e.target.closest('[data-lightbox-src]');
        if (clickedImage) {
            galleryImages = Array.from(document.querySelectorAll('[data-lightbox-src]'));
            const index = galleryImages.indexOf(clickedImage);
            updateLightboxImage(index);
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
    };

    document.addEventListener('click', openLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    if (prevBtn) prevBtn.addEventListener('click', () => updateLightboxImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length));
    if (nextBtn) nextBtn.addEventListener('click', () => updateLightboxImage((currentImageIndex + 1) % galleryImages.length));
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('show')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });

    // --- Interactive Tree Health ---
    const treeParts = document.querySelectorAll('.tree-part');
    const infoPanels = document.querySelectorAll('.info-panel');
    if (treeParts.length > 0) {
        treeParts.forEach(part => {
            part.addEventListener('click', () => {
                const area = part.dataset.area;
                infoPanels.forEach(panel => {
                    panel.style.display = panel.id === `info-${area}` ? 'block' : 'none';
                });
                treeParts.forEach(p => p.classList.remove('active'));
                part.classList.add('active');
            });
        });
        // Activate first one by default
        treeParts[0].click();
    }

    // --- Sticky CTA & Back to Top ---
    const stickyCta = document.querySelector('.sticky-cta');
    const backToTopBtn = document.getElementById('back-to-top');

    if (stickyCta || backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                if (stickyCta) stickyCta.classList.add('show');
                if (backToTopBtn) backToTopBtn.classList.add('show');
            } else {
                if (stickyCta) stickyCta.classList.remove('show');
                if (backToTopBtn) backToTopBtn.classList.remove('show');
            }
        });
    }

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});