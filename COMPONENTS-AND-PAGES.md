# SOS Moving — Компоненты и страницы

## Оглавление

1. [Вступление: два стека](#вступление-два-стека)
2. [Секция 1. Инвентарь всех компонентов](#секция-1-инвентарь-всех-компонентов)
   - [1.1 Общая «рама» сайта (Shared frame)](#11-общая-рама-сайта-shared-frame)
   - [1.2 Webflow-секции — 20 компонентов `SectionX`](#12-webflow-секции--20-компонентов-sectionx)
   - [1.3 Стек `mainpage2` (новый дизайн)](#13-стек-mainpage2-новый-дизайн)
   - [1.4 Утилитарные и неиспользуемые компоненты](#14-утилитарные-и-неиспользуемые-компоненты)
3. [Секция 2. Типы страниц и их количество](#секция-2-типы-страниц-и-их-количество)

---

## Вступление: два стека

В проекте сосуществуют **два совершенно разных UI-стека**, и их нельзя путать.

1. **Webflow-legacy (группа роутов `src/app/(webflow)/`).** Это реальный «живой» сайт. Почти все страницы — это HTML-исходники из `public/pages/*.html`, которые на билде режутся на «секции» (по первому div/section первого уровня) и рендерятся через `src/components/sections/Section*.tsx`. Каждый компонент — фактически тонкая обёртка над `<div>/<section>` с нужным Webflow-классом и `dangerouslySetInnerHTML` внутри. Общая рама (navbar, footer, exit-popup, callback-widget) встраивается через `SharedHtmlBlock` и тянет сырой HTML из `src/data/shared/*.html`. Вёрстка работает за счёт импорта `public/webflow.css` и подгрузки Webflow IX2 скриптов через `ScriptLoader`.

2. **Новый дизайн (группа роутов `src/app/(new-design)/`).** Используется только для `/mainpage2`. Это «нормальный» React+Tailwind+Framer Motion, с собственным `layout.tsx`, собственными `Navbar`/`Footer`, собственным набором секций в `src/components/mainpage2/sections/*.tsx` и собственным UI-китом в `src/components/mainpage2/ui/*.tsx`. Никакого Webflow-HTML, никакого webflow.css — полностью изолированный стек.

Итого: всё, что в `src/components/sections/` и `src/components/shared/` — это Webflow-мир. Всё, что в `src/components/mainpage2/` — это новый мир. Дополнительно есть папка «полузаброшенных» компонентов (`src/components/layout/`, `src/components/ui/`, `src/components/blog/`, `src/components/forms/`), частично использующихся только на странице `/category/[slug]` — описаны отдельно.

---

## Секция 1. Инвентарь всех компонентов

### 1.1 Общая «рама» сайта (Shared frame)

Рендерится из `src/app/(webflow)/layout.tsx` на **каждой** странице Webflow-группы. Компонент один — `SharedHtmlBlock`, параметризируется именем блока:

| Компонент / источник | Что это | Меняется между страницами? | Страниц | Типы страниц |
| --- | --- | --- | ---: | --- |
| `SharedHtmlBlock name="navbar"` (`src/components/shared/SharedHtmlBlock.tsx` + `src/data/shared/navbar.html`) | Верхняя шапка сайта: логотип, меню Services/Locations/Company, телефон, кнопка «Free Estimate». Это сырой HTML из Webflow, рендерится через `dangerouslySetInnerHTML`. | Нет. Полностью одинаковый HTML на всех страницах. Активный пункт меню подсвечивается JS-ом Webflow по `data-wf-page`. | 536 (вся `(webflow)`-группа) | Все типы Webflow-страниц |
| `SharedHtmlBlock name="footer"` (+ `src/data/shared/footer.html`) | Подвал сайта: ссылки Quick Links / Services / Locations, адреса офисов, соцсети, копирайт. | Нет. Один и тот же футер везде. | 536 | Все типы Webflow-страниц |
| `SharedHtmlBlock name="exit-popup"` (+ `src/data/shared/exit-popup.html`) | Всплывающее окно «не уходи, получи скидку» при попытке закрыть вкладку / отведении курсора. Скрыто до срабатывания триггеров Webflow-скрипта. | Нет. | 536 | Все типы Webflow-страниц |
| Callback-widget (`src/data/shared/callback-widget.html`) | HTML-сниппет плавающей кнопки «заказать звонок». **Не** подключается через `SharedHtmlBlock` в текущем `layout.tsx` — файл присутствует в репозитории, но виджет сейчас фактически не вмонтирован в глобальный layout. | — | 0 (не подключён глобально) | — |
| `ScriptLoader` (`src/components/ScriptLoader.tsx`) | Клиентский компонент, который в нужном порядке подгружает jQuery, Webflow IX2, плагины слайдеров (Swiper и т.п.) и кастомные JS-файлы сайта. Без него большинство Webflow-анимаций и слайдеров не работают. | Нет. | 536 | Все типы Webflow-страниц |

**Отдельно:** `src/app/(new-design)/layout.tsx` **не** использует `SharedHtmlBlock`. У него свой `<SmoothScroll />` и собственные `Navbar`/`Footer` из `mainpage2/layout/` — см. раздел 1.3.

### 1.2 Webflow-секции — 20 компонентов `SectionX`

Все файлы лежат в `src/components/sections/`. Регистрируются в `src/components/sections/registry.tsx`: соответствие «первый CSS-класс блока → React-компонент». Все неизвестные классы падают в fallback `SharedSection` (прозрачная обёртка с `dangerouslySetInnerHTML`). Сейчас **все** 20 специализированных секций — это такие же тонкие обёртки вокруг `SharedSection`, просто с семантическими именами и комментариями о том, что именно они рендерят. «Настоящая» React-реализация с разбором HTML в данные пока не сделана (Phase 3).

Счётчики страниц — из `.tmp/sections-map.md` (скан 537 HTML-файлов в `public/pages/`).

| Компонент (файл) | Что это / что внутри | Меняется между страницами? | Страниц | Типы страниц |
| --- | --- | --- | ---: | --- |
| `SectionHero` (`SectionHero.tsx`) — классы `services-hero-section` (11 вариантов) и `hero-section` | Главный верхний hero-блок: заголовок, подзаголовок, фото/видео фон, рейтинг, CTA. 11 визуальных вариантов (блог-статья без фона, «with-rating mobile» для городов, «is-free-quote-page» для форм, «is-reviews-hero-section», «is-contact-section» и т.д.). | Да: заголовок, подзаголовок, hero-изображение/видео, CTA меняются на каждой странице; вариант класса меняется по типу страницы. | 534 (`services-hero-section` 532 + `hero-section` 2) | Почти все Webflow-страницы: Homepage, все Cities, About-us и его подстраницы, Blog, Blog posts, Services, Forms, Sitemap, Confirmation и др. |
| `SectionBottomCta` (`SectionBottomCta.tsx`) — `bottom-cta-section` | Большой финальный CTA над футером: заголовок «Ready to move?», подзаголовок, телефон и кнопка «Get a Free Quote». | Частично: текст заголовка иногда меняется под тематику страницы; шаблон идентичен. | 524 | Homepage, Cities, Services, About-us-sub, Blog posts, Forms, Moving-services, Confirmation (кроме `services__local-moving` и небольшого числа about-us подстраниц) |
| `SectionReviewsText` (`SectionReviewsText.tsx`) — `section-reviews is-have-slider` | Слайдер отзывов-текстов: карточки с аватаром клиента, именем, звёздами и цитатой. | Нет по факту (один и тот же набор отзывов везде, где он присутствует). | 130 | Homepage, Cities, About-us и часть подстраниц, Moving-services, Services listing, некоторые Services |
| `SectionReviewsRating` (`SectionReviewsRating.tsx`) — `reviews-section is-have-slider` | Слайдер логотипов Yelp/Google/Thumbtack/Angi c общим рейтингом и количеством отзывов. | Нет. | 127 | Homepage, Cities, About-us-sub, Moving-services, часть Services |
| `SectionWhySos` (`SectionWhySos.tsx`) — `why-sos-section` | Секция «Why SOS Moving»: 3–6 иконок с текстовыми буллетами + фото команды. | Почти нет — текст буллетов иногда слегка меняется на городских страницах. | 128 | Homepage, Cities, About-us и подстраницы, Moving-services, часть Services |
| `SectionServices` (`SectionServices.tsx`) — `services-section` | Сетка карточек услуг с иконками (Apartment / Commercial / Packing / White Glove / Storage / Local). | Обычно идентична; на некоторых сервис-страницах выделена текущая услуга. | 122 | Homepage, Cities, About-us-sub, Moving-services, некоторые Services |
| `SectionFaq` (`SectionFaq.tsx`) — `faq-section` (2 варианта: base, `is-mb-0`) | Аккордеон FAQ. | Да: вопросы/ответы свои на каждой странице. | 123 (121 div + 2 section) | Cities, Homepage, Moving-services, часть Services, пара About-us-sub |
| `SectionLatestNews` (`SectionLatestNews.tsx`) — `latest-news-section is-have-slider` (+вариант `is-mb-0`) | Слайдер «Latest Articles» — карточки последних постов блога. | Нет (один и тот же набор 6–12 постов). | 399 (397 + 2) | Все Blog posts, Homepage, Moving-services, пара Cities |
| `SectionServiceContent` (`SectionServiceContent.tsx`) — `service-content-section` (2 варианта: base, `is-mb-0`) | Большой текстово-графический контентный блок (заголовок, параграфы, изображение, список). На большинстве городских страниц встречается дважды подряд. | Да: заголовок, текст, картинка, списки уникальны для каждой страницы. | 242 | Cities (почти все), Services, About-us-sub |
| `SectionLocationsOffice` (`SectionLocationsOffice.tsx`) — `locations-office-section` | Сетка офисов/локаций с фото, адресом, телефоном, часами работы. | Да: список локаций может отличаться по городам. | 116 | Cities, «movers-*» (Other) |
| `SectionLocalWhiteContent` (`SectionLocalWhiteContent.tsx`) — `local-white-content-section` | Длинный SEO-текст на белом фоне про услуги переезда в конкретном городе. | Да: уникальный текст на каждой городской странице. | 115 | Cities, «movers-*» (Other) |
| `SectionLocationsSlider` (`SectionLocationsSlider.tsx`) — `locations-section is-have-slider` | Горизонтальный слайдер карточек городов/районов, куда ездят переезжать. | Нет. | 12 (11 + 1 у `los-angeles-movers`) | Homepage, Moving-services, About-us-sub, `los-angeles-movers`, `services__packing-services` |
| `SectionAboutCompany` (`SectionAboutCompany.tsx`) — `about-company-section` | Блок «About Company» с вертикальной прокруткой фото-коллажа и текстом. | Нет. | 2 | Homepage (`index`), Moving-services (`moving-services`) |
| `SectionContact` (`SectionContact.tsx`) — `contact-section is-footer-next` | Компактный CTA «Connect with us» перед футером (альтернатива Bottom-CTA) с формой/телефоном. | Нет. | 3 | About-us-sub: `apartment-partnership`, `influencer-program`, `referral` |
| `SectionServicesAreas` (`SectionServicesAreas.tsx`) — `services-areas` | Блок «Service Areas» — список/карта обслуживаемых регионов. | Нет. | 2 | Homepage, Sitemap |
| `SectionTeam` (`SectionTeam.tsx`) — `team-section` | Сетка карточек сотрудников «Meet Our Team». | — | 1 | About-us-sub: `meet-our-team` |
| `SectionJob` (`SectionJob.tsx`) — `job-section` | Список открытых вакансий на странице «Careers». | — | 1 | About-us-sub: `careers` |
| `SectionGalleryPhoto` (`SectionGalleryPhoto.tsx`) — `gallery-photo-section` | Мозаика из фотографий переездов. | — | 1 | About-us-sub: `gallery` |
| `SectionBlog` (`SectionBlog.tsx`) — `blog-section` | Листинг блога: карточки статей, пагинация (HTML-снимок из Webflow). | — | 1 | Blog index (`/blog`) |
| `SectionMisc` (`SectionMisc.tsx`) — один файл, 8 функций | Набор «одноразовых» секций: `SectionMilestones` (milestones на homepage), `SectionHeroForm` (`hero-form-section` на moving-services), `SectionContent` (contentful confirmation page), `SectionTouchbar` (`touchbar` на homepage), `SectionDelivery` (`delivery-section` на packing-services), `SectionPageWrapper` (особый `page-wrapper` local-moving), `SectionCodeEmbed` (`<div class="code w-embed">` — встроенные скрипты), `SectionWEmbed` (`<div class="w-embed w-iframe">` — iframe-встраивания). | Зависит от конкретной секции. | 535 (`SectionCodeEmbed`) + 139 (`SectionWEmbed`) + 1 у каждой из остальных | Homepage, Moving-services, Confirmation, Packing-services, Local-moving, плюс все страницы где встречаются `code`/`w-embed`-встраивания |
| `SharedSection` (`SharedSection.tsx`) — fallback | Прозрачная обёртка `<tag class={className}>` с `dangerouslySetInnerHTML`. Используется `SectionRenderer`-ом для любого блока, не попавшего ни в один из классов выше. | Да (что вставят — то и отрендерится). | n/a (fallback) | — |
| `SectionRenderer` (в `registry.tsx`) | Не секция, а роутер: принимает массив `ParsedSection[]` из `lib/render-page.ts` и по `s.type` (первому CSS-классу) выбирает нужный `SectionX`. | — | — | — |

### 1.3 Стек `mainpage2` (новый дизайн)

Полностью изолированный набор, используется **только** страницей `/mainpage2` (`src/app/(new-design)/mainpage2/page.tsx`). Никак не пересекается с Webflow-стеком. Реализован как честные React+Tailwind+Framer Motion компоненты. Описываю кратко — пользователь в курсе, что сейчас это одна страница.

**Layout (`src/components/mainpage2/layout/`)**

| Компонент | Что это |
| --- | --- |
| `Navbar.tsx` | Новая прилипающая шапка с анимацией появления, дропдаунами Services/Locations/Company, телефоном и CTA. |
| `Footer.tsx` | Новый футер с колонками ссылок и контактами. |

**Sections (`src/components/mainpage2/sections/` — 14 файлов)**

| Компонент | Что это (коротко) |
| --- | --- |
| `Hero.tsx` | Большой hero с заголовком, рейтингом, CTA и фоновым видео/изображением. |
| `MarqueeBand.tsx` | Бесконечная бегущая строка с логотипами/тезисами. |
| `BrandReveal.tsx` | Анимация проявления крупного бренд-лого/заявления. |
| `About.tsx` | Блок «о компании» с цифрами и фото. |
| `Services.tsx` | Сетка карточек услуг. |
| `BestMovers.tsx` | Блок «лучшие грузчики», с фичами/USP. |
| `WhySos.tsx` | «Why SOS» — причины выбрать компанию. |
| `Reviews.tsx` | Карусель отзывов. |
| `ServiceAreas.tsx` | Блок «куда мы ездим» — города/регионы. |
| `Gallery.tsx` | Фото-галерея. |
| `Faq.tsx` | Аккордеон FAQ. |
| `BottomCta.tsx` | Финальный CTA-блок перед футером. |
| `Press.tsx` | Блок «о нас пишут» / логотипы прессы. (Есть в папке, в текущем `page.tsx` не смонтирован.) |
| `Locations.tsx` | Расширенный блок локаций. (Есть в папке, в текущем `page.tsx` не смонтирован.) |

**UI-кит (`src/components/mainpage2/ui/` — 14 файлов)**

| Компонент | Что это |
| --- | --- |
| `Animate.tsx` | Обёртки Framer Motion для анимаций появления/параллакса. |
| `BankaiLink.tsx` | Стилизованная ссылка с hover-эффектом (подчёркивание/стрелка). |
| `Button.tsx` | Кнопка: варианты `primary`/`outline`/`ghost`, размеры `sm`/`md`/`lg`. |
| `Container.tsx` | Контейнер с max-width и padding. |
| `DotGrid.tsx` | Декоративная сетка точек для фонов. |
| `Globe.tsx` | Декоративный 3D-глобус / анимация. |
| `MagicCard.tsx` | Карточка с эффектом подсветки по курсору. |
| `RegionMap.tsx` | Интерактивная карта регионов обслуживания. |
| `RevealText.tsx` | Построчная/посимвольная анимация появления текста. |
| `Section.tsx` | Типовая `<section>`-обёртка с отступами и якорем. |
| `SectionHeading.tsx` | Типовой заголовок секции (ранг, стиль, eyebrow). |
| `SectionLabel.tsx` | Eyebrow-метка над заголовком. |
| `TechFrame.tsx` | Декоративная «техно-рамка» (уголки и т.п.). |
| `YouTubePlayer.tsx` | Ленивый плеер YouTube. |

**Прочее в `mainpage2/`**

| Компонент | Что это |
| --- | --- |
| `SmoothScroll.tsx` | Lenis / плавный скролл для всей новой страницы (подключается в `(new-design)/layout.tsx`). |
| `SchemaOrg.tsx` | JSON-LD structured data (LocalBusiness и т.п.) для SEO. |

Данные для всех `mainpage2`-секций лежат в `src/data/mainpage2/homepage.json`.

### 1.4 Утилитарные и неиспользуемые компоненты

В репозитории также есть ещё один набор файлов, которые **не** используются Webflow-роутингом и **не** имеют отношения к `mainpage2`. Это важно зафиксировать, чтобы не путать их с реально рендерящимися компонентами.

| Папка / компонент | Статус | Где используется |
| --- | --- | --- |
| `src/components/layout/Navbar.tsx`, `Footer.tsx` | Не импортируются ни в одном `page.tsx` / `layout.tsx`. Фактически мёртвый код (ранняя попытка сделать «нативные» шапку/футер для Webflow-страниц до того, как решили оставить встраивание HTML). | Нигде. |
| `src/components/sections/CtaSection.tsx`, `FaqSection.tsx`, `HeroSection.tsx`, `LatestNewsSection.tsx`, `ReviewsSection.tsx`, `AboutCompanySection.tsx`, `ServicesGridSection.tsx`, `ServicesHeroSection.tsx`, `ServiceContentSection.tsx`, `WhySosSection.tsx` | Параллельный «нативный» набор секций (без суффикса `Section…`-в начале, а именно вида `XxxSection`). Не регистрируются в `registry.tsx` и ни на одной странице не импортируются. Мёртвый код / ранний набросок Phase 3. | Нигде. |
| `src/components/ui/Container.tsx`, `Button.tsx`, `Accordion.tsx` | Шаред-утилиты Tailwind. Фактически используются только мёртвыми файлами выше и страницей категорий блога (`/category/[slug]`). `Container` также используется `BlogCard`/`Pagination`. | `src/app/(webflow)/category/[slug]/page.tsx` (живое), плюс цепочка мёртвых `*Section.tsx`. |
| `src/components/blog/BlogCard.tsx`, `Pagination.tsx` | Карточка статьи блога и пагинация на Tailwind. | `src/app/(webflow)/category/[slug]/page.tsx`. |
| `src/components/forms/QuoteForm.tsx` | Многошаговая форма «Get a Quote» на Tailwind. | Нигде не импортируется (формы на страницах `/free-estimate`, `/book-online` сейчас рендерятся из Webflow-HTML). |

Итого фактически активные компоненты Webflow-стека — это `SharedHtmlBlock`, `ScriptLoader` и 20 `SectionX` + `SharedSection`/`SectionRenderer`. Всё остальное в `src/components/` — либо `mainpage2`, либо заготовки.

---

## Секция 2. Типы страниц и их количество

Источники: 537 HTML-файлов в `public/pages/` (скан в `.tmp/sections-map.md`) + роуты в `src/app/(webflow)/**/page.tsx` и `src/app/(new-design)/mainpage2/page.tsx`. Типизация ниже сгруппирована по URL-паттернам. Для страниц, которые рендерятся из HTML-снимков, также указан соответствующий файл из `public/pages/`.

| # | Тип страницы | URL-паттерн | Количество | Что внутри (секции) |
| --- | --- | --- | ---: | --- |
| 1 | **Главная (Homepage)** | `/` (из `index.html`) | 1 | Полный набор: Hero → SectionReviewsText → SectionReviewsRating → ServicesAreas → WhySos → LocationsSlider → Services → «inside-gallery» hero → Milestones → LatestNews → FAQ → BottomCta (+ Touchbar, Code-embeds). |
| 2 | **Посадочные страницы городов (Cities / Locations)** | `/{city}-movers` — например `/alhambra-movers`, `/beverly-hills-movers`, `/seattle-movers` (роут `(cities)/[citySlug]`) | 107 (включая 6 вложенных `/los-angeles-movers/{subcity}-movers` и корневую `/los-angeles-movers`) | Типичная последовательность: Hero (`with-rating mobile` вариант) → ReviewsText → ServiceContent → LocalWhiteContent → LocationsOffice → ServiceContent (ещё раз) → Services → WhySos → ReviewsRating → FAQ → BottomCta. Контент (тексты, фото, списки локаций, FAQ) уникальный под каждый город. |
| 3 | **«Movers-{city}» (альт-паттерн)** | `/movers-{city}` — например `/movers-buena-park`, `/movers-hollywood` | 13 | В `.tmp/sections-map.md` отнесены к группе `other`. Секционно почти идентичны городским страницам: Hero → ReviewsText → ServiceContent → LocalWhiteContent → LocationsOffice → ServiceContent → Services → WhySos → ReviewsRating → FAQ → BottomCta. По сути — второй набор городских лендингов с другой схемой URL. |
| 4 | **Страницы услуг (детальные)** | `/services/{slug}` — `apartment-movers`, `commercial-movers`, `long-distance-movers`, `packing-services`, `white-glove-movers`, `storage`, `local-moving` | 7 | Hero → ReviewsText → ServiceContent → (LocationsSlider или LocalWhiteContent + LocationsOffice) → Services → WhySos → ReviewsRating → FAQ → BottomCta. У `packing-services` дополнительно `delivery-section`, у `local-moving` нестандартный `page-wrapper`. |
| 5 | **Листинг услуг** | `/services` (из `services.html`) | 1 | Минимальный: Hero (`is-services-section`) → ReviewsText → BottomCta. |
| 6 | **«Moving Services» лендинг** | `/moving-services` (из `moving-services.html`) — *по статусу ближе к главной, чем к `/services`* | 1 | Hero → ReviewsText → ReviewsRating → AboutCompany → WhySos → Services → HeroForm → LocationsSlider → inside-gallery hero → LatestNews → FAQ → BottomCta. |
| 7 | **Индекс блога** | `/blog` (из `blog.html`) | 1 | Hero → SectionBlog (листинг карточек) → BottomCta. |
| 8 | **Блог-посты** | `/blog/{slug}` | 394 (их очень много, списком не перечисляю) | Hero (`is-blog-article-hero is-without-bg-image`) → LatestNews (рекомендации) → BottomCta. Контент статьи — внутри Hero-блока. |
| 9 | **Страницы категорий блога** | `/category/{slug}` | 393 категорий (`src/data/shared/categories.json`) — это **нативный Next-роут**, не из `public/pages/` | Tailwind-реализация: заголовок категории → сетка `BlogCard` + `Pagination`. Единственная live-страница, где используется не-Webflow UI-кит и `src/components/blog/*`. |
| 10 | **About Us — корень** | `/about-us` (из `about-us.html`) | 1 | Hero → ReviewsText → WhySos → Services → LocationsSlider. |
| 11 | **About Us — подстраницы** | `/about-us/{sub}` | 8 (по роутам) / 11 (по `public/pages/about-us__*.html`) — см. заметку ниже | Набор варьируется (см. ниже) |
| 12 | **Forms: Free Estimate** | `/free-estimate` (из `free-estimate.html`) | 1 | Hero (`is-blog-article-hero is-free-quote-page` — с встроенной формой). |
| 13 | **Forms: Book Online** | `/book-online` (из `book-online.html`) | 1 | Hero (`is-free-quote-page` — с встроенной формой бронирования). |
| 14 | **Sitemap** | `/sitemap` (из `sitemap.html`) | 1 | Hero (`is-mb-0`) → ServicesAreas (перечень всех городов/услуг). |
| 15 | **Confirmation-страницы** | `/confirmation-page-refer-friends-get-cash` (из `confirmation-page-refer-friends-get-cash.html`) | 1 | Hero → SectionContent. *Других `confirmation-page-*` в репозитории сейчас нет.* |
| 16 | **Новый дизайн (main page v2)** | `/mainpage2` (роут `(new-design)/mainpage2/page.tsx`) | 1 | Собственный стек: Navbar → Hero → MarqueeBand → BrandReveal → About → Services → BestMovers → WhySos → Reviews → ServiceAreas → Gallery → FAQ → BottomCta → Footer. Компоненты `Press` и `Locations` существуют, но в текущем `page.tsx` не смонтированы. |

**Итого страниц в билде:** 1 (/) + 107 (`/{city}-movers` включая LA-вложенные) + 13 (`/movers-{city}`) + 7 (`/services/{slug}`) + 1 (`/services`) + 1 (`/moving-services`) + 1 (`/blog`) + 394 (`/blog/{slug}`) + 393 (`/category/{slug}`) + 1 (`/about-us`) + 8 (about-us subs) + 1 (`/free-estimate`) + 1 (`/book-online`) + 1 (`/sitemap`) + 1 (`/confirmation-page-refer-friends-get-cash`) + 1 (`/mainpage2`).

### Детализация: About Us подстраницы

В `public/pages/` лежат **11** `about-us__*.html` снимков. Под них реально поднято **7** именованных роутов плюс корневой `/about-us`:

| Файл (HTML) | Роут в `src/app/(webflow)/about-us/` | Что это | Типичные секции |
| --- | --- | --- | --- |
| `about-us.html` | `/about-us` (`about-us/page.tsx`) | Корень «О нас» | Hero → ReviewsText → WhySos → Services → LocationsSlider |
| `about-us__company-policy.html` | `/about-us/company-policy` | Политика компании | Hero (`is-reviews-hero-section`) |
| `about-us__contact-us.html` | `/about-us/contact-us` | Контакты | Hero (`is-contact-section`) |
| `about-us__faq.html` | `/about-us/faq` | Расширенный FAQ | Hero → BottomCta |
| `about-us__gallery.html` | `/about-us/gallery` | Фото-галерея переездов | Hero (`is-without-bg-image`) → GalleryPhoto |
| `about-us__meet-our-team.html` | `/about-us/meet-our-team` | Команда | Hero → ReviewsText → Team → WhySos → ReviewsRating → BottomCta |
| `about-us__referral.html` | `/about-us/referral` | Реферальная программа | Hero → ReviewsText → ServiceContent → WhySos → Services → LocationsSlider → Contact |
| `about-us__reviews.html` | `/about-us/reviews` | Отзывы | Hero (`is-reviews-hero-section`) |
| `about-us__apartment-partnership.html` | *нет явного роута* (доступен ли через общий catch — нужно проверять) | Партнёрство с управляющими компаниями | Hero → ReviewsText → ServiceContent → WhySos → Services → LocationsSlider → Contact |
| `about-us__careers.html` | *нет явного роута* | Вакансии | Hero → ReviewsText → Job → WhySos → ReviewsRating → BottomCta |
| `about-us__influencer-program.html` | *нет явного роута* | Программа для инфлюенсеров | Hero → ReviewsText → ServiceContent → WhySos → Services → LocationsSlider → Contact |
| `about-us__video-reviews.html` | *нет явного роута* | Видео-отзывы | Hero (`is-blog-article-hero is-without-bg-image is-have-slider`) |

То есть 4 HTML-файла лежат «про запас» без выделенных Next-роутов — их можно будет поднять отдельными `page.tsx` при необходимости.

### Замечание про `/category/{slug}`

Это единственный «не-Webflow» живой роут внутри группы `(webflow)`: страница собирается из Tailwind-компонентов `Container` + `BlogCard` + `Pagination` и ходит в `src/lib/data/blog.ts` и `src/lib/data/shared.ts`. Именно поэтому файлы `src/components/ui/Container.tsx`, `src/components/blog/BlogCard.tsx`, `src/components/blog/Pagination.tsx` остаются живыми, хотя на остальных Webflow-страницах не используются.
