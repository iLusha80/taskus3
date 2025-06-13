# План по изменению модального окна "Редактировать цель"

## Цель
Изменить модальное окно "Редактировать цель" таким образом, чтобы:
1. Поле "Статус" стало выпадающим списком с фиксированным набором значений.
2. Поле "Исполнитель (ID)" было удалено.

## Анализ файлов
*   `backend/models/objective.py`: Определяет допустимые значения для статуса цели: `'not_started', 'in_progress', 'completed', 'blocked'`.
*   `frontend-react/src/pages/RoadmapPage.jsx`: Содержит логику для отображения и редактирования целей, включая определение полей для модального окна через `setModalConfig` в функциях `handleAddObjective` и `handleEditObjective`.
*   `frontend-react/src/components/Modal.jsx`: Общий компонент модального окна, который принимает массив `fields` и рендерит различные типы полей, включая `select` (выпадающий список).

## План реализации

1.  **Изменение `frontend-react/src/pages/RoadmapPage.jsx`:**
    *   В функции `handleAddObjective` (строки 62-91) и `handleEditObjective` (строки 93-125):
        *   **Изменить поле "Статус":**
            *   Найти объект поля с `id: 'status'`.
            *   Изменить его `type` с `'text'` на `'select'`.
            *   Добавить свойство `options` со следующим массивом объектов:
                ```javascript
                options: [
                    { value: 'not_started', label: 'Не начато' },
                    { value: 'in_progress', label: 'В процессе' },
                    { value: 'completed', label: 'Завершено' },
                    { value: 'blocked', label: 'Заблокировано' }
                ]
                ```
        *   **Удалить поле "Исполнитель (ID)":**
            *   Найти объект поля с `id: 'owner_agent_id'`.
            *   Удалить этот объект из массива `fields`.

2.  **Проверка `frontend-react/src/components/Modal.jsx`:**
    *   Подтверждено, что компонент `Modal.jsx` (строки 54-64) уже содержит логику для рендеринга полей типа `select` с использованием `options`. Дополнительных изменений в этом файле не требуется.

## Mermaid Диаграмма
```mermaid
graph TD
    A[Начало] --> B{Задача: Изменить модальное окно "Редактировать цель"};
    B --> C[Определить файлы для изменения];
    C --> D[Прочитать frontend/src/pages/RoadmapPage.jsx];
    C --> E[Прочитать frontend/src/components/Modal.jsx];
    D --> F{Анализ handleEditObjective};
    E --> G{Анализ компонента Modal};
    F --> H[Изменить тип поля "status" на "select" и добавить options];
    F --> I[Удалить поле "owner_agent_id"];
    G --> J[Подтвердить поддержку type='select' в Modal.jsx];
    H & I & J --> K[Предложить план пользователю];
    K --> L{Пользователь одобряет план?};
    L -- Да --> M[Переключиться в режим Code];
    L -- Нет --> N[Пересмотреть план];
    M --> O[Реализация изменений];
    O --> P[Завершение];