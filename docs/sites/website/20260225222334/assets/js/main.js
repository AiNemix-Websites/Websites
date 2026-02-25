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

    // --- Mobile Navigation --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const overlay = document.querySelector('.mobile-nav-overlay');

    if (menuToggle && mainNav && overlay) {
        const closeMenu = () => {
            header.classList.remove('open');
            mainNav.classList.remove('open');
            overlay.classList.remove('show');
            document.body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            header.classList.toggle('open', isOpen);
            overlay.classList.toggle('show', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        overlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-stagger-group > *');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, entry.target.parentElement.classList.contains('reveal-stagger-group') ? index * 100 : 0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                if (!isExpanded) {
                    answer.style.gridTemplateRows = '1fr';
                } else {
                    answer.style.gridTemplateRows = '0fr';
                }
            });
        }
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
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
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

        updateCarousel();
    }

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieAccepted', 'true');
        });
    }

    // --- Back to Top Button --- //
    const backToTopButton = document.getElementById('back-to-top');
    const progressRing = document.querySelector('.progress-ring-circle');
    if (backToTopButton && progressRing) {
        const radius = progressRing.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;

        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / scrollHeight) * circumference;
            progressRing.style.strokeDashoffset = circumference - progress;

            if (scrollTop > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const closeButton = lightbox.querySelector('.close-lightbox');
        const prevButton = lightbox.querySelector('.prev-lightbox');
        const nextButton = lightbox.querySelector('.next-lightbox');
        let galleryImages = [];
        let currentIndex = -1;

        const updateLightboxNav = () => {
            prevButton.style.display = galleryImages.length > 1 ? 'block' : 'none';
            nextButton.style.display = galleryImages.length > 1 ? 'block' : 'none';
        };

        const showImage = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentIndex = index;
            lightboxImage.src = galleryImages[currentIndex];
        };

        const openLightbox = (e) => {
            const clickedImage = e.target.closest('.clickable-image');
            if (clickedImage) {
                const src = clickedImage.dataset.lightboxSrc;
                galleryImages = Array.from(document.querySelectorAll('.clickable-image')).map(img => img.dataset.lightboxSrc);
                currentIndex = galleryImages.indexOf(src);
                showImage(currentIndex);
                updateLightboxNav();
                lightbox.style.display = 'flex';
                setTimeout(() => lightbox.classList.add('show'), 10);
                document.body.classList.add('no-scroll');
            }
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImage.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
        };

        document.body.addEventListener('click', openLightbox);
        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevButton.addEventListener('click', () => showImage((currentIndex - 1 + galleryImages.length) % galleryImages.length));
        nextButton.addEventListener('click', () => showImage((currentIndex + 1) % galleryImages.length));

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevButton.click();
                if (e.key === 'ArrowRight') nextButton.click();
            }
        });
    }
});