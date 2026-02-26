document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header --- //
    const header = document.getElementById('site-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNav) {
        const openNav = () => {
            mobileNav.classList.add('is-open');
            mobileNav.setAttribute('aria-hidden', 'false');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
        };

        const closeNav = () => {
            mobileNav.classList.remove('is-open');
            mobileNav.setAttribute('aria-hidden', 'true');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
        };

        mobileNavToggle.addEventListener('click', openNav);
        if (mobileNavClose) mobileNavClose.addEventListener('click', closeNav);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
                closeNav();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
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

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && acceptBtn && declineBtn) {
        const cookieStatus = localStorage.getItem('cookie_status');
        if (!cookieStatus) {
            cookieBanner.classList.add('show');
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'accepted');
            cookieBanner.classList.remove('show');
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_status', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('button');

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- Before/After Slider --- //
    const slider = document.getElementById('before-after-slider');
    if (slider) {
        const beforeImg = slider.querySelector('.ba-image-before');
        const handle = slider.querySelector('.ba-handle');
        let isDragging = false;

        const moveHandler = (x) => {
            const rect = slider.getBoundingClientRect();
            let pos = (x - rect.left) / rect.width * 100;
            pos = Math.max(0, Math.min(100, pos));
            handle.style.left = `${pos}%`;
            beforeImg.style.clipPath = `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`;
        };

        handle.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup', () => isDragging = false);
        document.addEventListener('mousemove', (e) => {
            if (isDragging) moveHandler(e.clientX);
        });

        handle.addEventListener('touchstart', () => isDragging = true);
        document.addEventListener('touchend', () => isDragging = false);
        document.addEventListener('touchmove', (e) => {
            if (isDragging) moveHandler(e.touches[0].clientX);
        });
    }
    
    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const triggers = document.querySelectorAll('.lightbox-trigger');
        const galleryImages = Array.from(triggers).map(t => ({ src: t.dataset.kmImage || t.src, alt: t.alt }));
        let currentIndex = 0;

        const showImage = (index) => {
            const imgData = galleryImages[index];
            const relativePath = lightbox.dataset.isSubpage === 'true' ? '../' : '';
            lightboxImg.src = relativePath + imgData.src;
            lightboxImg.alt = imgData.alt;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            const clickedSrc = e.target.dataset.kmImage || e.target.src;
            const index = galleryImages.findIndex(img => (lightbox.dataset.isSubpage === 'true' ? '../' : '') + img.src === clickedSrc || img.src === clickedSrc);
            if (index > -1) {
                showImage(index);
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('show'), 10);
                document.body.classList.add('scroll-locked');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('scroll-locked');
        };

        const prevImage = () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length);
        const nextImage = () => showImage((currentIndex + 1) % galleryImages.length);

        // Detect if we are on a subpage to adjust image paths
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            lightbox.dataset.isSubpage = 'true';
        }

        triggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
        lightbox.querySelector('.km-lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.km-lightbox-prev').addEventListener('click', prevImage);
        lightbox.querySelector('.km-lightbox-next').addEventListener('click', nextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevImage();
                if (e.key === 'ArrowRight') nextImage();
            }
        });
    }
});