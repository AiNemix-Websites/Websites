document.addEventListener('DOMContentLoaded', () => {

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
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    if (mobileNavToggle && mobileNavMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNavMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- Scroll Reveal Animations --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Stagger children if group
                const staggerGroup = entry.target.querySelector('.stagger-group');
                if (staggerGroup) {
                    const children = staggerGroup.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.setProperty('--stagger-index', i);
                    }
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => cookieBanner.classList.add('show'), 1000);
        }
        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    const imageSources = Array.from(galleryItems).map(item => item.dataset.kmImage);

    if (lightbox && galleryItems.length > 0) {
        const lightboxImg = lightbox.querySelector('.lightbox-content');
        const closeBtn = lightbox.querySelector('.close-btn');
        const prevBtn = lightbox.querySelector('.prev-btn');
        const nextBtn = lightbox.querySelector('.next-btn');

        const showImage = (index) => {
            if (index < 0 || index >= imageSources.length) return;
            const imagePath = window.location.pathname.includes('/ueber-uns/') ? `../${imageSources[index]}` : imageSources[index];
            lightboxImg.src = imagePath;
            const originalImg = Array.from(galleryItems).find(item => item.dataset.kmImage === imageSources[index]);
            lightboxImg.alt = originalImg ? originalImg.alt : 'Galeriebild';
            currentImageIndex = index;
        };

        const openLightbox = (index) => {
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('show'), 10);
            document.body.classList.add('no-scroll');
            document.addEventListener('keydown', handleKeydown);
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
                lightboxImg.src = '';
            }, 300);
            document.body.classList.remove('no-scroll');
            document.removeEventListener('keydown', handleKeydown);
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        prevBtn.addEventListener('click', () => showImage(currentImageIndex - 1));
        nextBtn.addEventListener('click', () => showImage(currentImageIndex + 1));

        const handleKeydown = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentImageIndex + 1);
        };
    }

    // --- Sticky CTA Bar --- //
    const stickyCtaBar = document.querySelector('.sticky-cta-bar');
    if (stickyCtaBar) {
        const showCtaThreshold = 300;
        window.addEventListener('scroll', () => {
            if (window.scrollY > showCtaThreshold) {
                stickyCtaBar.classList.add('show');
            } else {
                stickyCtaBar.classList.remove('show');
            }
        });
    }

    // --- Contact Form --- //
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedbackEl = document.getElementById('form-feedback');
            feedbackEl.style.display = 'block';
            feedbackEl.textContent = 'Vielen Dank! Ihre Nachricht wird bearbeitet. (Dies ist eine Demo)';
            feedbackEl.style.color = 'var(--color-accent)';
            contactForm.reset();
            setTimeout(() => { feedbackEl.style.display = 'none'; }, 5000);
        });
    }
});