# API-эндпоинты Taskus3 для AI-агентов

Этот документ описывает основные API-эндпоинты системы Taskus3, предназначенные для взаимодействия AI-агентов с сущностями `card`, `milestone` и `objective`.

## Общие положения

*   **Базовый URL:** Предполагается, что все эндпоинты доступны по базовому URL, например, `http://localhost:5000/api/v1`.
*   **Формат данных:** Все запросы и ответы используют формат JSON.
*   **Аутентификация и Авторизация:** Для всех эндпоинтов требуется аутентификация. Предполагается использование токена API или другого механизма, предоставляющего необходимые права доступа. В примерах запросов будет использоваться заголовок `Authorization: Bearer YOUR_API_TOKEN`.
*   **Обработка ошибок:**
    *   `400 Bad Request`: Неверные параметры запроса или структура тела.
    *   `401 Unauthorized`: Отсутствует или недействительный токен аутентификации.
    *   `403 Forbidden`: Недостаточно прав для выполнения операции.
    *   `404 Not Found`: Ресурс не найден.
    *   `500 Internal Server Error`: Внутренняя ошибка сервера.

---

## 1. Сущность `Card` (Карточка задачи)

Модель `Card` (`backend/models/card.py`) представляет собой отдельную задачу или элемент работы.

### 1.1. Получение всех карточек

*   **HTTP-метод:** `GET`
*   **Эндпоинт:** `/cards`
*   **Назначение:** Получить список всех доступных карточек в системе.
*   **Параметры запроса:**
    *   `column_id` (опционально, int): Фильтровать карточки по ID колонки.
    *   `milestone_id` (опционально, int): Фильтровать карточки по ID вехи.
    *   `assigned_agent_id` (опционально, int): Фильтровать карточки по ID назначенного агента.
    *   `status` (опционально, string): Фильтровать карточки по статусу (например, 'todo', 'in_progress', 'done').
*   **Пример запроса:**
    ```http
    GET /api/v1/cards?column_id=1&status=in_progress
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    [
        {
            "id": 1,
            "column_id": 1,
            "milestone_id": null,
            "title": "Реализовать аутентификацию пользователя",
            "description": "Необходимо добавить систему аутентификации с использованием JWT.",
            "priority": "high",
            "assigned_agent_id": 101,
            "assigned_agent_name": "Agent Alpha",
            "assigned_agent_color": "#FF5733",
            "task_type": "feature",
            "start_date": "2024-06-01",
            "due_date": "2024-06-15",
            "position": 1,
            "created_at": "2024-05-28 10:00:00",
            "updated_at": "2024-06-05 14:30:00",
            "metadata": "{}"
        },
        {
            "id": 2,
            "column_id": 1,
            "milestone_id": null,
            "title": "Исправить баг с отображением профиля",
            "description": "При открытии профиля пользователя данные отображаются некорректно.",
            "priority": "medium",
            "assigned_agent_id": 102,
            "assigned_agent_name": "Agent Beta",
            "assigned_agent_color": "#33FF57",
            "task_type": "bug",
            "start_date": "2024-06-03",
            "due_date": "2024-06-07",
            "position": 2,
            "created_at": "2024-06-01 09:00:00",
            "updated_at": "2024-06-03 11:00:00",
            "metadata": "{}"
        }
    ]
    ```

### 1.2. Получение карточки по ID

*   **HTTP-метод:** `GET`
*   **Эндпоинт:** `/cards/{card_id}`
*   **Назначение:** Получить детальную информацию о конкретной карточке.
*   **Параметры пути:**
    *   `card_id` (int, обязательный): Уникальный идентификатор карточки.
