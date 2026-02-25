document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
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

    // --- Mobile Menu --- 
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.classList.add('scroll-locked');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('scroll-locked');
        }
    };

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        }
    });

    // --- Testimonial Carousel ---
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        const updateCarousel = () => {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.style.transition = 'transform 0.5s ease-in-out';
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

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        updateCarousel(); // Initial setup
    }

    // --- Cookie Banner ---
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

    // --- Lightbox --- 
    const lightbox = document.getElementById('km-lightbox');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    const galleryItems = Array.from(lightboxTriggers);
    let currentImageIndex = 0;

    if (lightbox && lightboxTriggers.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        const showImage = (index) => {
            const item = galleryItems[index];
            const imgElement = item.querySelector('img');
            if (imgElement) {
                const imagePath = imgElement.dataset.kmImage;
                const altText = imgElement.alt;
                lightboxImg.src = (window.location.pathname.includes('/index.html') || window.location.pathname.endsWith('/')) ? imagePath : `../${imagePath}`;
                lightboxImg.alt = altText;
                currentImageIndex = index;
            }
        };

        const openLightbox = (e) => {
            e.preventDefault();
            const clickedIndex = galleryItems.indexOf(e.currentTarget);
            showImage(clickedIndex);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('scroll-locked');
            addLightboxListeners();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = ''; // Stop image loading
            }, 300);
            document.body.classList.remove('scroll-locked');
            removeLightboxListeners();
        };

        const showNextImage = () => showImage((currentImageIndex + 1) % galleryItems.length);
        const showPrevImage = () => showImage((currentImageIndex - 1 + galleryItems.length) % galleryItems.length);

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        };

        const handleBackdropClick = (e) => {
            if (e.target === lightbox) closeLightbox();
        }

        function addLightboxListeners() {
            closeBtn.addEventListener('click', closeLightbox);
            nextBtn.addEventListener('click', showNextImage);
            prevBtn.addEventListener('click', showPrevImage);
            document.addEventListener('keydown', handleKeydown);
            lightbox.addEventListener('click', handleBackdropClick);
        }

        function removeLightboxListeners() {
            closeBtn.removeEventListener('click', closeLightbox);
            nextBtn.removeEventListener('click', showNextImage);
            prevBtn.removeEventListener('click', showPrevImage);
            document.removeEventListener('keydown', handleKeydown);
            lightbox.removeEventListener('click', handleBackdropClick);
        }

        lightboxTriggers.forEach(trigger => trigger.addEventListener('click', openLightbox));
    }

    // --- Back to Top & Sticky CTA ---
    const backToTopButton = document.getElementById('back-to-top');
    const stickyCta = document.getElementById('sticky-cta');
    const progressCircle = document.querySelector('.progress-ring-circle');

    if (backToTopButton) {
        const radius = progressCircle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const progress = scrollTop / scrollHeight;
            const offset = circumference - progress * circumference;
            progressCircle.style.strokeDashoffset = offset;

            if (scrollTop > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }

            if (stickyCta) {
                const footer = document.querySelector('.main-footer');
                const footerTop = footer.offsetTop;
                const scrollBottom = scrollTop + window.innerHeight;

                if (scrollTop > window.innerHeight / 2 && scrollBottom < footerTop) {
                    stickyCta.style.display = 'block';
                    setTimeout(() => stickyCta.classList.add('visible'), 10);
                } else {
                    stickyCta.classList.remove('visible');
                    setTimeout(() => stickyCta.style.display = 'none', 300);
                }
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});