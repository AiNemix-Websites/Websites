document.addEventListener('DOMContentLoaded', function() {

  // --- 1. STICKY HEADER --- //
  const header = document.getElementById('site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- 2. MOBILE NAVIGATION --- //
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const mainMenu = document.getElementById('main-menu');
  if (navToggle && mainMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      mainMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }

  // --- 3. SCROLL REVEAL ANIMATION --- //
  const revealElements = document.querySelectorAll('.scroll-reveal, .text-reveal');
  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealElements.forEach(el => observer.observe(el));
  }

  // --- 4. TESTIMONIAL CAROUSEL --- //
  const carousel = document.getElementById('testimonial-carousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.testimonial-slide');
    const nextBtn = document.querySelector('.carousel-controls .next');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;

    const goToSlide = (index) => {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      currentIndex = index;
    };

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    const dots = dotsContainer.querySelectorAll('button');

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

  // --- 5. SERVICE FINDER WIZARD --- //
  const wizard = document.getElementById('service-finder-wizard');
  if (wizard) {
    const steps = wizard.querySelectorAll('.step');
    const resultContainer = document.getElementById('service-finder-result');
    const resultText = resultContainer.querySelector('p');
    const resultCta = resultContainer.querySelector('a');
    let selections = {};

    const optionsMap = {
        bad: [{label:'Komplett-Badsanierung',value:'badsanierung'},{label:'Barrierefreies Bad',value:'barrierefrei'},{label:'Teilrenovierung',value:'teilrenovierung'}],
        heizung: [{label:'Heizungscheck / Wartung',value:'heizung_wartung'},{label:'Neue Heizung / Modernisierung',value:'heizung_neu'},{label:'Solaranlage',value:'solaranlage'}],
        sanitaer_problem: [{label:'Wasserhahn tropft',value:'tropfender_hahn'},{label:'Abfluss verstopft',value:'abfluss_verstopft'},{label:'Leckage / Wasserschaden',value:'leckage'}],
        haustechnik_frage: [{label:'Regenwassernutzung',value:'regenwassernutzung'},{label:'Wasserführender Kaminofen',value:'kaminofen'},{label:'Allgemeine Beratung',value:'beratung'}]
    };

    const results = {
        badsanierung: {text:'Für Ihre Badsanierung bieten wir Ihnen eine umfassende Planung und Koordination aller Gewerke.',cta:{label:'Bad-Beratung starten',href:'kontakt/'}},
        barrierefrei: {text:'Ein barrierefreies Bad schafft Komfort und Sicherheit für alle Lebensphasen. Wir planen und realisieren Ihr zugängliches Wohlfühlbad.',cta:{label:'Beratung für Barrierefreiheit',href:'kontakt/'}},
        teilrenovierung: {text:'Sie möchten Ihr Bad teilweise erneuern? Wir unterstützen Sie bei der Modernisierung einzelner Bereiche oder Komponenten.',cta:{label:'Angebot für Teilsanierung',href:'kontakt/'}},
        heizung_wartung: {text:'Regelmäßige Heizungswartung sichert Effizienz und Langlebigkeit. Buchen Sie jetzt Ihren Heizungscheck.',cta:{label:'Wartungstermin vereinbaren',href:'kontakt/'}},
        heizung_neu: {text:'Eine neue Heizung spart Energie. Wir beraten Sie zu modernen, effizienten Systemen, die perfekt zu Ihnen passen.',cta:{label:'Heizungsberatung anfragen',href:'kontakt/'}},
        solaranlage: {text:'Nutzen Sie die Kraft der Sonne. Solaranlagen sind eine nachhaltige und kostensparende Ergänzung.',cta:{label:'Solaranlagen-Beratung',href:'kontakt/'}},
        tropfender_hahn: {text:'Ein tropfender Wasserhahn? Wir beheben kleine und große Sanitärprobleme schnell und zuverlässig.',cta:{label:'Sanitär-Service anfordern',href:'kontakt/'}},
        abfluss_verstopft: {text:'Ein verstopfter Abfluss ist ärgerlich. Wir kümmern uns um die professionelle Reinigung.',cta:{label:'Abflussreinigung buchen',href:'kontakt/'}},
        leckage: {text:'Bei Leckagen oder Wasserschäden ist schnelles Handeln gefragt. Wir lokalisieren die Ursache und führen Reparaturen durch.',cta:{label:'Notfall-Service kontaktieren',href:'kontakt/'}},
        regenwassernutzung: {text:'Regenwassernutzung ist ökologisch und ökonomisch sinnvoll. Wir beraten Sie zu passenden Systemen.',cta:{label:'Beratung Regenwassernutzung',href:'kontakt/'}},
        kaminofen: {text:'Ein wasserführender Kaminofen schafft gemütliche Wärme und unterstützt Ihre Heizung.',cta:{label:'Kaminofen-Beratung',href:'kontakt/'}},
        beratung: {text:'Sie haben eine allgemeine Frage zu Sanitär, Heizung oder Haustechnik? Wir stehen Ihnen mit unserer Expertise gerne zur Seite.',cta:{label:'Jetzt beraten lassen',href:'kontakt/'}}
    };

    wizard.addEventListener('click', function(e) {
      if (e.target.tagName === 'BUTTON') {
        const stepEl = e.target.closest('.step');
        const currentStep = parseInt(stepEl.dataset.step, 10);
        const value = e.target.dataset.value;
        selections[`step${currentStep}`] = value;

        if (currentStep === 0) {
          const nextStepOptions = optionsMap[value];
          const nextStepEl = steps[1];
          const optionsContainer = nextStepEl.querySelector('.options');
          optionsContainer.innerHTML = '';
          nextStepOptions.forEach(opt => {
            const btn = document.createElement('button');
            btn.dataset.value = opt.value;
            btn.textContent = opt.label;
            optionsContainer.appendChild(btn);
          });
          stepEl.style.display = 'none';
          nextStepEl.style.display = 'block';
        } else if (currentStep === 1) {
          const result = results[value];
          resultText.textContent = result.text;
          resultCta.textContent = result.cta.label;
          resultCta.href = result.cta.href;
          stepEl.style.display = 'none';
          resultContainer.style.display = 'block';
        }
      }
    });
  }

  // --- 6. COOKIE BANNER --- //
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (cookieBanner && !localStorage.getItem('cookieConsent')) {
    cookieBanner.hidden = false;
    setTimeout(() => cookieBanner.classList.add('show'), 100);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
    });
  }

  // --- 7. GLOBAL LIGHTBOX --- //
  const lightbox = document.getElementById('km-lightbox');
  if (lightbox) {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.km-lightbox-close');
    const prevBtn = lightbox.querySelector('.km-lightbox-prev');
    const nextBtn = lightbox.querySelector('.km-lightbox-next');
    let currentIndex = 0;

    const showImage = (index) => {
        const item = galleryItems[index];
        const imageSrc = item.href;
        const imageAlt = item.querySelector('img').alt;
        lightboxImg.src = imageSrc;
        lightboxImg.alt = imageAlt;
        currentIndex = index;
        prevBtn.hidden = index === 0;
        nextBtn.hidden = index === galleryItems.length - 1;
    };

    const openLightbox = (e) => {
      e.preventDefault();
      const itemIndex = galleryItems.indexOf(e.currentTarget);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      showImage(itemIndex);
      closeBtn.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    };

    galleryItems.forEach(item => item.addEventListener('click', openLightbox));

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.querySelector('.km-lightbox-backdrop').addEventListener('click', closeLightbox);

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) showImage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.hidden) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
        if (e.key === 'ArrowRight' && currentIndex < galleryItems.length - 1) showImage(currentIndex + 1);
      }
    });
  }

  // --- 8. STICKY CTA --- //
  const stickyCTA = document.getElementById('sticky-cta');
  if (stickyCTA) {
      const ctaFooter = document.querySelector('.cta-footer');
      const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
              stickyCTA.classList.remove('show');
          } else if (window.scrollY > 400) {
              stickyCTA.classList.add('show');
          }
      }, { threshold: 0.1 });

      if (ctaFooter) {
          observer.observe(ctaFooter);
      }
      
      window.addEventListener('scroll', () => {
          if (!ctaFooter && window.scrollY > 400) {
              stickyCTA.classList.add('show');
          } else if (!ctaFooter && window.scrollY <= 400) {
              stickyCTA.classList.remove('show');
          }
      }, { passive: true });
  }

});