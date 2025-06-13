# План по улучшению дизайна заголовка и нижнего колонтитула

**Цель:** Улучшить дизайн заголовка и нижнего колонтитула, выровнять их содержимое по центру и использовать одинаковое название проекта "AI Task Tracker".

**Текущее состояние:**
*   Заголовок и нижний колонтитул реализованы как `StyledHeader` и `StyledFooter` в `frontend-react/src/App.jsx`.
*   Стили определены инлайн в `App.jsx` с использованием `styled-components` и значений из `theme.js`.
*   Название проекта в заголовке: "AI Task Tracker".
*   Нижний колонтитул содержит текст: "&copy; 2023 Taskus. Все права защищены."

**Предлагаемые изменения:**

1.  **Центрирование содержимого заголовка:**
    *   Изменить `justify-content: space-between;` на `justify-content: center;` в `StyledHeader` в `frontend-react/src/App.jsx`.
    *   Добавить `width: 100%;` и `text-align: center;` к `HeaderTitle` для обеспечения центрирования текста.
    *   Удалить `LogoPlaceholder`, так как оно не используется и может мешать центрированию.

2.  **Центрирование содержимого нижнего колонтитула:**
    *   `text-align: center;` уже присутствует в `StyledFooter`, что обеспечивает центрирование текста. Дополнительных изменений не требуется.

3.  **Единое название проекта "AI Task Tracker":**
    *   Обновить `HeaderTitle` на "AI Task Tracker" (уже установлено).
    *   Обновить текст в нижнем колонтитуле на "&copy; 2023 AI Task Tracker. Все права защищены."

**Визуализация изменений (Mermaid Diagram):**

```mermaid
graph TD
    A[Начало] --> B{Название проекта: "AI Task Tracker"};
    B --> C[Изменить StyledHeader в App.jsx];
    C --> C1[Удалить LogoPlaceholder];
    C --> C2[Изменить justify-content на center];
    C --> C3[Добавить text-align: center к HeaderTitle];
    C --> D[Изменить StyledFooter в App.jsx];
    D --> D1[Обновить текст футера на "&copy; 2023 AI Task Tracker. Все права защищены."];
    D --> E[Завершение];
```

**Детали реализации:**

*   **Файл:** `frontend-react/src/App.jsx`
*   **Изменения в `StyledHeader` (строки 17-18):**
    ```
    <<<<<<< SEARCH
    :start_line:17
    -------
      display: flex;
      justify-content: space-between;
    =======
      display: flex;
      justify-content: center; /* Центрирование содержимого */
    >>>>>>> REPLACE
    ```
*   **Изменения в `HeaderTitle` (строки 35-36):**
    ```
    <<<<<<< SEARCH
    :start_line:35
    -------
    const HeaderTitle = styled.h1`
      margin: 0;
    =======
    const HeaderTitle = styled.h1`
      margin: 0;
      width: 100%; /* Занимает всю доступную ширину */
      text-align: center; /* Центрирование текста */
    >>>>>>> REPLACE
    ```
*   **Изменения в JSX `StyledHeader` (строки 103-105):**
    ```
    <<<<<<< SEARCH
    :start_line:103
    -------
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogoPlaceholder /> {/* Logo placeholder */}
            <HeaderTitle><Link to="/">AI Task Tracker</Link></HeaderTitle> {/* Styled title */}
          </div>
    =======
          {/* Удален LogoPlaceholder, HeaderTitle центрируется */}
          <HeaderTitle><Link to="/">AI Task Tracker</Link></HeaderTitle> {/* Styled title */}
    >>>>>>> REPLACE
    ```
*   **Изменения в `StyledFooter` (строка 128):**
    ```
    <<<<<<< SEARCH
    :start_line:128
    -------
          <p>&copy; 2023 Taskus. Все права защищены.</p>
    =======
          <p>&copy; 2023 AI Task Tracker. Все права защищены.</p>
    >>>>>>> REPLACE