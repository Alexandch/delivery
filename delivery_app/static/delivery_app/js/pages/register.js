document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    const inputs = form.querySelectorAll('.form-control');

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (this.required) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('error');
                this.classList.add('valid');
            }
        });
    });

    form.addEventListener('submit', function(e) {
        let valid = true;
        inputs.forEach(input => {
            if (input.required && input.value.trim() === '') {
                input.classList.add('error');
                valid = false;
            }
        });

        if (!valid) {
            e.preventDefault();
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.auth-form');
    const inputs = form.querySelectorAll('.form-control');

    const dobField = document.getElementById('id_date_of_birth');
    if (dobField) {
        dobField.addEventListener('change', function() {
            validateDateOfBirth(this);
        });

        dobField.addEventListener('input', function() {
            validateDateOfBirth(this);
        });
    }

    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value.trim() !== '') {
                this.classList.add('valid');
                this.classList.remove('error');
            } else if (this.required) {
                this.classList.add('error');
                this.classList.remove('valid');
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('error');
                this.classList.add('valid');
            }
        });
    });

    form.addEventListener('submit', function(e) {
        let valid = true;
        inputs.forEach(input => {
            if (input.required && input.value.trim() === '') {
                input.classList.add('error');
                valid = false;
            }
        });

        if (dobField && !validateDateOfBirth(dobField, true)) {
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    function validateDateOfBirth(field, showAlert = false) {
        const value = field.value;
        const messageContainer = document.getElementById('dob-message') || createDOBMessageContainer(field);

        if (!value) {
            messageContainer.style.display = 'none';
            field.classList.remove('error', 'valid');
            return true;
        }

        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            field.classList.add('error');
            field.classList.remove('valid');
            messageContainer.innerHTML = '<span>❌</span> Дата рождения не может быть в будущем.';
            messageContainer.className = 'alert alert-error';
            messageContainer.style.display = 'flex';
            return false;
        }

        const daysOfWeek = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const dayOfWeek = daysOfWeek[birthDate.getDay()];

        if (age < 18) {
            field.classList.add('error');
            field.classList.remove('valid');
            messageContainer.innerHTML = `<span>⚠️</span> Вам ${age} лет. Для использования сайта требуется разрешение родителей.`;
            messageContainer.className = 'alert alert-warning';
            messageContainer.style.display = 'flex';

            if (showAlert) {
                alert(`ВНИМАНИЕ: Вам ${age} лет. Для регистрации на сайте требуется разрешение родителей.`);
            }
            return false;
        } else {
            field.classList.remove('error');
            field.classList.add('valid');
            messageContainer.innerHTML = `<span>✅</span> Вам ${age} лет(год). Вы родились в ${dayOfWeek}.`;
            messageContainer.className = 'alert alert-success';
            messageContainer.style.display = 'flex';
            return true;
        }
    }

    function createDOBMessageContainer(field) {
        const container = document.createElement('div');
        container.id = 'dob-message';
        container.className = 'alert';
        container.style.display = 'none';
        container.style.marginTop = '10px';

        field.parentNode.insertBefore(container, field.nextSibling);
        return container;
    }
});
