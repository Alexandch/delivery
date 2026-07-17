function toggleFaq(faqId) {
    const faqItem = document.querySelector(`.faq-item[data-faq-id="${faqId}"]`);
    faqItem.classList.toggle('active');
}

document.querySelectorAll('[data-faq-toggle]').forEach(button => {
    button.addEventListener('click', () => toggleFaq(button.dataset.faqToggle));
});

document.getElementById('faq-search').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-content').textContent.toLowerCase();

        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';

            if (searchTerm.length > 2) {
                const regex = new RegExp(searchTerm, 'gi');
                const questionElem = item.querySelector('.faq-question h3');
                const answerElem = item.querySelector('.faq-content');

                if (!questionElem.dataset.original) {
                    questionElem.dataset.original = questionElem.innerHTML;
                }
                if (!answerElem.dataset.original) {
                    answerElem.dataset.original = answerElem.innerHTML;
                }

                questionElem.innerHTML = questionElem.dataset.original.replace(
                    regex, 
                    match => `<span class="highlight">${match}</span>`
                );

                answerElem.innerHTML = answerElem.dataset.original.replace(
                    regex, 
                    match => `<span class="highlight">${match}</span>`
                );
            }
        } else {
            item.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash;
    if (hash) {
        const faqId = hash.replace('#faq-', '');
        const faqItem = document.querySelector(`.faq-item[data-faq-id="${faqId}"]`);
        if (faqItem) {
            faqItem.classList.add('active');
            faqItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
        firstFaq.classList.add('active');
    }
});
