const Column = {
    render: async (columnData) => {
        const columnElement = document.createElement('div');
        columnElement.className = 'column';
        columnElement.dataset.columnId = columnData.id;
        columnElement.innerHTML = `
            <h3>${columnData.name}</h3>
            <div class="cards-container"></div>
            <button class="add-card-button" data-column-id="${columnData.id}">Добавить карточку</button>
            <button class="delete-column-button" data-column-id="${columnData.id}">Удалить колонку</button>
        `;

        const cardsContainer = columnElement.querySelector('.cards-container');
        const cards = await api.getCards(columnData.id);

        if (cards && cards.length > 0) {
            cards.forEach(cardData => {
                const cardElement = Card.render(cardData);
                cardsContainer.appendChild(cardElement);
            });
        } else {
            cardsContainer.innerHTML = '<p>Нет задач</p>';
        }

        // Инициализация Drag and Drop для этой колонки
        DragAndDrop.initColumn(columnElement);

        // Обработчики событий
        columnElement.querySelector('.add-card-button').addEventListener('click', Column.handleAddCard);
        columnElement.querySelector('.delete-column-button').addEventListener('click', Column.handleDeleteColumn);

        return columnElement;
    },

    handleAddCard: async (event) => {
        const columnId = event.target.dataset.columnId;
        const cardTitle = prompt('Введите название новой задачи:');
        if (cardTitle) {
            const cardsInColumn = document.querySelector(`.column[data-column-id="${columnId}"] .cards-container`).children.length;
            const newCard = await api.createCard(columnId, {
                title: cardTitle,
                description: '', // Описание пока пустое, можно будет редактировать
                position: cardsInColumn // Добавляем в конец
            });
            if (newCard && newCard.id) {
                alert(`Задача "${newCard.title}" успешно создана!`);
                // Перезагружаем доску, чтобы обновить UI
                router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`);
            } else {
                alert('Ошибка при создании задачи.');
            }
        }
    },

    handleDeleteColumn: async (event) => {
        const columnId = event.target.dataset.columnId;
        if (confirm('Вы уверены, что хотите удалить эту колонку и все задачи в ней?')) {
            const success = await api.deleteColumn(columnId);
            if (success) {
                alert('Колонка успешно удалена.');
                router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`); // Перезагружаем доску
            } else {
                alert('Ошибка при удалении колонки.');
            }
        }
    }
};

window.Column = Column;