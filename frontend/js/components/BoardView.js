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
                    <button class="add-button add-column-button" title="Добавить колонку"><i class="fas fa-plus"></i></button>
                    <button class="add-button add-board-button" title="Добавить доску"><i class="fas fa-plus"></i></button>
                    <button class="delete-button delete-board-button" title="Удалить текущую доску"><i class="fas fa-trash-alt"></i></button>
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
        Modal.show({
            title: 'Создать новую колонку',
            fields: [
                { id: 'columnName', label: 'Название колонки', type: 'text', required: true }
            ],
            onSave: async (formData) => {
                const { columnName } = formData;
                if (columnName) {
                    const boardContainer = document.querySelector('.board-container');
                    const currentColumns = boardContainer.querySelectorAll('.column').length;
                    const newColumn = await api.createColumn(BoardView.currentBoardId, {
                        name: columnName,
                        position: currentColumns
                    });
                    if (newColumn && newColumn.id) {
                        Modal.show({
                            title: 'Успех',
                            message: `Колонка "${newColumn.name}" успешно создана!`,
                            autoClose: true
                        });
                        router.loadRoute(`/project/${BoardView.currentProjectId}/board/${BoardView.currentBoardId}`);
                    } else {
                        Modal.show({
                            title: 'Ошибка',
                            message: 'Ошибка при создании колонки.',
                            autoClose: true
                        });
                    }
                }
            }
        });
    },

    handleAddBoard: async () => {
        Modal.show({
            title: 'Создать новую доску',
            fields: [
                { id: 'boardName', label: 'Название доски', type: 'text', required: true }
            ],
            onSave: async (formData) => {
                const { boardName } = formData;
                if (boardName) {
                    const newBoard = await api.createBoard(BoardView.currentProjectId, { name: boardName });
                    if (newBoard && newBoard.id) {
                        Modal.show({
                            title: 'Успех',
                            message: `Доска "${newBoard.name}" успешно создана!`,
                            autoClose: true
                        });
                        router.navigate(`/project/${BoardView.currentProjectId}/board/${newBoard.id}`);
                    } else {
                        Modal.show({
                            title: 'Ошибка',
                            message: 'Ошибка при создании доски.',
                            autoClose: true
                        });
                    }
                }
            }
        });
    },

    handleDeleteBoard: async () => {
        Modal.show({
            title: 'Подтверждение удаления',
            message: 'Вы уверены, что хотите удалить текущую доску и все связанные с ней колонки и задачи? Это действие необратимо.',
            onConfirm: async () => {
                const success = await api.deleteBoard(BoardView.currentBoardId);
                if (success) {
                    Modal.show({
                        title: 'Успех',
                        message: 'Доска успешно удалена.',
                        autoClose: true
                    });
                    router.navigate('/');
                } else {
                    Modal.show({
                        title: 'Ошибка',
                        message: 'Ошибка при удалении доски.',
                        autoClose: true
                    });
                }
            },
            isConfirm: true
        });
    }
};

window.BoardView = BoardView;