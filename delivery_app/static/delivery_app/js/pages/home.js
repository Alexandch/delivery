document.addEventListener('DOMContentLoaded', function () {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const alreadySeen = sessionStorage.getItem('homePreloaderSeen') === '1';
        const hidePreloader = () => {
            preloader.classList.add('is-hidden');
            sessionStorage.setItem('homePreloaderSeen', '1');
            window.setTimeout(() => preloader.remove(), reduceMotion ? 0 : 350);
        };
        if (reduceMotion || alreadySeen) {
            hidePreloader();
            return;
        }
        window.addEventListener('load', () => window.setTimeout(hidePreloader, 350), { once: true });
        window.setTimeout(hidePreloader, 1200);
    });

    const quickViewModal = document.getElementById('quickViewModal');
    const quickViewContent = document.getElementById('quickViewContent');
    const quickViewClose = quickViewModal ? quickViewModal.querySelector('.quick-view-close') : null;
    let quickViewTrigger = null;

    const closeQuickView = () => {
        if (!quickViewModal || quickViewModal.hidden) return;
        quickViewModal.hidden = true;
        quickViewContent.replaceChildren();
        document.body.classList.remove('quick-view-open');
        if (quickViewTrigger) quickViewTrigger.focus();
    };

    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function () {
            const template = document.getElementById(this.dataset.templateId);
            if (!quickViewModal || !quickViewContent || !template) return;
            quickViewTrigger = this;
            quickViewContent.replaceChildren(template.content.cloneNode(true));
            quickViewModal.hidden = false;
            document.body.classList.add('quick-view-open');
            quickViewClose.focus();
        });
    });

    if (quickViewClose) quickViewClose.addEventListener('click', closeQuickView);
    if (quickViewModal) {
        quickViewModal.addEventListener('click', event => {
            if (event.target === quickViewModal) closeQuickView();
        });
    }
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeQuickView();
    });

class ImageSlider {
    constructor(container, options = {}) {
        this.container = container;
        this.slides = options.slides || [];
        this.currentIndex = 0;
        this.autoPlay = options.autoPlay || false;
        this.delay = options.delay || 5000;
        this.loop = options.loop !== false;
        this.showNavs = options.showNavs !== false;
        this.showPags = options.showPags !== false;
        this.stopOnHover = options.stopOnHover !== false;

        this.autoPlayInterval = null;
        this.isPaused = false;
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.container.innerHTML = '';

        this.track = document.createElement('div');
        this.track.className = 'slider-track';
        this.container.appendChild(this.track);

        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'slide';

            const link = document.createElement('a');
            link.href = slide.url || '#';
            link.className = `slide-link promo-banner ${slide.variant || ''}`;
            link.setAttribute('aria-label', slide.title || `Слайд ${index + 1}`);

            const perks = (slide.perks || []).map((perk) => (
                `<span>${this.escapeHtml(perk)}</span>`
            )).join('');

            link.innerHTML = `
                <span class="promo-badge">${this.escapeHtml(slide.badge || '')}</span>
                <div class="promo-copy">
                    <div class="slide-title">${this.escapeHtml(slide.title || '')}</div>
                    <div class="slide-description">${this.escapeHtml(slide.description || '')}</div>
                    <div class="promo-perks">${perks}</div>
                    <span class="promo-cta">${this.escapeHtml(slide.cta || 'Перейти')}</span>
                </div>
                <div class="promo-visual" aria-hidden="true">
                    <span class="promo-blob promo-blob-one"></span>
                    <span class="promo-blob promo-blob-two"></span>
                    <span class="promo-icon">${this.escapeHtml(slide.icon || '🛒')}</span>
                    <span class="promo-mini promo-mini-one">${this.escapeHtml(slide.miniOne || '🥕')}</span>
                    <span class="promo-mini promo-mini-two">${this.escapeHtml(slide.miniTwo || '🍎')}</span>
                    <span class="promo-mini promo-mini-three">${this.escapeHtml(slide.miniThree || '🥛')}</span>
                </div>
            `;

            slideElement.appendChild(link);
            this.track.appendChild(slideElement);
        });

        if (this.showNavs) {
            this.prevButton = document.createElement('button');
            this.prevButton.className = 'slider-nav prev';
            this.prevButton.innerHTML = '‹';
            this.prevButton.setAttribute('aria-label', 'Предыдущий слайд');
            this.prevButton.addEventListener('click', () => this.prev());
            this.container.appendChild(this.prevButton);

            this.nextButton = document.createElement('button');
            this.nextButton.className = 'slider-nav next';
            this.nextButton.innerHTML = '›';
            this.nextButton.setAttribute('aria-label', 'Следующий слайд');
            this.nextButton.addEventListener('click', () => this.next());
            this.container.appendChild(this.nextButton);
        }

        if (this.showPags) {
            this.pagination = document.createElement('div');
            this.pagination.className = 'slider-pagination';
            this.container.appendChild(this.pagination);

            this.slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'pagination-dot';
                dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(index));
                this.pagination.appendChild(dot);
            });
        }

        this.counter = document.createElement('div');
        this.counter.className = 'slider-counter';
        this.updateCounter();
        this.container.appendChild(this.counter);

        if (this.stopOnHover) {
            this.container.addEventListener('mouseenter', () => {
                this.isPaused = true;
                this.clearAutoPlay();
            });

            this.container.addEventListener('mouseleave', () => {
                this.isPaused = false;
                if (this.autoPlay) {
                    this.startAutoPlay();
                }
            });
        }

        this.setupTouchEvents();

        if (this.autoPlay) {
            this.startAutoPlay();
        }

        this.updateSlider();
    }

    escapeHtml(value = '') {
        const div = document.createElement('div');
        div.textContent = value;
        return div.innerHTML;
    }

    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;

        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > minSwipeDistance) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        }, { passive: true });
    }

    updateSlider() {
        if (this.isAnimating) return;

        this.isAnimating = true;
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        if (this.showPags) {
            const dots = this.pagination.querySelectorAll('.pagination-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentIndex);
            });
        }

        this.updateCounter();

        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }

    updateCounter() {
        this.counter.textContent = `${this.currentIndex + 1} / ${this.slides.length}`;
    }

    next() {
        if (this.isAnimating) return;

        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
        } else if (this.loop) {
            this.currentIndex = 0;
        } else {
            return; // Не делаем ничего если loop отключен и это последний слайд
        }

        this.updateSlider();
    }

    prev() {
        if (this.isAnimating) return;

        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else if (this.loop) {
            this.currentIndex = this.slides.length - 1;
        } else {
            return; // Не делаем ничего если loop отключен и это первый слайд
        }

        this.updateSlider();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;

        if (index >= 0 && index < this.slides.length) {
            this.currentIndex = index;
            this.updateSlider();
        }
    }

    startAutoPlay() {
        this.clearAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (!this.isPaused && !this.isAnimating) {
                this.next();
            }
        }, this.delay);
    }

    clearAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    updateDelay(newDelay) {
        this.delay = newDelay * 1000;
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    updateOptions(options) {
        if (options.autoPlay !== undefined) {
            this.autoPlay = options.autoPlay;
            if (this.autoPlay) {
                this.startAutoPlay();
            } else {
                this.clearAutoPlay();
            }
        }

        if (options.loop !== undefined) {
            this.loop = options.loop;
        }

        if (options.stopOnHover !== undefined) {
            this.stopOnHover = options.stopOnHover;
            this.container.removeEventListener('mouseenter', this.mouseEnterHandler);
            this.container.removeEventListener('mouseleave', this.mouseLeaveHandler);

            if (this.stopOnHover) {
                this.container.addEventListener('mouseenter', () => {
                    this.isPaused = true;
                    this.clearAutoPlay();
                });

                this.container.addEventListener('mouseleave', () => {
                    this.isPaused = false;
                    if (this.autoPlay) {
                        this.startAutoPlay();
                    }
                });
            }
        }
    }
}

