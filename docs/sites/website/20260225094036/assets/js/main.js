document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header & CTA Bar ---
    const header = document.getElementById('site-header');
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    const scrollThreshold = 50;
    const ctaThreshold = 400;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (stickyCtaBar) {
            if (window.scrollY > ctaThreshold) {
                stickyCtaBar.classList.add('show');
            } else {
                stickyCtaBar.classList.remove('show');
            }
        }
    }, { passive: true });

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileNavToggle && mobileNav) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('open');
            mobileNav.setAttribute('aria-hidden', isExpanded);
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('show');
            }
        }, 1000);

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('button');

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        updateCarousel();
        
        setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        }, 5000);
    }
    
    // --- Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = Array.from(galleryItems).map(item => item.dataset.kmImage);
    let currentImageIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            currentImageIndex = index;
            const imagePath = galleryImages[index];
            const relativePath = lightbox.closest('main') ? (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../') + imagePath : imagePath;
            lightboxImg.src = relativePath;
            prevBtn.style.display = index === 0 ? 'none' : 'block';
            nextBtn.style.display = index === galleryImages.length - 1 ? 'none' : 'block';
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const imageSrc = e.currentTarget.dataset.kmImage;
            const index = galleryImages.indexOf(imageSrc);
            if (index > -1) {
                showImage(index);
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('show'), 10);
                document.body.classList.add('scroll-locked');
                document.addEventListener('keydown', handleKeydown);
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('scroll-locked');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrevImage = () => {
            if (currentImageIndex > 0) {
                showImage(currentImageIndex - 1);
            }
        };

        const showNextImage = () => {
            if (currentImageIndex < galleryImages.length - 1) {
                showImage(currentImageIndex + 1);
            }
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

});