*   **Пример запроса:**
    ```http
    GET /api/v1/cards/1
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    {
        "id": 1,
        "column_id": 1,
        "milestone_id": null,
        "title": "Реализовать аутентификацию пользователя",
        "description": "Необходимо добавить систему аутентификации с использованием JWT.",
        "priority": "high",
        "assigned_agent_id": 101,
        "assigned_agent_name": "Agent Alpha",
        "assigned_agent_color": "#FF5733",
        "task_type": "feature",
        "start_date": "2024-06-01",
        "due_date": "2024-06-15",
        "position": 1,
        "created_at": "2024-05-28 10:00:00",
        "updated_at": "2024-06-05 14:30:00",
        "metadata": "{}"
    }
    ```
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Card not found"
    }
    ```

### 1.3. Создание новой карточки

*   **HTTP-метод:** `POST`
*   **Эндпоинт:** `/cards`
*   **Назначение:** Создать новую карточку задачи.
*   **Структура тела запроса (JSON):**
    ```json
    {
        "column_id": 1,             // int, обязательный
        "milestone_id": null,       // int, опционально
        "title": "Название карточки", // string, обязательный
        "description": "Описание задачи", // string, опционально
        "priority": "medium",       // string, опционально (low, medium, high)
        "assigned_agent_id": 101,   // int, опционально
        "task_type": "feature",     // string, опционально (bug, feature, task, etc.)
        "start_date": "2024-06-10", // string (YYYY-MM-DD), опционально
        "due_date": "2024-06-20",   // string (YYYY-MM-DD), опционально
        "position": 1,              // int, обязательный
        "metadata": "{}"            // string (JSON-строка), опционально
    }
    ```
*   **Пример запроса:**
    ```http
    POST /api/v1/cards
    Authorization: Bearer YOUR_API_TOKEN
    Content-Type: application/json

    {
        "column_id": 1,
        "title": "Разработать модуль логирования",
        "description": "Реализовать централизованную систему логирования для бэкенда.",
        "priority": "high",
        "assigned_agent_id": 103,
        "task_type": "feature",
        "due_date": "2024-07-01",
        "position": 3
    }
    ```
*   **Пример успешного ответа (201 Created):**
    ```json
    {
        "id": 3,
        "column_id": 1,
        "milestone_id": null,
        "title": "Разработать модуль логирования",
        "description": "Реализовать централизованную систему логирования для бэкенда.",
        "priority": "high",
        "assigned_agent_id": 103,
        "assigned_agent_name": "Agent Gamma",
        "assigned_agent_color": "#5733FF",
        "task_type": "feature",
        "start_date": "2024-06-27",
        "due_date": "2024-07-01",
        "position": 3,
        "created_at": "2024-06-27 12:00:00",
        "updated_at": "2024-06-27 12:00:00",
        "metadata": "{}"
    }
    ```
*   **Пример ответа с ошибкой (400 Bad Request):**
    ```json
    {
        "message": "Missing required fields: title, column_id, position"
    }
    ```

### 1.4. Обновление существующей карточки

*   **HTTP-метод:** `PUT`
*   **Эндпоинт:** `/cards/{card_id}`
*   **Назначение:** Обновить информацию о существующей карточке.
*   **Параметры пути:**
    *   `card_id` (int, обязательный): Уникальный идентификатор карточки.
*   **Структура тела запроса (JSON):**
    *   Все поля опциональны, но хотя бы одно должно быть предоставлено.
    ```json
    {
        "column_id": 2,             // int
        "milestone_id": 1,          // int
        "title": "Обновленное название", // string
        "description": "Обновленное описание", // string
        "priority": "low",          // string
        "assigned_agent_id": 102,   // int
        "task_type": "refactor",    // string
        "start_date": "2024-06-11", // string (YYYY-MM-DD)
        "due_date": "2024-06-25",   // string (YYYY-MM-DD)
        "position": 1,              // int
        "metadata": "{\"status\": \"completed\"}" // string (JSON-строка)
    }
    ```
*   **Пример запроса:**
    ```http
    PUT /api/v1/cards/1
    Authorization: Bearer YOUR_API_TOKEN
    Content-Type: application/json

    {
        "priority": "medium",
        "description": "Обновленное описание: необходимо также добавить тесты."
    }
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    {
        "id": 1,
        "column_id": 1,
        "milestone_id": null,
        "title": "Реализовать аутентификацию пользователя",
        "description": "Обновленное описание: необходимо также добавить тесты.",
        "priority": "medium",
        "assigned_agent_id": 101,
        "assigned_agent_name": "Agent Alpha",
        "assigned_agent_color": "#FF5733",
        "task_type": "feature",
        "start_date": "2024-06-01",
        "due_date": "2024-06-15",
        "position": 1,
        "created_at": "2024-05-28 10:00:00",
        "updated_at": "2024-06-27 12:05:00",
        "metadata": "{}"
    }
    ```
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Card not found"
    }
    ```

