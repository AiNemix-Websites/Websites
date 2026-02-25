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
    const menuDrawer = document.getElementById('mobile-menu-drawer');
    const body = document.body;

    if (menuToggle && menuDrawer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
            menuDrawer.classList.toggle('open');
            body.classList.toggle('scroll-locked');
        });
    }

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

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookiesAccepted')) {
                cookieBanner.classList.add('visible');
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { rootMargin: '-200px 0px 0px 0px' });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- Global Lightbox --- //
    // Even with no images, the logic is here for future use.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let galleryImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            updateImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        };

        const updateImage = () => {
            if (galleryImages.length > 0) {
                const imgData = galleryImages[currentIndex];
                lightboxImage.src = imgData.src;
                lightboxImage.alt = imgData.alt;
                prevBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
                nextBtn.style.display = galleryImages.length > 1 ? 'block' : 'none';
            }
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        document.querySelectorAll('[data-km-image]').forEach((el, index) => {
            const src = el.dataset.kmImage;
            const alt = el.alt || 'Galeriebild';
            if (src) {
                galleryImages.push({ src, alt });
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(index);
                });
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
    }
});