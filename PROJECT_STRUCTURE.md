# Подробное описание структуры проекта AI Task Tracker

## Введение

Данный проект представляет собой веб-приложение для отслеживания задач, разработанное с акцентом на простоту использования и визуализацию прогресса. Оно позволяет пользователям эффективно управлять проектами, досками, колонками и карточками. Приложение имеет клиент-серверную архитектуру, состоящую из бэкенда на Python (Flask), фронтенда на React и базы данных PostgreSQL, оркестрированных с помощью Docker Compose.

## Бэкенд (`backend/`)

Бэкенд предоставляет RESTful API для управления всеми сущностями проекта (проектами, досками, колонками, карточками и историей изменений). Он написан на Python с использованием фреймворка Flask и взаимодействует с базой данных PostgreSQL через SQLAlchemy.

*   [`app.py`](backend/app.py): Основной файл Flask-приложения. Отвечает за инициализацию приложения, настройку CORS (Cross-Origin Resource Sharing) для взаимодействия с фронтендом, инициализацию подключения к базе данных SQLAlchemy, регистрацию всех блюпринтов API и обслуживание статических файлов фронтенда.
*   [`config.py`](backend/config.py): Содержит конфигурационные настройки приложения, такие как параметры подключения к базе данных (DATABASE_URL), секретный ключ и другие переменные окружения.
*   [`database.py`](backend/database.py): Модуль, отвечающий за настройку и управление подключением к базе данных. Здесь определяется объект `db` (SQLAlchemy) и функция `init_db` для создания таблиц в базе данных при первом запуске.
*   [`Dockerfile`](backend/Dockerfile): Инструкции для Docker по сборке образа Flask-бэкенда. Определяет базовый образ, копирует зависимости и код, устанавливает необходимые пакеты и определяет команду для запуска приложения.
*   [`requirements.txt`](backend/requirements.txt): Список всех Python-зависимостей, необходимых для работы бэкенда (Flask, Gunicorn, Flask-SQLAlchemy, Flask-Cors, psycopg2-binary, sqlalchemy-utils).
*   [`API_ENDPOINTS.md`](backend/API_ENDPOINTS.md): Документация, описывающая все доступные API-эндпоинты бэкенда, их методы, параметры запросов и форматы ответов.
*   [`api/`](backend/api/): Директория, содержащая модули с определениями API-эндпоинтов (блюпринтов) для различных сущностей проекта: `agents.py` (для управления агентами), `boards.py`, `cards.py`, `columns.py`, `milestones.py` (для управления вехами), `objectives.py` (для управления целями) и `projects.py`. Каждый файл определяет маршруты и логику обработки запросов для соответствующей сущности.
*   [`models/`](backend/models/): Директория, содержащая определения моделей данных SQLAlchemy. Каждая модель (например, `agent.py`, `board.py`, `card.py`, `column.py`, `history.py`, `milestone.py`, `objective.py`, `project.py`) соответствует таблице в базе данных и определяет структуру данных и их взаимосвязи.
*   [`services/`](backend/services/): Директория, содержащая модули с бизнес-логикой приложения. Эти сервисы инкапсулируют операции по работе с данными, взаимодействуя с моделями и предоставляя более высокоуровневые функции для API-эндпоинтов. Включает сервисы для управления досками, карточками, колонками, вехами, целями и проектами.
*   [`utils/`](backend/utils/): Директория для вспомогательных утилит и функций, которые могут быть использованы в различных частях бэкенда.

## Фронтенд (`frontend-react/`)

Фронтенд представляет собой одностраничное приложение (SPA), разработанное на React. Он взаимодействует с бэкендом через API для получения и отправки данных, а также предоставляет интуитивно понятный пользовательский интерфейс для управления задачами.

