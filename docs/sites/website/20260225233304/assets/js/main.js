document.addEventListener('DOMContentLoaded', function() {

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
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('#mobile-nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll', !isExpanded);
        });
    }

    // --- Scroll Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
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
        observer.observe(el);
    });

    // --- FAQ Accordion --- //
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                question.setAttribute('aria-expanded', !isExpanded);
                answer.hidden = isExpanded;
            });
        }
    });
    
    // --- Service Detail Accordion --- //
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        const question = item.querySelector('.service-question');
        const answer = item.querySelector('.service-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const wasActive = question.classList.contains('active');
                // Close all answers
                document.querySelectorAll('.service-question').forEach(q => q.classList.remove('active'));
                document.querySelectorAll('.service-answer').forEach(a => a.style.display = 'none');
                // Open the clicked one if it wasn't active
                if (!wasActive) {
                    question.classList.add('active');
                    answer.style.display = 'block';
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
        let currentIndex = 0;

        function showSlide(index) {
            carousel.style.transform = `translateX(-${index * 100}%)`;
        }

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            showSlide(currentIndex);
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
        });
    }

    // --- Interactive House --- //
    const hotspots = document.querySelectorAll('.hotspot');
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            const area = hotspot.dataset.area;
            const popup = document.getElementById(`info-popup-${area}`);
            
            // Close all other popups
            document.querySelectorAll('.info-popup.active').forEach(p => {
                if (p !== popup) p.classList.remove('active');
            });

            if (popup) {
                popup.classList.toggle('active');
                // Position popup
                const hotspotRect = hotspot.getBoundingClientRect();
                const containerRect = hotspot.parentElement.getBoundingClientRect();
                popup.style.top = `${hotspotRect.top - containerRect.top + hotspotRect.height + 10}px`;
                popup.style.left = `${hotspotRect.left - containerRect.left + hotspotRect.width / 2 - popup.offsetWidth / 2}px`;
            }
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.info-popup.active').forEach(p => p.classList.remove('active'));
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('cookie-accept');

    if (cookieBanner && acceptButton) {
        if (!localStorage.getItem('cookieConsent')) {
            cookieBanner.hidden = false;
        }

        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.hidden = true;
        });
    }
    
    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');
        let currentImageIndex;
        let galleryImages = [];

        document.querySelectorAll('img[data-km-image]').forEach((img, index) => {
            // Check if image is part of a gallery context (can be refined)
            if (img.closest('.service-detail-image, .gallery')) { // Example context
                galleryImages.push(img);
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    currentImageIndex = galleryImages.indexOf(img);
                    openLightbox(img.dataset.kmImage);
                });
            }
        });

        function openLightbox(src) {
            lightboxImg.setAttribute('src', src.startsWith('..') ? src : (location.pathname.includes('/index.html') || location.pathname.endsWith('/') ? '' : '../') + src);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
            document.body.classList.add('no-scroll');
            updateLightboxNav();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.setAttribute('src', '');
            }, 300);
            document.body.classList.remove('no-scroll');
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
            openLightbox(galleryImages[currentImageIndex].dataset.kmImage);
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
            openLightbox(galleryImages[currentImageIndex].dataset.kmImage);
        }
        
        function updateLightboxNav() {
            if (galleryImages.length <= 1) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                 prevBtn.style.display = 'block';
                nextBtn.style.display = 'block';
            }
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showPrevImage();
                if (e.key === 'ArrowRight') showNextImage();
            }
        });
    }
});