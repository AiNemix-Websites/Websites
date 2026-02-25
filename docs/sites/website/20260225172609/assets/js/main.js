document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HEADER & NAVIGATION --- //
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    // Sticky Header Shrink
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile Menu Toggle
    if (mobileMenuToggle && mainMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isOpen);
            mobileMenuToggle.classList.toggle('open');
            mainMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- 2. SCROLL-REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stagger animations for items in a group
                if (entry.target.classList.contains('stagger-group')) {
                    const items = entry.target.querySelectorAll(':scope > *');
                    items.forEach((item, index) => {
                        item.style.setProperty('--stagger-index', index);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => observer.observe(el));

    // --- 3. TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        let currentIndex = 0;
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const totalSlides = slides.length;

        const updateCarousel = () => {
            const offset = -currentIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        };

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    // --- 4. COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieAccepted', 'true');
        });
    }

    // --- 5. STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting (scrolled past)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) ctaObserver.observe(heroSection);
    }

    // --- 6. GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    let imagesInGallery = [];

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        imagesInGallery = Array.from(galleryItems).map(item => item.dataset.kmImage);

        const openLightbox = (index) => {
            currentImageIndex = index;
            const imagePath = imagesInGallery[currentImageIndex];
            // Adjust path for subdirectories if needed
            const isSubdirectory = window.location.pathname.split('/').length > 2;
            lightboxImg.src = isSubdirectory ? `../${imagePath}` : imagePath;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % imagesInGallery.length;
            openLightbox(currentImageIndex);
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + imagesInGallery.length) % imagesInGallery.length;
            openLightbox(currentImageIndex);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
        lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }
});