*   [`.gitignore`](frontend-react/.gitignore): Файл, указывающий Git, какие файлы и директории (например, `node_modules`, `dist`) следует игнорировать при отслеживании изменений в репозитории.
*   [`Dockerfile`](frontend-react/Dockerfile): Инструкции для Docker по сборке образа React-фронтенда. Он настраивает среду для сборки приложения и использует Nginx для обслуживания статических файлов.
*   [`eslint.config.js`](frontend-react/eslint.config.js): Конфигурация ESLint для проверки качества кода JavaScript/React, обеспечения единообразия стиля и выявления потенциальных ошибок.
*   [`index.html`](frontend-react/index.html): Основной HTML-файл, который служит точкой входа для React-приложения. В него встраивается скомпилированный JavaScript-код.
*   [`nginx.conf`](frontend-react/nginx.conf): Конфигурация веб-сервера Nginx, используемого в Docker-контейнере фронтенда для обслуживания статических файлов React-приложения и проксирования API-запросов к бэкенду.
*   [`package-lock.json`](frontend-react/package-lock.json): Автоматически генерируемый файл, который фиксирует точные версии всех зависимостей Node.js, используемых в проекте, обеспечивая воспроизводимость сборок.
*   [`package.json`](frontend-react/package.json): Определяет метаданные проекта, список зависимостей Node.js (как для продакшена, так и для разработки) и скрипты для запуска, сборки и тестирования приложения.
*   [`README.md`](frontend-react/README.md): Исходный README-файл, сгенерированный Vite/React, содержащий базовую информацию о шаблоне.
*   [`vite.config.js`](frontend-react/vite.config.js): Конфигурация сборщика Vite, используемого для быстрой разработки и оптимизированной сборки React-приложения.
*   [`public/`](frontend-react/public/): Директория для статических ресурсов (например, `vite.svg`), которые будут доступны напрямую в корневом каталоге веб-сервера без обработки Vite.
*   [`src/`](frontend-react/src/): Основная директория с исходным кодом React-приложения.
    *   [`App.css`](frontend-react/src/App.css), [`App.jsx`](frontend-react/src/App.jsx): Корневые компоненты приложения. `App.jsx` отвечает за общую структуру, маршрутизацию с помощью `react-router-dom` и интеграцию глобальных провайдеров (например, `NotificationProvider`, `ThemeProvider`). `App.css` содержит общие стили для корневого компонента.
    *   [`index.css`](frontend-react/src/index.css), [`main.jsx`](frontend-react/src/main.jsx): Точка входа React-приложения. `main.jsx` рендерит корневой компонент `App` в DOM и настраивает глобальные провайдеры, такие как `NotificationProvider` и `ThemeProvider` (для `styled-components`). `index.css` содержит глобальные стили для всего приложения.
    *   [`assets/`](frontend-react/src/assets/): Директория для изображений и других статических файлов, используемых в приложении (например, `react.svg`).
    *   [`components/`](frontend-react/src/components/): Директория для переиспользуемых UI-компонентов, таких как `BoardNavigation` (для навигации по доскам), `Card` (для отображения карточек задач), `Column` (для отображения колонок на доске), `Modal` (для всплывающих окон), `Notification` (для отображения уведомлений) и `StyledButton` (для стилизованных кнопок). Также содержит соответствующие CSS-файлы для этих компонентов.
    *   [`contexts/`](frontend-react/src/contexts/): Директория для React-контекстов, таких как `NotificationContext.jsx`, который предоставляет глобальный доступ к функциям уведомлений по всему приложению.
    *   [`pages/`](frontend-react/src/pages/): Директория для компонентов, представляющих целые страницы приложения. Например, `BoardPage.jsx` отображает конкретную доску с колонками и карточками, а `ProjectListPage.jsx` отображает список всех проектов. Также содержит соответствующие CSS-файлы для этих страниц.
    *   [`services/`](frontend-react/src/services/): Директория для сервисов, отвечающих за взаимодействие с бэкенд API. `api.js` содержит функции для выполнения HTTP-запросов к API бэкенда.
    *   [`styles/`](frontend-react/src/styles/): Директория для глобальных стилей и определений темы. `GlobalStyles.js` содержит глобальные стили, применяемые ко всему приложению, а `theme.js` определяет цветовую палитру, типографику и другие стили для `styled-components`. `buttons.css` содержит стили для кнопок.

