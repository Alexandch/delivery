const cartItems = Array.from(document.querySelectorAll('[data-cart-item]'));
const totalElements = document.querySelectorAll('[data-cart-total]');
const quantityTotalElements = document.querySelectorAll('[data-total-quantity]');

function formatCartPrice(value) {
    const language = document.documentElement.lang === 'en' ? 'en-US' : 'ru-RU';
    return `${new Intl.NumberFormat(language, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value)} BYN`;
}

function clampQuantity(input, value) {
    const minimum = Number.parseInt(input.min, 10) || 1;
    const maximum = Number.parseInt(input.max, 10) || Number.MAX_SAFE_INTEGER;
    return Math.min(Math.max(value, minimum), maximum);
}

function refreshCartTotals() {
    let cartTotal = 0;
    let quantityTotal = 0;

    cartItems.forEach(item => {
        const input = item.querySelector('.quantity-input');
        const lineTotal = item.querySelector('[data-line-total]');
        const unitPrice = Number.parseFloat(item.dataset.unitPrice) || 0;
        const quantity = clampQuantity(input, Number.parseInt(input.value, 10) || 1);

        input.value = quantity;
        lineTotal.textContent = formatCartPrice(unitPrice * quantity);
        cartTotal += unitPrice * quantity;
        quantityTotal += quantity;

        const decreaseButton = item.querySelector('.btn-decrease');
        const increaseButton = item.querySelector('.btn-increase');
        decreaseButton.disabled = quantity <= (Number.parseInt(input.min, 10) || 1);
        increaseButton.disabled = quantity >= (Number.parseInt(input.max, 10) || Number.MAX_SAFE_INTEGER);
    });

    totalElements.forEach(element => {
        element.textContent = formatCartPrice(cartTotal);
    });

    quantityTotalElements.forEach(element => {
        element.textContent = quantityTotal;
    });
}

cartItems.forEach(item => {
    const input = item.querySelector('.quantity-input');

    item.querySelector('.btn-increase').addEventListener('click', () => {
        input.value = clampQuantity(input, (Number.parseInt(input.value, 10) || 1) + 1);
        refreshCartTotals();
    });

    item.querySelector('.btn-decrease').addEventListener('click', () => {
        input.value = clampQuantity(input, (Number.parseInt(input.value, 10) || 1) - 1);
        refreshCartTotals();
    });

    input.addEventListener('input', refreshCartTotals);
    input.addEventListener('blur', refreshCartTotals);
});

document.querySelectorAll('[data-confirm-remove]').forEach(link => {
    link.addEventListener('click', event => {
        const message = document.documentElement.lang === 'en'
            ? 'Remove this product from the cart?'
            : 'Удалить этот товар из корзины?';

        if (!window.confirm(message)) {
            event.preventDefault();
        }
    });
});

refreshCartTotals();
