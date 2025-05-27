# План реализации изменений в AI Task Tracker

## 1. Изменение механизма добавления задач:

### 1.1. Перенос кнопки "Добавить задачу":
*   **В `frontend/js/components/BoardView.js`:**
    *   Добавить кнопку "Добавить задачу" (`<button class="add-button add-card-global-button">Добавить задачу</button>`) в `board-actions` рядом с существующими кнопками.
    *   Реализовать новую функцию `handleAddCardGlobal` в `BoardView.js`.
    *   Эта функция будет получать список колонок с текущей доски (`api.getColumns(BoardView.currentBoardId)`).
    *   Модальное окно для создания задачи будет содержать поля для названия и описания задачи, а также выпадающий список (`<select>`) для выбора колонки.
    *   По умолчанию в выпадающем списке будет выбрана первая колонка.
    *   При сохранении задачи, `api.createCard` будет вызываться с `columnId` из выбранной колонки.
*   **В `frontend/js/components/Column.js`:**
    *   Удалить HTML-код кнопки `.add-card-button` из метода `render`.
    *   Удалить обработчик события `columnElement.querySelector('.add-card-button').addEventListener('click', Column.handleAddCard);`.
    *   Удалить функцию `Column.handleAddCard`.

## 2. Расположение столбцов в одну горизонтальную линию:
*   **В `frontend/style.css`:**
    *   Для `.board-container`:
        *   Установить `display: flex;`.
        *   Добавить `flex-wrap: nowrap;` для предотвращения переноса на новую строку.
        *   Добавить `overflow-x: auto;` для горизонтальной прокрутки.
        *   Установить `gap` для отступов между колонками.
    *   Для `.column`:
        *   Установить фиксированную ширину, например, `min-width: 300px;` и `max-width: 340px;` или `width: 320px;`.
        *   Добавить `flex-shrink: 0;` чтобы колонки не сжимались.

## 3. Замена иконок на понятные символы/текстовые метки:
*   **В `frontend/js/components/BoardView.js` и `frontend/js/components/Column.js`:**
    *   Заменить `<i class="fas fa-plus"></i>` на `+` (для кнопок добавления).
    *   Заменить `<i class="fas fa-trash-alt"></i>` на `×` (для кнопок удаления).
*   **В `frontend/style.css`:**
    *   Удалить или изменить стили, относящиеся к иконкам Font Awesome (классы `fas`). Возможно, потребуется скорректировать `padding` и `font-size` для кнопок, чтобы символы выглядели хорошо.

## 4. Переработка всплывающего окна подтверждения при удалении задачи:
*   **В `frontend/js/components/Modal.js`:**
    *   В методе `show`, когда `isConfirm` равно `true`, изменить HTML-структуру для кнопок "Подтвердить" и "Отмена", чтобы они были более заметными и контрастными.
    *   Возможно, добавить классы для стилизации этих кнопок.
*   **В `frontend/style.css`:**
    *   Добавить новые стили или изменить существующие для кнопок подтверждения (`.confirm-button`) и отмены (`.cancel-button`) в модальном окне, чтобы они соответствовали пожеланиям пользователя (более заметные и контрастные). Например, использовать `background-color: #dc3545;` для кнопки подтверждения удаления и `background-color: #6c757d;` для отмены, с соответствующими `hover` эффектами.

## Mermaid Диаграмма потока данных для добавления задачи (обновленная):

```mermaid
graph TD
    A[Пользователь нажимает "Добавить задачу" в BoardView] --> B[Вызов BoardView.handleAddCardGlobal]
    B --> C[Получение списка колонок через api.getColumns]
    C --> D[Модальное окно для создания задачи с полями и выпадающим списком колонок]
    D --> E[Пользователь выбирает колонку и вводит данные задачи]
    E --> F[Нажатие "Сохранить" в модальном окне]
    F --> G[Вызов api.createCard с выбранной columnId]
    G --> H{Задача создана успешно?}
    H -- Да --> I[Модальное окно "Успех"]
    H -- Нет --> J[Модальное окно "Ошибка"]
    I --> K[Перезагрузка доски]
    J --> K
```

## Mermaid Диаграмма структуры компонентов после изменений:

```mermaid
graph TD
    App --> Header
    App --> Main
    App --> Footer

    Main --> BoardView
    BoardView --> BoardHeader
    BoardView --> BoardContainer

    BoardHeader --> BoardName
    BoardHeader --> BoardActions
    BoardActions --> AddColumnButton
    BoardActions --> AddBoardButton
    BoardActions --> DeleteBoardButton
    BoardActions --> AddCardGlobalButton

    BoardContainer --> Column1
    BoardContainer --> Column2
    BoardContainer --> ...

    Column1 --> ColumnHeader
    Column1 --> CardsContainer
    Column1 --> DeleteColumnButton

    CardsContainer --> Card1
    CardsContainer --> Card2
    CardsContainer --> ...

    Card1 --> CardTitle
    Card1 --> CardDescription
    Card1 --> CardMeta
    Card1 --> DeleteCardButton

    Modal --> ModalOverlay
    ModalOverlay --> ModalContent
    ModalContent --> CloseButton
    ModalContent --> ModalTitle
    ModalContent --> ModalBody
    ModalContent --> ModalForm (для создания/редактирования)
    ModalContent --> ModalActions (кнопки Сохранить/Отмена/Подтвердить)