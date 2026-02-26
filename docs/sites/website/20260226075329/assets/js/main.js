document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
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

    // --- Mobile Menu --- 
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        const closeButton = mobileMenu.querySelector('.mobile-menu-close');
        
        const openMenu = () => {
            menuToggle.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            mobileMenu.classList.add('open');
            document.body.classList.add('no-scroll');
        };

        const closeMenu = () => {
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            mobileMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        };

        menuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        closeButton.addEventListener('click', closeMenu);
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const staggerContainer = entry.target.querySelector('[data-stagger-delay]');
                if(staggerContainer) {
                    const delay = staggerContainer.dataset.staggerDelay || '100';
                    staggerContainer.style.setProperty('--stagger-delay-val', `${delay}ms`);
                    const children = staggerContainer.children;
                    for(let i = 0; i < children.length; i++){
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        observer.observe(el);
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            carousel.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.ariaLabel = `Go to slide ${i + 1}`;
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');
        dots[0].classList.add('active');

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
    }

    // --- Contact Form --- 
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMessage = document.getElementById('form-success-message');
            successMessage.style.display = 'block';
            contactForm.reset();
            setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'flex';
        } else {
            cookieBanner.style.display = 'none';
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Sticky CTA ---
    const stickyCTA = document.getElementById('sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const backdrop = lightbox.querySelector('.km-lightbox-backdrop');
        let currentGallery = [];
        let currentIndex = -1;

        const updateImage = () => {
            if (currentIndex >= 0 && currentIndex < currentGallery.length) {
                const el = currentGallery[currentIndex];
                const imgSrc = el.dataset.kmImage || el.src;
                const imgAlt = el.alt || 'Großansicht';
                lightboxImage.src = imgSrc.startsWith('..') ? imgSrc.substring(1) : imgSrc; // Adjust path for subpages
                lightboxImage.alt = imgAlt;
            }
        };

        const openLightbox = (gallery, index) => {
            currentGallery = gallery;
            currentIndex = index;
            updateImage();
            lightbox.setAttribute('aria-hidden', 'false');
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            prevBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
            nextBtn.style.display = currentGallery.length > 1 ? 'flex' : 'none';
        };

        const closeLightbox = () => {
            lightbox.setAttribute('aria-hidden', 'true');
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            lightboxImage.src = '';
            currentGallery = [];
            currentIndex = -1;
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            updateImage();
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            updateImage();
        };

        document.addEventListener('click', (e) => {
            if (e.target.matches('.lightbox-trigger')) {
                e.preventDefault();
                const galleryName = e.target.dataset.gallery;
                const galleryElements = galleryName 
                    ? Array.from(document.querySelectorAll(`.lightbox-trigger[data-gallery='${galleryName}']`))
                    : [e.target];
                const index = galleryElements.indexOf(e.target);
                openLightbox(galleryElements, index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft' && currentGallery.length > 1) showPrev();
                if (e.key === 'ArrowRight' && currentGallery.length > 1) showNext();
            }
        });
    }
});