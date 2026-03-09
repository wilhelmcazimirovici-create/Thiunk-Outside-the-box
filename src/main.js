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
  const revealElements = document.querySelectorAll('section, .glass-panel, .testimonial-card');
  
  revealElements.forEach(el => {
    if (!el.classList.contains('main-header') && !el.classList.contains('hero-section') && !el.closest('.gallery-track')) {
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

  // Inlocuim API-ul care nu mai functioneaza cu generare algoritmica offline pentru a garanta functionalitatea pe toate platformele fara probleme de CORS.
  const horoscopePredictions = {
    ro: [
      "Astăzi este o zi excelentă pentru a lua decizii îndrăznețe. Norocul îți surâde la prima ceașcă de cafea!",
      "Astrele indică o surpriză plăcută în a doua parte a zilei. Fii deschis la noutăți.",
      "O persoană dragă îți va da o veste excelentă. Răsfață-te cu o prăjitură alături de cafea.",
      "Creativitatea ta este la cote maxime astăzi. Gândește dincolo de tipare!",
      "Nu lăsa stresul să te copleșească. Ia o pauză binemeritată și bucură-te de aroma cafelei tale preferate.",
      "O întâlnire neașteptată s-ar putea lăsa cu o oportunitate fantastică de carieră.",
      "Finanțele tale primesc un impuls favorabil azi. Este timpul să pui acel plan în acțiune.",
      "Ai o aură plină de energie pozitivă. Orice proiect începi astăzi va avea un succes remarcabil.",
      "Bucură-te de lucrurile mărunte. Călătoria este la fel de importantă ca destinația.",
      "Curajul tău va fi răsplătit în curând. Păstrează-ți încrederea și mergi mai departe.",
      "Răbdarea ta de azi se va transforma într-o mare reușită mâine.",
      "O zi perfectă pentru a petrece timp cu cei care îți aduc bucurie. Savurați un moment frumos împreună."
    ],
    en: [
      "Today is an excellent day to make bold decisions. Luck smiles at you with your first cup of coffee!",
      "The stars indicate a pleasant surprise in the second half of the day. Be open to new things.",
      "A loved one will give you excellent news. Treat yourself to a pastry with your coffee.",
      "Your creativity is at an all-time high today. Think outside the box!",
      "Don't let stress overwhelm you. Take a well-deserved break and enjoy the aroma of your favorite coffee.",
      "An unexpected meeting could turn into a fantastic career opportunity.",
      "Your finances are getting a favorable boost today. It's time to put that plan into action.",
      "You have an aura full of positive energy. Every project you start today will be remarkably successful.",
      "Enjoy the little things. The journey is just as important as the destination.",
      "Your courage will be rewarded soon. Keep your confidence and keep moving forward.",
      "Your patience today will turn into a great success tomorrow.",
      "A perfect day to spend time with those who bring you joy. Savor a beautiful moment together."
    ]
  };

  async function fetchHoroscope(sign) {
    if (!horoscopeText) return;
    horoscopeText.textContent = translations[currentLang]['horoscope.fetching'];
    horoscopeText.classList.add('loading');

    setTimeout(() => {
      try {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        
        // Sum the char codes of the date string and sign to get a consistent pseudo-random index for the day
        const seed = Array.from(dateString + sign).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Define the 5 categories we want to display
        const categories = ['general', 'love', 'career', 'friends', 'health'];
        
        let htmlContent = `<div class="horoscope-grid">`;
        
        categories.forEach((cat, index) => {
          // Unique seed per category by multiplying the base seed by (index + 1)
          const catSeed = seed * (index + 1);
          const langArray = horoscopePredictions[currentLang] || horoscopePredictions['ro'];
          const prediction = langArray[catSeed % langArray.length];
          const catName = translations[currentLang][`horoscope.cat.${cat}`];
          const catIcon = translations[currentLang][`horoscope.icon.${cat}`];
          
          htmlContent += `
            <div class="horoscope-card">
              <div class="horo-card-header">
                <span class="horo-icon">${catIcon}</span>
                <h4 class="horo-title">${catName}</h4>
              </div>
              <p class="horo-desc">${prediction}</p>
            </div>
          `;
        });
        htmlContent += `</div>`;
        
        horoscopeText.innerHTML = htmlContent;
      } catch (err) {
        horoscopeText.innerHTML = `<p>${translations[currentLang]['horoscope.error']}</p>`;
      }
      horoscopeText.classList.remove('loading');
    }, 600); // Simulate brief loading
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
