const BoardNavigation = {
    render: async () => {
        const navElement = document.getElementById('main-nav');
        if (!navElement) {
            console.error('Элемент навигации #main-nav не найден.');
            return '';
        }

        const projects = await api.getProjects();
        let navHtml = '<ul>';

        if (projects && projects.length > 0) {
            for (const project of projects) {
                navHtml += `
                    <li class="nav-project-item" data-project-id="${project.id}">
                        <a href="#" class="project-link">${project.name}</a>
                        <ul class="board-list" id="boards-for-project-${project.id}">
                            <!-- Доски будут загружены по требованию -->
                        </ul>
                    </li>
                `;
            }
        } else {
            navHtml += '<li>Нет доступных проектов.</li>';
        }
        navHtml += '</ul>';
        navElement.innerHTML = navHtml;

        // Добавляем обработчики событий
        navElement.querySelectorAll('.project-link').forEach(link => {
            link.addEventListener('click', async (event) => {
                event.preventDefault();
                const projectId = event.target.closest('.nav-project-item').dataset.projectId;
                await BoardNavigation.toggleProjectBoards(projectId);
            });
        });

        // Обработчик для навигации по доскам
        navElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('board-link')) {
                event.preventDefault();
                const projectId = event.target.dataset.projectId;
                const boardId = event.target.dataset.boardId;
                router.navigate(`/project/${projectId}/board/${boardId}`);
            }
        });
    },

    toggleProjectBoards: async (projectId) => {
        const boardListElement = document.getElementById(`boards-for-project-${projectId}`);
        if (!boardListElement) return;

        // Если доски уже загружены, просто переключаем видимость
        if (boardListElement.children.length > 0 && boardListElement.dataset.loaded === 'true') {
            boardListElement.classList.toggle('active');
            return;
        }

        // Загружаем доски, если они еще не загружены
        const boards = await api.getBoards(projectId);
        let boardsHtml = '';
        if (boards && boards.length > 0) {
            boards.forEach(board => {
                boardsHtml += `
                    <li><a href="#" class="board-link" data-project-id="${projectId}" data-board-id="${board.id}">${board.name}</a></li>
                `;
            });
        } else {
            boardsHtml += '<li>Нет досок.</li>';
        }
        boardListElement.innerHTML = boardsHtml;
        boardListElement.dataset.loaded = 'true';
        boardListElement.classList.add('active'); // Показываем доски
    },

    highlightActive: (projectId, boardId) => {
        document.querySelectorAll('.nav-project-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.projectId === projectId) {
                item.classList.add('active');
                const boardListElement = document.getElementById(`boards-for-project-${projectId}`);
                if (boardListElement) {
                    boardListElement.classList.add('active'); // Убедимся, что список досок открыт
                }
            }
        });

        document.querySelectorAll('.board-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.projectId === projectId && link.dataset.boardId === boardId) {
                link.classList.add('active');
            }
        });
    }
};

window.BoardNavigation = BoardNavigation;