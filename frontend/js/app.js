document.addEventListener('DOMContentLoaded', () => {
    // Инициализация роутера
    // Добавление маршрутов
    router.addRoute('/', async () => {
        await ProjectList.render();
    });

    router.addRoute('/project/:projectId/board/:boardId', async (params) => {
        await BoardView.render(params.projectId, params.boardId);
    });

    // Инициализация роутера
    router.init();

    // Добавьте другие маршруты по мере необходимости
});