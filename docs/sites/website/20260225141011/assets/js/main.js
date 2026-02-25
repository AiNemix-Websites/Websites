document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check
    }

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavDrawer) {
        const openMenu = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            mobileNavDrawer.classList.add('open');
            document.body.classList.add('scroll-locked');
            mobileNavClose.focus();
        };

        const closeMenu = () => {
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            mobileNavDrawer.classList.remove('open');
            document.body.classList.remove('scroll-locked');
            mobileNavToggle.focus();
        };

        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            isExpanded ? closeMenu() : openMenu();
        });

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.staggerDelay) || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });

        revealElements.forEach(el => observer.observe(el));
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
                answer.hidden = isExpanded;
            });
        }
    });

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        let currentIndex = 0;

        const goToSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.style.transform = `translateX(${(i - index) * 100}%)`;
            });
            currentIndex = index;
        };

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0); // Initialize
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });
        const heroSection = document.querySelector('.hero');
        if(heroSection) ctaObserver.observe(heroSection);
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentGallery = [];
        let currentIndex = -1;

        const showImage = (index) => {
            if (index < 0 || index >= currentGallery.length) return;
            currentIndex = index;
            const imagePath = currentGallery[currentIndex];
            lightboxImage.src = imagePath;
            prevBtn.style.display = (currentIndex === 0) ? 'none' : 'block';
            nextBtn.style.display = (currentIndex === currentGallery.length - 1) ? 'none' : 'block';
        };

        const openLightbox = (gallery, startIndex) => {
            currentGallery = gallery;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('scroll-locked');
            showImage(startIndex);
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        };

        document.body.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                const galleryContainer = galleryItem.closest('[id]');
                const galleryItems = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
                const galleryPaths = galleryItems.map(item => item.dataset.kmImagePath);
                const startIndex = galleryItems.indexOf(galleryItem);
                openLightbox(galleryPaths, startIndex);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    }

});