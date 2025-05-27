import Notification from './Notification.js';
const DragAndDrop = {
    draggingCard: null, // Карточка, которую сейчас перетаскивают

    initColumn: (columnElement) => {
        const cardsContainer = columnElement.querySelector('.cards-container');

        cardsContainer.addEventListener('dragstart', DragAndDrop.handleDragStart);
        cardsContainer.addEventListener('dragover', DragAndDrop.handleDragOver);
        cardsContainer.addEventListener('drop', DragAndDrop.handleDrop);
        cardsContainer.addEventListener('dragenter', DragAndDrop.handleDragEnter);
        cardsContainer.addEventListener('dragleave', DragAndDrop.handleDragLeave);
    },

    handleDragStart: (e) => {
        // Убедимся, что перетаскиваем именно карточку
        if (!e.target.classList.contains('card')) {
            return;
        }
        DragAndDrop.draggingCard = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.cardId); // Передаем ID карточки
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    },

    handleDragOver: (e) => {
        e.preventDefault(); // Разрешаем drop
        e.dataTransfer.dropEffect = 'move';

        const target = e.target.closest('.card') || e.target.closest('.cards-container');
        if (target && DragAndDrop.draggingCard && target !== DragAndDrop.draggingCard) {
            const cardsContainer = target.closest('.cards-container');
            if (!cardsContainer) return;

            const children = Array.from(cardsContainer.children).filter(el => el.classList.contains('card') && el !== DragAndDrop.draggingCard);
            const afterElement = DragAndDrop.getDragAfterElement(cardsContainer, e.clientY);

            if (afterElement == null) {
                cardsContainer.appendChild(DragAndDrop.draggingCard);
            } else {
                cardsContainer.insertBefore(DragAndDrop.draggingCard, afterElement);
            }
        }
    },

    handleDrop: async (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('text/plain');
        const droppedCard = document.querySelector(`.card[data-card-id="${cardId}"]`);
        if (!droppedCard) return;

        droppedCard.classList.remove('dragging');

        const newColumnElement = e.target.closest('.column');
        if (!newColumnElement) return;

        const newColumnId = newColumnElement.dataset.columnId;
        const oldColumnId = droppedCard.dataset.columnId;

        // Определяем новую позицию
        const cardsInNewColumn = Array.from(newColumnElement.querySelector('.cards-container').children).filter(el => el.classList.contains('card'));
        const newPosition = cardsInNewColumn.indexOf(droppedCard);

        if (newColumnId !== oldColumnId || newPosition !== parseInt(droppedCard.dataset.position)) {
            // Обновляем данные на бэкенде
            const updatedCard = await api.updateCard(cardId, {
                column_id: parseInt(newColumnId),
                position: newPosition
            });

            if (updatedCard && updatedCard.id) {
                // Обновляем data-атрибуты карточки после успешного обновления
                droppedCard.dataset.columnId = updatedCard.column_id;
                droppedCard.dataset.position = updatedCard.position;
                // Перезагружаем доску, чтобы обновить UI и историю
                router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`);
            } else {
                Notification.show('Ошибка при перемещении карточки.', 'error');
                // В случае ошибки, можно откатить изменения UI, если нужно
                router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`);
            }
        }
        DragAndDrop.draggingCard = null;
    },

    handleDragEnter: (e) => {
        e.preventDefault();
        // Добавляем класс для визуального эффекта, если нужно
        // e.target.closest('.cards-container')?.classList.add('drag-over');
    },

    handleDragLeave: (e) => {
        // Удаляем класс
        // e.target.closest('.cards-container')?.classList.remove('drag-over');
    },

    getDragAfterElement: (container, y) => {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
};

window.DragAndDrop = DragAndDrop;