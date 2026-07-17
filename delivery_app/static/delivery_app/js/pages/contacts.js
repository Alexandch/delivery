const applyEmployeeLocale = (language) => {
    const suffix = language === 'en' ? 'En' : 'Ru';

    document.querySelectorAll('.contact-person[data-name-ru]').forEach((card) => {
        const name = card.querySelector('.js-employee-name');
        const position = card.querySelector('.js-employee-position');

        if (name) {
            name.textContent = card.dataset[`name${suffix}`] || card.dataset.nameRu;
        }
        if (position) {
            position.textContent = card.dataset[`position${suffix}`] || card.dataset.positionRu;
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {
    applyEmployeeLocale(localStorage.getItem('siteLanguage') || 'ru');

    document.querySelectorAll('[data-lang-switch]').forEach((button) => {
        button.addEventListener('click', () => {
            window.requestAnimationFrame(() => applyEmployeeLocale(button.dataset.langSwitch));
        });
    });

    const sections = [...document.querySelectorAll('[data-contact-reveal]')];
    if (!sections.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
        sections.forEach((section) => section.classList.add('is-visible'));
        return;
    }

    document.documentElement.classList.add('contacts-animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px' });

    sections.forEach((section, index) => {
        section.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`);
        observer.observe(section);
    });
});
