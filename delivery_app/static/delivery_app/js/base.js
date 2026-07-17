const sitePreloader = document.getElementById('sitePreloader');
        const sitePreloaderStartedAt = performance.now();

        function hideSitePreloader() {
            if (!sitePreloader) return;
            const minimumDisplayTime = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180;
            const delay = Math.max(0, minimumDisplayTime - (performance.now() - sitePreloaderStartedAt));
            window.setTimeout(() => sitePreloader.classList.add('is-hidden'), delay);
        }

        if (document.readyState === 'complete') {
            hideSitePreloader();
        } else {
            window.addEventListener('load', hideSitePreloader, { once: true });
        }
        window.setTimeout(hideSitePreloader, 1600);
        window.addEventListener('pageshow', hideSitePreloader);

        document.addEventListener('click', function (event) {
            const link = event.target.closest('a[href]');
            if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            if (link.target === '_blank' || link.hasAttribute('download')) return;
            const destination = new URL(link.href, window.location.href);
            if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
            if (destination.pathname === window.location.pathname && destination.search === window.location.search && destination.hash) return;
            sitePreloader.classList.remove('is-hidden');
        });

        document.addEventListener('submit', function (event) {
            if (!event.defaultPrevented) sitePreloader.classList.remove('is-hidden');
        });

        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMobile = document.getElementById('navMobile');

        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navMobile.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                mobileMenuToggle.classList.remove('active');
                navMobile.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        const currentUrl = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentUrl) {
                link.classList.add('active-link');
            }
        });

        const logoutForms = document.querySelectorAll('.logout-form');
        logoutForms.forEach(form => {
            form.addEventListener('submit', function (e) {
                if (!confirm('Вы уверены, что хотите выйти?')) {
                    e.preventDefault();
                }
            });
        });

        document.addEventListener('DOMContentLoaded', function () {
            console.log('Сайт загружен!');
        });

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
        themeLabel.textContent = 'Светлая тема';
    }

    themeToggle.addEventListener('change', function() {
        if (themeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeLabel.textContent = 'Светлая тема';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeLabel.textContent = 'Темная тема';
        }
        if (window.applySiteLanguage) window.applySiteLanguage(localStorage.getItem('siteLanguage') || 'ru');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const todayDay = String(new Date().getDate());
    document.querySelectorAll('.calendar-table').forEach(table => {
        table.querySelectorAll('td').forEach(cell => {
            const value = cell.textContent.trim();
            if (value === todayDay && !cell.classList.contains('empty')) {
                cell.classList.add('today');
                cell.setAttribute('aria-current', 'date');
                cell.title = 'Сегодня';
            }
        });
    });
});

