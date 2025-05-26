const ProjectList = {
    render: async () => {
        const appRoot = document.getElementById('app-root');
        appRoot.innerHTML = `
            <h2>Проекты</h2>
            <div class="project-list"></div>
            <button class="add-project-button">Добавить новый проект</button>
        `;

        const projectListContainer = appRoot.querySelector('.project-list');
        const projects = await api.getProjects();

        if (projects && projects.length > 0) {
            projects.forEach(project => {
                const projectCard = document.createElement('div');
                projectCard.className = 'project-card';
                projectCard.innerHTML = `
                    <h2>${project.name}</h2>
                    <p>${project.description || 'Нет описания'}</p>
                    <div class="actions">
                        <button class="view-button" data-project-id="${project.id}">Открыть доски</button>
                        <button class="delete-button" data-project-id="${project.id}">Удалить</button>
                    </div>
                `;
                projectListContainer.appendChild(projectCard);
            });
        } else {
            projectListContainer.innerHTML = '<p>Пока нет проектов. Создайте первый!</p>';
        }

        // Обработчики событий
        appRoot.querySelector('.add-project-button').addEventListener('click', ProjectList.handleAddProject);
        projectListContainer.addEventListener('click', ProjectList.handleProjectActions);
    },

    handleAddProject: async () => {
        const projectName = prompt('Введите название нового проекта:');
        if (projectName) {
            const projectDescription = prompt('Введите описание проекта (необязательно):');
            const newProject = await api.createProject({ name: projectName, description: projectDescription });
            if (newProject && newProject.id) {
                alert(`Проект "${newProject.name}" успешно создан!`);
                router.loadRoute('/'); // Перезагружаем список проектов
            } else {
                alert('Ошибка при создании проекта.');
            }
        }
    },

    handleProjectActions: async (event) => {
        const projectId = event.target.dataset.projectId;
        if (!projectId) return;

        if (event.target.classList.contains('view-button')) {
            // При открытии проекта, переходим на первую доску или предлагаем создать
            const boards = await api.getBoards(projectId);
            if (boards && boards.length > 0) {
                router.navigate(`/project/${projectId}/board/${boards[0].id}`);
            } else {
                const createBoardConfirm = confirm('У этого проекта пока нет досок. Создать новую доску?');
                if (createBoardConfirm) {
                    const boardName = prompt('Введите название новой доски:');
                    if (boardName) {
                        const newBoard = await api.createBoard(projectId, { name: boardName });
                        if (newBoard && newBoard.id) {
                            alert(`Доска "${newBoard.name}" успешно создана!`);
                            router.navigate(`/project/${projectId}/board/${newBoard.id}`);
                        } else {
                            alert('Ошибка при создании доски.');
                        }
                    }
                }
            }
        } else if (event.target.classList.contains('delete-button')) {
            if (confirm('Вы уверены, что хотите удалить этот проект и все связанные с ним доски и задачи?')) {
                const success = await api.deleteProject(projectId);
                if (success) {
                    alert('Проект успешно удален.');
                    router.loadRoute('/'); // Перезагружаем список проектов
                } else {
                    alert('Ошибка при удалении проекта.');
                }
            }
        }
    }
};

window.ProjectList = ProjectList;