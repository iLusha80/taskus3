# План реализации Frontend для Roadmap

## 1. Добавление новой вкладки "Roadmap" в `frontend-react/src/components/BoardNavigation.jsx`

*   Добавить новый `NavItem` и `BoardButton` для "Roadmap".
*   Настроить `onClick` для перехода на новую страницу Roadmap.

## 2. Создание новой страницы `frontend-react/src/pages/RoadmapPage.jsx`

*   Создать новый файл `frontend-react/src/pages/RoadmapPage.jsx`.
*   Эта страница будет отвечать за отображение иерархии "Цель -> Этап".
*   Будет использовать новые API-эндпоинты для получения Objectives и Milestones.
*   Реализовать древовидное представление или вложенные списки для визуализации.
*   Добавить прогресс-бары для Objectives и Milestones.
*   Реализовать интерактивность: клик на Milestone для фильтрации Kanban-доски (перенаправление на страницу доски с примененным фильтром) и раскрытие списка задач.
*   Добавить функционал для создания, редактирования и удаления Objectives и Milestones.

## 3. Обновление `frontend-react/src/App.jsx` для маршрутизации

*   Добавить новый маршрут для `/project/:projectId/roadmap` в `App.jsx`.

## 4. Расширение `frontend-react/src/services/api.js` для работы с Objectives и Milestones

*   Добавить функции для получения, создания, обновления и удаления Objectives.
*   Добавить функции для получения, создания, обновления и удаления Milestones.
*   Добавить функцию для получения Milestones по `projectId`.
*   Добавить функцию для получения карточек, связанных с Milestone.

## 5. Интеграция с модальным окном создания/редактирования Card

*   В `frontend-react/src/pages/BoardPage.jsx` (или в компоненте `Modal`, если это более универсально) добавить логику для загрузки Milestones при открытии модального окна создания/редактирования карточки.
*   Добавить новое поле типа `select` в `frontend-react/src/components/Modal.jsx` для выбора Milestone.
*   Обновить логику сохранения карточки в `BoardPage.jsx` для включения `milestone_id`.

## 6. Создание новых компонентов для Roadmap

*   `ObjectiveItem.jsx`: Компонент для отображения одной цели с ее прогрессом и вложенными этапами.
    *   Поля: `id`, `project_id`, `name`, `description`, `status`, `owner_agent_id`, `start_date`, `target_date`, `created_at`, `updated_at`.
*   `MilestoneItem.jsx`: Компонент для отображения одного этапа с его прогрессом и ссылками на карточки.
    *   Поля: `id`, `objective_id`, `name`, `description`, `status`, `due_date`, `created_at`, `updated_at`.
*   `ProgressBar.jsx`: Переиспользуемый компонент для отображения прогресса.

## Визуализация плана (Mermaid Diagram)

```mermaid
graph TD
    A[Пользователь] --> B(Переходит на страницу проекта);
    B --> C{BoardNavigation};
    C -- Клик на "Roadmap" --> D[RoadmapPage.jsx];
    D -- Загрузка данных --> E[api.js];
    E -- Получение Objectives/Milestones --> F[Backend API];
    F --> E;
    E --> D;
    D -- Отображение иерархии --> G[ObjectiveItem.jsx];
    G --> H[MilestoneItem.jsx];
    H -- Отображение прогресса --> I[ProgressBar.jsx];
    H -- Клик на Milestone --> J[Фильтрация Kanban-доски];
    D -- Создание/Редактирование/Удаление --> K[Modal.jsx];
    K -- Сохранение --> E;

    L[BoardPage.jsx] -- Открытие модального окна Card --> K;
    K -- Выбор Milestone --> E;
    E -- Получение Milestones для проекта --> F;
    F --> E;
    E --> K;
    K -- Сохранение Card с Milestone --> E;