const siteRuToEn = {
    'Продуктовая доставка': 'Grocery Delivery',
    'Главная': 'Home',
    'О компании': 'About',
    'Товары': 'Products',
    'Новости': 'News',
    'Еще': 'More',
    'Промокоды': 'Promo codes',
    'Словарь терминов': 'Glossary',
    'Контакты': 'Contacts',
    'Политика конфиденциальности': 'Privacy policy',
    'Вакансии': 'Careers',
    'Отзывы': 'Reviews',
    'Статистика': 'Statistics',
    'Управление сотрудниками': 'Employee management',
    'Профиль': 'Profile',
    'Мои заказы': 'My orders',
    'История покупок': 'Purchase history',
    'Следите за статусом, способом доставки и оплатой в одном месте.': 'Track status, delivery and payment in one place.',
    'Перейти в каталог': 'Go to catalog',
    'Сводка по заказам': 'Order summary',
    'В работе': 'In progress',
    'Сумма заказов': 'Order total',
    'Ваши покупки': 'Your purchases',
    'История заказов': 'Order history',
    'Поиск': 'Search',
    'Номер заказа или адрес': 'Order number or address',
    'Показать': 'Show',
    'Заказ': 'Order',
    'Получение': 'Fulfilment',
    'Товаров': 'Items',
    'позиций:': 'lines:',
    'Курьер': 'Courier',
    'Самовывоз': 'Pickup',
    'Итого': 'Total',
    'Ожидает оплаты': 'Awaiting payment',
    'Заказы не найдены': 'No orders found',
    'Попробуйте изменить параметры поиска или сбросить фильтр.': 'Try changing the search options or reset the filter.',
    'Сбросить фильтры': 'Reset filters',
    'У вас пока нет заказов': 'You have no orders yet',
    'Добавьте товары в корзину, и история покупок появится здесь.': 'Add products to the cart and your purchase history will appear here.',
    'Выбрать товары': 'Choose products',
    'Назад': 'Previous',
    'Далее': 'Next',
    'Панель сотрудника': 'Employee panel',
    'Выйти': 'Log out',
    'Войти': 'Sign in',
    'Регистрация': 'Sign up',
    'Темная тема': 'Dark theme',
    'Светлая тема': 'Light theme',
    'Каталог товаров': 'Product catalog',
    'Список товаров': 'Product list',
    'Подробнее': 'Details',
    'Кол-во:': 'Qty:',
    'Выберите количество': 'Choose quantity',
    'В корзину': 'Add to cart',
    'В наличии': 'In stock',
    'Остаток:': 'Stock:',
    'Все типы товаров': 'All product types',
    'По названию (А-Я)': 'By name (A-Z)',
    'Применить фильтры': 'Apply filters',
    'Сбросить': 'Reset',
    'Свежие продукты': 'Fresh products',
    'Выберите товары, настройте фильтры и добавьте нужное количество в корзину.': 'Choose products, set filters and add the needed quantity to the cart.',
    'Найдите нужные продукты': 'Find the products you need',
    'Используйте поиск, категории и удобную сортировку.': 'Use search, categories and convenient sorting.',
    'В наличии сегодня': 'Available today',
    'Проверено': 'Verified',
    'Ваша корзина': 'Your cart',
    'Покупки': 'Shopping',
    'Проверьте количество товаров и переходите к оформлению заказа.': 'Check product quantities and proceed to checkout.',
    'товаров': 'items',
    'Ваш заказ': 'Your order',
    'Товары в корзине': 'Cart items',
    'Продолжить покупки': 'Continue shopping',
    'Товар': 'Product',
    'Цена за единицу': 'Unit price',
    'Количество': 'Quantity',
    'Общая стоимость': 'Total',
    'Действия': 'Actions',
    'Удалить': 'Remove',
    'Итоги заказа': 'Order summary',
    'К оплате': 'Payment',
    'Количество товаров': 'Items',
    'Стоимость товаров': 'Products subtotal',
    'Доставка': 'Delivery',
    'Рассчитается далее': 'Calculated next',
    'Итого': 'Total',
    'Количество товаров:': 'Items:',
    'Итого к оплате:': 'Total to pay:',
    'Обновить корзину': 'Update cart',
    'Оформить заказ': 'Checkout',
    'Условия доставки': 'Delivery terms',
    'Сервис': 'Service',
    'От 2 часов': 'From 2 hours',
    'по Минску': 'in Minsk',
    'Бесплатно': 'Free',
    'при заказе от 50 BYN': 'on orders over 50 BYN',
    'Ежедневно': 'Every day',
    'Товары сохранятся в корзине до оформления заказа': 'Products stay in your cart until checkout',
    'Безопасное оформление и защищённая оплата': 'Secure checkout and protected payment',
    'Календарь доставки': 'Delivery calendar',
    'Быстрая доставка': 'Fast delivery',
    'Бесплатная доставка': 'Free delivery',
    'Работаем ежедневно': 'Open daily',
    'В течение 2 часов по городу': 'Within 2 hours in the city',
    'При заказе от 50 BYN': 'For orders over 50 BYN',
    'с 8:00 до 22:00': 'from 8:00 to 22:00',
    'Ваша корзина пуста': 'Your cart is empty',
    'Здесь пока пусто': 'Nothing here yet',
    'Добавьте продукты в корзину': 'Add products to your cart',
    'В каталоге уже собраны свежие товары с актуальными ценами и остатками.': 'Browse fresh products with current prices and stock information.',
    'Перейти в каталог': 'Go to catalog',
    'Добавьте товары из каталога, чтобы сделать заказ': 'Add products from the catalog to place an order',
    'Перейти к покупкам': 'Go shopping',
    'Вход в систему': 'Sign in',
    'Имя пользователя': 'Username',
    'Пароль': 'Password',
    'Запомнить меня': 'Remember me',
    'Забыли пароль?': 'Forgot password?',
    'Преимущества': 'Benefits',
    'Лучшие цены': 'Best prices',
    'Регулярные акции и скидки': 'Regular deals and discounts',
    'Только качественные товары': 'Only quality products',
    'Календарь на': 'Calendar for',
    'Дата:': 'Date:',
    'Временная зона:': 'Timezone:',
    'Актуально на:': 'Updated:',
    'Подписаться': 'Subscribe',
    'Подписка на новости': 'Newsletter',
    'Полезные ссылки': 'Useful links',
    'О нас': 'About us',
    'О компании': 'About',
    'Мы доставляем свежие продукты прямо к вашей двери. Быстро, удобно и надежно.': 'We deliver fresh groceries right to your door. Fast, convenient and reliable.',
    'Все права защищены.': 'All rights reserved.',
    'ДОСТАВКА СВЕЖИХ ПРОДУКТОВ': 'FRESH GROCERY DELIVERY',
    'Служба доставки продуктов': 'Grocery delivery service',
    'Перейти в каталог': 'Go to catalog',
    'Связаться с нами': 'Contact us',
    'История': 'History',
    'Ценности': 'Values',
    'Команда': 'Team',
    'Реквизиты': 'Company details',
    'Сертификаты': 'Certificates',
    'Готовы оформить доставку?': 'Ready to place a delivery order?',
    'Выберите товары в каталоге, добавьте их в корзину и укажите удобный способ получения.': 'Choose products in the catalog, add them to the cart and select a convenient delivery method.',
    'Смотреть товары': 'View products',
    'Реквизиты и расположение': 'Details and location',
    'Офис и поддержка': 'Office and support',
    'Адрес': 'Address',
    'Телефон': 'Phone',
    'Время работы': 'Working hours',
    'Определить расстояние': 'Calculate distance',
    'Озвучить адрес': 'Read address',
    'Поделиться': 'Share',
    'Сертификаты и гарантии': 'Certificates and guarantees',
    'Контроль качества продуктов': 'Product quality control',
    'Запросить документы': 'Request documents',
    'Поиск товаров': 'Product search',
    'Тип товара': 'Product type',
    'Сортировка': 'Sorting',
    'По названию (Я-А)': 'By name (Z-A)',
    'По цене (возрастание)': 'By price (ascending)',
    'По цене (убывание)': 'By price (descending)',
    'По наличию': 'By availability',
    'Активные фильтры:': 'Active filters:',
    'Поиск:': 'Search:',
    'Тип:': 'Type:',
    'Сортировка:': 'Sorting:',
    'Найдено товаров:': 'Products found:',
    'Товары не найдены': 'Products not found',
    'Попробуйте изменить параметры поиска или фильтрации': 'Try changing search or filter parameters',
    'Показать все товары': 'Show all products',
    'Товаров на странице:': 'Products per page:',
    'Страница': 'Page',
    'из': 'of',
    'Показано': 'Showing',
    'товаров': 'products',
    'шт.': 'pcs.',
    'Нет в наличии': 'Out of stock',
    'Недоступно': 'Unavailable',
    'Добро пожаловать в службу доставки продуктов!': 'Welcome to the grocery delivery service!',
    'Свежие продукты прямо к вашей двери. Быстро, удобно, надежно.': 'Fresh groceries right to your door. Fast, convenient and reliable.',
    'Заказать сейчас': 'Order now',
    'Доставка без лишней суеты': 'Delivery without hassle',
    'Свежие продукты — у вашей двери уже сегодня': 'Fresh groceries at your door today',
    'Соберите корзину онлайн, а мы привезём свежие товары быстро, аккуратно и в удобное время.': 'Build your cart online, and we will deliver fresh groceries quickly, carefully and at a convenient time.',
    'Узнать о сервисе': 'About the service',
    'от 2 часов': 'from 2 hours',
    'доставка по городу': 'city delivery',
    'оценка клиентов': 'customer rating',
    'заказов доставлено': 'orders delivered',
    'Преимущества доставки': 'Delivery benefits',
    'Ваш заказ': 'Your order',
    '7 товаров': '7 products',
    'Свежие овощи · молоко · фрукты': 'Fresh vegetables · milk · fruit',
    'Статус': 'Status',
    'Курьер в пути': 'Courier on the way',
    '24 мин · маршрут построен': '24 min · route ready',
    '+ бонусы': '+ bonuses',
    'Бесплатная доставка от 60 BYN': 'Free delivery from 60 BYN',
    'Наши акции и предложения': 'Our deals and offers',
    'Интервал (сек):': 'Interval (sec):',
    'Зациклить': 'Loop',
    'Авто': 'Auto',
    'Пауза при наведении': 'Pause on hover',
    'Популярные товары': 'Popular products',
    'Самые востребованные продукты этой недели': 'The most popular products this week',
    'Выбор покупателей': 'Customer favorites',
    'Весь каталог': 'Full catalog',
    'Популярное': 'Popular',
    'Быстрый просмотр': 'Quick view',
    'В наличии:': 'In stock:',
    'Смотреть все товары': 'View all products',
    'Последние новости': 'Latest news',
    'Актуальное': 'Latest updates',
    'Читайте о развитии сервиса, новых возможностях и специальных проектах': 'Read about service updates, new features and special projects',
    'Новая публикация': 'New article',
    'Все новости': 'All news',
    'Читать далее': 'Read more',
    'Наши партнёры': 'Our partners',
    'Мы сотрудничаем с лучшими производителями и поставщиками': 'We work with the best producers and suppliers',
    'Нам доверяют': 'Trusted by businesses',
    'Мы объединяем надёжных поставщиков, производителей и платёжные сервисы, чтобы каждый заказ был свежим и удобным.': 'We bring together reliable suppliers, producers and payment services to make every order fresh and convenient.',
    'компании в экосистеме': 'companies in the ecosystem',
    'На сайт': 'Visit website',
    'Полезно сегодня': 'Useful today',
    'Город в одном взгляде': 'The city at a glance',
    'Актуальная погода, официальные курсы валют и текущая дата — всё нужное перед оформлением доставки.': 'Current weather, official exchange rates and today’s date — everything you need before placing a delivery order.',
    'Сейчас': 'Now',
    'Обновлено': 'Updated',
    'НБРБ · сегодня': 'NBRB · today',
    'Доллар США': 'US dollar',
    'Евро': 'Euro',
    'Сезонные предложения, быстрая доставка и выгодные наборы для дома': 'Seasonal deals, fast delivery and value bundles for home',
    'Экспресс-доставка': 'Express delivery',
    'Доставка за 2 часа': 'Delivery in 2 hours',
    'Привезём продукты за 2 часа': 'We deliver groceries in 2 hours',
    'Соберём свежие товары, согласуем замену и привезём заказ к удобному времени.': 'We will pick fresh products, agree replacements and deliver at a convenient time.',
    'Соберём свежие товары, согласуем замену и доставим заказ к удобному времени.': 'We will pick fresh products, agree replacements and deliver at a convenient time.',
    'Собрать корзину': 'Build a cart',
    'сегодня': 'today',
    'без очередей': 'no queues',
    'контроль свежести': 'freshness check',
    'Набор недели': 'Weekly bundle',
    'Семейный набор': 'Family bundle',
    'Овощи и фрукты для всей семьи': 'Vegetables and fruit for the whole family',
    'Овощи, фрукты и молочные продукты для завтраков, ужинов и перекусов со скидкой до 20%.': 'Vegetables, fruit and dairy products for breakfasts, dinners and snacks with up to 20% off.',
    'Готовые наборы для завтраков, ужинов и перекусов с выгодой до 20%.': 'Ready-made bundles for breakfasts, dinners and snacks with up to 20% savings.',
    'Посмотреть товары': 'View products',
    'фрукты': 'fruit',
    'овощи': 'vegetables',
    'молочные продукты': 'dairy products',
    'Скидки каждый день': 'Daily discounts',
    'Промокоды и акции на заказы': 'Promo codes and order deals',
    'Проверяйте купоны перед оформлением и экономьте на любимых товарах.': 'Check coupons before checkout and save on your favorite products.',
    'Открыть промокоды': 'Open promo codes',
    'скидки': 'discounts',
    'бонусы': 'bonuses',
    'выгодные цены': 'good prices',
    'Промокоды и акции': 'Promo codes and deals',
    'Свежий завоз': 'Fresh arrivals',
    'Новые продукты уже в каталоге': 'New products are already in the catalog',
    'Добавили сезонные позиции, напитки и товары для быстрого ужина.': 'We added seasonal items, drinks and products for a quick dinner.',
    'Смотреть новинки': 'View new arrivals',
    'новинки': 'new arrivals',
    'поставщики': 'suppliers',
    'качество': 'quality',
    'Самовывоз': 'Pickup',
    'Самовывоз без ожидания': 'Pickup without waiting',
    'Заберите заказ без ожидания': 'Pick up your order without waiting',
    'Оформите корзину на сайте, а мы заранее подготовим товары к выдаче.': 'Place your cart on the site and we will prepare the items for pickup in advance.',
    'быстро': 'fast',
    'удобно': 'convenient',
    'без переплат': 'no overpayment',
    'Проверенный партнёр': 'Trusted partner',
    'Евроопт': 'Euroopt',
    'Савушкин продукт': 'Savushkin Product',
    'Белкарт': 'Belkart',
    'Крупнейшая сеть магазинов в Беларуси': 'The largest supermarket chain in Belarus',
    'Крупнейший производитель молочной продукции в Беларуси': 'The largest dairy producer in Belarus',
    'Национальная платежная система': 'National payment system',
    'Белпочта': 'Belpost',
    'Оплати': 'Oplati',
    'МТБанк': 'MTBank',
    'Логистика, пункты выдачи и удобная доставка по Беларуси': 'Logistics, pickup points and convenient delivery across Belarus',
    'Быстрая онлайн-оплата заказов и платёжные сценарии': 'Fast online order payment and payment scenarios',
    'Банковские карты и платёжные сервисы для покупателей': 'Bank cards and payment services for customers',
    'Почему выбирают нас?': 'Why choose us?',
    'Сервис без компромиссов': 'Service without compromise',
    'Продумали весь путь заказа — от проверки свежести до доставки в удобное для вас время.': 'We designed the entire order journey — from freshness checks to delivery at a convenient time.',
    'причины доверить нам покупки': 'reasons to trust us with your shopping',
    'По Минску · ежедневно': 'Across Minsk · daily',
    'Контроль качества': 'Quality control',
    'Акции каждую неделю': 'Weekly offers',
    '24/7 онлайн': 'Online 24/7',
    'Доступные цены': 'Affordable prices',
    'Удобный заказ': 'Easy ordering',
    'Доставляем заказы в течение 2-х часов по городу': 'We deliver orders within 2 hours around the city',
    'Только качественные и свежие продукты от проверенных поставщиков': 'Only quality and fresh products from trusted suppliers',
    'Конкурентные цены и регулярные акции для наших клиентов': 'Competitive prices and regular promotions for our customers',
    'Заказывайте через сайт или мобильное приложение в любое время': 'Order through the website or mobile app anytime',
    'Погода': 'Weather',
    'Курсы валют': 'Exchange rates',
    'Календарь': 'Calendar',
    'Источник:': 'Source:',
    'Показано резервное значение': 'Fallback value shown',
    'Новости и акции': 'News and promotions',
    'Будьте в курсе последних событий и специальных предложений': 'Stay up to date with the latest events and special offers',
    'Поиск по новостям': 'News search',
    'Сортировать по:': 'Sort by:',
    'Сначала новые': 'Newest first',
    'Сначала старые': 'Oldest first',
    'Сначала популярные': 'Most popular first',
    'Словарь терминов': 'Glossary',
    'Все, что вам нужно знать о нашей службе доставки': 'Everything you need to know about our delivery service',
    'Начните вводить слово или фразу для поиска в вопросах и ответах': 'Start typing a word or phrase to search questions and answers',
    'Добавлено:': 'Added:',
    'Всего терминов:': 'Total terms:',
    'Раздел словаря терминов пуст': 'The glossary section is empty',
    'Мы скоро добавим полезную информацию о нашей службе доставки.': 'We will soon add useful information about our delivery service.',
    'Не нашли ответа на свой вопрос?': 'Did not find an answer?',
    'Свяжитесь с нашей службой поддержки, и мы с радостью поможем вам!': 'Contact our support team and we will gladly help you!',
    'Позвонить нам': 'Call us',
    'Написать нам': 'Write to us',
    'Промокоды и купоны': 'Promo codes and coupons',
    'Экономьте с нашими промокодами!': 'Save with our promo codes!',
    'Используйте специальные коды для получения скидок на доставку и продукты.': 'Use special codes to get discounts on delivery and products.',
    'Действующие промокоды': 'Active promo codes',
    'Архив промокодов': 'Promo code archive',
    'Активен': 'Active',
    'Завершен': 'Finished',
    'Код промокода:': 'Promo code:',
    'Описание': 'Description',
    'Скидка на заказ': 'Order discount',
    'Действует до': 'Valid until',
    'Минимальный заказ': 'Minimum order',
    'Лимит использований': 'Usage limit',
    'Осталось:': 'Time left:',
    'Действует сегодня': 'Valid today',
    'Использовать': 'Use',
    'Активных промокодов нет': 'No active promo codes',
    'Новые промокоды появятся скоро. Следите за обновлениями!': 'New promo codes will appear soon. Stay tuned!',
    'Архив пуст': 'Archive is empty',
    'Здесь появятся завершенные промокоды': 'Finished promo codes will appear here',
    'Как использовать промокод?': 'How to use a promo code?',
    'Введите код промокода на этапе оформления заказа в специальное поле "Промокод"': 'Enter the promo code during checkout in the special “Promo code” field',
    'Важно знать': 'Good to know',
    'Один промокод можно использовать только один раз. Не суммируется с другими акциями.': 'A promo code can be used only once. It cannot be combined with other promotions.',
    'Помощь': 'Help',
    'Если промокод не работает, свяжитесь с нашей поддержкой для помощи.': 'If a promo code does not work, contact our support team for help.',
    'Отзывы наших клиентов': 'Customer reviews',
    'Мы ценим мнение каждого клиента и постоянно работаем над улучшением нашего сервиса': 'We value every customer’s opinion and constantly improve our service',
    'Средняя оценка': 'Average rating',
    'Всего отзывов': 'Total reviews',
    'Положительных отзывов': 'Positive reviews',
    'Добавить отзыв': 'Add review',
    'Чтобы оставить отзыв, пожалуйста, авторизуйтесь': 'Please sign in to leave a review',
    'Оставьте ваш отзыв': 'Leave your review',
    'Ваша оценка': 'Your rating',
    'Текст отзыва': 'Review text',
    'Фильтр по оценке:': 'Filter by rating:',
    'Все': 'All',
    'Отзыв полезен?': 'Was this review helpful?',
    'Наша команда': 'Our team',
    'Мы всегда на связи!': 'We are always in touch!',
    'Познакомьтесь с нашей командой профессионалов, которые готовы помочь вам с доставкой продуктов.': 'Meet our team of professionals ready to help with grocery delivery.',
    'Отдел продаж': 'Sales department',
    'Служба доставки': 'Delivery service',
    'Технический отдел': 'Technical department',
    'Руководство': 'Management',
    'Администрация': 'Administration',
    'График работы': 'Working schedule',
    'Обязанности': 'Responsibilities',
    'Консультирование клиентов': 'Customer consulting',
    'Прием заказов': 'Order processing',
    'Решение вопросов': 'Issue resolution',
    'Доставка заказов': 'Order delivery',
    'Контроль качества': 'Quality control',
    'Отчетность': 'Reporting',
    'Поддержка сайта': 'Website support',
    'Техническое обслуживание': 'Technical maintenance',
    'Разработка улучшений': 'Improvement development',
    'Управление процессами': 'Process management',
    'Стратегическое планирование': 'Strategic planning',
    'Сотрудников пока нет': 'No employees yet',
    'Информация о нашей команде скоро появится': 'Information about our team will appear soon',
    'Контактная информация компании': 'Company contact information',
    'Адрес офиса': 'Office address',
    'Телефоны': 'Phones',
    'Единый call-центр': 'Unified call center',
    'Отдел доставки': 'Delivery department',
    'Электронная почта': 'Email',
    'Общие вопросы': 'General questions',
    'Вопросы доставки': 'Delivery questions',
    'Социальные сети': 'Social networks',
    'Политика конфиденциальности': 'Privacy policy',
    'Ваша конфиденциальность важна для нас.': 'Your privacy matters to us.',
    'В этой политике объясняется, как мы собираем, используем и защищаем ваши данные.': 'This policy explains how we collect, use and protect your data.',
    'Общие положения': 'General provisions',
    'По вопросам конфиденциальности:': 'For privacy questions:',
    'Карьера': 'Career',
    'Работа в продуктовой доставке': 'Work in grocery delivery',
    'Ищем людей, которым важны аккуратность, ответственность и нормальный человеческий сервис.': 'We are looking for people who value accuracy, responsibility and good human service.',
    'Отправить резюме': 'Send CV',
    'Понятный график': 'Clear schedule',
    'Смены согласуются заранее, без внезапных переработок.': 'Shifts are agreed in advance, without sudden overtime.',
    'Обучение': 'Training',
    'Помогаем быстро разобраться в стандартах сервиса и доставки.': 'We help you quickly learn service and delivery standards.',
    'Рост': 'Growth',
    'Лучшие сотрудники переходят в логистику, поддержку и управление сменами.': 'The best employees move into logistics, support and shift management.',
    'Открытые позиции': 'Open positions',
    'Сейчас ищем': 'Currently hiring',
    'Откликнуться': 'Apply',
    'Сейчас нет открытых вакансий': 'No open vacancies now',
    'Но вы можете отправить резюме заранее, и мы вернёмся к нему, когда появится подходящая роль.': 'You can send your CV in advance and we will return to it when a suitable role appears.'
};