const sliderConfigElement = document.getElementById('main-slider');
const productsUrl = sliderConfigElement ? sliderConfigElement.dataset.productsUrl : '/products/';
const promocodesUrl = sliderConfigElement ? sliderConfigElement.dataset.promocodesUrl : '/promocodes/';

const slidesData = [
    {
        variant: 'promo-blue',
        badge: 'Экспресс-доставка',
        title: 'Доставка за 2 часа',
        description: 'Соберём свежие товары, согласуем замену и привезём заказ к удобному времени.',
        cta: 'Собрать корзину',
        perks: ['сегодня', 'без очередей', 'контроль свежести'],
        icon: '🚚',
        miniOne: '🥬',
        miniTwo: '🍊',
        miniThree: '🥛',
        url: productsUrl
    },
    {
        variant: 'promo-green',
        badge: 'Набор недели',
        title: 'Семейный набор',
        description: 'Овощи, фрукты и молочные продукты для завтраков, ужинов и перекусов со скидкой до 20%.',
        cta: 'Посмотреть товары',
        perks: ['фрукты', 'овощи', 'молочные продукты'],
        icon: '🥗',
        miniOne: '🍎',
        miniTwo: '🥕',
        miniThree: '🍌',
        url: `${productsUrl}?type=fruits`
    },
    {
        variant: 'promo-orange',
        badge: 'Скидки каждый день',
        title: 'Промокоды и акции',
        description: 'Проверяйте купоны перед оформлением и экономьте на любимых товарах.',
        cta: 'Открыть промокоды',
        perks: ['скидки', 'бонусы', 'выгодные цены'],
        icon: '🎁',
        miniOne: '−20%',
        miniTwo: '₽',
        miniThree: '🔥',
        url: promocodesUrl
    },
    {
        variant: 'promo-purple',
        badge: 'Свежий завоз',
        title: 'Свежий завоз',
        description: 'Добавили сезонные позиции, напитки и товары для быстрого ужина.',
        cta: 'Смотреть новинки',
        perks: ['новинки', 'поставщики', 'качество'],
        icon: '🛒',
        miniOne: '🥩',
        miniTwo: '🍞',
        miniThree: '🧃',
        url: `${productsUrl}?sale=true`
    },
    {
        variant: 'promo-dark',
        badge: 'Самовывоз',
        title: 'Самовывоз без ожидания',
        description: 'Оформите корзину на сайте, а мы заранее подготовим товары к выдаче.',
        cta: 'Оформить заказ',
        perks: ['быстро', 'удобно', 'без переплат'],
        icon: '📦',
        miniOne: '⏱',
        miniTwo: '✓',
        miniThree: '🏪',
        url: `${productsUrl}?new=true`
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('main-slider');
    const slider = new ImageSlider(sliderContainer, {
        slides: slidesData,
        autoPlay: true,
        delay: 5000,
        loop: true,
        showNavs: true,
        showPags: true,
        stopOnHover: true
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            slider.prev();
        } else if (e.key === 'ArrowRight') {
            slider.next();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const revealItems = document.querySelectorAll('[data-reveal-section] .reveal-item');
    if (!revealItems.length) return;

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealItems.forEach(item => item.classList.add('is-visible'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });

    revealItems.forEach(item => revealObserver.observe(item));
});
