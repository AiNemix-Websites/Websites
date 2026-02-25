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
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            document.body.classList.toggle('mobile-menu-open');
            mainNav.classList.toggle('mobile-active');
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // --- SCROLL REVEAL ANIMATIONS --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealElements.forEach(el => {
        if (el.classList.contains('reveal-stagger')) {
            const staggerItems = el.parentElement.querySelectorAll('.reveal-stagger');
            staggerItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
            });
        }
        observer.observe(el);
    });

    // --- ACCORDION --- //
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.maxHeight = isExpanded ? null : content.scrollHeight + 'px';
        });
    });

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const nextBtn = document.querySelector('.carousel-controls .next');
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

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');
    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- GLOBAL LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const closeBtn = lightbox.querySelector('.close-lightbox');
    const prevBtn = lightbox.querySelector('.prev-lightbox');
    const nextBtn = lightbox.querySelector('.next-lightbox');
    const galleryImages = Array.from(document.querySelectorAll('.lightbox-trigger'));
    let currentImageIndex;

    function showImage(index) {
        if (index < 0 || index >= galleryImages.length) return;
        currentImageIndex = index;
        const imgElement = galleryImages[index];
        const imagePath = imgElement.dataset.kmImage || imgElement.src;
        const altText = imgElement.alt || 'Galeriebild';
        
        // Use relative path for display
        let displayPath = imagePath;
        if (document.body.contains(document.querySelector('.site-header a[href*="../"]'))) {
            displayPath = '../' + imagePath;
        }

        lightboxImg.src = displayPath;
        lightboxImg.alt = altText;
        prevBtn.style.display = (index === 0) ? 'none' : 'block';
        nextBtn.style.display = (index === galleryImages.length - 1) ? 'none' : 'block';
    }

    function openLightbox(index) {
        lightbox.classList.add('active');
        showImage(index);
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeydown);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));
});