### 1.5. Удаление карточки

*   **HTTP-метод:** `DELETE`
*   **Эндпоинт:** `/cards/{card_id}`
*   **Назначение:** Удалить карточку из системы.
*   **Параметры пути:**
    *   `card_id` (int, обязательный): Уникальный идентификатор карточки.
*   **Пример запроса:**
    ```http
    DELETE /api/v1/cards/1
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (204 No Content):**
    *   Пустое тело ответа.
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Card not found"
    }
    ```

---

## 2. Сущность `Milestone` (Веха)

Модель `Milestone` (`backend/models/milestone.py`) представляет собой значимый этап в рамках цели.

### 2.1. Получение всех вех

*   **HTTP-метод:** `GET`
*   **Эндпоинт:** `/milestones`
*   **Назначение:** Получить список всех доступных вех.
*   **Параметры запроса:**
    *   `objective_id` (опционально, int): Фильтровать вехи по ID цели.
    *   `status` (опционально, string): Фильтровать вехи по статусу ('not_started', 'in_progress', 'completed', 'blocked').
*   **Пример запроса:**
    ```http
    GET /api/v1/milestones?objective_id=1&status=in_progress
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    [
        {
            "id": 1,
            "objective_id": 1,
            "name": "Завершение MVP бэкенда",
            "description": "Все основные API-эндпоинты для бэкенда должны быть реализованы и протестированы.",
            "status": "in_progress",
            "due_date": "2024-07-31",
            "created_at": "2024-06-01 09:00:00",
            "updated_at": "2024-06-20 15:00:00"
        },
        {
            "id": 2,
            "objective_id": 1,
            "name": "Развертывание на тестовом сервере",
            "description": "Приложение должно быть развернуто на тестовом сервере для QA.",
            "status": "not_started",
            "due_date": "2024-08-15",
            "created_at": "2024-06-01 09:00:00",
            "updated_at": "2024-06-01 09:00:00"
        }
    ]
    ```

### 2.2. Получение вехи по ID

*   **HTTP-метод:** `GET`
*   **Эндпоинт:** `/milestones/{milestone_id}`
*   **Назначение:** Получить детальную информацию о конкретной вехе.
*   **Параметры пути:**
    *   `milestone_id` (int, обязательный): Уникальный идентификатор вехи.
*   **Пример запроса:**
    ```http
    GET /api/v1/milestones/1
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    {
        "id": 1,
        "objective_id": 1,
        "name": "Завершение MVP бэкенда",
        "description": "Все основные API-эндпоинты для бэкенда должны быть реализованы и протестированы.",
        "status": "in_progress",
        "due_date": "2024-07-31",
        "created_at": "2024-06-01 09:00:00",
        "updated_at": "2024-06-20 15:00:00"
    }
    ```
*   **Пример ответа с ошибкой (404 Not Found):
    ```json
    {
        "message": "Milestone not found"
    }
    ```

### 2.3. Создание новой вехи

*   **HTTP-метод:** `POST`
*   **Эндпоинт:** `/milestones`
*   **Назначение:** Создать новую веху в рамках цели.
*   **Структура тела запроса (JSON):**
    ```json
    {
        "objective_id": 1,          // int, обязательный
        "name": "Название вехи",    // string, обязательный
        "description": "Описание вехи", // string, опционально
        "status": "not_started",    // string, опционально (not_started, in_progress, completed, blocked)
        "due_date": "2024-09-30"    // string (YYYY-MM-DD), опционально
    }
    ```
*   **Пример запроса:**
    ```http
    POST /api/v1/milestones
    Authorization: Bearer YOUR_API_TOKEN
    Content-Type: application/json

    {
        "objective_id": 1,
        "name": "Интеграция с внешним API",
        "description": "Завершить интеграцию с платежной системой.",
        "due_date": "2024-08-31"
    }
    ```
