import Notification from './Notification.js';
const ProjectList = {
    render: async () => {
        const appRoot = document.getElementById('app-root');
        appRoot.innerHTML = `
            <h2>Проекты</h2>
            <div class="project-list"></div>
            <button class="add-button add-project-button"><i class="fas fa-plus"></i> Добавить новый проект</button>
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
                        <button class="view-button" data-project-id="${project.id}"><i class="fas fa-eye"></i> Открыть доски</button>
                        <button class="delete-button" data-project-id="${project.id}"><i class="fas fa-trash-alt"></i> Удалить</button>
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
        Modal.show({
            title: 'Создать новый проект',
            fields: [
                { id: 'projectName', label: 'Название проекта', type: 'text', required: true },
                { id: 'projectDescription', label: 'Описание проекта (необязательно)', type: 'textarea', required: false }
            ],
            onSave: async (formData) => {
                const { projectName, projectDescription } = formData;
                if (projectName) {
                    const newProject = await api.createProject({ name: projectName, description: projectDescription });
                    if (newProject && newProject.id) {
                        Notification.show(`Проект "${newProject.name}" успешно создан!`, 'success');
                        router.loadRoute('/'); // Перезагружаем список проектов
                    } else {
                        Notification.show('Ошибка при создании проекта.', 'error');
                    }
                }
            }
        });
    },

    handleProjectActions: async (event) => {
        const targetButton = event.target.closest('.view-button, .delete-button');
        if (!targetButton) return;

        const projectId = targetButton.dataset.projectId;
        if (!projectId) return;

        if (targetButton.classList.contains('view-button')) {
            // При открытии проекта, переходим на первую доску или предлагаем создать
            const boards = await api.getBoards(projectId);
            if (boards && boards.length > 0) {
                router.navigate(`/project/${projectId}/board/${boards[0].id}`);
            } else {
                Modal.show({
                    title: 'Создать новую доску',
                    message: 'У этого проекта пока нет досок. Создать новую доску?',
                    fields: [
                        { id: 'boardName', label: 'Название доски', type: 'text', required: true }
                    ],
                    onSave: async (formData) => {
                        const { boardName } = formData;
                        if (boardName) {
                            const newBoard = await api.createBoard(projectId, { name: boardName });
                            if (newBoard && newBoard.id) {
                                Notification.show(`Доска "${newBoard.name}" успешно создана!`, 'success');
                                router.navigate(`/project/${projectId}/board/${newBoard.id}`);
                            } else {
                                Notification.show('Ошибка при создании доски.', 'error');
                            }
                        }
                    }
                    // isConfirm: true // Это модальное окно подтверждения - УДАЛЕНО
                });
            }
        } else if (targetButton.classList.contains('delete-button')) {
            Modal.show({
                title: 'Подтверждение удаления',
                message: 'Вы уверены, что хотите удалить этот проект и все связанные с ним доски и задачи? Это действие необратимо.',
                onConfirm: async () => {
                    const success = await api.deleteProject(projectId);
                    if (success) {
                        Notification.show('Проект успешно удален.', 'success');
                        router.loadRoute('/'); // Перезагружаем список проектов
                    } else {
                        Notification.show('Ошибка при удалении проекта.', 'error');
                    }
                },
                isConfirm: true
            });
        }
    }
};

window.ProjectList = ProjectList;