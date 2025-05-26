const BoardView = {
    currentProjectId: null,
    currentBoardId: null,

    render: async (projectId, boardId) => {
        BoardView.currentProjectId = projectId;
        BoardView.currentBoardId = boardId;

        const appRoot = document.getElementById('app-root');
        appRoot.innerHTML = `
            <div class="board-header">
                <h2 id="board-name">Загрузка доски...</h2>
                <div class="board-actions">
                    <button class="add-column-button">Добавить колонку</button>
                    <button class="add-board-button">Добавить доску</button>
                    <button class="delete-board-button">Удалить текущую доску</button>
                </div>
            </div>
            <div class="board-container"></div>
        `;

        const boardNameElement = appRoot.querySelector('#board-name');
        const boardContainer = appRoot.querySelector('.board-container');

        try {
            const board = await api.getBoard(boardId);
            if (!board) {
                appRoot.innerHTML = '<p>Доска не найдена.</p>';
                return;
            }
            boardNameElement.textContent = board.name;

            const columns = await api.getColumns(boardId);

            if (columns && columns.length > 0) {
                for (const columnData of columns) {
                    const columnElement = await Column.render(columnData);
                    boardContainer.appendChild(columnElement);
                }
            } else {
                boardContainer.innerHTML = '<p>На этой доске пока нет колонок. Добавьте первую!</p>';
            }

            // Обработчики событий
            appRoot.querySelector('.add-column-button').addEventListener('click', BoardView.handleAddColumn);
            appRoot.querySelector('.add-board-button').addEventListener('click', BoardView.handleAddBoard);
            appRoot.querySelector('.delete-board-button').addEventListener('click', BoardView.handleDeleteBoard);

        } catch (error) {
            console.error('Ошибка при загрузке доски:', error);
            appRoot.innerHTML = '<p>Не удалось загрузить доску. Пожалуйста, попробуйте позже.</p>';
        }
    },

    handleAddColumn: async () => {
        const columnName = prompt('Введите название новой колонки:');
        if (columnName) {
            const boardContainer = document.querySelector('.board-container');
            const currentColumns = boardContainer.querySelectorAll('.column').length;
            const newColumn = await api.createColumn(BoardView.currentBoardId, {
                name: columnName,
                position: currentColumns // Добавляем в конец
            });
            if (newColumn && newColumn.id) {
                alert(`Колонка "${newColumn.name}" успешно создана!`);
                router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`); // Перезагружаем доску
            } else {
                alert('Ошибка при создании колонки.');
            }
        }
    },

    handleAddBoard: async () => {
        const boardName = prompt('Введите название новой доски:');
        if (boardName) {
            const newBoard = await api.createBoard(BoardView.currentProjectId, { name: boardName });
            if (newBoard && newBoard.id) {
                alert(`Доска "${newBoard.name}" успешно создана!`);
                router.navigate(`/project/${BoardView.currentProjectId}/board/${newBoard.id}`); // Переходим на новую доску
            } else {
                alert('Ошибка при создании доски.');
            }
        }
    },

    handleDeleteBoard: async () => {
        if (confirm('Вы уверены, что хотите удалить текущую доску и все связанные с ней колонки и задачи?')) {
            const success = await api.deleteBoard(BoardView.currentBoardId);
            if (success) {
                alert('Доска успешно удалена.');
                // После удаления доски, возвращаемся к списку проектов
                router.navigate('/');
            } else {
                alert('Ошибка при удалении доски.');
            }
        }
    }
};

window.BoardView = BoardView;