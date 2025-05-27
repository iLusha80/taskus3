document.addEventListener('DOMContentLoaded', async () => {
    await BoardNavigation.render(); // Инициализируем навигацию
    // Инициализация роутера
    // Добавление маршрутов
    router.addRoute('/', async () => {
        await ProjectList.render();
    });

    router.addRoute('/project/:projectId/board/:boardId', async (params) => {
        await BoardView.render(params.projectId, params.boardId);
        BoardNavigation.highlightActive(params.projectId, params.boardId); // Выделяем активную доску
    });

    // Инициализация роутера
    router.init();

    // Добавьте другие маршруты по мере необходимости
});