Object.assign(siteRuToEn, {
    'лет на рынке': 'years on the market',
    'довольных клиентов': 'happy customers',
    '2 часа': '2 hours',
    'среднее окно доставки': 'average delivery window',
    'товаров в каталоге': 'products in catalog',
    'средняя оценка сервиса': 'average service rating',
    'КТО МЫ': 'WHO WE ARE',
    'Кто мы': 'Who we are',
    'Наша история': 'Our story',
    'Наша компания начала свой путь в 2018 году с небольшого семейного бизнеса по доставке фермерских продуктов.': 'Our company started in 2018 as a small family business delivering farm products.',
    'Основание компании как семейного бизнеса по доставке фермерских продуктов': 'Company founded as a family business delivering farm products',
    'Запуск первого интернет-магазина с ассортиментом 200 продуктов': 'Launch of the first online store with 200 products',
    'Утроение клиентской базы благодаря надежной системе бесконтактной доставки': 'Customer base tripled thanks to a reliable contactless delivery system',
    'Разработка мобильного приложения и внедрение AI-системы прогнозирования спроса': 'Mobile app development and AI demand forecasting implementation',
    'Открытие трех распределительных центров и партнерство с локальными производителями': 'Opening three distribution centers and partnering with local producers',
    'Расширение ассортимента до 5000+ продуктов и 50,000+ постоянных клиентов': 'Expansion to 5000+ products and 50,000+ regular customers',
    'Морковь': 'Carrots',
    'Яблоки': 'Apples',
    'Апельсины': 'Oranges',
    'Бананы': 'Bananas',
    'Картофель': 'Potatoes',
    'Вода': 'Water',
    'Фрукты': 'Fruit',
    'Овощи': 'Vegetables',
    'Кока кола 1л': 'Coca-Cola 1L',
    'Апельсины 1кг': 'Oranges 1 kg',
    'Свежие бананы 1 кг': 'Fresh bananas 1 kg',
    'Свежая морковь 1кг': 'Fresh carrots 1 kg',
    'Яблоки белорусские': 'Belarusian apples',
    'Картофель белорусский': 'Belarusian potatoes',
    'Килограммы': 'kg',
    'Штуки': 'pcs',
    'Литры': 'liters',
    'Запуск экспресс-доставки за 60 минут': 'Express delivery launched in 60 minutes',
    'Теперь вы можете получить свои покупки всего за час в радиусе 10 км от наших складов.': 'You can now receive your groceries in just one hour within 10 km of our warehouses.',
    'Подпишитесь на наши новости': 'Subscribe to our news',
    'Получайте уведомления о новых акциях и специальных предложениях первыми': 'Be the first to receive updates about new promotions and special offers',
    'Истёк': 'Expired',
    'Истек': 'Expired',
    'Промокод более не активен': 'Promo code is no longer active',
    'Какая минимальная сумма заказа?': 'What is the minimum order amount?',
    'Минимальная сумма заказа составляет 20 BYN. Это помогает нам покрывать расходы на доставку и обеспечивать качественный сервис для всех клиентов.': 'The minimum order amount is 20 BYN. This helps us cover delivery costs and provide quality service for all customers.',
    'Администратор менеджмента': 'Management administrator',
    'Настоящая Политика конфиденциальности регулирует порядок обработки и использования персональных данных пользователей сайта "Продуктовая доставка" (далее — "Сайт" и "Сервис"). Используя Сайт и наши услуги, вы соглашаетесь с условиями обработки ваших персональных данных в соответствии с настоящей Политикой конфиденциальности. Мы обеспечиваем конфиденциальность и защиту персональных данных наших пользователей в соответствии с законодательством Республики Беларусь.': 'This Privacy Policy governs the processing and use of personal data of users of the "Grocery Delivery" website (hereinafter — the "Site" and "Service"). By using the Site and our services, you agree to the processing of your personal data in accordance with this Privacy Policy. We ensure the confidentiality and protection of our users’ personal data in accordance with the legislation of the Republic of Belarus.',
    'Собираемая информация': 'Information we collect',
    'Курьер-водитель': 'Courier driver',
    'Сборщик заказов': 'Order picker',
    'Оператор call-центра': 'Call center operator',
    'Менеджер по закупкам': 'Purchasing manager',
    'Мы ищем ответственного курьера-водителя для доставки продуктов нашим клиентам. Вам предстоит работать с современной системой навигации и мобильным приложением для управления заказами.': 'We are looking for a responsible courier driver to deliver groceries to our customers. You will work with a modern navigation system and a mobile order management app.',
    'Приглашаем внимательных и аккуратных сборщиков заказов на наш склад. Вы будете отвечать за комплектацию товаров согласно заказам клиентов.': 'We invite attentive and accurate order pickers to our warehouse. You will be responsible for assembling products according to customer orders.',
    'Требуется коммуникабельный оператор call-центра для обработки входящих звонков и консультации клиентов по вопросам заказов и доставки.': 'We need a communicative call center operator to handle incoming calls and advise customers on orders and delivery.',
    'Ищем опытного менеджера по закупкам для формирования ассортимента и работы с поставщиками продуктов питания.': 'We are looking for an experienced purchasing manager to manage the assortment and work with food suppliers.',
    'Статистика магазина': 'Store statistics',
    'Реальные показатели заказов, оплаты, доставки и продаж на 13/07/2026.': 'Real order, payment, delivery and sales metrics for 13/07/2026.',
    'Всего заказов': 'Total orders',
    'Выручка': 'Revenue',
    'Средний чек': 'Average order value',
    'Оплачено картой': 'Paid by card',
    'Статусы заказов': 'Order statuses',
    'Доля каждого состояния в текущей базе заказов': 'Share of each status in the current order database',
    'В ожидании': 'Pending',
    'Отправлен': 'Sent',
    'Доставлен': 'Delivered',
    'Отменен': 'Canceled',
    'Оплата': 'Payment',
    'Состояние оплат по заказам': 'Payment status by orders',
    'Ожидает оплаты': 'Awaiting payment',
    'Оплачено': 'Paid',
    'Ошибка оплаты': 'Payment error',
    'Рабочая область': 'Workspace',
    'Заказы и аналитика': 'Orders and analytics',
    'Заказы': 'Orders',
    'Сотрудники': 'Employees',
    'Статус': 'Status',
    'Дата заказа': 'Order date',
    'Доставка': 'Delivery',
    'Все статусы': 'All statuses',
    'Все типы': 'All types',
    'Все способы': 'All methods',
    'Применить': 'Apply',
    'Обновляйте статус и дату доставки непосредственно в строке.': 'Update status and delivery date directly in the row.',
    'ЗАКАЗ': 'ORDER',
    'КЛИЕНТ': 'CLIENT',
    'ДОСТАВКА': 'DELIVERY',
    'ОПЛАТА': 'PAYMENT',
    'СУММА': 'AMOUNT',
    'ИСПОЛНИТЕЛЬ': 'ASSIGNEE',
    'УПРАВЛЕНИЕ': 'MANAGEMENT',
    '← К панели': '← To panel',
    '+ Добавить сотрудника': '+ Add employee',
    'Премировать выбранных': 'Reward selected',
    'Введите текст для поиска...': 'Enter search text...',
    'Найти': 'Search',
    'ФИО': 'FULL NAME',
    'ФОТО': 'PHOTO',
    'ОПИСАНИЕ РАБОТ': 'JOB DESCRIPTION',
    'ПОЧТА': 'EMAIL',
    'Техническая поддержка': 'Technical support',
    'Менеджер заказов': 'Order manager',
    'Администрирование каталога': 'Catalog administration',
    'Товары и категории': 'Products and categories',
    '← К заказам': '← To orders',
    'Добавить товар': 'Add product',
    'Название': 'Name',
    'Цена, BYN': 'Price, BYN',
    'Единица': 'Unit',
    'Производитель': 'Producer',
    'Выберите тип': 'Choose type',
    'Не указан': 'Not specified',
    'Каталог': 'Catalog',
    'Редактирование сохраняется отдельно для каждой позиции.': 'Edits are saved separately for each item.',
    'Сохранить': 'Save'
});

