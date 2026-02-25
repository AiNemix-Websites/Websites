document.addEventListener('DOMContentLoaded', () => {

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
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('scroll-locked');
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.stagger || '0') * 100;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Before/After Slider --- //
    const sliderContainer = document.getElementById('before-after-slider');
    if (sliderContainer) {
        const slider = sliderContainer.querySelector('.slider-range');
        const afterImage = sliderContainer.querySelector('.after-image');
        const handle = sliderContainer.querySelector('.slider-handle');

        const updateSlider = (value) => {
            afterImage.style.clipPath = `inset(0 0 0 ${value}%)`;
            handle.style.left = `${value}%`;
        };

        slider.addEventListener('input', (e) => {
            updateSlider(e.target.value);
        });

        // Add touch support
        slider.addEventListener('touchstart', () => slider.focus());
        slider.addEventListener('touchmove', (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            slider.value = percentage;
            updateSlider(percentage);
        });
    }

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const prevBtn = document.getElementById('prev-testimonial');
        const nextBtn = document.getElementById('next-testimonial');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        function showSlide(index) {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
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

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-content img');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.prev-lightbox');
        const nextBtn = lightbox.querySelector('.next-lightbox');
        const galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
        let currentIndex = 0;

        const showImage = (index) => {
            const imgElement = galleryImages[index];
            if (!imgElement) return;
            const src = imgElement.dataset.kmImage || imgElement.src;
            const alt = imgElement.alt;
            lightboxImg.src = src.startsWith('../') ? src : (document.querySelector('base') ? '' : '../') + src;
            if (document.querySelector('base')) {
                lightboxImg.src = src;
            } else {
                const isSubpage = window.location.pathname.split('/').filter(Boolean).length > 0;
                lightboxImg.src = isSubpage ? `../${src}` : src;
            }

            lightboxImg.alt = alt;
            currentIndex = index;
        };

        const openLightbox = (e) => {
            const clickedIndex = galleryImages.indexOf(e.target);
            if (clickedIndex > -1) {
                showImage(clickedIndex);
                lightbox.classList.add('visible');
                document.body.classList.add('scroll-locked');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            document.body.classList.remove('scroll-locked');
        };

        const showPrev = () => {
            const newIndex = (currentIndex > 0) ? currentIndex - 1 : galleryImages.length - 1;
            showImage(newIndex);
        };

        const showNext = () => {
            const newIndex = (currentIndex < galleryImages.length - 1) ? currentIndex + 1 : 0;
            showImage(newIndex);
        };

        galleryImages.forEach(img => img.addEventListener('click', openLightbox));
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrev);
        nextBtn.addEventListener('click', showNext);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrev();
                if (e.key === 'ArrowRight') showNext();
            }
        });
    }
    
    // --- Back to Top Button --- //
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Smooth Scroll for Anchor Links --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});