# План реализации: Автоматическое добавление стандартных колонок при создании доски

## Задача
При создании новой доски автоматически добавлять стандартный набор статусных колонок: «Сделать», «В работе», «На Тестах», «Готово».

## Анализ
*   **backend/api/boards.py**: Конечная точка `/projects/<int:project_id>/boards` (POST) вызывает `BoardService.create_board()`.
*   **backend/services/board_service.py**: Функция `create_board()` создает новую доску и сохраняет ее в базе данных. Это идеальное место для добавления логики создания стандартных колонок.
*   **backend/services/column_service.py**: Функция `create_column()` в `ColumnService` позволяет создавать новые колонки, принимая `board_id`, `name`, `position` и `metadata`.

## План
1.  **Модифицировать `BoardService`**:
    *   Импортировать `ColumnService` в [`backend/services/board_service.py`](backend/services/board_service.py).
    *   После создания новой доски в функции [`create_board()`](backend/services/board_service.py:18), добавить вызов `ColumnService.create_column()` для каждой из стандартных колонок.
    *   Убедиться, что колонки создаются с правильным `board_id` (полученным от только что созданной доски) и последовательными значениями `position`.

2.  **Стандартные колонки**:
    *   «Сделать» (position: 0)
    *   «В работе» (position: 1)
    *   «На Тестах» (position: 2)
    *   «Готово» (position: 3)

## Диаграмма процесса

```mermaid
graph TD
    A[Вызов create_board в BoardService] --> B{Создание новой доски в БД};
    B --> C{Получение ID новой доски};
    C --> D[Вызов ColumnService.create_column для "Сделать"];
    D --> E[Вызов ColumnService.create_column для "В работе"];
    E --> F[Вызов ColumnService.create_column для "На Тестах"];
    F --> G[Вызов ColumnService.create_column для "Готово"];
    G --> H[Возврат новой доски с колонками];