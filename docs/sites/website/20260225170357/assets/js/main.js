document.addEventListener('DOMContentLoaded', () => {

    const siteHeader = document.querySelector('.site-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavContainer = document.querySelector('.mobile-nav-container');
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const stickyCta = document.getElementById('sticky-cta');

    // --- Helper Functions ---
    const lockScroll = () => document.body.classList.add('scroll-locked');
    const unlockScroll = () => document.body.classList.remove('scroll-locked');

    // --- Sticky Header ---
    const handleStickyHeader = () => {
        if (window.scrollY > 50) {
            siteHeader.classList.add('scrolled');
            if(stickyCta) stickyCta.classList.add('visible');
        } else {
            siteHeader.classList.remove('scrolled');
            if(stickyCta) stickyCta.classList.remove('visible');
        }
    };

    // --- Mobile Navigation ---
    const handleMobileMenu = () => {
        const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
        mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
        mobileNavToggle.classList.toggle('active');
        mobileNavContainer.classList.toggle('active');
        if (!isExpanded) {
            lockScroll();
        } else {
            unlockScroll();
        }
    };

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', handleMobileMenu);
    }

    // --- Scroll Reveal Animation ---
    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    };

    // --- FAQ Accordion ---
    const initFaqAccordion = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    };

    // --- Testimonials Carousel ---
    const initTestimonialsCarousel = () => {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        if (slides.length <= 1) {
            if(document.querySelector('.carousel-controls')) {
                 document.querySelector('.carousel-controls').style.display = 'none';
            }
            return;
        }

        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('span');

        const goToSlide = (index) => {
            currentIndex = (index + slides.length) % slides.length;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateControls();
        };

        const updateControls = () => {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        goToSlide(0);
    };

    // --- Lightbox ---
    const initLightbox = () => {
        const lightbox = document.getElementById('km-lightbox');
        if (!lightbox) return;

        const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
        if (galleryImages.length === 0) return;

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        let currentIndex = 0;

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.dataset.kmImage || imgElement.src;
            const imgAlt = imgElement.alt || 'Galeriebild';
            lightboxImg.src = imgSrc.startsWith('../') ? imgSrc : (imgSrc.startsWith('assets') ? '../' + imgSrc : imgSrc);
            // Correct path for subpages
            const pageDepth = window.location.pathname.split('/').length - 2;
            let prefix = pageDepth > 0 ? '../'.repeat(pageDepth) : '';
            lightboxImg.src = prefix + imgElement.dataset.kmImage;
            lightboxImg.alt = imgAlt;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            const clickedIndex = galleryImages.indexOf(e.currentTarget);
            if (clickedIndex === -1) return;
            e.preventDefault();
            showImage(clickedIndex);
            lightbox.classList.add('active');
            lockScroll();
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            unlockScroll();
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrev = () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const showNext = () => showImage((currentIndex + 1) % galleryImages.length);

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        galleryImages.forEach(img => img.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    };

    // --- Cookie Banner ---
    const initCookieBanner = () => {
        if (!cookieBanner || !cookieAcceptBtn) return;
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            cookieBanner.classList.add('visible');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('visible');
        });
    };

    // --- Initializations ---
    window.addEventListener('scroll', handleStickyHeader);
    initScrollReveal();
    initFaqAccordion();
    initTestimonialsCarousel();
    initLightbox();
    initCookieBanner();
});