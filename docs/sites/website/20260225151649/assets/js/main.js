document.addEventListener('DOMContentLoaded', () => {

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

    // --- Mobile Navigation --- //
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavDrawer = document.querySelector('.mobile-nav-drawer');
    if (mobileNavToggle && mobileNavDrawer) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavDrawer.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Accordion --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- Carousel --- //
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    if (carouselTrack && prevButton && nextButton) {
        const slides = Array.from(carouselTrack.children);
        const slideWidth = slides[0].getBoundingClientRect().width;

        const scrollToSlide = (track, currentSlide, targetSlide) => {
            track.scrollLeft = targetSlide.offsetLeft;
        }

        nextButton.addEventListener('click', e => {
            const currentSlideIndex = Math.round(carouselTrack.scrollLeft / slideWidth);
            const nextIndex = (currentSlideIndex + 1) % slides.length;
            carouselTrack.scroll({ left: slides[nextIndex].offsetLeft, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', e => {
            const currentSlideIndex = Math.round(carouselTrack.scrollLeft / slideWidth);
            const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            carouselTrack.scroll({ left: slides[prevIndex].offsetLeft, behavior: 'smooth' });
        });
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const clickableImages = document.querySelectorAll('.clickable-image');
    let galleryImages = [];
    let currentImageIndex = 0;

    if (lightbox && lightboxImg && clickableImages.length > 0) {
        clickableImages.forEach((img, index) => {
            galleryImages.push(img.dataset.kmImage);
            img.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
                showLightbox();
            });
        });

        const showLightbox = () => {
            lightbox.classList.add('visible');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleEscKey);
        };

        const hideLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleEscKey);
        };

        const updateLightboxImage = () => {
            const imagePath = galleryImages[currentImageIndex];
            // Adjust path for subdirectories
            const onSubPage = window.location.pathname.split('/').length > 2;
            lightboxImg.src = onSubPage ? '../' + imagePath : imagePath;
        };

        const showNextImage = () => {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        };

        const showPrevImage = () => {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        };

        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                hideLightbox();
            }
        };

        lightbox.querySelector('.close-lightbox').addEventListener('click', hideLightbox);
        lightbox.querySelector('.next-lightbox').addEventListener('click', showNextImage);
        lightbox.querySelector('.prev-lightbox').addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                hideLightbox();
            }
        });
    }
});