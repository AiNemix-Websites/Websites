document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
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

    // --- Mobile Navigation --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('.nav-list');
    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navList.classList.toggle('active');
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                const children = entry.target.querySelectorAll('.reveal-child');
                children.forEach((child, index) => {
                    child.style.transitionDelay = `${index * 100}ms`;
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Gehe zu Testimonial ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- FAQ Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.paddingTop = 'var(--spacing-sm)';
            } else {
                content.style.maxHeight = '0';
                content.style.paddingTop = '0';
            }
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookie_consent')) {
            cookieBanner.style.display = 'flex';
        }
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past hero)
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

    // --- Lightbox --- //
    // The lightbox is coded to be fully functional, but since there are no images
    // with the 'data-km-image' attribute, it will not be triggered.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const contentContainer = lightbox.querySelector('.km-lightbox-content');
        let galleryImages = [];
        let currentIndex = 0;

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            addLightboxEventListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                contentContainer.innerHTML = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            removeLightboxEventListeners();
        };

        const updateLightboxImage = () => {
            if (galleryImages.length === 0) return;
            const imageSrc = galleryImages[currentIndex].dataset.kmImage;
            const imageAlt = galleryImages[currentIndex].alt || 'Galeriebild';
            contentContainer.innerHTML = `<img src='${imageSrc}' alt='${imageAlt}'>`;
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        const addLightboxEventListeners = () => {
            document.addEventListener('keydown', handleKeydown);
        };

        const removeLightboxEventListeners = () => {
            document.removeEventListener('keydown', handleKeydown);
        };

        document.querySelectorAll('[data-km-image]').forEach((el, index) => {
            galleryImages.push(el);
            el.addEventListener('click', (e) => {
                e.preventDefault();
                openLightbox(index);
            });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});