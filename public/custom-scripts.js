gsap.registerPlugin(ScrollTrigger,ScrollToPlugin);

// ========================================

if (window.innerWidth > 991) {
    const excludedPages = [
      '/confirmation-page',
      '/free-estimate',
      '/la-movers',
      '/torrance-movers',
      '/movers-downtown-los-angeles',
      '/long-beach-movers',
      '/santa-clarita-movers',
      '/los-angeles-movers/pasadena-movers',
      '/corona-movers',
      '/hollywoodland-movers',
      '/huntington-beach-movers',
      '/south-bay-movers',
      '/irvine-movers',
      '/los-angeles-movers/santa-monica-movers',
      '/movers-garden-grove',
      '/culver-city-movers',
      '/denver-movers',
      '/claremont-movers',
      '/van-nuys-movers',
      '/studio-city-movers',
      '/orange-county-movers',
      '/placentia-movers',
      '/los-angeles-movers/west-hollywood-movers',
      '/movers-westminster',
      '/marina-del-rey-movers',
      '/fountain-valley-movers',
      '/costa-mesa-movers',
      '/chino-hills-movers',
      '/santa-ana-movers',
      '/los-angeles-movers/glendale-movers',
      '/brea-movers',
      '/tujunga-movers',
      '/simi-valley-movers',
      '/yorba-linda-movers',
      '/beverly-hills-movers',
      '/azusa-movers',
      '/north-hollywood-movers',
      '/anaheim-movers',
      '/eastvale-movers',
      '/newport-beach-movers',
      '/movers-fullerton',
      '/san-fernando-valley-movers',
      '/movers-buena-park',
      '/commerce-movers',
      '/aliso-viejo-movers',
      '/la-crescenta-movers',
      '/san-gabriel-movers',
      '/el-segundo-movers',
      '/movers-hermosa-beach',
      '/alhambra-movers',
      '/covina-movers',
      '/west-covina-movers',
      '/movers-glendora',
      '/montebello-movers',
      '/los-angeles-movers/calabasas-movers',
      '/manhattan-beach-movers',
      '/redondo-beach-movers',
      '/altadena-movers',
      '/malibu-movers',
      '/norwalk-movers',
      '/venice-movers',
      '/chatsworth-movers',
      '/tustin-movers',
      '/canoga-park-movers',
      '/sherman-oaks-movers',
      '/rancho-palos-verdes-movers',
      '/cerritos-movers',
      '/monrovia-movers',
      '/northridge-movers',
      '/la-mirada-movers',
      '/inglewood-movers',
      '/woodland-hills-movers',
      '/carson-movers',
      '/west-los-angeles-movers',
      '/los-feliz-movers',
      '/san-pedro-movers',
      '/movers-highland-park',
      '/el-monte-movers',
      '/movers-hollywood',
      '/los-angeles-movers/burbank-movers',
      '/baldwin-park-movers',
      '/lakewood-movers',
      '/panorama-city-movers',
      '/la-habra-movers',
      '/pomona-movers',
      '/whittier-movers',
      '/la-puente-movers',
      '/reseda-movers',
      '/hawthorne-movers',
      '/movers-pico-rivera',
      '/compton-movers',
      '/downey-movers',
      '/services/packing-services',
      '/services/long-distance-movers'
    ];

    if (!excludedPages.includes(window.location.pathname)) {
      // Загружаем chatbot с задержкой 3 секунды или при первом взаимодействии
      let chatbotLoaded = false;

      function loadChatbot() {
        if (chatbotLoaded) return;
        chatbotLoaded = true;

        (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="Jtjw5-cqniYYU2cG-3yVo";script.domain="www.chatbase.co";document.body.appendChild(script)};onLoad()})();
      }

      // Загрузка через 3 секунды после загрузки страницы
      window.addEventListener('load', function() {
        setTimeout(loadChatbot, 3000);
      });

      // ИЛИ при первом взаимодействии (что произойдет первым)
      ['click', 'scroll', 'touchstart'].forEach(function(event) {
        document.addEventListener(event, loadChatbot, {once: true, passive: true});
      });
    }
  }

// ========================================

