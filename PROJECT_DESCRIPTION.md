# Описание проекта

Данный проект представляет собой веб-приложение для управления задачами, организованное по принципу досок (boards) с колонками (columns) и карточками (cards). Проект состоит из двух основных частей: бэкенда на Python (Flask) и фронтенда на React.

## Бэкенд (`backend/`)

Бэкенд предоставляет API для управления проектами, досками, колонками и карточками. Используется база данных для хранения информации.

- [`app.py`](backend/app.py): Основной файл приложения Flask.
- [`config.py`](backend/config.py): Конфигурация приложения.
- [`database.py`](backend/database.py): Настройка и взаимодействие с базой данных.
- [`Dockerfile`](backend/Dockerfile): Определение Docker-образа для бэкенда.
- [`requirements.txt`](backend/requirements.txt): Список зависимостей Python.
- [`API_ENDPOINTS.md`](backend/API_ENDPOINTS.md): Документация по всем доступным API-эндпоинтам.
- [`api/`](backend/api/): Модули API для различных сущностей (агенты, доски, карточки, колонки, вехи, цели, проекты).
- [`models/`](backend/models/): Определение моделей данных (Agent, Board, Card, Column, History, Milestone, Objective, Project).
- [`services/`](backend/services/): Бизнес-логика и взаимодействие с моделями данных (включая сервисы для вех и целей).
- [`utils/`](backend/utils/): Вспомогательные утилиты.

## Фронтенд (`frontend-react/`)

Фронтенд представляет собой одностраничное приложение на React, взаимодействующее с бэкендом через API.

- [`.gitignore`](frontend-react/.gitignore): Файл для игнорирования в Git.
- [`Dockerfile`](frontend-react/Dockerfile): Определение Docker-образа для фронтенда.
- [`eslint.config.js`](frontend-react/eslint.config.js): Конфигурация ESLint.
- [`index.html`](frontend-react/index.html): Основной HTML-файл.
- [`nginx.conf`](frontend-react/nginx.conf): Конфигурация Nginx для обслуживания фронтенда.
- [`package-lock.json`](frontend-react/package-lock.json): Зафиксированные версии зависимостей npm.
- [`package.json`](frontend-react/package.json): Список зависимостей и скрипты npm.
- [`README.md`](frontend-react/README.md): Описание фронтенд-части проекта.
- [`vite.config.js`](frontend-react/vite.config.js): Конфигурация Vite.
- [`public/`](frontend-react/public/): Статические файлы.
- [`src/`](frontend-react/src/): Исходный код приложения.
    - [`App.css`](frontend-react/src/App.css), [`App.jsx`](frontend-react/src/App.jsx): Основные компоненты приложения.
    - [`index.css`](frontend-react/src/index.css), [`main.jsx`](frontend-react/src/main.jsx): Точка входа приложения.
    - [`assets/`](frontend-react/src/assets/): Статические ресурсы (изображения).
    - [`components/`](frontend-react/src/components/): Переиспользуемые компоненты UI ([`AutoRefreshToggle.jsx`](frontend-react/src/components/AutoRefreshToggle.jsx), [`BoardNavigation.css`](frontend-react/src/components/BoardNavigation.css), [`BoardNavigation.jsx`](frontend-react/src/components/BoardNavigation.jsx), [`Card.css`](frontend-react/src/components/Card.css), [`Card.jsx`](frontend-react/src/components/Card.jsx), [`Column.css`](frontend-react/src/components/Column.css), [`Column.jsx`](frontend-react/src/components/Column.jsx), [`MilestoneItem.jsx`](frontend-react/src/components/MilestoneItem.jsx), [`Modal.css`](frontend-react/src/components/Modal.css), [`Modal.jsx`](frontend-react/src/components/Modal.jsx), [`Notification.css`](frontend-react/src/components/Notification.css), [`Notification.jsx`](frontend-react/src/components/Notification.jsx), [`ObjectiveItem.jsx`](frontend-react/src/components/ObjectiveItem.jsx), [`ProgressBar.jsx`](frontend-react/src/components/ProgressBar.jsx), [`StyledButton.js`](frontend-react/src/components/StyledButton.js)).
    - [`contexts/`](frontend-react/src/contexts/): Контексты React ([`NotificationContext.jsx`](frontend-react/src/contexts/NotificationContext.jsx)).
    - [`pages/`](frontend-react/src/pages/): Страницы приложения ([`BoardPage.css`](frontend-react/src/pages/BoardPage.css), [`BoardPage.jsx`](frontend-react/src/pages/BoardPage.jsx), [`ProjectListPage.css`](frontend-react/src/pages/ProjectListPage.css), [`ProjectListPage.jsx`](frontend-react/src/pages/ProjectListPage.jsx), [`RoadmapPage.jsx`](frontend-react/src/pages/RoadmapPage.jsx)).
    - [`services/`](frontend-react/src/services/): Сервисы для взаимодействия с API ([`api.js`](frontend-react/src/services/api.js)).
    - [`styles/`](frontend-react/src/styles/): Файлы стилей ([`buttons.css`](frontend-react/src/styles/buttons.css), [`GlobalStyles.js`](frontend-react/src/styles/GlobalStyles.js), [`theme.js`](frontend-react/src/styles/theme.js)).

## Структура файлов

```
.
├── docker-compose.yml
├── package-lock.json
├── package.json
├── backend/
│   ├── API_ENDPOINTS.md
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── api/
│   │   ├── __init__.py
│   │   ├── agents.py
│   │   ├── boards.py
│   │   ├── cards.py
│   │   ├── columns.py
│   │   ├── milestones.py
│   │   ├── objectives.py
│   │   └── projects.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── agent.py
│   │   ├── board.py
│   │   ├── card.py
│   │   ├── column.py
│   │   ├── history.py
│   │   ├── milestone.py
│   │   ├── objective.py
│   │   └── project.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── board_service.py
│   │   ├── card_service.py
│   │   ├── column_service.py
│   │   ├── milestone_service.py
│   │   ├── objective_service.py
│   │   └── project_service.py
│   └── utils/
│       └── __init__.py
├── e2e_tests/
│   ├── api_tests.py
│   ├── refactoring_plan.md
│   ├── task_automation.py
│   └── api_client/
│       ├── __init__.py
│       ├── base_client.py
│       ├── board_api.py
│       ├── card_api.py
│       ├── column_api.py
│       └── project_api.py
├── frontend-react/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       │   └── react.svg
│       ├── components/
│       │   ├── AutoRefreshToggle.jsx
│       │   ├── BoardNavigation.css
│       │   ├── BoardNavigation.jsx
│       │   ├── Card.css
│       │   ├── Card.jsx
│       │   ├── Column.css
│       │   ├── Column.jsx
│       │   ├── MilestoneItem.jsx
│       │   ├── Modal.css
│       │   ├── Modal.jsx
│       │   ├── Notification.css
│       │   ├── Notification.jsx
│       │   ├── ObjectiveItem.jsx
│       │   ├── ProgressBar.jsx
│       │   └── StyledButton.js
│       ├── contexts/
│       │   └── NotificationContext.jsx
│       ├── pages/
│       │   ├── BoardPage.css
│       │   ├── BoardPage.jsx
│       │   ├── ProjectListPage.css
│       │   ├── ProjectListPage.jsx
│       │   └── RoadmapPage.jsx
│       ├── services/
│       │   └── api.js
│       └── styles/
│           ├── buttons.css
│           ├── GlobalStyles.js
│           └── theme.js
└── PROJECT_DESCRIPTION.md