const API_URL = "http://localhost:5001/api"; // Замените на ваш порт, если другой

// 1. Баланс и суммы
async function loadBalance() {
    try {
        const res = await fetch(`${API_URL}/dashboard/summary`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        document.getElementById('balance').textContent = (data.balance ?? 0).toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
        document.getElementById('income').textContent = (data.income ?? 0).toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
        document.getElementById('expense').textContent = (data.expense ?? 0).toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'});
    } catch {
        document.getElementById('balance').textContent = "0 ₽";
        document.getElementById('income').textContent = "0 ₽";
        document.getElementById('expense').textContent = "0 ₽";
    }
}

// 2. Последние операции
async function loadOperations() {
    const res = await fetch(`${API_URL}/operations`);
    const data = await res.json();
    const list = document.getElementById('operations-list');
    list.innerHTML = '';
    data.slice(0, 5).forEach(op => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            <span>
                <b>${op.category.name}</b> — ${op.description || ''} <small class="text-muted">${new Date(op.date).toLocaleDateString()}</small>
            </span>
            <span style="color:${op.amount > 0 ? 'green' : 'red'}">${op.amount > 0 ? '+' : ''}${op.amount} ₽</span>
            <button class="btn btn-sm btn-outline-secondary ms-2" onclick="repeatPayment(${op.id})">Повторить</button>
        `;
        list.appendChild(li);
    });
}

// 3. Повторить платёж
async function repeatPayment(id) {
    const res = await fetch(`${API_URL}/operations/${id}`);
    if (!res.ok) return alert("Ошибка при получении операции");
    const op = await res.json();
    await fetch(`${API_URL}/operations`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            date: new Date().toISOString(),
            categoryId: op.categoryId,
            description: op.description,
            amount: op.amount
        })
    });
    await loadBalance();
    await loadOperations();
}

// 4. Открыть модалку для добавления операции
function openOperationModal(type = "expense") {
    document.getElementById('op-type').value = type;
    loadCategoriesForOperation(type);
    new bootstrap.Modal(document.getElementById('operationModal')).show();
}

// 5. Загрузить категории по типу для операций
async function loadCategoriesForOperation(type) {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    const select = document.getElementById('op-category');
    select.innerHTML = '';
    data.filter(c => c.type === type).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        select.appendChild(opt);
    });
}

// 6. Добавить операцию
document.getElementById('operation-form').onsubmit = async function(e) {
    e.preventDefault();
    const type = document.getElementById('op-type').value;
    const categoryId = document.getElementById('op-category').value;
    const amount = parseFloat(document.getElementById('op-amount').value);
    const description = document.getElementById('op-description').value;
    await fetch(`${API_URL}/operations`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            date: new Date().toISOString(),
            categoryId,
            description,
            amount: type === 'income' ? Math.abs(amount) : -Math.abs(amount)
        })
    });
    bootstrap.Modal.getInstance(document.getElementById('operationModal')).hide();
    await loadBalance();
    await loadOperations();
    await loadCategoryStats();
}

// 7. Экспорт данных
document.getElementById('export-btn').onclick = async function() {
    const res = await fetch(`${API_URL}/operations`);
    const data = await res.json();
    const csv = [
        ["Дата", "Категория", "Описание", "Сумма"],
        ...data.map(op => [
            new Date(op.date).toLocaleDateString(),
            op.category.name,
            op.description || "",
            op.amount
        ])
    ].map(row => row.join(";")).join("\n");
    const blob = new Blob([csv], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "operations.csv";
    a.click();
    URL.revokeObjectURL(url);
}

// 8. Статистика по категориям (Chart.js)
let statsChart;
async function loadCategoryStats() {
    const res = await fetch(`${API_URL}/dashboard/category-stats`);
    const data = await res.json();
    const ctx = document.getElementById('stats-chart').getContext('2d');
    if (statsChart) statsChart.destroy();
    statsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(x => x.category),
            datasets: [{
                data: data.map(x => Math.abs(x.total)),
                backgroundColor: [
                    '#a78bfa', '#818cf8', '#f472b6', '#fbbf24', '#34d399', '#f87171'
                ]
            }]
        },
        options: {
            plugins: {
                legend: { display: true }
            }
        }
    });
}

// 9. Динамика расходов (пример: просто alert, можно сделать отдельный график)
document.getElementById('expense-dynamics-btn').onclick = function() {
    alert("Динамика расходов: реализуйте отдельный график или страницу!");
}

// 10. Кнопки операций
document.getElementById('add-income-btn').onclick = () => openOperationModal('income');
document.getElementById('add-expense-btn').onclick = () => openOperationModal('expense');
document.getElementById('add-operation-btn').onclick = () => openOperationModal();
document.getElementById('category-stats-btn').onclick = loadCategoryStats;
document.getElementById('repeat-payment-btn').onclick = () => {
    alert("Для повторения платежа используйте кнопку 'Повторить' рядом с нужной операцией.");
};

// 11. Кнопка "Финансовый менеджер" — переход в профиль
document.getElementById('profile-link').onclick = function(e) {
    e.preventDefault();
    window.location.href = "profile.html";
};

// 12. Категории: загрузка и добавление
async function loadCategories() {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    const expenseList = document.getElementById('expense-categories-list');
    const incomeList = document.getElementById('income-categories-list');
    expenseList.innerHTML = '';
    incomeList.innerHTML = '';
    data.forEach(cat => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = cat.name;
        if (cat.type === 'expense') {
            expenseList.appendChild(li);
        } else {
            incomeList.appendChild(li);
        }
    });
}

// 13. Добавление категории через модалку
document.addEventListener('DOMContentLoaded', function() {
    // Открытие модального окна для добавления категории
    const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));
    document.getElementById('add-category').addEventListener('click', function() {
        document.getElementById('cat-name').value = '';
        document.getElementById('cat-type').value = 'expense';
        categoryModal.show();
    });

    // Обработка отправки формы добавления категории
    document.getElementById('category-form').onsubmit = async function(e) {
        e.preventDefault();
        const name = document.getElementById('cat-name').value.trim();
        const type = document.getElementById('cat-type').value;
        if (!name) return;

        const res = await fetch(`${API_URL}/categories`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, type })
        });

        if (!res.ok) {
            const err = await res.text();
            alert("Ошибка при добавлении категории: " + err);
            return;
        }

        categoryModal.hide();
        loadCategories();
    };

    // Инициализация при загрузке страницы
    loadBalance();
    loadOperations();
    loadCategoryStats();
    loadCategories();
});
