document.addEventListener('DOMContentLoaded', function () {
        const SELECTED_EMPLOYEES_KEY = 'selectedEmployees';
        const EMPLOYEES_DATA_KEY = 'employeesData';

        const employeesForm = document.getElementById('employees-form');
        const selectedEmployeesInput = document.getElementById('selected-employees-input');
        const selectAllCheckbox = document.getElementById('select-all');
        const premiaceBtn = document.getElementById('premiace-btn');

        function showPreloader() {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.hidden = false;
            }
        }

        function hidePreloader() {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.hidden = true;
            }
        }

        function setupServerLoading() {
            const loadServerBtn = document.getElementById('load-server-btn');
            if (loadServerBtn) {
                loadServerBtn.addEventListener('click', function () {
                    showPreloader();

                    setTimeout(() => {
                        const serverEmployees = [
                            {
                                id: 'server_1',
                                firstName: 'Анна',
                                lastName: 'Сергеева',
                                position: 'Старший разработчик',
                                phone: '+375 (29) 111-22-33',
                                email: 'anna@company.com',
                                photo: 'https://via.placeholder.com/150/0088cc/ffffff?text=AS'
                            },
                            {
                                id: 'server_2',
                                firstName: 'Дмитрий',
                                lastName: 'Васильев',
                                position: 'Team Lead',
                                phone: '8 (029) 222-33-44',
                                email: 'dmitry@company.com',
                                photo: 'https://via.placeholder.com/150/00aa88/ffffff?text=DV'
                            },
                            {
                                id: 'server_3',
                                firstName: 'Екатерина',
                                lastName: 'Петрова',
                                position: 'UX/UI дизайнер',
                                phone: '80293334455',
                                email: 'ekaterina@company.com',
                                photo: 'https://via.placeholder.com/150/aa0088/ffffff?text=EP'
                            }
                        ];

                        const currentPage = parseInt(new URLSearchParams(window.location.search).get('page') || '1');
                        const totalServerEmployees = serverEmployees.length;

                        const tbody = document.getElementById('employees-tbody');
                        if (tbody) {
                            const existingRows = Array.from(tbody.querySelectorAll('tr[data-employee-id]'));

                            tbody.innerHTML = '';

                            existingRows.forEach(row => {
                                tbody.appendChild(row);
                            });

                            serverEmployees.forEach(employee => {
                                const row = document.createElement('tr');
                                row.setAttribute('data-employee-id', employee.id);

                                row.innerHTML = `
                            <td>
                                <input type="checkbox" class="employee-checkbox" name="selected_employees" value="${employee.id}">
                            </td>
                            <td>${employee.firstName} ${employee.lastName}</td>
                            <td>
                                <img src="${employee.photo}" alt="${employee.firstName} ${employee.lastName}" class="employee-photo-table">
                            </td>
                            <td>${employee.position}</td>
                            <td>${employee.phone}</td>
                            <td>${employee.email}</td>
                        `;

                                tbody.appendChild(row);
                            });

                            updatePaginationInfo(totalServerEmployees);
                        }

                        hidePreloader();
                        alert('Данные успешно загружены с сервера и добавлены на текущую страницу!');

                    }, 1500);
                });
            }
        }

        function setupFilter() {
            const filterInput = document.getElementById('filter-input');
            const filterBtn = document.getElementById('filter-btn');

            if (filterBtn && filterInput) {
                filterBtn.addEventListener('click', function () {
                    applyFilter();
                });

                filterInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        applyFilter();
                    }
                });
            }
        }

        function setupSearch() {
            const filterInput = document.getElementById('filter-input');
            const filterBtn = document.getElementById('filter-btn');
            const resetFilterBtn = document.getElementById('reset-filter-btn');

            if (filterBtn && filterInput) {
                filterBtn.addEventListener('click', performServerSearch);

                filterInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        performServerSearch();
                    }
                });

                let searchTimeout;
                filterInput.addEventListener('input', function () {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        if (filterInput.value.trim().length >= 2 || filterInput.value.trim() === '') {
                            performServerSearch();
                        }
                    }, 500);
                });
            }

            if (resetFilterBtn) {
                resetFilterBtn.addEventListener('click', function () {
                    filterInput.value = '';
                    performServerSearch();
                });
            }
        }

        async function performServerSearch() {
            const query = document.getElementById('filter-input').value.trim();

            showPreloader();

            try {
                const response = await fetch(`/api/search-employees/?q=${encodeURIComponent(query)}`);
                const data = await response.json();

                if (response.ok) {
                    updateTableWithSearchResults(data);
                } else {
                    throw new Error(data.error || 'Ошибка поиска');
                }
            } catch (error) {
                console.error('Ошибка поиска:', error);
                showSearchNotification('Ошибка при выполнении поиска', 'error');
                document.getElementById('filter-input').value = '';
                performServerSearch();
            } finally {
                hidePreloader();
            }
        }

        function updateTableWithSearchResults(data) {
            const tbody = document.getElementById('employees-tbody');
            const selectedSet = loadSelectedEmployees();
            const employees = data.employees || [];
            const totalCount = data.total_count || 0;
            const query = data.query || '';

            if (employees.length > 0) {
                let html = '';
                employees.forEach(employee => {
                    const isChecked = selectedSet.has(employee.id.toString());
                    html += `
                <tr data-employee-id="${employee.id}">
                    <td>
                        <input type="checkbox" class="employee-checkbox" name="selected_employees" 
                               value="${employee.id}" ${isChecked ? 'checked' : ''}>
                    </td>
                    <td>${employee.fio}</td>
                    <td>
                        ${employee.photo ?
                            `<img src="${employee.photo}" alt="${employee.fio}" class="employee-photo-table">` :
                            `<div class="photo-placeholder">📷</div>`
                        }
                    </td>
                    <td>${employee.description}</td>
                    <td>${employee.phone}</td>
                    <td>${employee.email}</td>
                </tr>
            `;
                });
                tbody.innerHTML = html;

                updatePaginationForSearch(totalCount, query);

                showSearchNotification(`Найдено сотрудников: ${totalCount}${query ? ` по запросу "${query}"` : ''}`, 'success');
            } else {
                tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                    ${query ? `Сотрудники по запросу "${query}" не найдены` : 'Сотрудники не найдены'}
                </td>
            </tr>
        `;

                updatePaginationForSearch(0, query);
                showSearchNotification(query ? `По запросу "${query}" ничего не найдено` : 'Нет сотрудников для отображения', 'warning');
            }

            updateSelectAllState();
            updatePremiateButton(selectedSet);
        }

        function updatePaginationForSearch(totalCount, query) {
            const pagination = document.querySelector('.pagination');
            if (pagination) {
                if (query) {
                    pagination.style.display = 'none';

                    let searchInfo = document.getElementById('search-results-info');
                    if (!searchInfo) {
                        searchInfo = document.createElement('div');
                        searchInfo.id = 'search-results-info';
                        searchInfo.className = 'search-results-info';
                        searchInfo.style.cssText = `
                    text-align: center;
                    padding: 15px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 4px;
                    margin: 10px 0;
                    color: #495057;
                `;
                        pagination.parentNode.insertBefore(searchInfo, pagination);
                    }
                    searchInfo.innerHTML = `
                <strong>Результаты поиска:</strong> 
                Найдено ${totalCount} сотрудников по запросу "${query}"
                <button id="clear-search-btn" class="btn btn-sm btn-outline-secondary" style="margin-left: 10px;">
                    Показать всех
                </button>
            `;

                    document.getElementById('clear-search-btn').addEventListener('click', function () {
                        document.getElementById('filter-input').value = '';
                        performServerSearch();
                    });
                } else {
                    pagination.style.display = '';

                    const searchInfo = document.getElementById('search-results-info');
                    if (searchInfo) {
                        searchInfo.remove();
                    }
                }
            }
        }

        function showSearchNotification(message, type = 'info') {
            let notification = document.getElementById('search-notification');
            if (!notification) {
                notification = document.createElement('div');
                notification.id = 'search-notification';
                notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 400px;
            transition: all 0.3s ease;
        `;
                document.body.appendChild(notification);
            }

            const styles = {
                success: { background: '#4CAF50', color: 'white' },
                error: { background: '#f44336', color: 'white' },
                warning: { background: '#ff9800', color: 'white' },
                info: { background: '#2196F3', color: 'white' }
            };

            Object.assign(notification.style, styles[type] || styles.info);
            notification.textContent = message;
            notification.style.display = 'block';

            setTimeout(() => {
                notification.style.display = 'none';
            }, 4000);
        }

        function updatePaginationInfo(totalEmployees) {
            console.log(`Всего сотрудников: ${totalEmployees}`);
        }

        function setupTableInteractions() {
            const headers = document.querySelectorAll('#employees-table th');
            headers.forEach((header, index) => {
                if (index > 0) { // Пропуск первый столбец с чекбоксами
                    header.style.cursor = 'pointer';
                    header.addEventListener('click', function () {
                        sortTable(index);
                    });
                }
            });

            document.addEventListener('click', function (e) {
                const row = e.target.closest('tr[data-employee-id]');
                if (row && !e.target.matches('.employee-checkbox')) {
                    showEmployeeDetails(row);
                }
            });
        }

        function sortTable(columnIndex) {
            const table = document.getElementById('employees-table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));

            const header = table.querySelectorAll('th')[columnIndex];
            const isAscending = !header.classList.contains('sorted-asc');

            table.querySelectorAll('th').forEach(th => {
                th.classList.remove('sorted-asc', 'sorted-desc');
            });

            if (isAscending) {
                header.classList.add('sorted-asc');
            } else {
                header.classList.add('sorted-desc');
            }

            rows.sort((a, b) => {
                const aValue = a.cells[columnIndex].textContent.trim();
                const bValue = b.cells[columnIndex].textContent.trim();

                if (isAscending) {
                    return aValue.localeCompare(bValue, 'ru');
                } else {
                    return bValue.localeCompare(aValue, 'ru');
                }
            });

            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        }

        function showEmployeeDetails(row) {
            const employeeId = row.getAttribute('data-employee-id');
            const cells = row.querySelectorAll('td');

            const detailsContent = `
                <div class="employee-detail">
                    <div class="detail-item">
                        <span class="detail-label">ФИО:</span>
                        <span class="detail-value">${cells[1].textContent}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Должность:</span>
                        <span class="detail-value">${cells[3].textContent}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Телефон:</span>
                        <span class="detail-value">${cells[4].textContent}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${cells[5].textContent}</span>
                    </div>
                </div>
            `;

            const detailsContainer = document.getElementById('employee-details');
            const detailsContentDiv = document.getElementById('details-content');

            if (detailsContainer && detailsContentDiv) {
                detailsContentDiv.innerHTML = detailsContent;
                detailsContainer.hidden = false;
            }
        }

        function loadSelectedEmployees() {
            const saved = localStorage.getItem(SELECTED_EMPLOYEES_KEY);
            if (saved) {
                try {
                    const selectedIds = JSON.parse(saved);
                    console.log('Загружены выбранные сотрудники из localStorage:', selectedIds);
                    return new Set(selectedIds);
                } catch (e) {
                    console.error('Ошибка загрузки выбранных сотрудников:', e);
                }
            }
            return new Set();
        }

        function loadEmployeesData() {
            const saved = localStorage.getItem(EMPLOYEES_DATA_KEY);
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    console.log('Загружены данные о сотрудниках из localStorage:', data);
                    return data;
                } catch (e) {
                    console.error('Ошибка загрузки данных о сотрудниках:', e);
                }
            }
            return {};
        }

        function saveSelectedEmployees(selectedSet) {
            const selectedIds = Array.from(selectedSet);
            localStorage.setItem(SELECTED_EMPLOYEES_KEY, JSON.stringify(selectedIds));
            console.log('Сохранены выбранные сотрудники в localStorage:', selectedIds);
        }

        function saveEmployeesData(employeesData) {
            localStorage.setItem(EMPLOYEES_DATA_KEY, JSON.stringify(employeesData));
        }

        function updateEmployeesData(employeesData) {
            document.querySelectorAll('tr[data-employee-id]').forEach(row => {
                const employeeId = row.getAttribute('data-employee-id');
                const cells = row.querySelectorAll('td');
                if (cells.length > 1) {
                    const name = cells[1].textContent.trim();
                    employeesData[employeeId] = name;
                }
            });
            saveEmployeesData(employeesData);
            console.log('Обновлены данные сотрудников:', employeesData);
            return employeesData;
        }

        function updateCheckboxesState(selectedSet, employeesData) {
            document.querySelectorAll('.employee-checkbox').forEach(checkbox => {
                const employeeId = checkbox.value;
                checkbox.checked = selectedSet.has(employeeId);
            });
            updateSelectAllState();
            updatePremiateButton(selectedSet);
        }

        function updatePremiateButton(selectedSet) {
            const checkedCount = selectedSet.size;
            if (premiaceBtn) {
                premiaceBtn.disabled = checkedCount === 0;

                if (checkedCount > 0) {
                    premiaceBtn.style.opacity = '1';
                    premiaceBtn.title = `Премировать выбранных (${checkedCount})`;
                } else {
                    premiaceBtn.style.opacity = '0.6';
                    premiaceBtn.title = 'Выберите сотрудников для премирования';
                }
            }
        }

        function updateSelectAllState() {
            const checkboxes = document.querySelectorAll('.employee-checkbox');
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

            if (selectAllCheckbox && checkboxes.length > 0) {
                if (checkedCount === checkboxes.length) {
                    selectAllCheckbox.checked = true;
                    selectAllCheckbox.indeterminate = false;
                } else if (checkedCount > 0) {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = true;
                } else {
                    selectAllCheckbox.checked = false;
                    selectAllCheckbox.indeterminate = false;
                }
            }
        }

        function getEmployeeName(employeeId, employeesData) {
            return employeesData[employeeId] || 'Неизвестный';
        }

        function getSelectedEmployeeNames(selectedSet, employeesData) {
            const names = [];
            selectedSet.forEach(id => {
                names.push(getEmployeeName(id, employeesData));
            });
            return names;
        }

        function setupCheckboxHandlers(selectedSet, employeesData) {
            document.addEventListener('change', function (e) {
                if (e.target.matches('.employee-checkbox')) {
                    const employeeId = e.target.value;

                    if (e.target.checked) {
                        selectedSet.add(employeeId);
                        const row = e.target.closest('tr');
                        if (row) {
                            const cells = row.querySelectorAll('td');
                            if (cells.length > 1) {
                                employeesData[employeeId] = cells[1].textContent.trim();
                                saveEmployeesData(employeesData);
                            }
                        }
                    } else {
                        selectedSet.delete(employeeId);
                    }

                    saveSelectedEmployees(selectedSet);
                    updateSelectAllState();
                    updatePremiateButton(selectedSet);
                    console.log('Выбранные сотрудники обновлены:', Array.from(selectedSet));
                }
            });
        }

        function setupSelectAllHandler(selectedSet, employeesData) {
            if (selectAllCheckbox) {
                selectAllCheckbox.addEventListener('change', function () {
                    const checkboxes = document.querySelectorAll('.employee-checkbox');
                    const currentPageIds = Array.from(checkboxes).map(cb => cb.value);

                    checkboxes.forEach(cb => {
                        const employeeId = cb.value;
                        cb.checked = this.checked;

                        if (this.checked) {
                            selectedSet.add(employeeId);
                            const row = cb.closest('tr');
                            if (row) {
                                const cells = row.querySelectorAll('td');
                                if (cells.length > 1) {
                                    employeesData[employeeId] = cells[1].textContent.trim();
                                }
                            }
                        } else {
                            if (currentPageIds.includes(employeeId)) {
                                selectedSet.delete(employeeId);
                            }
                        }
                    });

                    saveSelectedEmployees(selectedSet);
                    saveEmployeesData(employeesData);
                    updatePremiateButton(selectedSet);
                    console.log('Выбрать все:', Array.from(selectedSet));
                });
            }
        }

        function setupPremiateHandler(selectedSet, employeesData) {
            if (premiaceBtn) {
                premiaceBtn.addEventListener('click', function () {
                    if (selectedSet.size > 0) {
                        const names = [];
                        selectedSet.forEach(employeeId => {
                            const row = document.querySelector(`tr[data-employee-id="${employeeId}"]`);
                            if (row) {
                                const cells = row.querySelectorAll('td');
                                if (cells.length > 1) {
                                    names.push(cells[1].textContent.trim());
                                }
                            } else {
                                names.push(employeesData[employeeId] || 'Неизвестный');
                            }
                        });

                        const premiaceContent = document.getElementById('premiace-content');
                        const premiaceResults = document.getElementById('premiace-results');
                        const employeeDetails = document.getElementById('employee-details');

                        premiaceContent.innerHTML = `
                            <div class="premiate-content">
                                <p>Поздравляем сотрудников с получением премии!</p>
                                <p><strong>Премированы:</strong> ${names.join(', ')}</p>
                                <p>За высокие профессиональные достижения и выдающийся вклад в развитие компании.</p>
                                <p>Желаем дальнейших успехов в работе!</p>
                            </div>
                        `;

                        premiaceResults.hidden = false;
                        if (employeeDetails) {
                            employeeDetails.hidden = true;
                        }

                        selectedSet.clear();
                        document.querySelectorAll('.employee-checkbox').forEach(cb => {
                            cb.checked = false;
                        });
                        if (selectAllCheckbox) {
                            selectAllCheckbox.checked = false;
                            selectAllCheckbox.indeterminate = false;
                        }
                        saveSelectedEmployees(selectedSet);
                        updatePremiateButton(selectedSet);
                        console.log('Сброшены выбранные сотрудники после премирования');
                    }
                });
            }
        }

        function setupFormHandler(selectedSet) {
            if (employeesForm) {
                employeesForm.addEventListener('submit', function (e) {
                    if (selectedEmployeesInput) {
                        selectedEmployeesInput.value = JSON.stringify(Array.from(selectedSet));
                    }
                    saveSelectedEmployees(selectedSet);
                    console.log('Форма отправляется с выбранными сотрудниками:', Array.from(selectedSet));
                });
            }
        }

        function setupAddEmployeeForm() {
            const addEmployeeBtn = document.getElementById('add-employee-btn');
            const addFormContainer = document.getElementById('add-form-container');
            const cancelAddBtn = document.getElementById('cancel-add-btn');
            const addForm = document.getElementById('add-employee-form');

            if (addEmployeeBtn && addFormContainer) {
                addEmployeeBtn.addEventListener('click', function () {
                    addFormContainer.hidden = !addFormContainer.hidden;
                });
            }

            if (cancelAddBtn && addFormContainer) {
                cancelAddBtn.addEventListener('click', function () {
                    addFormContainer.hidden = true;
                    if (addForm) {
                        addForm.reset();
                    }
                    resetValidation();
                });
            }

            const validators = {
                url: function (url) {
                    if (!url) return { isValid: true, message: '' };

                    const pattern = /^(http:\/\/|https:\/\/).*\.(php|html)$/;
                    const isValid = pattern.test(url);

                    return {
                        isValid,
                        message: isValid ? 'URL валиден' : 'URL должен начинаться с http:// или https:// и заканчиваться на .php или .html'
                    };
                },

                phone: function (phone) {
                    if (!phone) return { isValid: false, message: 'Телефон обязателен' };

                    const patterns = [
                        /^\+375\s?\(\d{2}\)\s?\d{3}-\d{2}-\d{2}$/, // +375 (29) XXX-XX-XX
                        /^\+375\d{9}$/, // +375XXXXXXXXX
                        /^8\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, // 8 (XXX) XXX-XX-XX
                    ];

                    const isValid = patterns.some(pattern => pattern.test(phone));

                    return {
                        isValid,
                        message: isValid ? 'Телефон валиден' : 'Телефон должен быть в формате: +375 (29) XXX-XX-XX'
                    };
                },

                email: function (email) {
                    if (!email) return { isValid: false, message: 'Email обязателен' };

                    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const isValid = pattern.test(email);

                    return {
                        isValid,
                        message: isValid ? 'Email валиден' : 'Введите корректный email адрес'
                    };
                }
            };

            function validateForm() {
                const url = document.getElementById('new-photo').value;
                const phone = document.getElementById('new-phone').value;
                const firstName = document.getElementById('new-firstname').value;
                const lastName = document.getElementById('new-lastname').value;
                const position = document.getElementById('new-position').value;
                const email = document.getElementById('new-email').value;

                const urlValidation = validators.url(url);
                const phoneValidation = validators.phone(phone);
                const emailValidation = validators.email(email);

                updateValidation('url', urlValidation);
                updateValidation('phone', phoneValidation);
                updateValidation('email', emailValidation);

                const allFieldsFilled = firstName && lastName && position && phone && email;
                const allValid = urlValidation.isValid && phoneValidation.isValid && emailValidation.isValid && allFieldsFilled;

                const submitBtn = document.getElementById('submit-add-btn');
                if (submitBtn) {
                    submitBtn.disabled = !allValid;
                }

                return allValid;
            }

            function updateValidation(field, validation) {
                const input = document.getElementById(`new-${field}`);
                const messageElement = document.getElementById(`${field}-validation`);

                if (input && messageElement) {
                    if (validation.message) {
                        messageElement.textContent = validation.message;
                        messageElement.className = `validation-message ${validation.isValid ? 'success' : 'error'}`;

                        if (validation.isValid) {
                            input.classList.remove('invalid');
                        } else {
                            input.classList.add('invalid');
                        }
                    } else {
                        messageElement.textContent = '';
                        messageElement.className = 'validation-message';
                        input.classList.remove('invalid');
                    }
                }
            }

            function resetValidation() {
                document.querySelectorAll('.validation-message').forEach(el => {
                    el.textContent = '';
                    el.className = 'validation-message';
                });

                document.querySelectorAll('.invalid').forEach(el => {
                    el.classList.remove('invalid');
                });

                const submitBtn = document.getElementById('submit-add-btn');
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
            }

            const photoInput = document.getElementById('new-photo');
            if (photoInput) {
                photoInput.addEventListener('input', validateForm);
            }

            const phoneInput = document.getElementById('new-phone');
            if (phoneInput) {
                phoneInput.addEventListener('input', validateForm);
            }

            const emailInput = document.getElementById('new-email');
            if (emailInput) {
                emailInput.addEventListener('input', validateForm);
            }

            const requiredFields = ['new-firstname', 'new-lastname', 'new-position', 'new-phone', 'new-email'];
            requiredFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.addEventListener('input', validateForm);
                }
            });

            if (addForm) {
                addForm.addEventListener('submit', async function (e) {
                    e.preventDefault();

                    if (!validateForm()) {
                        alert('Пожалуйста, исправьте ошибки в форме');
                        return;
                    }

                    showPreloader();

                    try {
                        const formData = {
                            first_name: document.getElementById('new-firstname').value.trim(),
                            last_name: document.getElementById('new-lastname').value.trim(),
                            middle_name: document.getElementById('new-middlename').value.trim(),
                            position: document.getElementById('new-position').value.trim(),
                            phone: document.getElementById('new-phone').value.trim(),
                            email: document.getElementById('new-email').value.trim(),
                            photo_url: document.getElementById('new-photo').value.trim()
                        };

                        const response = await fetch('/api/add-employee/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCSRFToken()
                            },
                            body: JSON.stringify(formData)
                        });

                        const result = await response.json();

                        if (result.success) {
                            alert('Сотрудник успешно добавлен!');
                            addFormContainer.hidden = true;
                            addForm.reset();
                            resetValidation();

                            window.location.reload();
                        } else {
                            alert('Ошибка при добавлении сотрудника: ' + (result.error || 'Неизвестная ошибка'));
                        }
                    } catch (error) {
                        console.error('Ошибка:', error);
                        alert('Произошла ошибка при отправке данных');
                    } finally {
                        hidePreloader();
                    }
                });
            }
        }

        function getCSRFToken() {
            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('csrftoken='))
                ?.split('=')[1];
            return cookieValue || '';
        }

        function init() {
            console.log('Инициализация управления сотрудниками');

            const selectedSet = loadSelectedEmployees();
            let employeesData = loadEmployeesData();

            employeesData = updateEmployeesData(employeesData);

            updateCheckboxesState(selectedSet, employeesData);

            setupCheckboxHandlers(selectedSet, employeesData);
            setupSelectAllHandler(selectedSet, employeesData);
            setupPremiateHandler(selectedSet, employeesData);
            setupFormHandler(selectedSet);
            setupAddEmployeeForm();

            setupServerLoading();
            setupSearch();
            setupTableInteractions();

            updatePremiateButton(selectedSet);

            if (selectedEmployeesInput) {
                selectedEmployeesInput.value = JSON.stringify(Array.from(selectedSet));
            }
        }

        init();
    });
