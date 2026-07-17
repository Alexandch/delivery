document.addEventListener('DOMContentLoaded', function() {
    const showReviewFormBtn = document.getElementById('showReviewForm');
    const reviewFormContainer = document.getElementById('reviewFormContainer');
    const cancelReviewBtn = document.getElementById('cancelReview');

    if (showReviewFormBtn && reviewFormContainer) {
        showReviewFormBtn.addEventListener('click', function() {
            reviewFormContainer.hidden = false;
            showReviewFormBtn.hidden = true;
        });
    }

    if (cancelReviewBtn && reviewFormContainer) {
        cancelReviewBtn.addEventListener('click', function() {
            reviewFormContainer.hidden = true;
            if (showReviewFormBtn) showReviewFormBtn.hidden = false;
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const rating = this.getAttribute('data-rating');

            reviewCards.forEach(card => {
                if (rating === 'all' || card.getAttribute('data-rating') === rating) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const sortSelect = document.getElementById('sortReviews');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            window.location.href = `?sort=${sortBy}`;
        });
    }

    const helpfulButtons = document.querySelectorAll('.helpful-btn');
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reviewId = this.getAttribute('data-review-id');
            const countElement = this.querySelector('.helpful-count');

            this.disabled = true;
            this.style.opacity = '0.7';

            setTimeout(() => {
                let count = parseInt(countElement.textContent);
                count++;
                countElement.textContent = count;

                this.innerHTML = '<i class="fas fa-check"></i> Спасибо за ваш голос!';
            }, 500);
        });
    });
});
