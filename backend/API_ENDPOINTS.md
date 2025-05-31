# API Endpoints

## Проекты

### GET /api/v1/projects
Описание: Получить список всех проектов.
Параметры запроса: Нет
Пример ответа:
```json
[
    {
        "id": 1,
        "name": "Project Alpha",
        "description": "Description for Alpha"
    }
]
```

### POST /api/v1/projects
Описание: Создать новый проект.
Тело запроса:
```json
{
    "name": "Название проекта",
    "description": "Описание проекта (необязательно)",
    "metadata": "{}" (необязательно)
}
```
Пример ответа:
```json
{
    "id": 2,
    "name": "New Project",
    "description": "Description for new project",
    "metadata": "{}"
}
```

### GET /api/v1/projects/{project_id}
Описание: Получить информацию о конкретном проекте по его ID.
Параметры пути:
- `project_id` (integer): ID проекта.
Пример ответа:
```json
{
    "id": 1,
    "name": "Project Alpha",
    "description": "Description for Alpha"
}
```

### PUT /api/v1/projects/{project_id}
Описание: Обновить информацию о существующем проекте.
Параметры пути:
- `project_id` (integer): ID проекта.
Тело запроса:
```json
{
    "name": "Обновленное название",
    "description": "Обновленное описание",
    "metadata": "{}"
}
```
Пример ответа:
```json
{
    "id": 1,
    "name": "Обновленное название",
    "description": "Обновленное описание",
    "metadata": "{}"
}
```

### DELETE /api/v1/projects/{project_id}
Описание: Удалить проект по его ID.
Параметры пути:
- `project_id` (integer): ID проекта.
Пример ответа: (Статус 204 No Content)

## Доски

### GET /api/v1/projects/{project_id}/boards
Описание: Получить список всех досок, принадлежащих конкретному проекту.
Параметры пути:
- `project_id` (integer): ID проекта.
Пример ответа:
```json
[
    {
        "id": 1,
        "project_id": 1,
        "name": "Board 1",
        "metadata": "{}"
    }
]
```

### POST /api/v1/projects/{project_id}/boards
Описание: Создать новую доску для конкретного проекта.
Параметры пути:
- `project_id` (integer): ID проекта.
Тело запроса:
```json
{
    "name": "Название доски",
    "metadata": "{}" (необязательно)
}
```
Пример ответа:
```json
{
    "id": 2,
    "project_id": 1,
    "name": "New Board",
    "metadata": "{}"
}
```

### GET /api/v1/boards/{board_id}
Описание: Получить информацию о конкретной доске по ее ID.
Параметры пути:
- `board_id` (integer): ID доски.
Пример ответа:
```json
{
    "id": 1,
    "project_id": 1,
    "name": "Board 1",
    "metadata": "{}"
}
```

### PUT /api/v1/boards/{board_id}
Описание: Обновить информацию о существующей доске.
Параметры пути:
- `board_id` (integer): ID доски.
Тело запроса:
```json
{
    "name": "Обновленное название доски",
    "metadata": "{}"
}
```
Пример ответа:
```json
{
    "id": 1,
    "project_id": 1,
    "name": "Обновленное название доски",
    "metadata": "{}"
}
```

### DELETE /api/v1/boards/{board_id}
Описание: Удалить доску по ее ID.
Параметры пути:
- `board_id` (integer): ID доски.
Пример ответа: (Статус 204 No Content)

## Колонки

### GET /api/v1/boards/{board_id}/columns
Описание: Получить список всех колонок, принадлежащих конкретной доске.
Параметры пути:
- `board_id` (integer): ID доски.
Пример ответа:
```json
[
    {
        "id": 1,
        "board_id": 1,
        "name": "To Do",
        "position": 0,
        "metadata": "{}"
    }
]
```

### POST /api/v1/boards/{board_id}/columns
Описание: Создать новую колонку для конкретной доски.
Параметры пути:
- `board_id` (integer): ID доски.
Тело запроса:
```json
{
    "name": "Название колонки",
    "position": 0 (необязательно),
    "metadata": "{}" (необязательно)
}
```
Пример ответа:
```json
{
    "id": 2,
    "board_id": 1,
    "name": "New Column",
    "position": 1,
    "metadata": "{}"
}
```

### GET /api/v1/columns/{column_id}
Описание: Получить информацию о конкретной колонке по ее ID.
Параметры пути:
- `column_id` (integer): ID колонки.
Пример ответа:
```json
{
    "id": 1,
    "board_id": 1,
    "name": "To Do",
    "position": 0,
    "metadata": "{}"
}
```

