# План улучшения интерфейса модального окна редактирования задачи

## 1. Анализ текущего состояния:
*   Модальное окно (`frontend-react/src/components/Modal.jsx`) использует CSS Grid (`frontend-react/src/components/Modal.css`) для расположения полей в две колонки. Некоторые поля (`title`, `description`, `column_id`, `milestone_id`) имеют `fullWidth: true`, что заставляет их занимать всю ширину.
*   Выпадающие списки (`select`) и поля ввода (`input`, `textarea`) используют общие стили, что может приводить к их "кривизне" или неоптимальному внешнему виду.

## 2. Предлагаемые изменения для компактности модального окна:

*   **Уменьшение отступов и полей:** Проверить и уменьшить `padding` в `.modal-content` и `margin-bottom` в `.form-group`, а также `gap` в `modal-content form` в `frontend-react/src/components/Modal.css`. Это позволит уменьшить общее пространство, занимаемое элементами.
*   **Оптимизация ширины полей:**
    *   Для полей, которые не требуют полной ширины, убедиться, что они корректно отображаются в двух колонках.
    *   Рассмотреть возможность уменьшения `max-width` для `.modal-content` в `frontend-react/src/components/Modal.css`, если это не приведет к слишком сильному сжатию содержимого.
*   **Изменение порядка полей для лучшей компактности и логичности:**
    *   Перегруппировать поля в `handleEditCard` в `frontend-react/src/pages/BoardPage.jsx` следующим образом:
        1.  `title` (Название задачи) - `fullWidth: true`
        2.  `description` (Описание задачи) - `fullWidth: true`
        3.  `column_id` (Колонка) - `fullWidth: true`
        4.  `priority` (Приоритет)
        5.  `task_type` (Тип задачи)
        6.  `assigned_agent_id` (Исполнитель (ID))
        7.  `start_date` (Дата начала)
        8.  `due_date` (Дата завершения)
        9.  `milestone_id` (Этап (Milestone)) - `fullWidth: true`

## 3. Предлагаемые изменения для стилизации выпадающих списков:

*   **Специфичные стили для `select`:** Добавить отдельные стили для `select` элементов в `frontend-react/src/components/Modal.css`, чтобы они выглядели более современно. Это может включать:
    *   Увеличение `height` или `padding` для лучшей визуальной высоты.
    *   Изменение `border` (цвет, толщина, радиус).
    *   Добавление `background-color` или `box-shadow` для эффекта глубины.
    *   Стилизация стрелки выпадающего списка (хотя это может быть сложнее без кастомных компонентов).
    *   Обеспечение единообразия с другими полями ввода.
*   **Фокусное состояние:** Добавить стили для `:focus` состояния для `input`, `textarea` и `select`.

## 4. План реализации (в режиме `code`):

*   **Шаг 1: Изменение `frontend-react/src/components/Modal.css`**
    *   Корректировка `padding` и `gap` для `.modal-content` и `form-group`.
    *   Добавление специфических стилей для `select` элементов, включая `width`, `padding`, `border`, `border-radius`, `background-color`, `appearance: none` (для скрытия нативной стрелки) и `background-image` (для кастомной стрелки, если возможно).
    *   Добавление стилей для `:focus` состояния для `input`, `textarea` и `select`.
*   **Шаг 2: Изменение `frontend-react/src/pages/BoardPage.jsx`**
    *   Изменение порядка полей в массиве `fields` внутри функции `handleEditCard`.
*   **Шаг 3: Проверка**
    *   Убедиться, что изменения в CSS корректно применяются ко всем полям, особенно к выпадающим спискам "Колонка" и "Этап (Milestone)".
    *   При необходимости, скорректировать `fullWidth` пропсы для полей в `fields` массиве, чтобы они лучше соответствовали новому макету.

## Обновленная диаграмма Mermaid для визуализации макета (после изменений порядка полей):

```mermaid
graph TD
    A[Модальное окно] --> B(Заголовок)
    A --> C(Форма)
    C --> D1(Название задачи)
    C --> D2(Описание задачи)
    C --> E(Колонка)
    C --> F1(Приоритет)
    C --> F2(Тип задачи)
    C --> G1(Исполнитель (ID))
    C --> G2(Дата начала)
    C --> H(Дата завершения)
    C --> I(Этап (Milestone))
    A --> J(Кнопки действий)

    subgraph Форма (2 колонки)
        D1 -- fullWidth --> C
        D2 -- fullWidth --> C
        E -- fullWidth --> C
        F1 --- F2
        G1 --- G2
        H -- fullWidth --> C
        I -- fullWidth --> C
    end