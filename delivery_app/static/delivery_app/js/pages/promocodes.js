function copyPromoCode(code) {
    navigator.clipboard.writeText(code).then(function() {
        showNotification('Промокод скопирован: ' + code);
    }).catch(function(err) {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Промокод скопирован: ' + code);
    });
}

function usePromoCode(code) {
    showNotification('Промокод ' + code + ' готов к использованию! Примените его при оформлении заказа.');

    localStorage.setItem('selectedPromoCode', code);
}

document.querySelectorAll('[data-copy-code]').forEach(element => {
    const copy = () => copyPromoCode(element.dataset.copyCode);
    element.addEventListener('click', copy);
    element.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            copy();
        }
    });
});

document.querySelectorAll('[data-use-code]').forEach(button => {
    button.addEventListener('click', () => usePromoCode(button.dataset.useCode));
});

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    const promoCards = document.querySelectorAll('.promocode-card.active');

    promoCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.use-btn') && !e.target.closest('.code-value')) {
                this.classList.toggle('expanded');
            }
        });
    });

    const savedPromoCode = localStorage.getItem('selectedPromoCode');
    if (savedPromoCode) {
        console.log('Сохраненный промокод:', savedPromoCode);
    }
});
