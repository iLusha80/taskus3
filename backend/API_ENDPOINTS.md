# Документация API эндпоинтов

## Agents

### GET /api/v1/agents
agents = Agent.query.all()
return jsonify([agent.to_dict() for agent in agents])

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Existing Agent",
    "color": "#000000"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.

### POST /api/v1/agents
data = request.get_json()
name = data.get('name')
color = data.get('color')

if not name:
    return jsonify({'error': 'Name is required'}), 400

existing_agent = Agent.query.filter_by(name=name).first()
if existing_agent:
    return jsonify({'error': 'Agent with this name already exists'}), 409

new_agent = Agent(name=name, color=color)
db.session.add(new_agent)
db.session.commit()
return jsonify(new_agent.to_dict()), 201

**Параметры:**
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `color` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "color": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "New Agent",
  "color": "#FFFFFF"
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `409 Conflict`: Конфликт. Ресурс с таким именем уже существует.

### PUT /api/v1/agents/<int:agent_id>
agent = Agent.query.get(agent_id)
if not agent:
    return jsonify({'error': 'Agent not found'}), 404

data = request.get_json()
if not data:
    return jsonify({'error': 'No data provided for update'}), 400

if 'name' in data:
    # Проверяем, не занято ли новое имя другим агентом
    existing_agent = Agent.query.filter(Agent.name == data['name'], Agent.id != agent_id).first()
    if existing_agent:
        return jsonify({'error': 'Agent with this name already exists'}), 409
    agent.name = data['name']

if 'color' in data:
    agent.color = data['color']

db.session.commit()
return jsonify(agent.to_dict())

**Параметры:**
*   `agent_id` (unknown): Inferred from function signature.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `color` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "color": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Agent",
  "color": "#000000"
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.
*   `409 Conflict`: Конфликт. Ресурс с таким именем уже существует.

## Boards

### GET /api/v1/projects/<int:project_id>/boards
Получает список досок для указанного проекта.

**Параметры:**
*   `project_id` (int): ID проекта.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### POST /api/v1/projects/<int:project_id>/boards
Создает новую доску для указанного проекта.

Принимает данные доски в формате JSON.

