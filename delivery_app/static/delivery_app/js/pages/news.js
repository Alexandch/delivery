document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('news-search');
    const newsCards = document.querySelectorAll('.news-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            newsCards.forEach(card => {
                const title = card.querySelector('.news-title').textContent.toLowerCase();
                const summary = card.querySelector('.news-summary').textContent.toLowerCase();

                if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const sortSelect = document.getElementById('sort-news');

    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const newsContainer = document.querySelector('.news-grid');
            const newsItems = Array.from(newsCards);

            newsItems.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));

                if (sortBy === 'newest') {
                    return dateB - dateA;
                } else {
                    return dateA - dateB;
                }
            });

            newsContainer.innerHTML = '';
            newsItems.forEach(item => {
                newsContainer.appendChild(item);
            });
        });
    }

    const shareButtons = document.querySelectorAll('.share-btn');

    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            const fullUrl = window.location.origin + url;

            if (this.querySelector('.fa-facebook-f')) {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank');
            } else if (this.querySelector('.fa-twitter')) {
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}`, '_blank');
            } else if (this.querySelector('.fa-vk')) {
                window.open(`https://vk.com/share.php?url=${encodeURIComponent(fullUrl)}`, '_blank');
            }
        });
    });

    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;

            alert(`Спасибо за подписку! На адрес ${email} будут приходить наши новости.`);
            this.reset();
        });
    }
});
