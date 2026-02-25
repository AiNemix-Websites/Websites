document.addEventListener('DOMContentLoaded', () => {

    // --- STICKY HEADER --- //
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

    // --- MOBILE MENU --- //
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- SCROLL REVEAL --- //
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-stagger');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach((el, index) => {
        if (el.classList.contains('reveal-stagger')) {
            el.style.transitionDelay = `${index * 100}ms`;
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
            if (!isExpanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });

    // --- TESTIMONIAL CAROUSEL --- //
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const slides = carousel.querySelectorAll('.testimonial-slide');
        const nextBtn = document.querySelector('.carousel-controls .next');
        const prevBtn = document.querySelector('.carousel-controls .prev');
        const dotsContainer = document.querySelector('.carousel-controls .dots');
        let currentIndex = 0;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = dotsContainer.querySelectorAll('.dot');

        const goToSlide = (index) => {
            currentIndex = index;
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        };

        nextBtn.addEventListener('click', () => {
            let nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });
    }

    // --- COOKIE BANNER --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- LIGHTBOX --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryGrid = document.getElementById('gallery-grid');
    let galleryImages = [];
    let currentImageIndex = -1;

    if (lightbox && galleryGrid) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.close');
        const prevBtn = lightbox.querySelector('.prev');
        const nextBtn = lightbox.querySelector('.next');
        
        galleryImages = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imgSrc = galleryImages[currentImageIndex].getAttribute('href');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.classList.add('show');
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        const showPrevImage = () => {
            const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            openLightbox(newIndex);
        };

        const showNextImage = () => {
            const newIndex = (currentImageIndex + 1) % galleryImages.length;
            openLightbox(newIndex);
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        };

        galleryGrid.addEventListener('click', (e) => {
            e.preventDefault();
            const clickedItem = e.target.closest('.gallery-item');
            if (clickedItem) {
                const index = galleryImages.indexOf(clickedItem);
                openLightbox(index);
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    
    // --- STICKY CTA --- //
    const stickyCTA = document.getElementById('sticky-cta');
    if(stickyCTA) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting) {
                    stickyCTA.classList.add('show');
                } else {
                    stickyCTA.classList.remove('show');
                }
            });
        }, { threshold: 0.1 });
        
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            ctaObserver.observe(heroSection);
        }
    }
});