**Параметры:**
*   `project_id` (int): ID проекта, к которому будет принадлежать доска.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (По умолчанию: '{}') (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "metadata": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "New Board",
  "project_id": 1
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/boards/<int:board_id>
Получает доску по ее ID.

**Параметры:**
*   `board_id` (int): ID доски.

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Board",
  "project_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### PUT /api/v1/boards/<int:board_id>
Обновляет существующую доску.

Принимает ID доски и данные для обновления в формате JSON.

**Параметры:**
*   `board_id` (int): ID доски.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "metadata": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Board",
  "project_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### DELETE /api/v1/boards/<int:board_id>
Удаляет доску по ее ID.

**Параметры:**
*   `board_id` (int): ID доски.

**Коды состояния:**
*   `204 No Content`: Ресурс успешно удален.
*   `404 Not Found`: Ресурс не найден.

## Cards

### GET /api/v1/columns/<int:column_id>/cards
Получает список карточек для указанной колонки.

**Параметры:**
*   `column_id` (int): ID колонки.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### POST /api/v1/columns/<int:column_id>/cards
Создает новую карточку для указанной колонки.

Принимает данные карточки в формате JSON.

**Параметры:**
*   `column_id` (int): ID колонки, к которой будет принадлежать карточка.
*   `title` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `priority` (string): Описание отсутствует. (По умолчанию: 'medium') (Тело запроса)
*   `assigned_agent_id` (integer): Описание отсутствует. (Тело запроса)
*   `task_type` (string): Описание отсутствует. (Тело запроса)
*   `start_date` (string): Описание отсутствует. (Тело запроса)
*   `due_date` (string): Описание отсутствует. (Тело запроса)
*   `position` (integer): Описание отсутствует. (По умолчанию: 0) (Тело запроса)
*   `metadata` (string): Описание отсутствует. (По умолчанию: '{}') (Тело запроса)
*   `milestone_id` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "title": "<string>",
  "description": "<string>",
  "priority": "<string>",
  "assigned_agent_id": "<integer>",
  "task_type": "<string>",
  "start_date": "<string>",
  "due_date": "<string>",
  "position": "<integer>",
  "metadata": "<string>",
  "milestone_id": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "title": "New Card",
  "column_id": 1
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/cards/<int:card_id>
Получает карточку по ее ID.

**Параметры:**
*   `card_id` (int): ID карточки.

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Existing Card",
  "column_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### PUT /api/v1/cards/<int:card_id>
Обновляет существующую карточку.

Принимает ID карточки и данные для обновления в формате JSON.

**Параметры:**
*   `card_id` (int): ID карточки.
*   `title` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `priority` (string): Описание отсутствует. (Тело запроса)
*   `assigned_agent_id` (string): Описание отсутствует. (Тело запроса)
*   `task_type` (string): Описание отсутствует. (Тело запроса)
*   `start_date` (string): Описание отсутствует. (Тело запроса)
*   `due_date` (string): Описание отсутствует. (Тело запроса)
*   `position` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (Тело запроса)
*   `milestone_id` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "title": "<string>",
  "description": "<string>",
  "priority": "<string>",
  "assigned_agent_id": "<string>",
  "task_type": "<string>",
  "start_date": "<string>",
  "due_date": "<string>",
  "position": "<string>",
  "metadata": "<string>",
  "milestone_id": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "title": "Existing Card",
  "column_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### DELETE /api/v1/cards/<int:card_id>
Удаляет карточку по ее ID.

**Параметры:**
*   `card_id` (int): ID карточки.

**Коды состояния:**
*   `204 No Content`: Ресурс успешно удален.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/cards/<int:card_id>/history
Получает историю изменений для указанной карточки.

**Параметры:**
*   `card_id` (int): ID карточки.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/objectives/<int:objective_id>/milestones/<int:milestone_id>/cards
Получает список карточек для указанного этапа, принадлежащего определенной цели.

**Параметры:**
*   `objective_id` (int): ID цели.
*   `milestone_id` (int): ID этапа.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

## Columns

### GET /api/v1/boards/<int:board_id>/columns
Получает список колонок для указанной доски.

**Параметры:**
*   `board_id` (int): ID доски.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### POST /api/v1/boards/<int:board_id>/columns
Создает новую колонку для указанной доски.

Принимает данные колонки в формате JSON.

**Параметры:**
*   `board_id` (int): ID доски, к которой будет принадлежать колонка.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `position` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (По умолчанию: '{}') (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "position": "<string>",
  "metadata": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "New Column",
  "board_id": 1
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/columns/<int:column_id>
Получает колонку по ее ID.

**Параметры:**
*   `column_id` (int): ID колонки.

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Column",
  "board_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### PUT /api/v1/columns/<int:column_id>
Обновляет существующую колонку.

Принимает ID колонки и данные для обновления в формате JSON.

**Параметры:**
*   `column_id` (int): ID колонки.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `position` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "position": "<string>",
  "metadata": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Column",
  "board_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### DELETE /api/v1/columns/<int:column_id>
Удаляет колонку по ее ID.

**Параметры:**
*   `column_id` (int): ID колонки.

**Коды состояния:**
*   `204 No Content`: Ресурс успешно удален.
*   `404 Not Found`: Ресурс не найден.

## Milestones

### POST /api/v1/objectives/<int:objective_id>/milestones
Создает новый этап для указанной цели.

Принимает данные этапа в формате JSON.

**Параметры:**
*   `objective_id` (int): ID цели, к которой будет относиться этап.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `due_date` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "description": "<string>",
  "due_date": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "New Milestone",
  "objective_id": 1
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/objectives/<int:objective_id>/milestones
Получает список этапов для указанной цели.

**Параметры:**
*   `objective_id` (int): ID цели.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.

### GET /api/v1/projects/<int:project_id>/milestones
Получает список этапов для указанного проекта.

**Параметры:**
*   `project_id` (int): ID проекта.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.

### GET /api/v1/milestones/<int:milestone_id>
Получает этап по его ID.

**Параметры:**
*   `milestone_id` (int): ID этапа.

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Milestone",
  "objective_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### PUT /api/v1/milestones/<int:milestone_id>
Обновляет существующий этап.

Принимает ID этапа и данные для обновления в формате JSON.

**Параметры:**
*   `milestone_id` (int): ID этапа.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `due_date` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "description": "<string>",
  "due_date": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Milestone",
  "objective_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### DELETE /api/v1/milestones/<int:milestone_id>
Удаляет этап по его ID.

**Параметры:**
*   `milestone_id` (int): ID этапа.

**Коды состояния:**
*   `204 No Content`: Ресурс успешно удален.
*   `404 Not Found`: Ресурс не найден.

## Objectives

### POST /api/v1/projects/<int:project_id>/objectives
Создает новую цель для указанного проекта.

Принимает данные цели в формате JSON.

**Параметры:**
*   `project_id` (int): ID проекта, к которому будет относиться цель.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `status` (string): Описание отсутствует. (По умолчанию: 'not_started') (Тело запроса)
*   `start_date` (string): Описание отсутствует. (Тело запроса)
*   `target_date` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "description": "<string>",
  "status": "<string>",
  "start_date": "<string>",
  "target_date": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "New Objective",
  "project_id": 1
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### GET /api/v1/projects/<int:project_id>/objectives
Получает список целей для указанного проекта с вложенными этапами.

**Параметры:**
*   `project_id` (int): ID проекта.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.

### GET /api/v1/objectives/<int:objective_id>
Получает цель по ее ID.

**Параметры:**
*   `objective_id` (int): ID цели.

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Objective",
  "project_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### PUT /api/v1/objectives/<int:objective_id>
Обновляет существующую цель.

Принимает ID цели и данные для обновления в формате JSON.

**Параметры:**
*   `objective_id` (int): ID цели.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `status` (string): Описание отсутствует. (Тело запроса)
*   `start_date` (string): Описание отсутствует. (Тело запроса)
*   `target_date` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "description": "<string>",
  "status": "<string>",
  "start_date": "<string>",
  "target_date": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Objective",
  "project_id": 1
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### DELETE /api/v1/objectives/<int:objective_id>
Удаляет цель по ее ID.

**Параметры:**
*   `objective_id` (int): ID цели.

**Коды состояния:**
*   `204 No Content`: Ресурс успешно удален.
*   `404 Not Found`: Ресурс не найден.

## Projects

### GET /api/v1/projects/
Получает список всех проектов.

**Пример ответа:**
```json
[
  {
    "id": 1,
    "name": "Item 1"
  }
]
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.

### POST /api/v1/projects/
Создает новый проект.

Принимает данные проекта в формате JSON.

**Параметры:**
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (По умолчанию: '{}') (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "description": "<string>",
  "metadata": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "New Project"
}
```

**Коды состояния:**
*   `201 Created`: Ресурс успешно создан.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.

### GET /api/v1/projects/<int:project_id>
Получает проект по его ID.

**Параметры:**
*   `project_id` (int): ID проекта.

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Project"
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `404 Not Found`: Ресурс не найден.

### PUT /api/v1/projects/<int:project_id>
Обновляет существующий проект.

Принимает ID проекта и данные для обновления в формате JSON.

**Параметры:**
*   `project_id` (int): ID проекта.
*   `name` (string): Описание отсутствует. (Тело запроса)
*   `description` (string): Описание отсутствует. (Тело запроса)
*   `metadata` (string): Описание отсутствует. (Тело запроса)

**Пример запроса:**
```json
{
  "name": "<string>",
  "description": "<string>",
  "metadata": "<string>"
}
```

**Пример ответа:**
```json
{
  "id": 1,
  "name": "Existing Project"
}
```

**Коды состояния:**
*   `200 OK`: Запрос успешно выполнен.
*   `400 Bad Request`: Неверный запрос. Отсутствуют обязательные поля или некорректные данные.
*   `404 Not Found`: Ресурс не найден.

### DELETE /api/v1/projects/<int:project_id>
Удаляет проект по его ID.

**Параметры:**
*   `project_id` (int): ID проекта.

**Коды состояния:**
*   `204 No Content`: Ресурс успешно удален.
*   `404 Not Found`: Ресурс не найден.