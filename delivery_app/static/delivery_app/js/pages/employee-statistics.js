document.querySelectorAll('[data-progress]').forEach(bar => {
    const value = Number.parseFloat(bar.dataset.progress);
    bar.style.width = `${Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))}%`;
});
