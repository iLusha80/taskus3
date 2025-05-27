# План по оптимизации и обновлению дизайна главной страницы

## Задача
Оптимизировать и обновить дизайн главной страницы приложения Taskus, включая внедрение темной темы, изменение заголовка, удаление определенных кнопок, настройку кликабельности карточек проектов и улучшение футера.

## План действий

### 1. Внедрение темной темы

*   **Изменение переменных CSS в `frontend-react/src/index.css`:**
    *   Добавление новых переменных для темной темы и изменение существующих для поддержки переключения.
    *   Пример:
        ```css
        :root {
            /* Light theme variables */
            --primary-blue: #007bff;
            --background-light: #f0f2f5;
            --text-color: #212529;
            --white: #ffffff;
            --dark-gray: #343a40;
            /* ... другие переменные светлой темы */
        }

        body.dark-theme {
            /* Dark theme variables */
            --primary-blue: #66b3ff; /* Более светлый синий для темной темы */
            --background-light: #1a1a1a; /* Темный фон */
            --text-color: #e0e0e0; /* Светлый текст */
            --white: #2c2c2c; /* Темный фон для карточек/шапки/футера */
            --dark-gray: #e0e0e0; /* Светлый текст для заголовков */
            /* ... другие переменные темной темы */
        }
        ```

*   **Добавление логики переключения темы:**
    *   В `frontend-react/src/App.jsx` или `frontend-react/src/main.jsx` добавить состояние для управления темой (например, `isDarkTheme`).
    *   Использовать `useEffect` для применения класса `dark-theme` к `body` в зависимости от состояния.
    *   Добавить кнопку или переключатель для изменения состояния `isDarkTheme`.

### 2. Изменение заголовка и его центрирование

*   **Изменение текста заголовка в `frontend-react/src/App.jsx`:**
    *   Изменить `<h1><Link to="/">Taskus</Link></h1>` на `<h1><Link to="/">AI Task Tracker</Link></h1>`.

*   **Центрирование заголовка в `frontend-react/src/index.css`:**
    *   Изменить стили `header` в `index.css` для центрирования содержимого.
    *   Пример:
        ```css
        header {
            /* ... существующие стили ... */
            justify-content: center; /* Центрирование по горизонтали */
        }
        ```

### 3. Удаление кнопок "Открыть доски" и "Удалить"

*   **Удаление JSX-элементов в `frontend-react/src/pages/ProjectListPage.jsx`:**
    *   Удалить блоки `<button className="view-button" ...>` и `<button className="delete-button" ...>` внутри `project-card`.
    *   Удалить `div` с классом `actions`, который их содержит.

*   **Удаление связанных функций в `frontend-react/src/pages/ProjectListPage.jsx`:**
    *   Удалить функции `handleViewProject` и `handleDeleteProject`.
    *   Удалить импорт `useNavigate` если он больше не используется.

### 4. Настройка клика по карточке проекта для прямого перехода

*   **Изменение `project-card` в `frontend-react/src/pages/ProjectListPage.jsx`:**
    *   Обернуть `project-card` в компонент `Link` из `react-router-dom` или добавить `onClick` обработчик к `div.project-card`.
    *   Если использовать `Link`:
        ```jsx
        <Link to={`/project/${project.id}/board/${project.defaultBoardId}`} className="project-card-link">
            <div key={project.id} className="project-card">
                <h2>{project.name}</h2>
                <p>{project.description || 'Нет описания'}</p>
            </div>
        </Link>
        ```
        *Примечание: потребуется получить `defaultBoardId` для каждого проекта. Если его нет, то нужно будет либо получать первую доску проекта, либо создавать ее при клике.*
    *   Если использовать `onClick` на `div`:
        ```jsx
        <div key={project.id} className="project-card" onClick={() => navigateToProjectDetails(project.id)}>
            <h2>{project.name}</h2>
            <p>{project.description || 'Нет описания'}</p>
        </div>
        ```
        *Примечание: `navigateToProjectDetails` будет функцией, которая определяет, куда перенаправлять, возможно, используя `handleViewProject` без модального окна.*

### 5. Перемещение кнопки "Добавить проект" в верхнюю часть страницы

*   **Перемещение JSX-элемента в `frontend-react/src/pages/ProjectListPage.jsx`:**
    *   Переместить `<button className="add-button add-project-button" onClick={handleAddProject}>` выше `<h2>Проекты</h2>` или в другое подходящее место в верхней части страницы.

*   **Обновление CSS-стилей в `frontend-react/src/pages/ProjectListPage.css`:**
    *   Изменить стили для `.add-project-button` для правильного позиционирования, например, с использованием flexbox или grid для контейнера.

### 6. Исправление и улучшение дизайна футера

*   **Обновление стилей футера в `frontend-react/src/index.css`:**
    *   Изменить `background-color` и `color` футера, чтобы они соответствовали темной теме.
    *   Пример:
        ```css
        footer {
            background-color: var(--white); /* Будет темнее в темной теме */
            color: var(--secondary-gray); /* Будет светлее в темной теме */
            /* ... другие стили ... */
        }
        ```

## Диаграмма потока выполнения (Mermaid):

```mermaid
graph TD
    A[Начало задачи] --> B{Сбор информации};
    B --> C[Прочитать ProjectListPage.jsx];
    B --> D[Прочитать ProjectListPage.css];
    B --> E[Прочитать App.css];
    B --> F[Прочитать index.css];
    B --> G[Прочитать App.jsx];
    C & D & E & F & G --> H[Анализ и планирование];
    H --> I[Внедрение темной темы];
    H --> J[Изменение заголовка и центрирование];
    H --> K[Удаление кнопок];
    H --> L[Клик по карточке проекта];
    H --> M[Перемещение кнопки "Добавить проект"];
    H --> N[Улучшение футера];
    I & J & K & L & M & N --> O[Представление плана пользователю];
    O --> P{План одобрен?};
    P -- Да --> Q[Записать план в Markdown];
    P -- Да --> R[Переключиться в режим Code для реализации];
    P -- Нет --> S[Корректировка плана];
    S --> O;
```

## Диаграмма компонентов (Mermaid):

```mermaid
graph TD
    App.jsx --> ProjectListPage.jsx;
    App.jsx --> BoardPage.jsx;
    App.jsx --> index.css;
    App.jsx --> App.css;
    ProjectListPage.jsx --> Modal.jsx;
    ProjectListPage.jsx --> NotificationContext.jsx;
    ProjectListPage.jsx --> ProjectListPage.css;
    ProjectListPage.jsx --> api.js;
    index.css -- Глобальные стили/переменные --> App.jsx;
    index.css -- Глобальные стили/переменные --> ProjectListPage.jsx;
    index.css -- Глобальные стили/переменные --> BoardPage.jsx;
    ProjectListPage.css -- Стили для страницы проектов --> ProjectListPage.jsx;
    App.css -- Общие стили приложения --> App.jsx;