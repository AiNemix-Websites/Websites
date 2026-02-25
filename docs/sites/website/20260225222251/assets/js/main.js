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
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    const openMenu = () => {
        mobileMenu.classList.add('open');
        body.classList.add('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    if (menuToggle && mobileMenu && menuClose) {
        menuToggle.addEventListener('click', openMenu);
        menuClose.addEventListener('click', closeMenu);
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && e.target !== menuToggle) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    // --- Scroll Animations --- //
    const revealItems = document.querySelectorAll('.reveal-item');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    revealItems.forEach(item => revealObserver.observe(item));

    // --- Testimonial Carousel --- //
    const carousel = document.getElementById('testimonial-carousel');
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        const slides = carousel.querySelectorAll('.testimonial-slide');
        let currentIndex = 0;

        const showSlide = (index) => {
            const scrollAmount = slides[index].offsetLeft - carousel.offsetLeft;
            carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
        };

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
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryImages = document.querySelectorAll('.gallery-image');
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const imageSources = Array.from(galleryImages).map(img => img.dataset.kmImage);

        const showImage = (index) => {
            lightboxImg.src = imageSources[index];
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            lightbox.style.display = 'block';
            document.body.classList.add('no-scroll');
            showImage(index);
        };

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.classList.remove('no-scroll');
        };

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imageSources.length - 1;
            showImage(newIndex);
        });
        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex < imageSources.length - 1) ? currentImageIndex + 1 : 0;
            showImage(newIndex);
        });
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }
    
    // --- Context CTA --- //
    const contextCta = document.getElementById('context-cta');
    if(contextCta) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                contextCta.classList.add('show');
            } else {
                contextCta.classList.remove('show');
            }
        });
    }

    // --- Contact Form --- //
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            const status = document.getElementById('form-status');
            const data = new FormData(event.target);
            
            // Replace 'YOUR_FORM_ID' with a real Formspree ID for functionality
            const formspreeUrl = 'https://formspree.io/f/mqkrvqjy'; // Example URL

            if (formspreeUrl.includes('your_form_id')) {
                status.innerHTML = 'Formular-Setup unvollständig.';
                status.style.color = 'orange';
                return;
            }

            try {
                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.innerHTML = 'Vielen Dank! Ihre Nachricht wurde gesendet.';
                    status.style.color = 'var(--color-accent)';
                    form.reset();
                } else {
                    const responseData = await response.json();
                    if (Object.hasOwn(responseData, 'errors')) {
                        status.innerHTML = responseData['errors'].map(error => error['message']).join(', ');
                    } else {
                        status.innerHTML = 'Oops! Es gab ein Problem beim Senden des Formulars.';
                    }
                     status.style.color = 'red';
                }
            } catch (error) {
                status.innerHTML = 'Oops! Es gab ein Problem beim Senden des Formulars.';
                status.style.color = 'red';
            }
        });
    }
});