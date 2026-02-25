document.addEventListener('DOMContentLoaded', function() {

    // --- Helper Functions ---
    const select = (el, all = false) => {
        el = el.trim();
        if (all) {
            return [...document.querySelectorAll(el)];
        } else {
            return document.querySelector(el);
        }
    }

    // --- Sticky Header ---
    const header = select('#main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // --- Mobile Navigation ---
    const mobileMenuToggle = select('#mobile-menu-toggle');
    const mobileMenu = select('#mobile-menu');
    const mobileMenuClose = select('#mobile-menu-close');

    if (mobileMenuToggle && mobileMenu) {
        const toggleMenu = (open) => {
            mobileMenu.classList.toggle('open', open);
            mobileMenuToggle.setAttribute('aria-expanded', open);
            document.body.classList.toggle('no-scroll', open);
        };

        mobileMenuToggle.addEventListener('click', () => toggleMenu(true));
        mobileMenuClose.addEventListener('click', () => toggleMenu(false));
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                toggleMenu(false);
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                toggleMenu(false);
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = select('.reveal', true);
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 50}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- Cookie Banner ---
    const cookieBanner = select('#cookie-banner');
    const acceptCookiesBtn = select('#accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Testimonial Carousel ---
    const carousel = select('.testimonial-carousel');
    if (carousel) {
        const wrapper = select('.carousel-wrapper');
        const slides = select('.testimonial-slide', true);
        const prevBtn = select('.carousel-controls .prev');
        const nextBtn = select('.carousel-controls .next');
        const dotsContainer = select('.carousel-dots');
        let currentIndex = 0;
        let intervalId;

        const updateCarousel = () => {
            wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
                resetInterval();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = select('.carousel-dots .dot', true);

        const showNext = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        };

        const startInterval = () => {
            intervalId = setInterval(showNext, 5000);
        };

        const resetInterval = () => {
            clearInterval(intervalId);
            startInterval();
        };

        nextBtn.addEventListener('click', () => { showNext(); resetInterval(); });
        prevBtn.addEventListener('click', () => { showPrev(); resetInterval(); });

        updateCarousel();
        startInterval();
    }

    // --- Lightbox --- 
    const lightbox = select('#km-lightbox');
    const galleryItems = select('.gallery-item', true);
    let currentImageIndex = -1;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        const imageSources = galleryItems.map(item => item.dataset.kmImage);

        const openLightbox = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            currentImageIndex = index;
            const imagePath = `../${imageSources[index]}`.replace(/\.\.\/assets/, 'assets'); // Fix path for root page
            const finalPath = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') ? imageSources[index] : `../${imageSources[index]}`;
            lightboxImg.setAttribute('src', finalPath);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        const showNextImage = () => openLightbox((currentImageIndex + 1) % imageSources.length);
        const showPrevImage = () => openLightbox((currentImageIndex - 1 + imageSources.length) % imageSources.length);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = select('#sticky-cta');
    if (stickyCTA) {
        const footer = select('.main-footer');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when footer is NOT intersecting, and we are not at the top
                const isVisible = !entry.isIntersecting && window.scrollY > 300;
                stickyCTA.classList.toggle('visible', isVisible);
            });
        }, { threshold: 0.1 });

        if (footer) {
            observer.observe(footer);
        }
    }
});