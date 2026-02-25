document.addEventListener('DOMContentLoaded', function() {

    // --- Sticky Header --- //
    const header = document.querySelector('.sticky-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const mobileNavClose = document.querySelector('.mobile-nav-close');

    if (mobileNavToggle && mobileNavMenu) {
        const openMenu = () => {
            mobileNavMenu.classList.add('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
        };

        const closeMenu = () => {
            mobileNavMenu.classList.remove('is-open');
            mobileNavToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        };

        mobileNavToggle.addEventListener('click', openMenu);
        if(mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNavMenu.classList.contains('is-open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Testimonial Carousel --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-next');
        const prevButton = carousel.querySelector('.carousel-prev');
        const dotsNav = carousel.querySelector('.carousel-dots');
        
        const slideWidth = slides[0].getBoundingClientRect().width;

        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        // slides.forEach(setSlidePosition);

        let currentIndex = 0;

        const moveToSlide = (targetIndex) => {
            track.style.transform = 'translateX(-' + (slideWidth * targetIndex) + 'px)';
            updateDots(currentIndex, targetIndex);
            currentIndex = targetIndex;
            updateArrows();
        };
        
        const updateDots = (current, target) => {
            if(!dotsNav) return;
            const currentDot = dotsNav.children[current];
            const targetDot = dotsNav.children[target];
            if(currentDot) currentDot.classList.remove('active');
            if(targetDot) targetDot.classList.add('active');
        };

        const updateArrows = () => {
            if (currentIndex === 0) {
                prevButton.disabled = true;
            } else {
                prevButton.disabled = false;
            }
            if (currentIndex === slides.length - 1) {
                nextButton.disabled = true;
            } else {
                nextButton.disabled = false;
            }
        };

        if (dotsNav) {
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.classList.add('carousel-dot');
                button.addEventListener('click', () => moveToSlide(index));
                dotsNav.appendChild(button);
            });
            dotsNav.children[0].classList.add('active');
        }

        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) moveToSlide(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            if (currentIndex < slides.length - 1) moveToSlide(currentIndex + 1);
        });

        updateArrows();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookieBanner && cookieAccept) {
        setTimeout(() => {
            if (!localStorage.getItem('cookieConsent')) {
                cookieBanner.classList.add('show');
            }
        }, 2000);

        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }
    
    // --- Sticky CTA --- //
    const stickyCta = document.getElementById('sticky-cta');
    if(stickyCta) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                 // Show after scrolling past the hero
                if (window.scrollY > window.innerHeight * 0.8) {
                    stickyCta.classList.add('visible');
                } else {
                    stickyCta.classList.remove('visible');
                }
            });
        });
        ctaObserver.observe(document.body);
        window.addEventListener('scroll', () => {
            if (window.scrollY > window.innerHeight * 0.8) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const gallery = document.getElementById('image-gallery');

    if (lightbox && gallery) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        const galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
        let currentIndex = 0;

        const showImage = (index) => {
            const item = galleryItems[index];
            if (!item) return;
            const img = item.querySelector('img');
            const imagePath = img.getAttribute('data-km-image');
            const altText = img.getAttribute('alt');
            
            const pathPrefix = lightbox.dataset.pathPrefix || '';
            lightboxImg.src = pathPrefix + imagePath;
            lightboxImg.alt = altText;
            currentIndex = index;

            prevBtn.style.display = (index === 0) ? 'none' : 'block';
            nextBtn.style.display = (index === galleryItems.length - 1) ? 'none' : 'block';
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedItem = e.target.closest('.gallery-item');
            if (!clickedItem) return;

            const itemIndex = galleryItems.indexOf(clickedItem);
            
            const pathPrefix = getPathPrefix();
            lightbox.dataset.pathPrefix = pathPrefix;

            showImage(itemIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 250);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrev = () => {
            if (currentIndex > 0) showImage(currentIndex - 1);
        };

        const showNext = () => {
            if (currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        
        const getPathPrefix = () => {
            const path = window.location.pathname;
            // Count slashes to determine depth, excluding trailing slash
            const depth = (path.endsWith('/') ? path.slice(0, -1) : path).split('/').length - 1;
            return '../'.repeat(depth > 0 ? depth : 0);
        };

        gallery.addEventListener('click', openLightbox);
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

});