# План по устранению неработоспособности функционала добавления колонки и задачи

## Диагностика проблемы:

Выявлено, что функционал добавления колонок и задач не работает из-за отсутствия передачи параметра `position` с фронтенда на бэкенд. Бэкенд ожидает этот параметр для создания новых сущностей.

## План действий:

1.  **Изменение фронтенда (`frontend-react/src/pages/BoardPage.jsx`):**
    *   В функции `handleAddColumn` перед вызовом `api.createColumn` определить `position` как `columns.length`.
    *   Передать `position` в `api.createColumn`.

2.  **Изменение фронтенда (`frontend-react/src/components/Column.jsx`):**
    *   В функции `handleAddCard` перед вызовом `api.createCard` определить `position` как `cards.length`.
    *   Передать `position` в `api.createCard`.

3.  **Изменение бэкенда (`backend/api/columns.py`):**
    *   В функции `create_column` удалить проверку `position is None` на строке 20, так как `position` теперь будет всегда передаваться с фронтенда.
    *   Убедиться, что `ColumnService.create_column` корректно обрабатывает `position`.

4.  **Изменение бэкенда (`backend/api/cards.py`):**
    *   В функции `create_card` удалить проверку `position is None` на строке 27, так как `position` теперь будет всегда передаваться с фронтенда.
    *   Убедиться, что `CardService.create_card` корректно обрабатывает `position`.

5.  **Проверка сервисов бэкенда (`backend/services/column_service.py` и `backend/services/card_service.py`):**
    *   Проверить, как `create_column` и `create_card` в этих файлах используют параметр `position`. Если они просто сохраняют его, то никаких изменений не потребуется. Если же они генерируют позицию самостоятельно, то эту логику нужно будет изменить, чтобы использовать переданное значение.

6.  **Тестирование:**
    *   Проверить функционал добавления колонок.
    *   Проверить функционал добавления задач.

## Диаграмма потока данных и изменений:

```mermaid
graph TD
    A[Пользователь нажимает "Добавить колонку"] --> B{BoardPage.jsx: handleAddColumn};
    B --> C{Определить position = columns.length};
    C --> D[Вызвать api.createColumn(boardId, { name, position })];
    D --> E[api.js: createColumn];
    E --> F[backend/api/columns.py: create_column];
    F --> G{ColumnService.create_column(board_id, name, position, metadata)};
    G --> H[Сохранить колонку с position в БД];
    H --> I[Вернуть новую колонку];
    I --> J[Обновить список колонок на фронтенде];

    K[Пользователь нажимает "Добавить карточку"] --> L{Column.jsx: handleAddCard};
    L --> M{Определить position = cards.length};
    M --> N[Вызвать api.createCard(columnId, { title, description, position })];
    N --> O[api.js: createCard];
    O --> P[backend/api/cards.py: create_card];
    P --> Q{CardService.create_card(column_id, title, description, ..., position, metadata)};
    Q --> R[Сохранить карточку с position в БД];
    R --> S[Вернуть новую карточку];
    S --> T[Обновить список карточек на фронтенде];