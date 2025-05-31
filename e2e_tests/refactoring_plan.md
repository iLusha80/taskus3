# План реструктуризации `e2e_tests/api_tests.py`

Цель: Сделать код более модульным, используя классы и функции, а также добавить описания в стиле Google docstrings.

## 1. Создание новой структуры директорий для API-клиента:

*   Будет создана новая директория `e2e_tests/api_client/`.
*   Внутри этой директории будет создан файл `__init__.py`, чтобы сделать ее пакетом Python.

## 2. Создание базового класса API-клиента (`e2e_tests/api_client/base_client.py`):

*   Будет создан класс `BaseApiClient`, который будет содержать общую логику для выполнения HTTP-запросов (GET, POST, PUT) и обработки ошибок.
*   Он будет инициализироваться с `base_url`.
*   Будет включать приватный метод `_make_request` для выполнения запросов.

## 3. Создание модулей для каждого типа ресурсов API:

*   **`e2e_tests/api_client/project_api.py`**:
    *   Будет создан класс `ProjectApi`, наследующий от `BaseApiClient`.
    *   Функция `create_project` будет перемещена в этот класс как метод.
    *   Будут добавлены docstrings в стиле Google.
*   **`e2e_tests/api_client/board_api.py`**:
    *   Будет создан класс `BoardApi`, наследующий от `BaseApiClient`.
    *   Функция `create_board` будет перемещена в этот класс как метод.
    *   Будут добавлены docstrings в стиле Google.
*   **`e2e_tests/api_client/column_api.py`**:
    *   Будет создан класс `ColumnApi`, наследующий от `BaseApiClient`.
    *   Функции `create_column` и `get_columns_by_board` будут перемещены в этот класс как методы.
    *   Будут добавлены docstrings в стиле Google.
*   **`e2e_tests/api_client/card_api.py`**:
    *   Будет создан класс `CardApi`, наследующий от `BaseApiClient`.
    *   Функции `create_card`, `update_card`, и `get_card` будут перемещены в этот класс как методы.
    *   Будут добавлены docstrings в стиле Google.

## 4. Модификация основного файла тестов (`e2e_tests/api_tests.py`):

*   Все существующие функции взаимодействия с API будут удалены.
*   Будут импортированы новые классы API-клиента из `e2e_tests.api_client`.
*   Функция `main` будет обновлена для использования экземпляров этих новых классов для выполнения API-операций.
*   Будут удалены дублирующиеся импорты `time`.
*   Будут добавлены docstrings в стиле Google для функции `main`.

## Диаграмма структуры кода:

```mermaid
graph TD
    A[e2e_tests/api_tests.py] --> B(e2e_tests/api_client/__init__.py)
    B --> C(e2e_tests/api_client/base_client.py)
    B --> D(e2e_tests/api_client/project_api.py)
    B --> E(e2e_tests/api_client/board_api.py)
    B --> F(e2e_tests/api_client/column_api.py)
    B --> G(e2e_tests/api_client/card_api.py)

    D -- extends --> C
    E -- extends --> C
    F -- extends --> C
    G -- extends --> C

    A -- uses --> D
    A -- uses --> E
    A -- uses --> F
    A -- uses --> G