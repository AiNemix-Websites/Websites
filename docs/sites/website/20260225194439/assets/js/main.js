document.addEventListener('DOMContentLoaded', () => {

    // Sticky Header
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

    // Mobile Menu
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Testimonial Carousel
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-next');
        const prevBtn = document.querySelector('.carousel-prev');
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

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        goToSlide(0); // Initial setup
    }

    // Scroll Reveal Animation
    const revealItems = document.querySelectorAll('.reveal-item');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // Cookie Banner
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }
        cookieAccept.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
            localStorage.setItem('cookieAccepted', 'true');
        });
    }

    // Before-After Slider
    document.querySelectorAll('.before-after-slider').forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        let isDragging = false;

        const moveHandler = (x) => {
            const rect = slider.getBoundingClientRect();
            let newX = x - rect.left;
            if (newX < 0) newX = 0;
            if (newX > rect.width) newX = rect.width;
            const percentage = (newX / rect.width) * 100;
            handle.style.left = percentage + '%';
            afterImage.style.width = percentage + '%';
        };

        handle.addEventListener('mousedown', () => { isDragging = true; });
        handle.addEventListener('touchstart', () => { isDragging = true; });

        document.addEventListener('mouseup', () => { isDragging = false; });
        document.addEventListener('touchend', () => { isDragging = false; });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) moveHandler(e.clientX);
        });
        document.addEventListener('touchmove', (e) => {
            if (isDragging) moveHandler(e.touches[0].clientX);
        });
    });
    
    // Sticky CTA
    const stickyCTA = document.querySelector('.sticky-cta');
    if (stickyCTA) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                stickyCTA.classList.add('visible');
            } else {
                stickyCTA.classList.remove('visible');
            }
        });
    }

});