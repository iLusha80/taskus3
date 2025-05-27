const Column = {
    render: async (columnData) => {
        const columnElement = document.createElement('div');
        columnElement.className = 'column';
        columnElement.dataset.columnId = columnData.id;
        columnElement.innerHTML = `
            <h3>${columnData.name}</h3>
            <div class="cards-container" data-column-id="${columnData.id}"></div>
            <button class="delete-button delete-column-button" data-column-id="${columnData.id}" title="Удалить колонку">×</button>
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
        columnElement.querySelector('.delete-column-button').addEventListener('click', Column.handleDeleteColumn);

        return columnElement;
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