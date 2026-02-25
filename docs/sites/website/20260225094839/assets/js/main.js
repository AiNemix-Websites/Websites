document.addEventListener('DOMContentLoaded', function() {

    // --- UTILITIES ---
    const select = (el, all = false) => all ? document.querySelectorAll(el) : document.querySelector(el);

    // --- STICKY HEADER ---
    const header = select('.site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }

    // --- MOBILE MENU ---
    const mobileMenuToggle = select('.mobile-menu-toggle');
    const mainNav = select('.main-nav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileMenuToggle.classList.toggle('active');
            mainNav.classList.toggle('mobile-active');
            document.body.classList.toggle('body-lock');
        });
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    const revealElements = select('.reveal-on-scroll', true);
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- FAQ ACCORDION ---
    const faqItems = select('.faq-item', true);
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

    // --- TESTIMONIAL CAROUSEL ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const slides = select('.testimonial-slide', true);
        const nextBtn = select('.carousel-btn.next');
        const prevBtn = select('.carousel-btn.prev');
        const dotsContainer = select('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = select('.carousel-dots button', true);

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        // Set initial state for carousel slides
        carousel.style.display = 'flex';
        carousel.style.transition = 'transform 0.5s ease-in-out';
        slides.forEach(slide => slide.style.flex = '0 0 100%');

        goToSlide(0); // Initialize
    }

    // --- GLOBAL LIGHTBOX ---
    const lightbox = select('#km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.km-lightbox-close');
    const lightboxPrev = lightbox.querySelector('.km-lightbox-prev');
    const lightboxNext = lightbox.querySelector('.km-lightbox-next');
    const lightboxBackdrop = lightbox.querySelector('.km-lightbox-backdrop');
    let galleryItems = [];
    let currentImageIndex = -1;

    const openLightbox = (index) => {
        currentImageIndex = index;
        const item = galleryItems[currentImageIndex];
        const imagePath = item.getAttribute('href');
        const altText = item.querySelector('img').getAttribute('alt');
        lightboxImg.setAttribute('src', imagePath);
        lightboxImg.setAttribute('alt', altText);
        lightbox.classList.add('visible');
        document.body.classList.add('body-lock');
        document.addEventListener('keydown', handleLightboxKeydown);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('visible');
        document.body.classList.remove('body-lock');
        lightboxImg.setAttribute('src', '');
        document.removeEventListener('keydown', handleLightboxKeydown);
    };

    const showPrevImage = () => {
        const prevIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(prevIndex);
    };

    const showNextImage = () => {
        const nextIndex = (currentImageIndex + 1) % galleryItems.length;
        openLightbox(nextIndex);
    };

    const handleLightboxKeydown = (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    };

    const galleryContainers = select('.lightbox-gallery', true);
    galleryContainers.forEach(container => {
        const items = Array.from(container.querySelectorAll('a'));
        const currentGalleryOffset = galleryItems.length;
        galleryItems.push(...items);

        items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(currentGalleryOffset + index);
            });
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);

    // --- COOKIE BANNER ---
    const cookieBanner = select('#cookie-banner');
    const cookieAcceptBtn = select('#cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- STICKY CTA ---
    const stickyCTA = select('#sticky-cta');
    if(stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('visible');
                } else {
                    stickyCTA.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = select('.hero');
        if(heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});