document.addEventListener('DOMContentLoaded', function() {

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
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Scroll Reveal Animation --- //
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Cookie Banner --- //
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        // Need to inject content because it's shared across pages
        const bannerContent = `
            <div class='container cookie-banner-content'>
                <p>Wir verwenden Cookies, um die beste Erfahrung auf unserer Website zu gewährleisten. <a href='datenschutz/'>Mehr erfahren</a></p>
                <div class='cookie-banner-actions'>
                    <button id='cookie-accept' class='btn btn-primary'>Akzeptieren</button>
                    <button id='cookie-decline' class='btn btn-secondary'>Ablehnen</button>
                </div>
            </div>`;
        cookieBanner.innerHTML = bannerContent;
        cookieBanner.classList.add('show');

        document.getElementById('cookie-accept').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.classList.remove('show');
        });

        document.getElementById('cookie-decline').addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Global Lightbox --- //
    const lightbox = document.getElementById('km-lightbox');
    const galleryImages = Array.from(document.querySelectorAll('.gallery-image'));
    let currentImageIndex = 0;

    if (lightbox && galleryImages.length > 0) {
        const lightboxImage = lightbox.querySelector('.km-lightbox-image');
        const closeBtn = lightbox.querySelector('.km-lightbox-close');
        const prevBtn = lightbox.querySelector('.km-lightbox-prev');
        const nextBtn = lightbox.querySelector('.km-lightbox-next');

        function showImage(index) {
            const imgElement = galleryImages[index];
            const imgSrc = imgElement.getAttribute('data-km-image');
            const imgAlt = imgElement.getAttribute('alt');
            
            // Correct path for subpages
            const pathPrefix = window.location.pathname.includes('/impressum/') || window.location.pathname.includes('/datenschutz/') || window.location.pathname.includes('/kontakt/') || window.location.pathname.includes('/faq/') || window.location.pathname.includes('/ueber-uns/') || window.location.pathname.includes('/leistungen/') ? '../' : '';

            lightboxImage.setAttribute('src', pathPrefix + imgSrc);
            lightboxImage.setAttribute('alt', imgAlt);
            currentImageIndex = index;
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.style.display = 'flex';
            setTimeout(() => lightbox.classList.add('active'), 10);
            document.body.classList.add('no-scroll');
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.style.display = 'none', 300);
            document.body.classList.remove('no-scroll');
        }

        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => openLightbox(index));
        });

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        prevBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = (currentImageIndex + 1) % galleryImages.length;
            showImage(newIndex);
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // --- Sticky CTA Bar --- //
    const stickyCtaBar = document.getElementById('sticky-cta-bar');
    if (stickyCtaBar) {
        // Inject content for subpages
        if (window.location.pathname !== '/') {
            const pathPrefix = '../';
            stickyCtaBar.innerHTML = `
            <div class='container sticky-cta-container'>
                <p>Dringendes Problem? Wir helfen schnell.</p>
                <a href='tel:01759050026' class='btn btn-primary'>Jetzt anrufen</a>
            </div>`;
        }

        const showCtaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show when hero is NOT intersecting
                if (!entry.isIntersecting) {
                    stickyCtaBar.classList.add('visible');
                } else {
                    stickyCtaBar.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            showCtaObserver.observe(heroSection);
        }
    }
});