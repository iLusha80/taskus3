document.addEventListener('DOMContentLoaded', () => {
    // Инициализация роутера
    router.init();

    // Добавление маршрутов
    router.addRoute('/', async () => {
        await ProjectList.render();
    });

    router.addRoute('/project/:projectId/board/:boardId', async (params) => {
        await BoardView.render(params.projectId, params.boardId);
    });

    // Добавьте другие маршруты по мере необходимости
});