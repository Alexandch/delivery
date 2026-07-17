document.addEventListener('DOMContentLoaded', () => {
  const number = document.getElementById('card_number');
  const expiry = document.getElementById('expiry_date');
  const cvv = document.getElementById('cvv');
  const brand = document.getElementById('card-brand');
  number.addEventListener('input', () => {
    const digits = number.value.replace(/\D/g, '').slice(0, 19);
    number.value = digits.replace(/(.{4})/g, '$1 ').trim();
    brand.textContent = digits.startsWith('4') ? 'Visa' : (/^5[1-5]/.test(digits) ? 'Mastercard' : '');
  });
  expiry.addEventListener('input', () => { const d=expiry.value.replace(/\D/g,'').slice(0,4); expiry.value=d.length>2?`${d.slice(0,2)}/${d.slice(2)}`:d; });
  cvv.addEventListener('input', () => { cvv.value=cvv.value.replace(/\D/g,'').slice(0,4); });
});
