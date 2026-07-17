const cartCopies = {
    ru: {
        added: 'Товар добавлен в корзину',
        updated: 'Количество обновлено',
        removed: 'Товар удалён из корзины',
        failed: 'Не удалось обновить корзину',
        idle: 'Выберите количество',
        active: 'В корзине',
        add: 'В корзину'
    },
    en: {
        added: 'Product added to cart',
        updated: 'Quantity updated',
        removed: 'Product removed from cart',
        failed: 'Could not update the cart',
        idle: 'Choose quantity',
        active: 'In cart',
        add: 'Add to cart'
    }
};

function getCartCopy(key) {
    const language = document.documentElement.dataset.lang === 'en' ? 'en' : 'ru';
    return cartCopies[language][key];
}

function updateCartBadges(count) {
    const numericCount = Number(count) || 0;
    const holders = [
        ...document.querySelectorAll('.cart-nav-link'),
        ...document.querySelectorAll('.mobile-nav-link[href*="/cart/"]'),
        document.querySelector('#floatingCart .cart-icon')
    ].filter(Boolean);

    document.querySelectorAll('.cart-count').forEach(badge => {
        if (numericCount > 0) {
            badge.textContent = numericCount;
        } else {
            badge.remove();
        }
    });

    if (numericCount > 0) {
        holders.forEach(holder => {
            if (!holder.querySelector('.cart-count')) {
                const badge = document.createElement('span');
                badge.className = 'cart-count';
                badge.textContent = numericCount;
                holder.appendChild(badge);
            }
        });
    }
}

function setCartFormBusy(form, isBusy) {
    form.classList.toggle('is-loading', isBusy);
    form.querySelectorAll('button, input').forEach(control => {
        control.disabled = isBusy;
    });
}

function refreshQuantityButtons(form) {
    const input = form.querySelector('.quantity-input');
    const cartQuantity = Number(form.dataset.cartQuantity) || 0;
    const value = Number(input.value) || 1;
    const max = Number(input.max) || Number.MAX_SAFE_INTEGER;
    const decreaseButton = form.querySelector('[data-quantity-step="-1"]');
    const increaseButton = form.querySelector('[data-quantity-step="1"]');
    const submitButton = form.querySelector('[data-cart-submit]');

    decreaseButton.disabled = cartQuantity === 0 && value <= 1;
    increaseButton.disabled = value >= max;
    submitButton.disabled = cartQuantity > 0;
}

function applyCartFormState(form, quantity) {
    const numericQuantity = Number(quantity) || 0;
    const isInCart = numericQuantity > 0;
    const input = form.querySelector('.quantity-input');
    const idleState = form.querySelector('.cart-state-idle');
    const activeState = form.querySelector('.cart-state-active');
    const quantityLabel = form.querySelector('[data-cart-quantity-label]');
    const buttonLabel = form.querySelector('[data-cart-button-label]');

    form.dataset.cartQuantity = numericQuantity;
    form.classList.toggle('is-in-cart', isInCart);
    input.value = isInCart ? numericQuantity : 1;
    idleState.hidden = isInCart;
    activeState.hidden = !isInCart;
    idleState.textContent = getCartCopy('idle');
    activeState.querySelector('span').textContent = getCartCopy('active');
    quantityLabel.textContent = numericQuantity;
    buttonLabel.textContent = isInCart ? getCartCopy('active') : getCartCopy('add');
    refreshQuantityButtons(form);
}

function showCartFeedback(form, message, isError = false) {
    const feedback = form.querySelector('[data-cart-feedback]');
    feedback.textContent = message;
    feedback.classList.toggle('is-error', isError);
    feedback.classList.add('is-visible');
    window.clearTimeout(Number(feedback.dataset.timeout));
    feedback.dataset.timeout = window.setTimeout(() => {
        feedback.classList.remove('is-visible');
    }, 2400);
}

