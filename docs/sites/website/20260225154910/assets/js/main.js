document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Mobile Menu --- //
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
        }
    };

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMenu);
    if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMenu);

    // --- 2. Sticky Header --- //
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

    // --- 3. Scroll Reveal Animations --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // --- 4. Accordion (FAQ) --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- 5. Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateCarousel();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        if(nextBtn) nextBtn.addEventListener('click', showNext);
        if(prevBtn) prevBtn.addEventListener('click', showPrev);

        updateCarousel(); // Initial state
    }

    // --- 6. Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.classList.add('show');
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- 7. Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    const galleryImageSources = Array.from(galleryItems).map(item => item.href);

    if (lightbox && galleryItems.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        const showImage = (index) => {
            const item = galleryItems[index];
            const imageSrc = item.href;
            const altText = item.querySelector('img')?.alt || 'Galeriebild';
            lightboxImage.src = imageSrc;
            lightboxImage.alt = altText;
            currentImageIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = galleryImageSources.indexOf(e.currentTarget.href);
            showImage(clickedIndex);
            lightbox.classList.add('show');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('scroll-locked');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showNextImage = () => {
            const nextIndex = (currentImageIndex + 1) % galleryItems.length;
            showImage(nextIndex);
        };

        const showPrevImage = () => {
            const prevIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(prevIndex);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
    }

    // --- 8. Sticky CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const heroSection = document.querySelector('.hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0 });

        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

    // --- 9. Smooth Scroll for Anchor Links --- //
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});