## Docker Compose (`docker-compose.yml`)
 
 Файл `docker-compose.yml` используется для определения и запуска многоконтейнерных Docker-приложений. В данном проекте он оркестрирует три основных сервиса: бэкенд, фронтенд и базу данных.
 
 *   **`backend`**: Сервис для Flask-бэкенда.
     *   `build`: Указывает Docker на сборку образа из директории `./backend` с использованием `Dockerfile`.
     *   `ports`: Маппинг порта `5000` контейнера на порт `5000` хост-машины.
     *   `environment`: Определяет переменные окружения, такие как `DATABASE_URL`, для подключения к базе данных.
     *   `depends_on`: Указывает, что этот сервис зависит от сервиса `db`, гарантируя, что база данных будет запущена до бэкенда.
     *   `restart: unless-stopped`: Автоматически перезапускает контейнер, если он останавливается, если только он не был остановлен вручную.
 *   **`frontend`**: Сервис для React-фронтенда, обслуживаемый Nginx.
     *   `build`: Указывает Docker на сборку образа из директории `./frontend-react` с использованием `Dockerfile`.
     *   `ports`: Маппинг порта `80` контейнера на порт `80` хост-машины.
     *   `volumes`: Монтирует файл `nginx.conf` с хост-машины в контейнер, чтобы Nginx использовал пользовательскую конфигурацию.
     *   `depends_on`: Указывает, что этот сервис зависит от сервиса `backend`, гарантируя, что бэкенд будет запущен до фронтенда.
 *   **`db`**: Сервис для базы данных PostgreSQL.
     *   `image: postgres:15-alpine`: Использует официальный образ PostgreSQL версии 15.
     *   `environment`: Определяет переменные окружения для настройки базы данных (имя базы данных, пользователь, пароль).
     *   `volumes`: Создает именованный том `postgres_data` для постоянного хранения данных базы данных, чтобы они не терялись при перезапуске контейнера.
     *   `ports`: Маппинг порта `5432` контейнера на порт `5432` хост-машины.
     *   `restart: unless-stopped`: Автоматически перезапускает контейнер, если он останавливается.
     *   `healthcheck`: Определяет проверку работоспособности базы данных, чтобы убедиться, что она готова принимать соединения.
 
 ## Сквозные тесты (`e2e_tests/`)
 
 Директория `e2e_tests/` содержит набор сквозных тестов (End-to-End tests) для проверки полной функциональности приложения, имитируя взаимодействие пользователя с системой. Эти тесты обеспечивают уверенность в том, что все компоненты приложения (фронтенд, бэкенд, база данных) работают корректно вместе.
 
 *   [`api_tests.py`](e2e_tests/api_tests.py): Модуль, содержащий тесты для проверки API бэкенда. Использует `api_client/` для взаимодействия с API.
 *   [`refactoring_plan.md`](e2e_tests/refactoring_plan.md): Документ, описывающий план рефакторинга для сквозных тестов.
 *   [`task_automation.py`](e2e_tests/task_automation.py): Скрипты для автоматизации различных задач, связанных с тестированием или развертыванием.
 *   [`api_client/`](e2e_tests/api_client/): Директория, содержащая клиентские модули для взаимодействия с API бэкенда.
     *   [`base_client.py`](e2e_tests/api_client/base_client.py): Базовый класс для API-клиентов.
     *   [`board_api.py`](e2e_tests/api_client/board_api.py): Клиент для API досок.
     *   [`card_api.py`](e2e_tests/api_client/card_api.py): Клиент для API карточек.
     *   [`column_api.py`](e2e_tests/api_client/column_api.py): Клиент для API колонок.
     *   [`project_api.py`](e2e_tests/api_client/project_api.py): Клиент для API проектов.
 
 ## Диаграмма структуры файлов
 
 ```mermaid
 graph TD
     A[Taskus3 Project Root] --> B[backend/]
     A --> C[frontend-react/]
     A --> D[docker-compose.yml]
     A --> E[package.json]
     A --> F[package-lock.json]
     A --> G[README.md]
     A --> H[PROJECT_STRUCTURE.md]
     A --> I[.gitignore]
     A --> J[e2e_tests/]
 
     B --> B1[app.py]
     B --> B2[config.py]
     B --> B3[database.py]
     B --> B4[Dockerfile]
     B --> B5[requirements.txt]
     B --> B6[API_ENDPOINTS.md]
     B --> B7[api/]
     B --> B8[models/]
     B --> B9[services/]
     B --> B10[utils/]
 
     B7 --> B7_1[__init__.py]
     B7 --> B7_2[agents.py]
     B7 --> B7_3[boards.py]
     B7 --> B7_4[cards.py]
     B7 --> B7_5[columns.py]
     B7 --> B7_6[milestones.py]
     B7 --> B7_7[objectives.py]
     B7 --> B7_8[projects.py]
 
     B8 --> B8_1[__init__.py]
     B8 --> B8_2[agent.py]
     B8 --> B8_3[board.py]
     B8 --> B8_4[card.py]
     B8 --> B8_5[column.py]
     B8 --> B8_6[history.py]
     B8 --> B8_7[milestone.py]
     B8 --> B8_8[objective.py]
     B8 --> B8_9[project.py]
 
     B9 --> B9_1[__init__.py]
     B9 --> B9_2[board_service.py]
     B9 --> B9_3[card_service.py]
     B9 --> B9_4[column_service.py]
     B9 --> B9_5[milestone_service.py]
     B9 --> B9_6[objective_service.py]
     B9 --> B9_7[project_service.py]
 
     B10 --> B10_1[__init__.py]
 
     C --> C1[.gitignore]
     C --> C2[Dockerfile]
     C --> C3[eslint.config.js]
     C --> C4[index.html]
     C --> C5[nginx.conf]
     C --> C6[package-lock.json]
     C --> C7[package.json]
     C --> C8[README.md]
     C --> C9[vite.config.js]
     C --> C10[public/]
     C --> C11[src/]
 
     C10 --> C10_1[vite.svg]
 
     C11 --> C11_1[App.css]
     C11 --> C11_2[App.jsx]
     C11 --> C11_3[index.css]
     C11 --> C11_4[main.jsx]
     C11 --> C11_5[assets/]
     C11 --> C11_6[components/]
     C11 --> C11_7[contexts/]
     C11 --> C11_8[pages/]
     C11 --> C11_9[services/]
     C11 --> C11_10[styles/]
 
     C11_5 --> C11_5_1[react.svg]
 
     C11_6 --> C11_6_1[AutoRefreshToggle.jsx]
     C11_6 --> C11_6_2[BoardNavigation.jsx]
     C11_6 --> C11_6_3[Card.jsx]
     C11_6 --> C11_6_4[Column.jsx]
     C11_6 --> C11_6_5[MilestoneItem.jsx]
     C11_6 --> C11_6_6[Modal.jsx]
     C11_6 --> C11_6_7[Notification.jsx]
     C11_6 --> C11_6_8[ObjectiveItem.jsx]
     C11_6 --> C11_6_9[ProgressBar.jsx]
     C11_6 --> C11_6_10[StyledButton.js]
     C11_6 --> C11_6_11[BoardNavigation.css]
     C11_6 --> C11_6_12[Card.css]
     C11_6 --> C11_6_13[Column.css]
     C11_6 --> C11_6_14[Modal.css]
     C11_6 --> C11_6_15[Notification.css]
 
     C11_7 --> C11_7_1[NotificationContext.jsx]
 
     C11_8 --> C11_8_1[BoardPage.jsx]
     C11_8 --> C11_8_2[ProjectListPage.jsx]
     C11_8 --> C11_8_3[RoadmapPage.jsx]
     C11_8 --> C11_8_4[BoardPage.css]
     C11_8 --> C11_8_5[ProjectListPage.css]
     C11_8 --> C11_8_6[RoadmapPage.css]
 
     C11_9 --> C11_9_1[api.js]
 
     C11_10 --> C11_10_1[GlobalStyles.js]
     C11_10 --> C11_10_2[theme.js]
     C11_10 --> C11_10_3[buttons.css]
 
     J --> J1[api_tests.py]
     J --> J2[refactoring_plan.md]
     J --> J3[task_automation.py]
     J --> J4[api_client/]
 
     J4 --> J4_1[__init__.py]
     J4 --> J4_2[base_client.py]
     J4 --> J4_3[board_api.py]
     J4 --> J4_4[card_api.py]
     J4 --> J4_5[column_api.py]
     J4 --> J4_6[project_api.py]