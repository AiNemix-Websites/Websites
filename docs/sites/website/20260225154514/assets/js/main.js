document.addEventListener('DOMContentLoaded', function() {

    // --- STICKY HEADER --- //
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

    // --- MOBILE NAVIGATION --- //
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (navToggle && mainNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.classList.toggle('nav-open', isOpen);
        });
    }

    // --- SCROLL ANIMATIONS --- //
    const animatedElements = document.querySelectorAll('.animate-in');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${index * 50}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const dotsContainer = document.querySelector('.carousel-dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            carousel.innerHTML = ''; // Clear and re-append to manage clones easily
            slides.forEach(slide => carousel.appendChild(slide.cloneNode(true)));
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateCarousel();
        }

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Basic swipe support
        let touchstartX = 0;
        let touchendX = 0;
        carousel.addEventListener('touchstart', e => touchstartX = e.changedTouches[0].screenX);
        carousel.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX;
            if (touchendX < touchstartX) goToSlide(currentIndex + 1);
            if (touchendX > touchstartX) goToSlide(currentIndex - 1);
        });

        // Initial setup
        const carouselInner = document.createElement('div');
        carouselInner.style.display = 'flex';
        slides.forEach(slide => carouselInner.appendChild(slide));
        carousel.innerHTML = '';
        carousel.appendChild(carouselInner);
        carousel.style.overflow = 'visible';
        carouselInner.style.transition = 'transform 0.5s ease';
        carousel.parentElement.style.overflow = 'hidden';
        
        function updateCarouselTransform() {
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            updateCarouselTransform();
        }

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');
        let currentImageIndex;
        const images = Array.from(galleryItems);

        function showLightbox(index) {
            currentImageIndex = index;
            const imageSrc = images[currentImageIndex].getAttribute('data-km-image');
            const imageAlt = images[currentImageIndex].getAttribute('alt');
            lightboxImg.setAttribute('src', '../' + imageSrc); // Adjust path for subpages
            lightboxImg.setAttribute('alt', imageAlt);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.style.overflow = 'hidden';
        }

        function hideLightbox() {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.style.overflow = '';
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            showLightbox(currentImageIndex);
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            showLightbox(currentImageIndex);
        }

        images.forEach((item, index) => {
            item.addEventListener('click', () => showLightbox(index));
        });

        closeBtn.addEventListener('click', hideLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) hideLightbox();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === 'Escape') hideLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
});