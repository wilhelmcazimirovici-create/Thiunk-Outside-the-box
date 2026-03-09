import './style.css';
import { translations } from './i18n';

// --- i18n Logic ---
let currentLang = 'ro';

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      // Check if it's a placeholder attribute
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.placeholder = translations[currentLang][key];
      } else {
        el.textContent = translations[currentLang][key];
      }
    }
  });
  
  // Update document language
  document.documentElement.lang = currentLang;
}

// Ensure elements exist before adding listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize translations
  updateTranslations();

  // Language Toggle
  const langToggleBtns = document.querySelectorAll('.lang-btn');
  langToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      langToggleBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentLang = e.target.dataset.lang;
      updateTranslations();
    });
  });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const desktopNav = document.querySelector('.desktop-nav');
  if (menuToggle && desktopNav) {
    menuToggle.addEventListener('click', () => {
      desktopNav.classList.toggle('active');
    });

    // Close menu when clicking a link
    desktopNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        desktopNav.classList.remove('active');
      });
    });
  }

  // --- Smooth Scroll Logic ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Navbar Scroll Effect ---
  const header = document.querySelector('header');
  if(header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Popup Logic ---
  const popupOverlay = document.getElementById('legalPopup');
  const popupTitle = document.getElementById('popupTitle');
  const popupContent = document.getElementById('popupContent');
  const closePopupBtn = document.getElementById('closePopupBtn');

  document.querySelectorAll('.legal-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const type = e.target.dataset.type; // 'terms' | 'gdpr'
      
      if(popupOverlay && popupTitle && popupContent) {
        popupTitle.textContent = translations[currentLang][`${type}.title`];
        popupContent.textContent = translations[currentLang][`${type}.content`];
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling
      }
    });
  });

  if(closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      popupOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if(popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
      if(e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Menu Popup Logic ---
  const menuPopup = document.getElementById('menuPopup');
  const closeMenuBtn = document.querySelector('.close-menu-popup');

  document.querySelectorAll('.open-menu-popup').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (menuPopup) {
        menuPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      menuPopup.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (menuPopup) {
    menuPopup.addEventListener('click', (e) => {
      if (e.target === menuPopup) {
        menuPopup.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Reset mobile menu styles on window resize
  window.addEventListener('resize', () => {
     if(window.innerWidth > 768 && desktopNav) {
       desktopNav.style.display = 'block';
       desktopNav.style.position = 'static';
       desktopNav.style.background = 'none';
       desktopNav.style.padding = '0';
       
       const ul = desktopNav.querySelector('ul');
       if(ul) {
         ul.style.flexDirection = 'row';
         ul.style.gap = '2rem';
       }
     } else if(desktopNav) {
       desktopNav.style.display = 'none';
     }
  });

  // --- FAQ Accordion Logic ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isActive = question.classList.contains('active');
      
      // Close all other accordions
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        if(q.nextElementSibling) {
           q.nextElementSibling.style.maxHeight = null;
        }
      });
      
      // Toggle current accordion
      if (!isActive) {
        question.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('section, .glass-panel, .gallery-item, .testimonial-card');
  
  revealElements.forEach(el => {
    if (!el.classList.contains('main-header') && !el.classList.contains('hero-section')) {
      el.classList.add('reveal');
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // --- Gallery Infinite Carousel (duplicate items) ---
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    const items = galleryTrack.innerHTML;
    galleryTrack.innerHTML = items + items; // Duplicate for seamless loop
  }

  // --- Gallery Lightbox ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  // --- Dynamic Footer Year ---
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Horoscope API Logic ---
  const horoscopeText = document.getElementById('horoscopeText');
  const signSelect = document.getElementById('signSelect');

  async function fetchHoroscope(sign) {
    if (!horoscopeText) return;
    horoscopeText.textContent = translations[currentLang]['horoscope.fetching'];
    horoscopeText.classList.add('loading');

    try {
      const url = `https://ohmanda.com/api/horoscope/${sign}`;
      // Use standard allorigins proxy to bypass CORS
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      const horoscopeData = JSON.parse(data.contents);
      horoscopeText.textContent = horoscopeData.horoscope || translations[currentLang]['horoscope.error'];
      horoscopeText.classList.remove('loading');
    } catch (err) {
      horoscopeText.textContent = translations[currentLang]['horoscope.error'];
      horoscopeText.classList.remove('loading');
    }
  }

  if (signSelect) {
    signSelect.addEventListener('change', () => {
      const sign = signSelect.value;
      if (sign) fetchHoroscope(sign);
    });
  }

  // --- i18n-html support (for footer credit with link) ---
  function updateHtmlTranslations() {
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (translations[currentLang][key]) {
        el.innerHTML = translations[currentLang][key];
      }
    });
  }
  updateHtmlTranslations();

  // Extend language toggle to also update HTML translations
  const origUpdateTranslations = updateTranslations;
  // Patch: call html translations after text translations
  const langBtns2 = document.querySelectorAll('.lang-btn');
  langBtns2.forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(updateHtmlTranslations, 10);
    });
  });
});