Object.assign(siteRuToEn, {
    'Запуск первого интернет-магазина с ассортиментом 200 товаров': 'Launch of the first online store with 200 products',
    'Расширение ассортимента до 5000+ товаров и 50,000+ постоянных клиентов': 'Expansion to 5000+ products and 50,000+ regular customers',
    'Внедрение экологичной упаковки и программы поддержки местных производителей': 'Eco-friendly packaging and local producer support program introduced',
    'Наша компания начала свой путь в 2018 году с небольшого семейного бизнеса по доставке фермерских продуктов. Основатели, семья Ивановых, заметили растущий спрос на качественные продукты с доставкой на дом в быстро развивающемся городе.': 'Our company started in 2018 as a small family business delivering farm products. The founders, the Ivanov family, noticed growing demand for quality groceries delivered to homes in a fast-growing city.',
    'В 2019 году мы запустили первый интернет-магазин и расширили ассортимент до 200 товаров. К 2020 году, несмотря на сложную мировую ситуацию, мы утроили количество клиентов благодаря надежной системе бесконтактной доставки.': 'In 2019, we launched our first online store and expanded the assortment to 200 products. By 2020, despite a difficult global situation, we tripled our customer base thanks to a reliable contactless delivery system.',
    '2021 год стал годом технологического прорыва - мы разработали собственное мобильное приложение и внедрили AI-систему для прогнозирования спроса. В 2022 году открыли три новых распределительных центра и начали сотрудничать с локальными производителями.': '2021 became a year of technological breakthrough: we developed our own mobile app and introduced an AI demand forecasting system. In 2022, we opened three new distribution centers and started working with local producers.',
    'Сегодня мы гордимся тем, что предлагаем более 5000 товаров от 200+ поставщиков, обслуживаем более 50,000 постоянных клиентов и продолжаем развиваться, внедряя экологичные упаковки и поддерживая местных производителей.': 'Today we are proud to offer more than 5000 products from 200+ suppliers, serve more than 50,000 regular customers and keep growing by introducing eco-friendly packaging and supporting local producers.',
    'Мясные и колбасные изделия': 'Meat and sausage products',
    'Филе курицы': 'Chicken fillet',
    'Свежее куриное филе 1кг': 'Fresh chicken fillet 1 kg',
    'Свинина': 'Pork',
    'Свиная шея 1 кг': 'Pork neck 1 kg',
    'Говядина': 'Beef',
    'Вырезка говяжья 1 кг': 'Beef tenderloin 1 kg',
    'Капуста': 'Cabbage',
    'Капуста белокачанная 1кг': 'White cabbage 1 kg',
    'Менеджер': 'Manager',
    'Маркетолог': 'Marketing specialist',
    'Описание:': 'Description:',
    'Требования:': 'Requirements:',
    'Условия:': 'Conditions:',
    'Разработка и реализация маркетинговой стратегии': 'Development and implementation of a marketing strategy',
    'Планирование и проведение рекламных кампаний': 'Planning and running advertising campaigns',
    'Анализ эффективности маркетинговых активностей': 'Analyzing marketing performance',
    'Работа с социальными сетями и контентом': 'Working with social media and content',
    'Организация промо-акций и специальных предложений': 'Organizing promotions and special offers',
    'Опыт работы в маркетинге от 2 лет': '2+ years of marketing experience',
    'Знание digital-маркетинга и SMM': 'Knowledge of digital marketing and SMM',
    'Навыки аналитики и работы с метриками': 'Analytics and metrics skills',
    'Креативное мышление': 'Creative thinking',
    'Высшее образование в сфере маркетинга или рекламы': 'Higher education in marketing or advertising',
    'Конкурентная заработная плата + бонусы за результат': 'Competitive salary plus performance bonuses',
    'Свободный график работы': 'Flexible work schedule',
    'Современный офис в бизнес-центре': 'Modern office in a business center',
    'Профессиональное развитие за счет компании': 'Professional development covered by the company',
    'В нашу команду требуется креативный маркетолог для разработки и реализации стратегии продвижения сервиса доставки продуктов.': 'Our team needs a creative marketing specialist to develop and implement the promotion strategy for the grocery delivery service.',
    'Поиск и оценка новых поставщиков': 'Searching for and evaluating new suppliers',
    'Ведение переговоров о ценах и условиях поставки': 'Negotiating prices and delivery terms',
    'Анализ рынка и цен конкурентов': 'Market and competitor price analysis',
    'Формирование ассортиментной матрицы': 'Assortment matrix planning',
    'Контроль качества поступающих товаров': 'Incoming product quality control',
    'Консультирование клиентов по ассортименту и условиям доставки': 'Consulting customers on assortment and delivery terms',
    'Прием и обработка заказов по телефону': 'Receiving and processing phone orders',
    'Решение вопросов и конфликтных ситуаций': 'Resolving questions and conflicts',
    'Ведение базы данных клиентов': 'Maintaining the customer database',
    'Координация с курьерами и складом': 'Coordinating with couriers and the warehouse',
    'Комплектация заказов согласно товарным накладным': 'Picking orders according to invoices',
    'Проверка качества и срока годности продуктов': 'Checking product quality and shelf life',
    'Соблюдение стандартов упаковки товаров': 'Following product packaging standards',
    'Поддержание порядка на рабочем месте': 'Keeping the workplace tidy',
    'Своевременная доставка заказов клиентам': 'Timely delivery of customer orders',
    'Соблюдение правил дорожного движения и стандартов обслуживания': 'Following traffic rules and service standards',
    'Проверка целостности и комплектности заказов перед доставкой': 'Checking order integrity and completeness before delivery',
    'Взаимодействие с клиентами и решение возникающих вопросов': 'Communicating with customers and resolving issues',
    'В какое время вы работаете?': 'What hours do you work?',
    'Мы принимаем заказы круглосуточно через сайт и мобильное приложение. Доставка осуществляется с 8:00 до 23:00 ежедневно.': 'We accept orders around the clock via the website and mobile app. Delivery runs daily from 8:00 to 23:00.',
    'Что делать, если какой-то товар из моего заказа отсутствует?': 'What should I do if an item from my order is missing?',
    'Если товар временно отсутствует, мы свяжемся с вами для согласования замены на аналогичный товар или исключения его из заказа с соответствующим перерасчетом.': 'If an item is temporarily unavailable, we will contact you to agree on a replacement or remove it from the order with recalculation.',
    'Как вы следите за сроками годности продуктов?': 'How do you monitor product shelf life?',
    'Мы регулярно проверяем сроки годности всех продуктов на нашем складе. Если какой-то продукт имеет ограниченный срок годности, мы указываем это в описании.': 'We regularly check the shelf life of all products in our warehouse. If a product has a limited shelf life, we mention it in the description.',
    'Есть ли у вас бесплатная доставка?': 'Do you offer free delivery?',
    'Да, мы предлагаем бесплатную доставку для заказов от 40 BYN в пределах города. Для заказов на меньшую сумма стоимость доставки составляет 5 BYN.': 'Yes, we offer free delivery for orders from 40 BYN within the city. For smaller orders, delivery costs 5 BYN.',
    'Какие способы оплаты вы принимаете?': 'What payment methods do you accept?',
    'Мы принимаем наличные при получении, банковские карты (Visa, Mastercard, Белкарт), а также онлайн-оплату через систему ЕРИП и банковские приложения.': 'We accept cash on delivery, bank cards (Visa, Mastercard, Belkart), and online payment through ERIP and banking apps.',
    'Сколько времени занимает доставка?': 'How long does delivery take?',
    'Стандартное время доставки - 2-4 часа в зависимости от вашего местоположения и загруженности службы доставки. Время может увеличиваться в пиковые часы и в выходные дни.': 'Standard delivery takes 2–4 hours depending on your location and delivery workload. It may take longer during peak hours and weekends.',
    'Новые фермерские продукты в ассортименте': 'New farm products in the assortment',
    'В нашем каталоге появилось более 50 наименований органических продуктов от местных фермеров.': 'Our catalog now includes over 50 organic products from local farmers.',
    'Бесплатная доставка при заказе от 40 BYN': 'Free delivery for orders from 40 BYN',
    'Теперь доставка бесплатна для всех заказов на сумму от 40 BYN по всему городу.': 'Delivery is now free for all orders from 40 BYN across the city.',
    'Запуск мобильного приложения': 'Mobile app launched',
    'Теперь заказывать продукты стало еще удобнее с нашим новым мобильным приложением.': 'Ordering groceries is now even easier with our new mobile app.',
    'Сезонные скидки на летние продукты': 'Seasonal discounts on summer products',
    'Специальные предложения на фрукты, овощи и напитки к летнему сезону.': 'Special offers on fruit, vegetables and drinks for the summer season.',
    'Улучшена система упаковки скоропортящихся продуктов': 'Packaging for perishable products improved',
    'Внедрены новые термо-сумки для сохранения свежести продуктов во время доставки.': 'New thermal bags have been introduced to keep products fresh during delivery.',
    'Расширение географии доставки': 'Delivery area expanded',
    'Теперь мы доставляем заказы в пригородные районы и соседние населенные пункты.': 'We now deliver orders to suburban areas and nearby towns.',
    'Новая система лояльности для постоянных клиентов': 'New loyalty system for regular customers',
    'За каждую покупку начисляются бонусы, которые можно тратить на следующие заказы.': 'Every purchase earns bonuses that can be spent on future orders.',
    'Собственный бренд продуктов "Ферма у дома"': 'Own product brand "Farm at Home"',
    'Запущена линейка продуктов под нашим собственным брендом по доступным ценам.': 'A line of products under our own affordable brand has been launched.',
    'Партнерство с благотворительным фондом': 'Partnership with a charity fund',
    'Часть средств от каждого заказа теперь направляется в местный благотворительный фонд.': 'Part of every order now goes to a local charity fund.',
    'Цели сбора и обработки данных': 'Purposes of data collection and processing',
    'Хранение и защита данных': 'Data storage and protection',
    'Передача данных третьим лицам': 'Transfer of data to third parties',
    'Cookies и аналогичные технологии': 'Cookies and similar technologies',
    'Права пользователей': 'User rights',
    'Согласие на обработку данных': 'Consent to data processing',
    'Изменения в политике конфиденциальности': 'Privacy policy changes',
    'Контактная информация': 'Contact information'
});