// 1. Функция для загрузки одного скрипта (возвращает Promise)
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve; // Успех
      script.onerror = reject; // Ошибка
      document.body.appendChild(script); // Добавляем в body
    });
  }

  // 2. Функция для загрузки одного CSS
  function loadStyle(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  // 3. Асинхронная функция для загрузки ВСЕГО по порядку
  async function loadResources() {
    try {
      // --- СНАЧАЛА ГРУЗИМ СТИЛИ ---
      // Они могут грузиться параллельно
      loadStyle("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css");
      loadStyle("https://cdnjs.cloudflare.com/ajax/libs/datepicker/1.0.10/datepicker.min.css");
      loadStyle("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css");
      loadStyle("assets/libs/jsdelivr/gh/Evgeny2723/sos-moving@552da70/style.css");

      // --- ТЕПЕРЬ ГРУЗИМ СКРИПТЫ ПО ПОРЯДКУ ---

      // ШАГ 1: Ждем загрузки jQuery
      await loadScript("https://code.jquery.com/jquery-3.7.1.min.js");
      console.log("jQuery загружен.");

      // ШАГ 2: Ждем загрузки ВСЕХ ПЛАГИНОВ
      // Они могут грузиться одновременно, т.к. jQuery уже есть
      await Promise.all([
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/masonry/4.2.2/masonry.pkgd.min.js"),
        loadScript("assets/libs/jsdelivr/npm/@finsweet/attributes-scrolldisable@1/scrolldisable.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery.inputmask/5.0.8/jquery.inputmask.min.js"),
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/datepicker/1.0.10/datepicker.min.js"),
        loadScript("assets/libs/jsdelivr/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"),
      ]);
      console.log("Все плагины загружены.");

      // ШАГ 3: ТОЛЬКО ТЕПЕРЬ грузим ваш главный скрипт
      await loadScript("assets/libs/jsdelivr/gh/Evgeny2723/sos-moving@0ad49c3/script.js");
      console.log("Главный script.js загружен и выполнен.");

    } catch (error) {
      console.error("Критическая ошибка при загрузке скриптов:", error);
    }
  }

  // 4. Запускаем весь процесс после загрузки DOM
  window.addEventListener('DOMContentLoaded', () => {
    // Пассивные слушатели для INP (как у вас и было)
    window.addEventListener('touchstart', function() {}, {passive: true});
    window.addEventListener('wheel', function() {}, {passive: true});

    // Запускаем асинхронную загрузку
    loadResources();
  });

// ========================================

if (document.getElementById("exit-popup")) {
    if (window.location.pathname !== '/confirmation-page') {
      let hasShownPopup = false;
      const ONE_HOUR = 60 * 60 * 1000;
      const STORAGE_KEY = "exitPopupShownAt";
      function showPopup() {
        if (!hasShownPopup) {
          const popupElement = document.getElementById("exit-popup");
          if (popupElement) {
            popupElement.style.display = "flex";
          }
          hasShownPopup = true;
          localStorage.setItem(STORAGE_KEY, Date.now());
          document.removeEventListener("mouseleave", handleMouseLeave);
        }
      }
      function shouldShowPopupAgain() {
        const lastShown = localStorage.getItem(STORAGE_KEY);
        if (!lastShown) return true;
        const now = Date.now();
        return now - parseInt(lastShown, 10) > ONE_HOUR;
      }
      function isMobileOrTablet() {
        const isTouchDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 991;
        return isTouchDevice || isSmallScreen;
      }
      function isFromCPC() {
        const params = new URLSearchParams(window.location.search);
        return params.get('utm_medium') === 'cpc' || params.has('gclid');
      }
      const handleMouseLeave = (e) => {
        if (e.clientY < 10) {
          showPopup();
        }
      };
      if (shouldShowPopupAgain()) {
        const isMobile = isMobileOrTablet();
        const fromCPC = isFromCPC();
        if (isMobile && fromCPC) {
          // Do nothing for mobile CPC users
        } else if (isMobile) {
          setTimeout(showPopup, 45000);
        } else {
          setTimeout(function() {
            document.addEventListener("mouseleave", handleMouseLeave);
          }, 20000);
        }
      }
      const closeButton = document.getElementById("close-popup");
      if (closeButton) {
        closeButton.addEventListener("click", function () {
          document.getElementById("exit-popup").style.display = "none";
        });
      }
    }
  }

// ========================================

document.addEventListener('DOMContentLoaded', function() {
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(event) {
        var formIsValid = true;
        var requiredInputs = form.querySelectorAll('[required]');
        requiredInputs.forEach(function(input) {
          if (input.value.trim() === '') {
            formIsValid = false;
          }
        });
        if (!formIsValid) {
          event.preventDefault();
          event.stopImmediatePropagation();
          var firstEmptyInput = form.querySelector('[required]:invalid');
          if(firstEmptyInput) {
            firstEmptyInput.reportValidity();
          }
          return false;
        }
      });
    });
  });

// ========================================

// Ждем, пока загрузится вся страница
window.addEventListener("load", function() {

  // Регистрируем плагин ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Задаем начальное состояние для touchbar (прячем его внизу)
  gsap.set(".touchbar", { y: '100%' });

  // Создаем временную шкалу (timeline) для синхронизации анимаций
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",         // Элемент-триггер
      start: "bottom center",           // Анимация начнется, когда низ .hero-section достигнет центра экрана
      toggleActions: "play none none reverse" // Проиграть при скролле вниз, обратить при скролле вверх
    }
  });

  // Добавляем анимации на временную шкалу
  tl.to(".touchbar", { 
    y: '0%',                     // Двигаем touchbar в видимую область
    duration: 0.5,               // Длительность анимации 0.5с
    ease: 'power2.out'
  })
  .to(".navbar", {
    y: '-100%',                  // Двигаем navbar вверх за пределы экрана
    duration: 0.5,
    ease: 'power2.out'
  }, "<"); // "<" означает, что эта анимация начнется ОДНОВРЕМЕННО с предыдущей

});