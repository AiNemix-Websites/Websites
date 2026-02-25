document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
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

    // --- MOBILE MENU --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = mobileMenu?.querySelector('.close-menu-btn');

    const openMenu = () => {
        if (mobileMenu) mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        menuToggle?.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        if (mobileMenu) mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle?.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', openMenu);
    closeMenuBtn?.addEventListener('click', closeMenu);
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
    });

    // --- SCROLL REVEAL ANIMATION --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // Staggered delay
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            document.querySelectorAll('.carousel-dots .dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBanner.classList.add('show'), 1000);
    }

    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('show');
    });

    declineBtn?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('show');
    });

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;

    if (lightbox && lightboxImg && galleryItems.length > 0) {
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        const showImage = (index) => {
            const item = galleryItems[index];
            const imageSrc = item.getAttribute('href');
            const imageAlt = item.querySelector('img')?.getAttribute('alt') || 'Galeriebild';
            lightboxImg.setAttribute('src', imageSrc);
            lightboxImg.setAttribute('alt', imageAlt);
            currentImageIndex = index;
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = Array.from(galleryItems).findIndex(item => item === e.currentTarget);
            showImage(clickedIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.style.overflow = '';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', openLightbox);
        });

        closeBtn?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('show')) closeLightbox();
        });

        prevBtn?.addEventListener('click', () => {
            const newIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryItems.length - 1;
            showImage(newIndex);
        });

        nextBtn?.addEventListener('click', () => {
            const newIndex = (currentImageIndex < galleryItems.length - 1) ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        });
    }

    // --- STICKY CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past)
                if (!entry.isIntersecting) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }

});