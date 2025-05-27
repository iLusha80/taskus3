# Описание проекта

Данный проект представляет собой веб-приложение для управления задачами, организованное по принципу досок (boards) с колонками (columns) и карточками (cards). Проект состоит из двух основных частей: бэкенда на Python (Flask) и фронтенда на React.

## Бэкенд (`backend/`)

Бэкенд предоставляет API для управления проектами, досками, колонками и карточками. Используется база данных для хранения информации.

- [`app.py`](backend/app.py): Основной файл приложения Flask.
- [`config.py`](backend/config.py): Конфигурация приложения.
- [`database.py`](backend/database.py): Настройка и взаимодействие с базой данных.
- [`Dockerfile`](backend/Dockerfile): Определение Docker-образа для бэкенда.
- [`requirements.txt`](backend/requirements.txt): Список зависимостей Python.
- [`api/`](backend/api/): Модули API для различных сущностей (доски, карточки, колонки, проекты).
- [`models/`](backend/models/): Определение моделей данных (Board, Card, Column, History, Project).
- [`services/`](backend/services/): Бизнес-логика и взаимодействие с моделями данных.
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
    - [`components/`](frontend-react/src/components/): Переиспользуемые компоненты UI ([`BoardNavigation.css`](frontend-react/src/components/BoardNavigation.css), [`BoardNavigation.jsx`](frontend-react/src/components/BoardNavigation.jsx), [`Card.css`](frontend-react/src/components/Card.css), [`Card.jsx`](frontend-react/src/components/Card.jsx), [`Column.css`](frontend-react/src/components/Column.css), [`Column.jsx`](frontend-react/src/components/Column.jsx), [`Modal.css`](frontend-react/src/components/Modal.css), [`Modal.jsx`](frontend-react/src/components/Modal.jsx), [`Notification.css`](frontend-react/src/components/Notification.css), [`Notification.jsx`](frontend-react/src/components/Notification.jsx)).
    - [`contexts/`](frontend-react/src/contexts/): Контексты React ([`NotificationContext.jsx`](frontend-react/src/contexts/NotificationContext.jsx)).
    - [`pages/`](frontend-react/src/pages/): Страницы приложения ([`BoardPage.css`](frontend-react/src/pages/BoardPage.css), [`BoardPage.jsx`](frontend-react/src/pages/BoardPage.jsx), [`ProjectListPage.css`](frontend-react/src/pages/ProjectListPage.css), [`ProjectListPage.jsx`](frontend-react/src/pages/ProjectListPage.jsx)).
    - [`services/`](frontend-react/src/services/): Сервисы для взаимодействия с API ([`api.js`](frontend-react/src/services/api.js)).
    - [`styles/`](frontend-react/src/styles/): Файлы стилей ([`buttons.css`](frontend-react/src/styles/buttons.css)).

## Структура файлов

```
.
├── .roomodes
├── docker-compose.yml
├── package-lock.json
├── package.json
├── PLAN.md
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── database.py
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── api/
│   │   ├── __init__.py
│   │   ├── boards.py
│   │   ├── cards.py
│   │   ├── columns.py
│   │   └── projects.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── board.py
│   │   ├── card.py
│   │   ├── column.py
│   │   ├── history.py
│   │   └── project.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── board_service.py
│   │   ├── card_service.py
│   │   ├── column_service.py
│   │   └── project_service.py
│   └── utils/
│       └── __init__.py
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
│       │   ├── BoardNavigation.css
│       │   ├── BoardNavigation.jsx
│       │   ├── Card.css
│       │   ├── Card.jsx
│       │   ├── Column.css
│       │   ├── Column.jsx
│       │   ├── Modal.css
│       │   ├── Modal.jsx
│       │   ├── Notification.css
│       │   └── Notification.jsx
│       ├── contexts/
│       │   └── NotificationContext.jsx
│       ├── pages/
│       │   ├── BoardPage.css
│       │   ├── BoardPage.jsx
│       │   ├── ProjectListPage.css
│       │   └── ProjectListPage.jsx
│       ├── services/
│       │   └── api.js
│       └── styles/
│           └── buttons.css
└── PROJECT_DESCRIPTION.md