Object.assign(siteRuToEn, {
    'Мы собираем следующую информацию: 1) Личные данные: имя, фамилия, номер телефона, адрес электронной почты, дата рождения; 2) Данные для доставки: адрес доставки, предпочтительное время доставки, история заказов; 3) Техническая информация: IP-адрес, данные о браузере и устройстве, cookies; 4) Платежная информация: данные банковской карты (хранятся в зашифрованном виде у платежного провайдера). Мы не собираем избыточную информацию и ограничиваемся только данными, необходимыми для предоставления наших услуг.': 'We collect the following information: 1) Personal data: first name, last name, phone number, email address and date of birth; 2) Delivery data: delivery address, preferred delivery time and order history; 3) Technical information: IP address, browser and device data, cookies; 4) Payment information: bank card data, stored encrypted by the payment provider. We do not collect excessive information and limit ourselves to data needed to provide our services.',
    'Мы используем ваши персональные данные для: 1) Обработки и доставки ваших заказов; 2) Связи с вами по вопросам заказов и предоставления информации о статусе доставки; 3) Улучшения качества наших услуг и разработки новых функций; 4) Персонализации контента и рекомендаций товаров; 5) Обработки платежей и предотвращения мошенничества; 6) Информирования об акциях, скидках и специальных предложениях (только с вашего согласия); 7) Обеспечения безопасности наших услуг и пользователей.': 'We use your personal data to: 1) Process and deliver your orders; 2) Contact you about orders and delivery status; 3) Improve service quality and develop new features; 4) Personalize content and product recommendations; 5) Process payments and prevent fraud; 6) Inform you about promotions, discounts and special offers with your consent; 7) Ensure the security of our services and users.',
    'Мы храним персональные данные в течение срока, необходимого для достижения целей их обработки, или в течение срока, установленного законодательством. Мы применяем современные технические и организационные меры защиты данных, включая шифрование передаваемой информации, ограничение доступа к данным, регулярное обновление систем безопасности. Все платежные данные обрабатываются через защищенные платежные шлюзы и не хранятся на наших серверах.': 'We store personal data for as long as necessary for the purposes of processing or for the period required by law. We use modern technical and organizational data protection measures, including encryption, access restrictions and regular security updates. All payment data is processed through secure payment gateways and is not stored on our servers.',
    'Мы не продаем и не передаем ваши персональные данные третьим лицам, за исключением: 1) Случаев, когда это необходимо для оказания услуг (курьерским службам для доставки заказов); 2) Платежных систем для обработки платежей; 3) По требованию законодательства или уполномоченных государственных органов; 4) При смене владельца бизнеса или активов компании. Во всех случаях мы обеспечиваем соответствие обработки данных требованиям конфиденциальности.': 'We do not sell or transfer your personal data to third parties except when: 1) It is necessary to provide services, such as sharing delivery details with couriers; 2) Payment systems need it to process payments; 3) It is required by law or authorized government bodies; 4) The business owner or company assets change. In all cases, we ensure data processing complies with confidentiality requirements.',
    'Мы используем cookies и аналогичные технологии для: 1) Запоминания ваших предпочтений и данных авторизации; 2) Анализа использования Сайта и улучшения его функциональности; 3) Предоставления персонализированного контента и рекламных предложений; 4) Сбора статистической информации о посещаемости. Вы можете управлять настройками cookies через параметры вашего браузера, однако это может ограничить функциональность Сайта.': 'We use cookies and similar technologies to: 1) Remember your preferences and authorization data; 2) Analyze Site usage and improve functionality; 3) Provide personalized content and promotional offers; 4) Collect traffic statistics. You can manage cookies in your browser settings, but this may limit Site functionality.',
    'Вы имеете право: 1) На доступ к вашим персональным данным и их получение; 2) На исправление неточных или неполных данных; 3) На удаление ваших персональных данных, за исключением случаев, когда мы обязаны хранить их по закону; 4) На отзыв согласия на обработку данных; 5) На ограничение обработки ваших данных; 6) На перенос данных в машиночитаемом формате. Для реализации этих прав обратитесь в нашу службу поддержки.': 'You have the right to: 1) Access and receive your personal data; 2) Correct inaccurate or incomplete data; 3) Delete your personal data unless we are required to store it by law; 4) Withdraw consent to data processing; 5) Restrict data processing; 6) Transfer data in a machine-readable format. To exercise these rights, contact support.',
    'Используя наш Сайт и услуги, вы даете явное согласие на обработку ваших персональных данных в соответствии с настоящей Политикой конфиденциальности. Вы можете отозвать свое согласие в любое время, отправив запрос на электронную почту privacy@product-delivery.by. Отзыв согласия не влияет на законность обработки данных, произведенной до его отзыва.': 'By using our Site and services, you explicitly consent to the processing of your personal data under this Privacy Policy. You can withdraw consent at any time by emailing privacy@product-delivery.by. Withdrawal does not affect the legality of processing performed before withdrawal.',
    'Мы можем периодически обновлять настоящую Политику конфиденциальности. Все изменения вступают в силу с момента их опубликования на Сайте. Мы уведомим вас о значительных изменениях через email или push-уведомления в мобильном приложении. Рекомендуем регулярно проверять актуальную версию Политики конфиденциальности.': 'We may periodically update this Privacy Policy. All changes take effect when published on the Site. We will notify you about significant changes by email or push notification in the mobile app. We recommend checking the current policy regularly.',
    'По всем вопросам, связанным с обработкой ваших персональных данных и настоящей Политикой конфиденциальности, обращайтесь: Электронная почта: privacy@product-delivery.by; Телефон: +375 (17) 123-45-67 (с 9:00 до 18:00 в рабочие дни); Почтовый адрес: 220000, г. Минск, ул. Примерная, 15, оф. 34, ООО "Продуктовая доставка".': 'For all questions about personal data processing and this Privacy Policy, contact us: Email: privacy@product-delivery.by; Phone: +375 (17) 123-45-67 from 9:00 to 18:00 on business days; Postal address: 220000, Minsk, Primernaya St. 15, office 34, Grocery Delivery LLC.',
    'Бюджет на реализацию маркетинговых идей': 'Budget for implementing marketing ideas',
    'Опыт работы в закупках продуктов питания от 2 лет': '2+ years of food purchasing experience',
    'Знание рынка поставщиков в регионе': 'Knowledge of the regional supplier market',
    'Навыки ведения переговоров': 'Negotiation skills',
    'Аналитическое мышление': 'Analytical thinking',
    'Высшее образование в сфере экономики или торговли': 'Higher education in economics or commerce',
    'Достойная заработная плата + процент от экономии': 'Good salary plus a percentage of savings',
    'Гибкий график работы': 'Flexible schedule',
    'Служебный автомобиль для выездов к поставщикам': 'Company car for supplier visits',
    'Корпоративный мобильный телефон и ноутбук': 'Corporate mobile phone and laptop',
    'Оплачиваемые командировки': 'Paid business trips',
    'Грамотная речь и приятный голос': 'Clear speech and a pleasant voice',
    'Умение работать в многозадачном режиме': 'Ability to multitask',
    'Стрессоустойчивость и терпение': 'Stress resistance and patience',
    'Опыт работы в сфере обслуживания приветствуется': 'Service experience is welcome',
    'Базовые знания о продуктах питания': 'Basic knowledge of food products',
    'Работа в современном офисе в центре города': 'Work in a modern office in the city center',
    'Гибкий график работы (возможны ночные смены)': 'Flexible schedule, night shifts possible',
    'Обучение за счет компании': 'Company-paid training',
    'Корпоративная связь и льготы': 'Corporate communication and benefits',
    'Система бонусов по результатам работы': 'Performance bonus system',
    'Работа с терминалом сбора данных': 'Working with a data collection terminal',
    'Внимательность и аккуратность': 'Attention and accuracy',
    'Физическая выносливость (работа на ногах)': 'Physical endurance for standing work',
    'Базовые знания по категориям продуктов': 'Basic knowledge of product categories',
    'Ответственное отношение к работе': 'Responsible attitude to work',
    'Опыт работы на складе приветствуется': 'Warehouse experience is welcome',
    'Конкурентная заработная плата (оклад + бонусы за скорость)': 'Competitive salary with speed bonuses',
    'Современное складское оборудование': 'Modern warehouse equipment',
    'Сменный график работы': 'Shift schedule',
    'Бесплатное питание во время смены': 'Free meals during shifts',
    'Возможность карьерного роста': 'Career growth opportunities',
    'Водительское удостоверение категории B': 'Category B driving license',
    'Опыт вождения от 2 лет': '2+ years of driving experience',
    'Хорошее знание города': 'Good knowledge of the city',
    'Ответственность, пунктуальность, вежливость': 'Responsibility, punctuality and politeness',
    'Готовность к работе в сменном графике': 'Readiness to work shifts',
    'Стабильная заработная плата (оклад + проценты от доставок)': 'Stable salary plus delivery percentage',
    'Служебный автомобиль с полной страховкой': 'Company car with full insurance',
    'Оплачиваемое обучение и стажировка': 'Paid training and internship',
    'График работы 5/2 или 2/2': 'Schedule 5/2 or 2/2',
    'Корпоративная мобильная связь': 'Corporate mobile connection'
});

