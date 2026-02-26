document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Navigation ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
            if (!isExpanded) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // --- Testimonial Carousel ---
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        let currentIndex = 0;

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        cookieBanner.style.display = 'block';
        setTimeout(() => cookieBanner.classList.add('visible'), 100);
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            cookieBanner.classList.remove('visible');
            localStorage.setItem('cookieAccepted', 'true');
            setTimeout(() => cookieBanner.style.display = 'none', 500);
        });
    }

    // --- Global Lightbox ---
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const galleryItems = document.querySelectorAll('.gallery-container [data-src]');
    let currentIndex = 0;

    if (lightbox) {
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');

        const showImage = (index) => {
            const item = galleryItems[index];
            if (item) {
                lightboxImg.src = item.dataset.src;
                lightboxImg.alt = item.dataset.alt || 'Projektbild';
                currentIndex = index;
            }
        };

        const openLightbox = (index) => {
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            showImage(index);
            document.body.classList.add('no-scroll');
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = ''; // Clear src to stop loading
            }, 350);
            document.body.classList.remove('no-scroll');
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentIndex + 1) % galleryItems.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
});