// Загрузка информации о семейной группе
async function loadFamilyInfo() {
    try {
        const response = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyMembers}`);
        const members = await response.json();

        const budgetResponse = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyBudget}`);
        const budgetData = await budgetResponse.json();

        const invitesResponse = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyInvites}`);
        const invites = await invitesResponse.json();

        updateFamilyUI(members, budgetData, invites);
    } catch (error) {
        console.error('Ошибка при загрузке информации о семье:', error);
    }
}

// Обновление UI с информацией о семейной группе
function updateFamilyUI(members, budgetData, invites) {
    const familySection = document.getElementById('familySection');
    const familyContent = document.getElementById('familyContent');

    if (members.length === 0) {
        // Нет семейной группы
        familyContent.innerHTML = `
            <div class="no-family">
                <h3>У вас пока нет семейной группы</h3>
                <button onclick="createFamilyGroup()" class="primary-button">Создать семейную группу</button>
            </div>
        `;
    } else {
        // Есть семейная группа
        const membersList = members.map(member => `
            <div class="family-member">
                <span>${member.name} ${member.surname}</span>
                ${member.isOwner ? '<span class="owner-badge">Владелец</span>' : ''}
            </div>
        `).join('');

        const invitesList = invites.map(invite => `
            <div class="invite-item">
                <span>${invite.invitedUserEmail || invite.invitedUserLogin}</span>
                <span class="invite-status">${invite.accepted ? 'Принято' : 'Ожидает'}</span>
            </div>
        `).join('');

        familyContent.innerHTML = `
            <div class="family-info">
                <h3>Члены семьи</h3>
                <div class="members-list">
                    ${membersList}
                </div>
                
                <h3>Семейный бюджет</h3>
                <div class="family-budget">
                    <p>Общий бюджет: ${budgetData.budget} руб.</p>
                    <p>Общие расходы: ${budgetData.members.reduce((sum, m) => sum + m.expense, 0)} руб.</p>
                </div>

                <h3>Приглашения</h3>
                <div class="invites-list">
                    ${invitesList}
                </div>

                <div class="family-actions">
                    <button onclick="showInviteForm()" class="primary-button">Пригласить члена семьи</button>
                    <button onclick="showBudgetForm()" class="primary-button">Установить бюджет</button>
                </div>
            </div>
        `;
    }
}

// Создание семейной группы
async function createFamilyGroup() {
    try {
        const response = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyCreate}`, {
            method: 'POST'
        });

        if (response.ok) {
            await loadFamilyInfo();
        } else {
            throw new Error('Не удалось создать семейную группу');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Отправка приглашения
async function inviteFamilyMember(email) {
    try {
        const response = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyInvite}`, {
            method: 'POST',
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Приглашение отправлено!');
            await loadFamilyInfo();
        } else {
            throw new Error('Не удалось отправить приглашение');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Установка семейного бюджета
async function setFamilyBudget(budget) {
    try {
        const response = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyBudget}`, {
            method: 'POST',
            body: JSON.stringify({ budget: parseFloat(budget) })
        });

        if (response.ok) {
            alert('Бюджет установлен!');
            await loadFamilyInfo();
        } else {
            throw new Error('Не удалось установить бюджет');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Показать форму приглашения
function showInviteForm() {
    const modal = document.getElementById('inviteModal');
    modal.style.display = 'block';
}

// Показать форму установки бюджета
function showBudgetForm() {
    const modal = document.getElementById('budgetModal');
    modal.style.display = 'block';
}

// Закрыть модальное окно
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Обработчики форм
document.getElementById('inviteForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('inviteEmail').value;
    await inviteFamilyMember(email);
    closeModal('inviteModal');
});

document.getElementById('budgetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const budget = document.getElementById('familyBudget').value;
    await setFamilyBudget(budget);
    closeModal('budgetModal');
});

// Принятие приглашения
async function acceptInvite(token) {
    try {
        const response = await fetchWithAuth(`${config.apiUrl}${config.endpoints.familyAcceptInvite}`, {
            method: 'POST',
            body: JSON.stringify({ token })
        });

        if (response.ok) {
            alert('Вы присоединились к семейной группе!');
            window.location.href = '/profile';
        } else {
            throw new Error('Не удалось принять приглашение');
        }
    } catch (error) {
        alert(error.message);
    }
}

// Проверяем URL на наличие токена приглашения
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteToken = urlParams.get('token');
    
    if (inviteToken) {
        acceptInvite(inviteToken);
    } else {
        loadFamilyInfo();
    }
}); 