Object.assign(siteRuToEn, {
    'КАК РАБОТАЕМ': 'HOW WE WORK',
    'Ценности сервиса': 'Service values',
    'Качество': 'Quality',
    'проверяем заказ': 'order checked',
    'Проверяем срок годности, упаковку и внешний вид товаров перед передачей заказа.': 'We check shelf life, packaging and appearance before handing over the order.',
    'Скорость': 'Speed',
    'маршрут до двери': 'route to your door',
    'Собираем заказ без лишних шагов и заранее планируем маршрут курьера.': 'We assemble orders without extra steps and plan the courier route in advance.',
    'Честная цена': 'Fair price',
    'Показываем стоимость товаров, доставки и скидок до подтверждения заказа.': 'We show product, delivery and discount costs before order confirmation.',
    'Поддержка': 'Support',
    'Помогаем с заменами, оплатой и вопросами по доставке без долгих ожиданий.': 'We help with replacements, payment and delivery questions without long waits.',
    'Люди, которые отвечают за сервис': 'People responsible for the service',
    'Иван Иванов': 'Ivan Ivanov',
    'Мария Петрова': 'Maria Petrova',
    'Алексей Смирнов': 'Alexey Smirnov',
    'Основатель и руководитель сервиса': 'Founder and service manager',
    'Контроль качества и работа с поставщиками': 'Quality control and supplier relations',
    'Маршруты, курьеры и операционные процессы': 'Routes, couriers and operations',
    'Офис отмечен на карте. Нажмите «Определить расстояние», чтобы построить маршрут.': 'The office is marked on the map. Click “Calculate distance” to build a route.',
    'ДОКУМЕНТЫ': 'DOCUMENTS',
    'СЕРТИФИКАТ СООТВЕТСТВИЯ № CT-12345 от 15 мая 2023 года Выдан: ООО "Продуктовая доставка" Адрес: 220000, г. Минск, ул. Примерная, 15 Подтверждает, что система менеджмента качества соответствует требованиям СТБ ISO 9001-2020 Область применения: оказание услуг по доставке продуктов питания и сопутствующих товаров Срок действия: с 15 мая 2023 года по 14 мая 2026 года Орган по сертификации: ООО "Белорусский центр сертификации" Регистрационный номер: РОСС BY.АБ12.В12345': 'CERTIFICATE OF CONFORMITY No. CT-12345 dated May 15, 2023 Issued to: Grocery Delivery LLC Address: 220000, Minsk, Primernaya St. 15 Confirms that the quality management system complies with STB ISO 9001-2020 Scope: delivery of food products and related goods Valid from May 15, 2023 to May 14, 2026 Certification body: Belarusian Certification Center LLC Registration number: ROSS BY.AB12.B12345',
    'Крупнейшая сеть магазинов в Беларуси': 'The largest store chain in Belarus',
    'Крупнейший производитель молочной продукции в Беларуси': 'The largest dairy producer in Belarus',
    'Национальная платежная система': 'National payment system',
    'Погода в Минск': 'Weather in Minsk',
    'Пасмурно': 'Cloudy',
    'Источник: Open-Meteo': 'Source: Open-Meteo',
    'Источник: НБРБ': 'Source: NBRB',
    'Июль 2026': 'July 2026',
    'Пн': 'Mon',
    'Вт': 'Tue',
    'Ср': 'Wed',
    'Чт': 'Thu',
    'Пт': 'Fri',
    'Сб': 'Sat',
    'Вс': 'Sun',
    'сегодня': 'today',
    'г. Минск, ул. Примерная, 15': 'Minsk, Primernaya St. 15',
    'Пн-Пт: 8:00-22:00, Сб-Вс: 9:00-20:00': 'Mon-Fri: 8:00-22:00, Sat-Sun: 9:00-20:00',
    'Подпишитесь на нашу рассылку, чтобы первыми узнавать об акциях и новинках.': 'Subscribe to our newsletter to be the first to learn about promotions and new products.',
    '© 2023 Продуктовая доставка. Все права защищены.': '© 2023 Grocery Delivery. All rights reserved.',
    'Можно ли изменить или отменить заказ после оформления?': 'Can I change or cancel an order after placing it?',
    'Как вы обеспечиваете качество продуктов?': 'How do you ensure product quality?',
    'Учитываете ли вы информацию об аллергенах в продуктах?': 'Do you take product allergen information into account?',
    'Добавлено: 03.06.2025': 'Added: 03.06.2025',
    'Отдел продаж': 'Sales department',
    'Консультирование клиентов': 'Customer consulting',
    'Прием заказов': 'Order processing',
    'Решение вопросов': 'Issue resolution',
    'Обязанности:': 'Responsibilities:',
    'Поддержание чистоты и порядка в служебном автомобиле': 'Keeping the company car clean and tidy',
    'Приятные цены и хорошие сотрудники.': 'Nice prices and good staff.',
    'Отличный сервис для заказа продуктов, но есть нюансы поэтому 4': 'Great service for ordering groceries, but there are some nuances, so 4.',
    'Да': 'Yes',
    'Нет': 'No',
    'Самовывоз': 'Pickup',
    'Курьер': 'Courier',
    'за доставку': 'for delivery',
    'Топ товаров': 'Top products',
    'Самые доходные позиции по заказам': 'The most profitable order items',
    'Распределение заказов по способам получения': 'Distribution of orders by delivery method',
    'Последние заказы': 'Recent orders',
    'Быстрый контроль свежих операций': 'Quick control of recent operations',
    'ЗАКАЗ': 'ORDER',
    'КЛИЕНТ': 'CLIENT',
    'СУММА': 'TOTAL',
    'АДМИНИСТРИРОВАНИЕ': 'ADMINISTRATION',
    'ФОТО': 'PHOTO',
    'ОПИСАНИЕ РАБОТ': 'JOB DESCRIPTION',
    'ПОЧТА': 'EMAIL',
    'Премировать выбранных': 'Reward selected',
    'Цена': 'Price',
    'Тип': 'Type',
    'Остаток:': 'Stock:',
    'Типы товаров': 'Product types',
    'Используются в фильтрах каталога и отчётах.': 'Used in catalog filters and reports.',
    'Новый тип товара': 'New product type',
    'Добавить': 'Add',
    'Фрукты': 'Fruits',
    'Овощи': 'Vegetables',
    'Мясные и колбасные изделия': 'Meat and sausages',
    'Вода': 'Water',
    'Капуста': 'Cabbage',
    'Доставка свежих продуктов': 'Fresh grocery delivery',
    'Ваша корзина': 'Your cart',
    'Условия доставки': 'Delivery terms',
    'Готовы оформить доставку?': 'Ready to place a delivery order?',
    'Готовы оформить заказ доставки?': 'Ready to place a delivery order?',
    'Выбрать товары': 'View products',
    'Смотреть товары': 'View products'
});

Object.assign(siteRuToEn, {
    'В какое время вы работаете?': 'What hours do you work?',
    'Мы принимаем заказы круглосуточно через сайт и мобильное приложение. Доставка осуществляется с 8:00 до 23:00 ежедневно.': 'We accept orders around the clock via the website and mobile app. Delivery is available daily from 8:00 to 23:00.',
    'Что делать, если какой-то товар из моего заказа отсутствует?': 'What should I do if an item from my order is missing?',
    'Если товар временно отсутствует, мы свяжемся с вами для согласования замены на аналогичный товар или исключения его из заказа с соответствующим перерасчетом.': 'If an item is temporarily unavailable, we will contact you to agree on a similar replacement or remove it from the order with recalculation.',
    'Как вы следите за сроками годности продуктов?': 'How do you monitor product shelf life?',
    'Мы регулярно проверяем сроки годности всех продуктов на нашем складе. Если какой-то продукт имеет ограниченный срок годности, мы указываем это в описании.': 'We regularly check the shelf life of all products in our warehouse. If a product has a limited shelf life, we specify it in the description.',
    'Да, мы указываем информацию об основных аллергенах в описании продуктов. Если у вас есть серьезные аллергии, пожалуйста, уточняйте дополнительную информацию у нашего оператора.': 'Yes, we list major allergen information in product descriptions. If you have serious allergies, please check additional details with our operator.',
    'Да, мы предлагаем бесплатную доставку для заказов от 40 BYN в пределах города. Для заказов на меньшую сумма стоимость доставки составляет 5 BYN.': 'Yes, we offer free delivery for orders from 40 BYN within the city. For smaller orders, delivery costs 5 BYN.',
    'Все продукты проходят тщательный отбор и контроль качества. Мы работаем напрямую с проверенными поставщиками и производителями, а скоропортящиеся товары доставляются в специальных термо-сумках.': 'All products go through careful selection and quality control. We work directly with trusted suppliers and producers, and perishable goods are delivered in special thermal bags.',
    'Вы можете изменить или отменить заказ в течение 30 минут после оформления, позвонив по нашему телефону. После этого времени заказ поступает в обработку, и изменения могут быть невозможны.': 'You can change or cancel an order within 30 minutes after placing it by calling us. After that, the order goes into processing and changes may be unavailable.',
    'Какие способы оплаты вы принимаете?': 'What payment methods do you accept?',
    'Мы принимаем наличные при получении, банковские карты (Visa, Mastercard, Белкарт), а также онлайн-оплату через систему ЕРИП и банковские приложения.': 'We accept cash on delivery, bank cards (Visa, Mastercard, Belkart), and online payment via ERIP and banking apps.',
    'Стандартное время доставки - 2-4 часа в зависимости от вашего местоположения и загруженности службы доставки. Время может увеличиваться в пиковые часы и в выходные дни.': 'Standard delivery time is 2-4 hours depending on your location and delivery workload. It may increase during peak hours and weekends.',
    'Какая минимальная сумма заказа?': 'What is the minimum order amount?',
    'Минимальная сумма заказа составляет 20 BYN. Это помогает нам покрывать расходы на доставку и обеспечивать качественный сервис для всех клиентов.': 'The minimum order amount is 20 BYN. This helps us cover delivery costs and provide quality service for all customers.',
    'Быстрая доставка и приятные акции и бонусы.': 'Fast delivery and nice promotions and bonuses.',
    'Самый лучший сервис доставки продуктов!': 'The best grocery delivery service!',
    'Морковь': 'Carrots',
    'Свежая морковь 1кг': 'Fresh carrots 1 kg',
    'Яблоки': 'Apples',
    'Яблоки белорусские': 'Belarusian apples',
    'Апельсины': 'Oranges',
    'Апельсины 1кг': 'Oranges 1 kg',
    'Картофель': 'Potatoes',
    'Картофель белорусский': 'Belarusian potatoes',
    'Филе курицы': 'Chicken fillet',
    'Свежее куриное филе 1кг': 'Fresh chicken fillet 1 kg',
    'Свинина': 'Pork',
    'Свиная шея 1 кг': 'Pork neck 1 kg',
    'Говядина': 'Beef',
    'Вырезка говяжья 1 кг': 'Beef tenderloin 1 kg',
    'Бананы': 'Bananas',
    'Свежие бананы 1 кг': 'Fresh bananas 1 kg',
    'Капуста белокачанная 1кг': 'White cabbage 1 kg',
    'Кока кола 1л': 'Coca cola 1 l',
    'Килограммы': 'Kilograms',
    'Штуки': 'Pieces',
    'Литры': 'Liters',
    'Администратор менеджмента': 'Management administrator',
    'Менеджер': 'Manager',
    'Менеджер заказов': 'Order manager',
    'Техническая поддержка': 'Technical support',
    'Неизвестно': 'Unknown',
    'Запуск экспресс-доставки за 60 минут': '60-minute express delivery launch',
    'Теперь вы можете получить свои покупки всего за час в радиусе 10 км от наших складов.': 'Now you can receive your groceries in just one hour within 10 km of our warehouses.',
    'Новые фермерские продукты в ассортименте': 'New farm products in the assortment',
    'В нашем каталоге появилось более 50 наименований органических продуктов от местных фермеров.': 'Our catalog now includes more than 50 organic products from local farmers.',
    'Запуск мобильного приложения': 'Mobile app launch',
    'Теперь заказывать продукты стало еще удобнее с нашим новым мобильным приложением.': 'Ordering groceries is now even easier with our new mobile app.',
    'Сезонные скидки на летние продукты': 'Seasonal discounts on summer products',
    'Специальные предложения на фрукты, овощи и напитки к летнему сезону.': 'Special offers on fruits, vegetables and drinks for the summer season.',
    'Улучшена система упаковки скоропортящихся продуктов': 'Improved packaging system for perishable products',
    'Внедрены новые термо-сумки для сохранения свежести продуктов во время доставки.': 'New thermal bags have been introduced to keep products fresh during delivery.',
    'Расширение географии доставки': 'Delivery area expansion',
    'Теперь мы доставляем заказы в пригородные районы и соседние населенные пункты.': 'We now deliver orders to suburban areas and nearby settlements.',
    'Новая система лояльности для постоянных клиентов': 'New loyalty system for regular customers',
    'За каждую покупку начисляются бонусы, которые можно тратить на следующие заказы.': 'Every purchase earns bonuses that can be spent on future orders.',
    'Собственный бренд продуктов "Ферма у дома"': 'Own product brand “Farm at Home”',
    'Запущена линейка продуктов под нашим собственным брендом по доступным ценам.': 'A line of affordable products under our own brand has been launched.',
    'Часть средств от каждого заказа теперь направляется в местный благотворительный фонд.': 'Part of each order now goes to a local charity fund.',
    'Маркетолог': 'Marketing specialist',
    'Описание:': 'Description:',
    'В нашу команду требуется креативный маркетолог для разработки и реализации стратегии продвижения сервиса доставки продуктов.': 'Our team needs a creative marketing specialist to develop and implement a promotion strategy for the grocery delivery service.',
    'Разработка и реализация маркетинговой стратегии': 'Development and implementation of a marketing strategy',
    'Планирование и проведение рекламных кампаний': 'Planning and running advertising campaigns',
    'Ведение социальных сетей и контент-маркетинг': 'Social media and content marketing',
    'Анализ эффективности маркетинговых активностей': 'Analysis of marketing activity effectiveness',
    'Менеджер по закупкам': 'Purchasing manager',
    'Оператор call-центра': 'Call center operator',
    'Сборщик заказов': 'Order picker',
    'Курьер-водитель': 'Courier driver',
    'Требования:': 'Requirements:',
    'Условия:': 'Conditions:',
    'Поддержание чистоты и порядка': 'Maintaining cleanliness and order'
});

