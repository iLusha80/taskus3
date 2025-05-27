const Column = {
    render: async (columnData) => {
        const columnElement = document.createElement('div');
        columnElement.className = 'column';
        columnElement.dataset.columnId = columnData.id;
        columnElement.innerHTML = `
            <h3>${columnData.name}</h3>
            <div class="cards-container" data-column-id="${columnData.id}"></div>
            <button class="add-button add-card-button" data-column-id="${columnData.id}" title="Добавить задачу"><i class="fas fa-plus"></i></button>
            <button class="delete-button delete-column-button" data-column-id="${columnData.id}" title="Удалить колонку"><i class="fas fa-trash-alt"></i></button>
        `;

        const cardsContainer = columnElement.querySelector('.cards-container');
        const cards = await api.getCards(columnData.id);

        if (cards && cards.length > 0) {
            for (const cardData of cards) {
                const cardElement = await Card.render(cardData);
                cardsContainer.appendChild(cardElement);
            }
        } else {
            cardsContainer.innerHTML = '<p>Нет задач.</p>';
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
        Modal.show({
            title: 'Создать новую задачу',
            fields: [
                { id: 'cardTitle', label: 'Название задачи', type: 'text', required: true },
                { id: 'cardDescription', label: 'Описание задачи (необязательно)', type: 'textarea', required: false }
            ],
            onSave: async (formData) => {
                const { cardTitle, cardDescription } = formData;
                if (cardTitle) {
                    const newCard = await api.createCard(columnId, {
                        title: cardTitle,
                        description: cardDescription,
                        position: document.querySelector(`.cards-container[data-column-id="${columnId}"]`).children.length
                    });
                    if (newCard && newCard.id) {
                        Modal.show({
                            title: 'Успех',
                            message: `Задача "${newCard.title}" успешно создана!`,
                            autoClose: true
                        });
                        router.loadRoute(window.location.pathname); // Перезагружаем доску, чтобы обновить список задач
                    } else {
                        Modal.show({
                            title: 'Ошибка',
                            message: 'Ошибка при создании задачи.',
                            autoClose: true
                        });
                    }
                }
            }
        });
    },

    handleDeleteColumn: async (event) => {
        const columnId = event.target.dataset.columnId;
        Modal.show({
            title: 'Подтверждение удаления',
            message: 'Вы уверены, что хотите удалить эту колонку и все связанные с ней задачи? Это действие необратимо.',
            onConfirm: async () => {
                const success = await api.deleteColumn(columnId);
                if (success) {
                    Modal.show({
                        title: 'Успех',
                        message: 'Колонка успешно удалена.',
                        autoClose: true
                    });
                    router.loadRoute(window.location.pathname); // Перезагружаем доску
                } else {
                    Modal.show({
                        title: 'Ошибка',
                        message: 'Ошибка при удалении колонки.',
                        autoClose: true
                    });
                }
            },
            isConfirm: true
        });
    }
};

window.Column = Column;