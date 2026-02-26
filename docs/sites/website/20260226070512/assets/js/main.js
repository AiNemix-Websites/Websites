document.addEventListener('DOMContentLoaded', function() {

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

    // --- Mobile Menu --- //
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = Array.from(carousel.children);
        const nextButton = document.querySelector('.carousel-next');
        const prevButton = document.querySelector('.carousel-prev');
        const dotsNav = document.querySelector('.carousel-dots');
        const slideWidth = slides[0].getBoundingClientRect().width;

        carousel.style.display = 'flex'; // Use flex for sliding

        slides.forEach((slide, index) => {
            const dot = document.createElement('button');
            dot.addEventListener('click', () => moveToSlide(index));
            dotsNav.appendChild(dot);
        });
        const dots = Array.from(dotsNav.children);

        const moveToSlide = (targetIndex) => {
            carousel.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
            carousel.style.transition = 'transform 0.4s ease-in-out';
            updateCarouselState(targetIndex);
        };

        const updateCarouselState = (currentIndex) => {
            carousel.dataset.currentIndex = currentIndex;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === slides.length - 1;
        };

        nextButton.addEventListener('click', () => {
            const currentIndex = parseInt(carousel.dataset.currentIndex || 0);
            if (currentIndex < slides.length - 1) {
                moveToSlide(currentIndex + 1);
            }
        });

        prevButton.addEventListener('click', () => {
            const currentIndex = parseInt(carousel.dataset.currentIndex || 0);
            if (currentIndex > 0) {
                moveToSlide(currentIndex - 1);
            }
        });
        
        // Initialize
        moveToSlide(0);
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const galleryImageSources = galleryItems.map(item => {
            const img = item.querySelector('img') || item;
            return img.dataset.kmImage;
        });

        const showImage = (index) => {
            const imgSrc = galleryImageSources[index];
            const relativePath = lightbox.getAttribute('data-base-path') || '';
            lightboxImg.src = relativePath + imgSrc;
            currentIndex = index;
        };

        document.body.addEventListener('click', e => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                e.preventDefault();
                const img = galleryItem.querySelector('img') || galleryItem;
                const itemIndex = galleryImageSources.indexOf(img.dataset.kmImage);
                
                // Set base path for assets on subpages
                const isSubpage = window.location.pathname.split('/').filter(Boolean).length > 0;
                lightbox.setAttribute('data-base-path', isSubpage ? '../' : '');

                showImage(itemIndex);
                lightbox.style.display = 'flex';
                document.body.classList.add('no-scroll');
            }
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            lightboxImg.src = '';
            document.body.classList.remove('no-scroll');
        };

        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        lightbox.querySelector('.next-lightbox').addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % galleryImageSources.length;
            showImage(nextIndex);
        });

        lightbox.querySelector('.prev-lightbox').addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + galleryImageSources.length) % galleryImageSources.length;
            showImage(prevIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') lightbox.querySelector('.next-lightbox').click();
                if (e.key === 'ArrowLeft') lightbox.querySelector('.prev-lightbox').click();
            }
        });
    }

    // --- Sticky CTA --- //
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when the hero is NOT intersecting (i.e., scrolled past it)
                stickyCta.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0 });
        const heroSection = document.querySelector('.hero, .hero-subpage');
        if (heroSection) ctaObserver.observe(heroSection);
    }

});