Object.assign(siteRuToEn, {
    'Доставлено': 'Delivered',
    'ДОСТАВЛЕНО': 'DELIVERED',
    'Документы': 'Documents',
    'Заказ': 'Order',
    'Клиент': 'Client',
    'Сумма': 'Total',
    'Исполнитель': 'Assignee',
    'Управление': 'Management',
    'ИСПОЛНИТЕЛЬ': 'ASSIGNEE',
    'УПРАВЛЕНИЕ': 'MANAGEMENT',
    'Банковская карта': 'Bank card',
    'доставка': 'delivery',
    'Не назначен': 'Unassigned',
    'Минск': 'Minsk',
    'ДОСТАВКА СВЕЖИХ ПРОДУКТОВ': 'FRESH GROCERY DELIVERY',
    'Запросить документы': 'Request documents',
    'СТАТУС': 'STATUS',
    'ОБЩАЯ СТОИМОСТЬ': 'TOTAL',
    'ДЕЙСТВИЯ': 'ACTIONS',
    'ПРОДУКТ': 'PRODUCT',
    'КОЛИЧЕСТВО': 'QUANTITY'
});

Object.assign(siteRuToEn, {
    'Личный кабинет': 'Personal account',
    'ЛИЧНЫЙ КАБИНЕТ': 'PERSONAL ACCOUNT',
    'Профиль пользователя': 'User profile',
    'Редактирование профиля': 'Edit profile',
    'Сохранить изменения': 'Save changes',
    'На главную': 'Back to home',
    'Дата рождения': 'Birth date',
    'Электронная почта': 'Email',
    'Телефон': 'Phone',
    'Адрес': 'Address',
    'Заказов': 'Orders',
    'В корзине': 'In cart',
    'Промокодов': 'Promo codes',
    'Информация о стране': 'Country information',
    'Страна:': 'Country:',
    'Столица:': 'Capital:',
    'Регион:': 'Region:',
    'Пожалуйста, исправьте ошибки:': 'Please fix the errors:',
    'Всего терминов': 'Total terms',
    'Всего терминов:': 'Total terms:',
    'Сегодня': 'Today',
    'сегодня': 'today',
    'Пасмурно': 'Cloudy',
    'Доставлено': 'Delivered',
    'ОПИСАНИЕ РАБОТ': 'JOB DESCRIPTION',
    'ФОТО': 'PHOTO',
    'ПОЧТА': 'EMAIL',
    'Описание работ': 'Job description',
    'Фото': 'Photo',
    'Почта': 'Email',
    'Премировать выбранных': 'Reward selected',
    'Администрирование': 'Administration',
    'На панели': 'To panel',
    'Не назначен': 'Unassigned',
    'Самовывоз': 'Pickup',
    'Курьер': 'Courier',
    'Банковская карта': 'Bank card',
    'доставка': 'delivery',
    'Заказ': 'Order',
    'Клиент': 'Client',
    'Сумма': 'Total',
    'Исполнитель': 'Assignee',
    'Управление': 'Management',
    'Текущее распределение': 'Current distribution',
    'Медианный чек': 'Median order value',
    'Наиболее частый чек': 'Most frequent order value',
    'Средний возраст клиентов': 'Average customer age',
    'Медианный возраст': 'Median age',
    'Наличные при получении': 'Cash on delivery',
    'Наличными при получении': 'Cash on delivery'
});

Object.assign(siteRuToEn, {
    'Заказ #2048': 'Order #2048',
    'Сборка и доставка': 'Picking and delivery',
    'В работе': 'In progress',
    'Принят': 'Accepted',
    'Собран': 'Packed',
    'В пути': 'On the way',
    'Свежий набор': 'Fresh set',
    '24 мин': '24 min',
    'До двери': 'To the door',
    'Маршрут готов': 'Route ready'
});

Object.assign(siteRuToEn, {
    'КОНТАКТЫ': 'CONTACTS',
    'Всегда на связи': 'Always in touch',
    'Поможем с заказом, доставкой и работой сервиса — выберите удобный канал.': 'We will help with orders, delivery and service — choose a convenient channel.',
    'Позвонить': 'Call us',
    'Написать': 'Email us',
    'Единый центр поддержки': 'Support center',
    'Отвечаем ежедневно': 'Available every day',
    'Обычно отвечаем за 5 минут': 'We usually respond within 5 minutes',
    'Удобный способ связи': 'A convenient way to reach us',
    'Позвонить в поддержку': 'Call support',
    'Написать на почту': 'Send an email',
    'Приехать в офис': 'Visit our office',
    'КОМАНДА ПОДДЕРЖКИ': 'SUPPORT TEAM',
    'Люди, которые решают вопросы': 'People who solve problems',
    'Наши сотрудники помогут с заказом, доставкой и техническими вопросами.': 'Our team will help with orders, delivery and technical issues.',
    'На связи': 'Available',
    'Чем поможет': 'How they can help',
    'Работа с обращениями': 'Handling requests',
    'Контроль качества сервиса': 'Service quality control',
    'ОФИС И РЕКВИЗИТЫ': 'OFFICE AND CONTACTS',
    'Заходите или свяжитесь напрямую': 'Visit us or contact us directly',
    'Построить маршрут': 'Get directions',
    'Сотрудников пока нет': 'No employees yet',
    'Сотрудник': 'Employee',
    'Технические вопросы': 'Technical issues',
    'Заказы и доставка': 'Orders and delivery',
    'Информация о нашей команде скоро появится': 'Our team information will be available soon',
    'Помощь с заказами, доставкой и работой сайта.': 'Help with orders, delivery and the website.',
    'Адрес и график работы': 'Address and opening hours',
    'Пн–Пт: 9:00–18:00': 'Mon–Fri: 9:00–18:00',
    'Сб–Вс: 10:00–16:00': 'Sat–Sun: 10:00–16:00',
    'г. Минск, ул. Примерная, 15': 'Minsk, Primernaya St., 15',
    'Общие вопросы и помощь с заказом': 'General questions and order support',
    'Отдел поддержки': 'Support department',
    'График работы': 'Opening hours',
    'Связаться': 'Contact',
    'Телефон': 'Phone',
    'Почта': 'Email'
});

const siteEnToRu = Object.fromEntries(Object.entries(siteRuToEn).map(([ru, en]) => [en, ru]));
const siteMixedToEn = {
    'Запуск первого интернет-магазина с ассортиментом 200 products': 'Launch of the first online store with 200 products',
    'Расширение ассортимента до 5000+ products и 50,000+ постоянных клиентов': 'Expansion to 5000+ products and 50,000+ regular customers',
    'Statistics магазина': 'Store statistics',
    'Allго заказов': 'Total orders',
    'DESCRIPTION РАБОТ': 'JOB DESCRIPTION',
    'Products и категории': 'Products and categories',
    'All статусы': 'All statuses',
    'All типы': 'All types',
    'All способы': 'All methods',
    'Проофводитель': 'Producer'
};

function replaceWholeTextPreservingSpace(value, replacement) {
    const leading = value.match(/^\s*/)?.[0] || '';
    const trailing = value.match(/\s*$/)?.[0] || '';
    return `${leading}${replacement}${trailing}`;
}

function translateLongFragments(trimmed, lang) {
    const mainMap = lang === 'en' ? siteRuToEn : siteEnToRu;
    const extraMap = lang === 'en' ? siteMixedToEn : {};
    const pairs = Object.entries({ ...mainMap, ...extraMap })
        .filter(([from]) => from.length >= 30)
        .sort((a, b) => b[0].length - a[0].length);
    let translated = trimmed;
    pairs.forEach(([from, to]) => {
        if (translated.includes(from)) {
            translated = translated.split(from).join(to);
        }
    });
    return translated;
}

const ruDatePartsToEn = {
    'января': 'January',
    'февраля': 'February',
    'марта': 'March',
    'апреля': 'April',
    'мая': 'May',
    'июня': 'June',
    'июля': 'July',
    'августа': 'August',
    'сентября': 'September',
    'октября': 'October',
    'ноября': 'November',
    'декабря': 'December',
    'Июль': 'July'
};
const enDatePartsToRu = {
    'January': 'января',
    'February': 'февраля',
    'March': 'марта',
    'April': 'апреля',
    'May': 'мая',
    'June': 'июня',
    'July': 'июля',
    'August': 'августа',
    'September': 'сентября',
    'October': 'октября',
    'November': 'ноября',
    'December': 'декабря'
};