### PUT /api/v1/columns/{column_id}
Описание: Обновить информацию о существующей колонке.
Параметры пути:
- `column_id` (integer): ID колонки.
Тело запроса:
```json
{
    "name": "Обновленное название колонки",
    "position": 1,
    "metadata": "{}"
}
```
Пример ответа:
```json
{
    "id": 1,
    "board_id": 1,
    "name": "Обновленное название колонки",
    "position": 1,
    "metadata": "{}"
}
```

### DELETE /api/v1/columns/{column_id}
Описание: Удалить колонку по ее ID.
Параметры пути:
- `column_id` (integer): ID колонки.
Пример ответа: (Статус 204 No Content)

## Карточки

### GET /api/v1/columns/{column_id}/cards
Описание: Получить список всех карточек, принадлежащих конкретной колонке.
Параметры пути:
- `column_id` (integer): ID колонки.
Пример ответа:
```json
[
    {
        "id": 1,
        "column_id": 1,
        "title": "Task 1",
        "description": "Description for task 1",
        "status": "open",
        "priority": "medium",
        "assigned_agent_id": null,
        "task_type": null,
        "start_date": null,
        "due_date": null,
        "position": 0,
        "metadata": "{}"
    }
]
```

### POST /api/v1/columns/{column_id}/cards
Описание: Создать новую карточку для конкретной колонки.
Параметры пути:
- `column_id` (integer): ID колонки.
Тело запроса:
```json
{
    "title": "Название карточки",
    "description": "Описание карточки (необязательно)",
    "status": "open" (по умолчанию),
    "priority": "medium" (по умолчанию),
    "assigned_agent_id": null (необязательно),
    "task_type": null (необязательно),
    "start_date": null (необязательно, формат YYYY-MM-DD),
    "due_date": null (необязательно, формат YYYY-MM-DD),
    "position": 0 (по умолчанию),
    "metadata": "{}" (необязательно)
}
```
Пример ответа:
```json
{
    "id": 2,
    "column_id": 1,
    "title": "New Card",
    "description": "Description for new card",
    "status": "open",
    "priority": "medium",
    "assigned_agent_id": null,
    "task_type": null,
    "start_date": null,
    "due_date": null,
    "position": 0,
    "metadata": "{}"
}
```

### GET /api/v1/cards/{card_id}
Описание: Получить информацию о конкретной карточке по ее ID.
Параметры пути:
- `card_id` (integer): ID карточки.
Пример ответа:
```json
{
    "id": 1,
    "column_id": 1,
    "title": "Task 1",
    "description": "Description for task 1",
    "status": "open",
    "priority": "medium",
    "assigned_agent_id": null,
    "task_type": null,
    "start_date": null,
    "due_date": null,
    "position": 0,
    "metadata": "{}"
}
```

### PUT /api/v1/cards/{card_id}
Описание: Обновить информацию о существующей карточке.
Параметры пути:
- `card_id` (integer): ID карточки.
Тело запроса:
```json
{
    "title": "Обновленное название",
    "description": "Обновленное описание",
    "status": "closed",
    "priority": "high",
    "assigned_agent_id": 1,
    "task_type": "bug",
    "start_date": "2023-01-01",
    "due_date": "2023-01-31",
    "position": 1,
    "metadata": "{}"
}
```
Пример ответа:
```json
{
    "id": 1,
    "column_id": 1,
    "title": "Обновленное название",
    "description": "Обновленное описание",
    "status": "closed",
    "priority": "high",
    "assigned_agent_id": 1,
    "task_type": "bug",
    "start_date": "2023-01-01",
    "due_date": "2023-01-31",
    "position": 1,
    "metadata": "{}"
}
```

### DELETE /api/v1/cards/{card_id}
Описание: Удалить карточку по ее ID.
Параметры пути:
- `card_id` (integer): ID карточки.
Пример ответа: (Статус 204 No Content)

### GET /api/v1/cards/{card_id}/history
Описание: Получить историю изменений для конкретной карточки.
Параметры пути:
- `card_id` (integer): ID карточки.
Пример ответа:
```json
[
    {
        "id": 1,
        "card_id": 1,
        "timestamp": "2023-05-31T10:00:00Z",
        "field_name": "status",
        "old_value": "open",
        "new_value": "in progress"
    }
]