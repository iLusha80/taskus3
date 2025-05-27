# План оптимизации отображения доски

**Цель:** Расширить область колонок до фиксированной ширины (300px), исключающей горизонтальную прокрутку, для обеспечения полного обзора содержимого.

**Шаги:**

1.  **Изменение стилей контейнера колонок (`.columns-container`)**:
    *   В файле `frontend-react/src/pages/BoardPage.css` удалить свойство `overflow-x: auto;` из класса `.columns-container`.
    *   Добавить свойство `flex-wrap: wrap;` к классу `.columns-container`, чтобы колонки автоматически переносились на новую строку, если не хватает места в текущей.
    *   Добавить свойство `justify-content: flex-start;` к классу `.columns-container` для выравнивания колонок по левому краю.

2.  **Изменение стилей отдельной колонки (`.column`)**:
    *   В файле `frontend-react/src/components/Column.css` изменить свойство `min-width: 280px;` на `width: 300px;` для класса `.column`. Это обеспечит фиксированную ширину каждой колонки.
    *   Убедиться, что свойство `flex-shrink: 0;` остается для класса `.column`, чтобы предотвратить сжатие колонок.

**Mermaid Диаграмма:**

```mermaid
graph TD
    A[Начало] --> B{Анализ CSS файлов};
    B --> C[Проверить BoardPage.css];
    C --> D[Проверить Column.css];
    D --> E[Определить текущие стили];
    E --> F[Удалить overflow-x: auto из .columns-container];
    F --> G[Добавить flex-wrap: wrap к .columns-container];
    G --> H[Добавить justify-content: flex-start к .columns-container];
    H --> I[Изменить min-width на width: 300px для .column];
    I --> J[Проверить flex-shrink: 0 для .column];
    J --> K[Конец];