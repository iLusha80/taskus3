const Card = {
    render: (cardData) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.cardId = cardData.id;
        cardElement.dataset.columnId = cardData.column_id; // Для Drag and Drop
        cardElement.setAttribute('draggable', 'true'); // Делаем карточку перетаскиваемой

        cardElement.innerHTML = `
            <h4>${cardData.title}</h4>
            <p>${cardData.description || 'Нет описания'}</p>
            <div class="meta">
                Статус: ${cardData.status} | Приоритет: ${cardData.priority}
                ${cardData.assigned_agent_id ? `| Агент: ${cardData.assigned_agent_id}` : ''}
            </div>
        `;

        cardElement.addEventListener('click', () => Card.handleCardClick(cardData.id));

        return cardElement;
    },

    handleCardClick: async (cardId) => {
        const card = await api.getCard(cardId);
        if (!card) {
            alert('Карточка не найдена.');
            return;
        }

        // Открываем модальное окно для редактирования/просмотра
        Modal.open({
            title: `Редактировать задачу: ${card.title}`,
            content: `
                <form id="edit-card-form">
                    <label for="card-title">Название:</label>
                    <input type="text" id="card-title" name="title" value="${card.title}" required>

                    <label for="card-description">Описание:</label>
                    <textarea id="card-description" name="description">${card.description || ''}</textarea>

                    <label for="card-status">Статус:</label>
                    <select id="card-status" name="status">
                        <option value="open" ${card.status === 'open' ? 'selected' : ''}>Открыта</option>
                        <option value="in_progress" ${card.status === 'in_progress' ? 'selected' : ''}>В работе</option>
                        <option value="done" ${card.status === 'done' ? 'selected' : ''}>Выполнена</option>
                        <option value="blocked" ${card.status === 'blocked' ? 'selected' : ''}>Заблокирована</option>
                    </select>

                    <label for="card-priority">Приоритет:</label>
                    <select id="card-priority" name="priority">
                        <option value="low" ${card.priority === 'low' ? 'selected' : ''}>Низкий</option>
                        <option value="medium" ${card.priority === 'medium' ? 'selected' : ''}>Средний</option>
                        <option value="high" ${card.priority === 'high' ? 'selected' : ''}>Высокий</option>
                        <option value="urgent" ${card.priority === 'urgent' ? 'selected' : ''}>Срочный</option>
                    </select>

                    <label for="card-assigned-agent">Назначенный агент (ID):</label>
                    <input type="text" id="card-assigned-agent" name="assigned_agent_id" value="${card.assigned_agent_id || ''}">

                    <label for="card-task-type">Тип задачи:</label>
                    <input type="text" id="card-task-type" name="task_type" value="${card.task_type || ''}">

                    <label for="card-start-date">Дата начала:</label>
                    <input type="date" id="card-start-date" name="start_date" value="${card.start_date || ''}">

                    <label for="card-due-date">Дата завершения:</label>
                    <input type="date" id="card-due-date" name="due_date" value="${card.due_date || ''}">

                    <label for="card-metadata">Метаданные (JSON):</label>
                    <textarea id="card-metadata" name="metadata">${card.metadata || '{}'}</textarea>

                    <button type="submit" class="save-button">Сохранить</button>
                    <button type="button" class="delete-button">Удалить задачу</button>
                </form>
                <h3>История изменений</h3>
                <div id="card-history-container">Загрузка истории...</div>
            `,
            onSave: async () => {
                const form = document.getElementById('edit-card-form');
                const formData = new FormData(form);
                const updatedData = {};
                for (let [key, value] of formData.entries()) {
                    updatedData[key] = value;
                }
                // Преобразуем метаданные в объект, если это JSON строка
                try {
                    updatedData.metadata = JSON.parse(updatedData.metadata);
                } catch (e) {
                    console.error('Неверный формат JSON для метаданных:', e);
                    alert('Ошибка: Неверный формат JSON для метаданных.');
                    return false; // Предотвращаем закрытие модального окна
                }

                const updatedCard = await api.updateCard(cardId, updatedData);
                if (updatedCard && updatedCard.id) {
                    alert('Задача успешно обновлена!');
                    Modal.close();
                    router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`); // Перезагружаем доску
                } else {
                    alert('Ошибка при обновлении задачи.');
                    return false; // Предотвращаем закрытие модального окна
                }
                return true; // Закрываем модальное окно
            },
            onDelete: async () => {
                if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                    const success = await api.deleteCard(cardId);
                    if (success) {
                        alert('Задача успешно удалена.');
                        Modal.close();
                        router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`); // Перезагружаем доску
                    } else {
                        alert('Ошибка при удалении задачи.');
                    }
                }
                return false; // Не закрываем модальное окно автоматически после удаления, ждем перезагрузки
            }
        });

        // Загрузка истории после открытия модального окна
        const historyContainer = document.getElementById('card-history-container');
        if (historyContainer) {
            HistoryView.render(cardId, historyContainer);
        }
    }
};

window.Card = Card;