document.addEventListener('DOMContentLoaded', () => {

    // --- Header Logic ---
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
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            document.body.classList.toggle('no-scroll', isActive);
        });
    }

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-fade-in, .reveal-stagger-group');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('reveal-stagger-group')) {
                    const children = entry.target.querySelectorAll(':scope > *');
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.style.transitionDelay = `${i * 100}ms`;
                            entry.target.classList.add('visible');
                        }, 100);
                    });
                } else {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAccept) {
        if (!localStorage.getItem('cookieAccepted')) {
            setTimeout(() => cookieBanner.classList.add('visible'), 1000);
        }
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieAccepted', 'true');
            cookieBanner.classList.remove('visible');
        });
    }

    // --- Testimonial Slider ---
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');
        let currentIndex = 0;

        const goToSlide = (index) => {
            slider.style.transform = `translateX(-${index * 100}%)`;
            updateDots(index);
            currentIndex = index;
        };

        const updateDots = (index) => {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            goToSlide(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            goToSlide(prevIndex);
        });

        goToSlide(0);
    }

    // --- Contact Form --- 
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedback = document.getElementById('form-feedback');
            // This is a dummy submission handler
            feedback.textContent = 'Vielen Dank! Ihre Nachricht wird verarbeitet.';
            feedback.style.color = 'green';
            setTimeout(() => {
                feedback.textContent = 'Vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage erhalten und werden uns umgehend bei Ihnen melden.';
                contactForm.reset();
            }, 1000);
        });
    }
    
    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Lightbox (Singleton) ---
    // NOTE: No images are provided, so this is set up but won't be triggered by default.
    // To use it, add `data-km-image='path/to/image.jpg'` to a clickable element and add the class `lightbox-trigger`.
    const lightbox = document.getElementById('km-lightbox');
    if (lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const backdrop = lightbox.querySelector('.lightbox-backdrop');
        let currentImageIndex = -1;
        let galleryImages = [];

        const openLightbox = (index) => {
            if (index < 0 || index >= galleryImages.length) return;
            currentImageIndex = index;
            const imageSrc = galleryImages[index];
            const imgContainer = lightbox.querySelector('.lightbox-image-container');
            imgContainer.innerHTML = `<img src='${imageSrc}' alt='Galeriebild ${index + 1}'>`;
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('visible'), 10);
            document.body.classList.add('no-scroll');
            lightbox.setAttribute('aria-hidden', 'false');
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('visible');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightbox.querySelector('.lightbox-image-container').innerHTML = '';
            }, 200);
            document.body.classList.remove('no-scroll');
            lightbox.setAttribute('aria-hidden', 'true');
        };

        document.querySelectorAll('.lightbox-trigger').forEach((el, index) => {
            const imagePath = el.dataset.kmImage;
            if (imagePath) {
                galleryImages.push(imagePath);
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(galleryImages.indexOf(imagePath));
                });
            }
        });

        closeBtn.addEventListener('click', closeLightbox);
        backdrop.addEventListener('click', closeLightbox);
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('visible')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') openLightbox(currentImageIndex + 1);
                if (e.key === 'ArrowLeft') openLightbox(currentImageIndex - 1);
            }
        });

        lightbox.querySelector('.lightbox-next').addEventListener('click', () => openLightbox(currentImageIndex + 1));
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => openLightbox(currentImageIndex - 1));
    }
});