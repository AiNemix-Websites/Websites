document.addEventListener('DOMContentLoaded', () => {

    // --- 1. STICKY HEADER --- //
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

    // --- 2. MOBILE NAVIGATION --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');

    const openMobileMenu = () => {
        if (!mobileNavMenu) return;
        mobileNavMenu.classList.add('is-opening');
        mobileNavMenu.style.display = 'flex';
        setTimeout(() => {
            mobileNavMenu.classList.add('is-open');
            document.body.classList.add('no-scroll');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
        }, 10);
    };

    const closeMobileMenu = () => {
        if (!mobileNavMenu) return;
        mobileNavMenu.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            mobileNavMenu.style.display = 'none';
            mobileNavMenu.classList.remove('is-opening');
        }, 300);
    };

    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', openMobileMenu);
        mobileNavClose.addEventListener('click', closeMobileMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMobileMenu();
            }
        });
    }

    // --- 3. SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger effect for multiple items
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. ACCORDION (FAQ) --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
        });
    });

    // --- 5. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsNav = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => moveToSlide(i));
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
            currentIndex = targetIndex;
            updateControls();
        };

        const updateControls = () => {
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        // Initial setup
        carousel.style.display = 'flex';
        carousel.style.transition = 'transform 0.4s ease-in-out';
        moveToSlide(0);
    }

    // --- 6. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookiesAccepted', 'true');
        });
    }

    // --- 7. STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }
    
    // --- 8. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        let galleryImages = [];
        let currentIndex = -1;

        const updateLightboxNav = () => {
            prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
            nextBtn.style.display = currentIndex < galleryImages.length - 1 ? 'block' : 'none';
        };

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            const imgElement = galleryImages[currentIndex];
            const imagePath = imgElement.dataset.kmImage;
            const altText = imgElement.alt || 'Galeriebild';
            lightboxImg.src = imgElement.src.replace('..', '.'); // Adjust path for lightbox
            lightboxImg.alt = altText;
            updateLightboxNav();
        };

        const openLightbox = (e) => {
            const clickedImage = e.currentTarget;
            const gallery = clickedImage.closest('.gallery-grid');
            if (gallery) {
                galleryImages = Array.from(gallery.querySelectorAll('img[data-km-image]'));
            } else {
                galleryImages = [clickedImage]; // Single image case
            }
            const startIndex = galleryImages.indexOf(clickedImage);
            
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            showImage(startIndex);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = ''; // Prevent loading in background
            }, 200);
        };

        document.querySelectorAll('img[data-km-image]').forEach(img => {
            if (img.closest('.gallery-grid')) { // Only make gallery images clickable
                img.style.cursor = 'pointer';
                img.addEventListener('click', openLightbox);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox(); // Close on backdrop click
        });
        prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});