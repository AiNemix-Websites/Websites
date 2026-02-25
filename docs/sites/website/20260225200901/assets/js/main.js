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
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.querySelector('.close-menu-btn');

    function openMenu() {
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) closeMenu();
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('span');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });

        updateCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    if (acceptCookiesBtn) {
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if (contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                contextCta.classList.add('visible');
            } else {
                contextCta.classList.remove('visible');
            }
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');

        const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);

        function showImage(index) {
            const relativePath = lightbox.ownerDocument.body.dataset.pageDepth === 'sub' ? '../' : './';
            lightboxImage.src = relativePath + imageSources[index];
            currentImageIndex = index;
        }

        function openLightbox(index) {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            lightbox.setAttribute('aria-hidden', 'false');
            showImage(index);
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('visible');
            lightbox.setAttribute('aria-hidden', 'true');
            setTimeout(() => { lightbox.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageSources.length - 1;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex < imageSources.length - 1) ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // Set page depth for asset loading in JS (e.g., lightbox)
    const path = window.location.pathname;
    if (path.includes('/reinigungsdienste/') || path.includes('/gartenservice/') || path.includes('/ueber-uns/') || path.includes('/kontakt/') || path.includes('/faq/') || path.includes('/impressum/') || path.includes('/datenschutz/')) {
        document.body.dataset.pageDepth = 'sub';
    } else {
        document.body.dataset.pageDepth = 'root';
    }

});