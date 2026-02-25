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
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');

    const openMenu = () => {
        if(mobileMenu) {
            mobileMenu.style.display = 'flex';
            setTimeout(() => mobileMenu.classList.add('open'), 10);
            document.body.classList.add('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'true');
        }
    };

    const closeMenu = () => {
        if(mobileMenu) {
            mobileMenu.classList.remove('open');
            setTimeout(() => mobileMenu.style.display = 'none', 300);
            document.body.classList.remove('scroll-locked');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
    }
    if (menuClose && mobileMenu) {
        menuClose.addEventListener('click', closeMenu);
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 50}ms`;
        observer.observe(el);
    });

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.scrollTo({ left: slides[currentIndex].offsetLeft, behavior: 'smooth' });
            updateDots();
        };

        const updateDots = () => {
            const dots = dotsContainer.querySelectorAll('button');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        updateDots();
    }

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            answer.style.maxHeight = isExpanded ? null : answer.scrollHeight + 'px';
        });
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.classList.add('show');
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentImageIndex = 0;

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');

        const showImage = (index) => {
            const item = galleryItems[index];
            const imagePath = item.dataset.kmImage || item.src;
            const altText = item.alt || 'Galeriebild';
            lightboxImg.src = imagePath.startsWith('../') ? imagePath : (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/') ? '' : '../') + imagePath;
            lightboxImg.alt = altText;
            currentImageIndex = index;
        };

        const openLightbox = (e) => {
            const clickedIndex = galleryItems.indexOf(e.currentTarget);
            showImage(clickedIndex);
            lightbox.classList.add('show');
            document.body.classList.add('scroll-locked');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('scroll-locked');
        };

        const showPrevImage = () => showImage((currentImageIndex - 1 + galleryItems.length) % galleryItems.length);
        const showNextImage = () => showImage((currentImageIndex + 1) % galleryItems.length);

        galleryItems.forEach(item => item.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
    
    // --- Sticky CTA Bar --- //
    const stickyBar = document.querySelector('.sticky-cta-bar');
    if (stickyBar) {
        const showBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    stickyBar.classList.add('show');
                } else {
                    stickyBar.classList.remove('show');
                }
            });
        }, { rootMargin: '0px 0px -100px 0px' });
        const heroSection = document.querySelector('.hero');
        if (heroSection) showBarObserver.observe(heroSection);
    }
});