*   **Пример успешного ответа (201 Created):**
    ```json
    {
        "id": 3,
        "objective_id": 1,
        "name": "Интеграция с внешним API",
        "description": "Завершить интеграцию с платежной системой.",
        "status": "not_started",
        "due_date": "2024-08-31",
        "created_at": "2024-06-27 12:10:00",
        "updated_at": "2024-06-27 12:10:00"
    }
    ```
*   **Пример ответа с ошибкой (400 Bad Request):**
    ```json
    {
        "message": "Missing required fields: objective_id, name"
    }
    ```

### 2.4. Обновление существующей вехи

*   **HTTP-метод:** `PUT`
*   **Эндпоинт:** `/milestones/{milestone_id}`
*   **Назначение:** Обновить информацию о существующей вехе.
*   **Параметры пути:**
    *   `milestone_id` (int, обязательный): Уникальный идентификатор вехи.
*   **Структура тела запроса (JSON):**
    *   Все поля опциональны, но хотя бы одно должно быть предоставлено.
    ```json
    {
        "name": "Обновленное название вехи", // string
        "description": "Обновленное описание", // string
        "status": "completed",      // string
        "due_date": "2024-09-15"    // string (YYYY-MM-DD)
    }
    ```
*   **Пример запроса:**
    ```http
    PUT /api/v1/milestones/1
    Authorization: Bearer YOUR_API_TOKEN
    Content-Type: application/json

    {
        "status": "completed",
        "description": "Все основные API-эндпоинты для бэкенда реализованы и протестированы."
    }
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    {
        "id": 1,
        "objective_id": 1,
        "name": "Завершение MVP бэкенда",
        "description": "Все основные API-эндпоинты для бэкенда реализованы и протестированы.",
        "status": "completed",
        "due_date": "2024-07-31",
        "created_at": "2024-06-01 09:00:00",
        "updated_at": "2024-06-27 12:15:00"
    }
    ```
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Milestone not found"
    }
    ```

### 2.5. Удаление вехи

*   **HTTP-метод:** `DELETE`
*   **Эндпоинт:** `/milestones/{milestone_id}`
*   **Назначение:** Удалить веху из системы.
*   **Параметры пути:**
    *   `milestone_id` (int, обязательный): Уникальный идентификатор вехи.
*   **Пример запроса:**
    ```http
    DELETE /api/v1/milestones/1
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (204 No Content):**
    *   Пустое тело ответа.
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Milestone not found"
    }
    ```

---

## 3. Сущность `Objective` (Цель)

Модель `Objective` (`backend/models/objective.py`) представляет собой высокоуровневую цель проекта.

### 3.1. Получение всех целей

*   **HTTP-метод:** `GET`
*   **Эндпоинт:** `/objectives`
*   **Назначение:** Получить список всех доступных целей.
*   **Параметры запроса:**
    *   `project_id` (опционально, int): Фильтровать цели по ID проекта.
    *   `status` (опционально, string): Фильтровать цели по статусу ('not_started', 'in_progress', 'completed', 'blocked').
*   **Пример запроса:**
    ```http
    GET /api/v1/objectives?project_id=1&status=in_progress
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    [
        {
            "id": 1,
            "project_id": 1,
            "name": "Запуск Taskus3 v1.0",
            "description": "Запустить первую версию Taskus3 с базовым функционалом управления задачами.",
            "status": "in_progress",
            "owner_agent_id": "Agent Alpha",
            "start_date": "2024-06-01",
            "target_date": "2024-09-30",
            "created_at": "2024-05-20 10:00:00",
            "updated_at": "2024-06-10 11:00:00"
        }
    ]
    ```

### 3.2. Получение цели по ID

*   **HTTP-метод:** `GET`
*   **Эндпоинт:** `/objectives/{objective_id}`
*   **Назначение:** Получить детальную информацию о конкретной цели.
*   **Параметры пути:**
    *   `objective_id` (int, обязательный): Уникальный идентификатор цели.
*   **Пример запроса:**
    ```http
    GET /api/v1/objectives/1
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    {
        "id": 1,
        "project_id": 1,
        "name": "Запуск Taskus3 v1.0",
        "description": "Запустить первую версию Taskus3 с базовым функционалом управления задачами.",
        "status": "in_progress",
        "owner_agent_id": "Agent Alpha",
        "start_date": "2024-06-01",
        "target_date": "2024-09-30",
        "created_at": "2024-05-20 10:00:00",
        "updated_at": "2024-06-10 11:00:00"
    }
    ```
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Objective not found"
    }
    ```