function translateDateParts(text, lang) {
    const map = lang === 'en' ? ruDatePartsToEn : enDatePartsToRu;
    let translated = text;
    Object.entries(map).forEach(([from, to]) => {
        translated = translated.split(from).join(to);
    });
    if (lang === 'en') {
        translated = translated.replace(/\s+г\./g, '');
    }
    return translated;
}

function translateDecoratedText(trimmed, lang) {
    const decorated = trimmed.match(/^([^A-Za-zА-Яа-яЁё0-9]+)(.+)$/u);
    if (!decorated) return null;
    const [, prefix, body] = decorated;
    const map = lang === 'en' ? siteRuToEn : siteEnToRu;
    const mixed = lang === 'en' ? siteMixedToEn : {};
    const bodyText = body.trim();
    let translatedBody = map[bodyText] || mixed[bodyText];
    if (!translatedBody) {
        const recursive = translateSiteText(bodyText, lang).replace(/\s+/g, ' ').trim();
        if (recursive && recursive !== bodyText) translatedBody = recursive;
    }
    return translatedBody ? `${prefix}${translatedBody}` : null;
}

function translateSiteText(value, lang) {
    const trimmed = value.replace(/\s+/g, ' ').trim();
    if (!trimmed) return value;
    const direct = lang === 'en' ? siteRuToEn[trimmed] : siteEnToRu[trimmed];
    if (direct) return replaceWholeTextPreservingSpace(value, direct);
    if (lang === 'en' && siteMixedToEn[trimmed]) return replaceWholeTextPreservingSpace(value, siteMixedToEn[trimmed]);

    if (lang === 'en') {
        const totalTerms = trimmed.match(/^Всего терминов:\s*(\d+)$/);
        if (totalTerms) return replaceWholeTextPreservingSpace(value, `Total terms: ${totalTerms[1]}`);
        const todayCell = trimmed.match(/^(\d+)\s+сегодня$/i);
        if (todayCell) return replaceWholeTextPreservingSpace(value, `${todayCell[1]} today`);
    } else {
        const totalTerms = trimmed.match(/^Total terms:\s*(\d+)$/);
        if (totalTerms) return replaceWholeTextPreservingSpace(value, `Всего терминов: ${totalTerms[1]}`);
        const todayCell = trimmed.match(/^(\d+)\s+today$/i);
        if (todayCell) return replaceWholeTextPreservingSpace(value, `${todayCell[1]} сегодня`);
    }

    const decorated = translateDecoratedText(trimmed, lang);
    if (decorated) return replaceWholeTextPreservingSpace(value, decorated);

    if (lang === 'en' && trimmed.startsWith('СЕРТИФИКАТ СООТВЕТСТВИЯ')) {
        return replaceWholeTextPreservingSpace(value, 'CERTIFICATE OF CONFORMITY No. CT-12345 dated May 15, 2023. Issued to: Grocery Delivery LLC. Address: 220000, Minsk, Primernaya St. 15. Confirms that the quality management system complies with STB ISO 9001-2020. Scope: delivery of food products and related goods. Valid from May 15, 2023 to May 14, 2026. Certification body: Belarusian Certification Center LLC. Registration number: ROSS BY.AB12.B12345.');
    }

    const fragmented = translateLongFragments(trimmed, lang);
    if (fragmented !== trimmed) return replaceWholeTextPreservingSpace(value, fragmented);

    if (lang === 'en') {
        if (/^Показано\s+\d+\s+товар/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('Показано', 'Showing').replace('товаров', 'products').replace('товара', 'products').replace('товар', 'product'));
        if (/^Найдено товаров:\s+\d+/.test(trimmed)) return value.replace('Найдено товаров:', 'Products found:');
        if (/^Календарь на\s+/.test(trimmed)) return replaceWholeTextPreservingSpace(value, translateDateParts(trimmed.replace('Календарь на', 'Calendar for'), lang));
        if (/^Дата:\s+/.test(trimmed)) return replaceWholeTextPreservingSpace(value, translateDateParts(trimmed.replace('Дата:', 'Date:').replace('Временная зона:', 'Timezone:'), lang));
        if (/^Актуально на:\s+/.test(trimmed)) return value.replace('Актуально на:', 'Updated:');
        if (/^Источник:\s+/.test(trimmed)) return value.replace('Источник:', 'Source:');
        if (/^Страница\s+\d+\s+из\s+\d+$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('Страница', 'Page').replace('из', 'of'));
        if (/\sза доставку$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('за доставку', 'for delivery'));
        if (/^\d+\s+мин чтения$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('мин чтения', 'min read'));
        if (/^\d+\s+в архиве$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('в архиве', 'archived'));
        if (/^\d+\s+активных$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('активных', 'active'));
        if (/^\d+\s+поз\.$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('поз.', 'items'));
        if (/^\d+\s+раз$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('раз', 'times'));
        if (/^\d+\s+шт\.$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('шт.', 'pcs.'));
        if (/^В наличии:\s+\d+\s+шт\.$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('В наличии:', 'In stock:').replace('шт.', 'pcs.'));
        if (/^\d+\s+товар/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('товаров', 'products').replace('товара', 'products').replace('товар', 'product'));
    } else {
        if (/^Showing\s+\d+\s+product/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('Showing', 'Показано').replace('products', 'товаров').replace('product', 'товар'));
        if (/^Products found:\s+\d+/.test(trimmed)) return value.replace('Products found:', 'Найдено товаров:');
        if (/^Calendar for\s+/.test(trimmed)) return replaceWholeTextPreservingSpace(value, translateDateParts(trimmed.replace('Calendar for', 'Календарь на'), lang));
        if (/^Date:\s+/.test(trimmed)) return replaceWholeTextPreservingSpace(value, translateDateParts(trimmed.replace('Date:', 'Дата:').replace('Timezone:', 'Временная зона:'), lang));
        if (/^Updated:\s+/.test(trimmed)) return value.replace('Updated:', 'Актуально на:');
        if (/^Source:\s+/.test(trimmed)) return value.replace('Source:', 'Источник:');
        if (/^Page\s+\d+\s+of\s+\d+$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('Page', 'Страница').replace('of', 'из'));
        if (/\sfor delivery$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('for delivery', 'за доставку'));
        if (/^\d+\s+min read$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('min read', 'мин чтения'));
        if (/^\d+\s+archived$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('archived', 'в архиве'));
        if (/^\d+\s+active$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('active', 'активных'));
        if (/^\d+\s+items$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('items', 'поз.'));
        if (/^\d+\s+times$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('times', 'раз'));
        if (/^\d+\s+pcs\.$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('pcs.', 'шт.'));
        if (/^In stock:\s+\d+\s+pcs\.$/.test(trimmed)) return replaceWholeTextPreservingSpace(value, trimmed.replace('In stock:', 'В наличии:').replace('pcs.', 'шт.'));
    }

    const dateTranslated = translateDateParts(trimmed, lang);
    if (dateTranslated !== trimmed) return replaceWholeTextPreservingSpace(value, dateTranslated);

    return value;
}

function translateSiteAttributes(lang) {
    const ruAttrToEn = {
        placeholder: {
            'Введите название или описание товара...': 'Enter product name or description...',
            'Поиск по новостям...': 'Search news...',
            'Поиск по терминам...': 'Search glossary...',
            'Поиск товаров': 'Product search',
            'Введите ваше имя': 'Enter your name',
            'Напишите ваш отзыв...': 'Write your review...',
            'Введите промокод': 'Enter promo code',
            'Ваш email': 'Your email',
            'Введите текст для поиска...': 'Enter search text...',
            'Название товара': 'Product name',
            'Например, FRESH10': 'For example, FRESH10',
            'Поиск по товарам...': 'Search products...',
            'Поиск по сотрудникам...': 'Search employees...',
            'дд.мм.гггг': 'dd.mm.yyyy',
            'Новый тип товара': 'New product type'
        },
        title: {
            'Корзина': 'Cart',
            'Подробнее о товаре': 'Product details',
            'Перейти в корзину': 'Go to cart'
        }
    };
    const enAttrToRu = {
        placeholder: Object.fromEntries(Object.entries(ruAttrToEn.placeholder).map(([ru, en]) => [en, ru])),
        title: Object.fromEntries(Object.entries(ruAttrToEn.title).map(([ru, en]) => [en, ru]))
    };
    const attrMaps = lang === 'en' ? ruAttrToEn : enAttrToRu;

    Object.entries(attrMaps).forEach(([attr, map]) => {
        document.querySelectorAll(`[${attr}]`).forEach(element => {
            const current = element.getAttribute(attr);
            if (!current) return;
            if (map[current]) element.setAttribute(attr, map[current]);
        });
    });

    const valueMap = lang === 'en' ? siteRuToEn : siteEnToRu;
    document.querySelectorAll('input:not([type]), input[type="text"], input[type="search"]').forEach(input => {
        const current = input.value.replace(/\s+/g, ' ').trim();
        if (!current) return;
        const translated = valueMap[current] || (lang === 'en' ? siteMixedToEn[current] : null);
        if (translated) input.value = translated;
    });
}

let siteLanguageApplying = false;
let siteLanguageApplyTimer = null;
let siteLanguageObserver = null;

window.applySiteLanguage = function applySiteLanguage(lang) {
    const language = lang === 'en' ? 'en' : 'ru';
    if (siteLanguageApplying) return;
    siteLanguageApplying = true;
    document.documentElement.lang = language;
    document.documentElement.dataset.lang = language;
    document.documentElement.dataset.language = language;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
            return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
        node.nodeValue = translateSiteText(node.nodeValue, language);
    });

    translateSiteAttributes(language);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const themeLabel = document.getElementById('theme-label');
    if (themeLabel) {
        themeLabel.textContent = language === 'en'
            ? (isDark ? 'Light theme' : 'Dark theme')
            : (isDark ? 'Светлая тема' : 'Темная тема');
    }

    document.querySelectorAll('[data-lang-switch]').forEach(button => {
        button.classList.toggle('is-active', button.dataset.langSwitch === language);
        button.setAttribute('aria-pressed', button.dataset.langSwitch === language ? 'true' : 'false');
    });

    siteLanguageApplying = false;
};

document.addEventListener('DOMContentLoaded', function () {
    const savedLanguage = localStorage.getItem('siteLanguage') || 'ru';
    window.applySiteLanguage(savedLanguage);

    if (!siteLanguageObserver) {
        siteLanguageObserver = new MutationObserver(() => {
            if (siteLanguageApplying) return;
            clearTimeout(siteLanguageApplyTimer);
            siteLanguageApplyTimer = setTimeout(() => {
                window.applySiteLanguage(localStorage.getItem('siteLanguage') || 'ru');
            }, 80);
        });
        siteLanguageObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    document.querySelectorAll('[data-lang-switch]').forEach(button => {
        button.addEventListener('click', function () {
            const selectedLanguage = this.dataset.langSwitch === 'en' ? 'en' : 'ru';
            localStorage.setItem('siteLanguage', selectedLanguage);
            window.applySiteLanguage(selectedLanguage);
        });
    });
});