async function saveCartQuantity(form, quantity, operation) {
    const previousQuantity = Number(form.dataset.cartQuantity) || 0;
    const data = new FormData(form);
    data.set('quantity', quantity);
    data.set('operation', operation);
    setCartFormBusy(form, true);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: data,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const payload = await response.json();
        if (!response.ok || !payload.success) {
            throw new Error(payload.message || getCartCopy('failed'));
        }

        applyCartFormState(form, payload.quantity);
        updateCartBadges(payload.cart_count);

        const messageKey = payload.quantity === 0
            ? 'removed'
            : previousQuantity === 0
                ? 'added'
                : 'updated';
        showCartFeedback(form, getCartCopy(messageKey));
    } catch (error) {
        applyCartFormState(form, previousQuantity);
        showCartFeedback(form, error.message || getCartCopy('failed'), true);
    } finally {
        setCartFormBusy(form, false);
        refreshQuantityButtons(form);
    }
}

function initializeCartForm(form) {
    const input = form.querySelector('.quantity-input');
    const max = Number(input.max) || Number.MAX_SAFE_INTEGER;

    form.addEventListener('submit', event => {
        event.preventDefault();
        if (Number(form.dataset.cartQuantity) > 0) return;
        const quantity = Math.min(max, Math.max(1, Number(input.value) || 1));
        input.value = quantity;
        saveCartQuantity(form, quantity, 'add');
    });

    form.querySelectorAll('[data-quantity-step]').forEach(button => {
        button.addEventListener('click', () => {
            const direction = Number(button.dataset.quantityStep);
            const cartQuantity = Number(form.dataset.cartQuantity) || 0;
            const displayedQuantity = Number(input.value) || 1;

            if (cartQuantity > 0) {
                const nextQuantity = direction < 0 && cartQuantity === 1
                    ? 0
                    : Math.min(max, Math.max(1, cartQuantity + direction));
                saveCartQuantity(form, nextQuantity, 'set');
                return;
            }

            input.value = Math.min(max, Math.max(1, displayedQuantity + direction));
            refreshQuantityButtons(form);
        });
    });

    input.addEventListener('input', () => {
        const value = Number(input.value);
        if (value > max) {
            input.setCustomValidity(`Максимальное количество: ${max}`);
        } else if (value < 1) {
            input.setCustomValidity('Минимальное количество: 1');
        } else {
            input.setCustomValidity('');
        }
    });

    input.addEventListener('change', () => {
        const value = Math.min(max, Math.max(1, Number(input.value) || 1));
        input.value = value;
        input.setCustomValidity('');
        if (Number(form.dataset.cartQuantity) > 0) {
            saveCartQuantity(form, value, 'set');
        } else {
            refreshQuantityButtons(form);
        }
    });

    applyCartFormState(form, Number(form.dataset.cartQuantity) || 0);
}

function updateProductsCount() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    const productCards = productsGrid.querySelectorAll('.product-card:not([style*="display: none"])');
    const productsCount = document.querySelector('.products-count');

    if (productsCount && productCards.length > 0) {
        const language = document.documentElement.dataset.lang === 'en' ? 'en' : 'ru';
        productsCount.textContent = language === 'en'
            ? `Showing ${productCards.length} products`
            : `Показано ${productCards.length} товаров`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.product-card').forEach((card, index) => {
        if (card.querySelector('.stock-status.out-of-stock')) {
            card.dataset.stock = '0';
        }
        card.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('[data-cart-form]').forEach(initializeCartForm);

    const filterForm = document.querySelector('.product-filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', () => {
            window.setTimeout(() => {
                document.querySelector('.products-section')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        });
    }

    const perPageSelect = document.getElementById('per_page');
    if (perPageSelect) {
        perPageSelect.addEventListener('change', () => {
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.style.opacity = '0.7';
                productsSection.style.transition = 'opacity 0.3s ease';
            }
        });
    }

    document.querySelectorAll('.page-link[href*="page="]').forEach(link => {
        link.addEventListener('click', event => {
            const href = link.getAttribute('href');
            if (!href || !href.includes('page=')) return;
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            window.setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });

    document.querySelectorAll('[data-auto-submit]').forEach(control => {
        control.addEventListener('change', () => control.form?.submit());
    });

    updateProductsCount();
});