### 3.3. Создание новой цели

*   **HTTP-метод:** `POST`
*   **Эндпоинт:** `/objectives`
*   **Назначение:** Создать новую цель проекта.
*   **Структура тела запроса (JSON):**
    ```json
    {
        "project_id": 1,            // int, обязательный
        "name": "Название цели",    // string, обязательный
        "description": "Описание цели", // string, опционально
        "status": "not_started",    // string, опционально (not_started, in_progress, completed, blocked)
        "owner_agent_id": "Agent Beta", // string, опционально
        "start_date": "2024-07-01", // string (YYYY-MM-DD), опционально
        "target_date": "2024-12-31" // string (YYYY-MM-DD), опционально
    }
    ```
*   **Пример запроса:**
    ```http
    POST /api/v1/objectives
    Authorization: Bearer YOUR_API_TOKEN
    Content-Type: application/json

    {
        "project_id": 1,
        "name": "Оптимизация производительности",
        "description": "Улучшить производительность бэкенда и фронтенда на 20%.",
        "target_date": "2025-03-31"
    }
    ```
*   **Пример успешного ответа (201 Created):**
    ```json
    {
        "id": 2,
        "project_id": 1,
        "name": "Оптимизация производительности",
        "description": "Улучшить производительность бэкенда и фронтенда на 20%.",
        "status": "not_started",
        "owner_agent_id": null,
        "start_date": "2024-06-27",
        "target_date": "2025-03-31",
        "created_at": "2024-06-27 12:20:00",
        "updated_at": "2024-06-27 12:20:00"
    }
    ```
*   **Пример ответа с ошибкой (400 Bad Request):**
    ```json
    {
        "message": "Missing required fields: project_id, name"
    }
    ```

### 3.4. Обновление существующей цели

*   **HTTP-метод:** `PUT`
*   **Эндпоинт:** `/objectives/{objective_id}`
*   **Назначение:** Обновить информацию о существующей цели.
*   **Параметры пути:**
    *   `objective_id` (int, обязательный): Уникальный идентификатор цели.
*   **Структура тела запроса (JSON):**
    *   Все поля опциональны, но хотя бы одно должно быть предоставлено.
    ```json
    {
        "name": "Обновленное название цели", // string
        "description": "Обновленное описание", // string
        "status": "completed",      // string
        "owner_agent_id": "Agent Gamma", // string
        "start_date": "2024-07-05", // string (YYYY-MM-DD)
        "target_date": "2025-01-31" // string (YYYY-MM-DD)
    }
    ```
*   **Пример запроса:**
    ```http
    PUT /api/v1/objectives/1
    Authorization: Bearer YOUR_API_TOKEN
    Content-Type: application/json

    {
        "status": "completed",
        "description": "Первая версия Taskus3 успешно запущена."
    }
    ```
*   **Пример успешного ответа (200 OK):**
    ```json
    {
        "id": 1,
        "project_id": 1,
        "name": "Запуск Taskus3 v1.0",
        "description": "Первая версия Taskus3 успешно запущена.",
        "status": "completed",
        "owner_agent_id": "Agent Alpha",
        "start_date": "2024-06-01",
        "target_date": "2024-09-30",
        "created_at": "2024-05-20 10:00:00",
        "updated_at": "2024-06-27 12:25:00"
    }
    ```
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Objective not found"
    }
    ```

### 3.5. Удаление цели

*   **HTTP-метод:** `DELETE`
*   **Эндпоинт:** `/objectives/{objective_id}`
*   **Назначение:** Удалить цель из системы.
*   **Параметры пути:**
    *   `objective_id` (int, обязательный): Уникальный идентификатор цели.
*   **Пример запроса:**
    ```http
    DELETE /api/v1/objectives/1
    Authorization: Bearer YOUR_API_TOKEN
    ```
*   **Пример успешного ответа (204 No Content):**
    *   Пустое тело ответа.
*   **Пример ответа с ошибкой (404 Not Found):**
    ```json
    {
        "message": "Objective not found"
    }