# План по восстановлению таблиц базы данных

## Проблема
База данных PostgreSQL создана, но в ней отсутствуют таблицы, что приводит к ошибке `sqlalchemy.exc.ProgrammingError: (psycopg2.errors.UndefinedTable) relation "project" does not exist`.

## Диагностика
1.  **docker-compose.yml**: Определено использование PostgreSQL.
2.  **backend/app.py**: Вызывается функция `init_db(app)` из `database.py`.
3.  **backend/database.py**: Функция `init_db` содержит `db.create_all()`, которая должна создавать таблицы.
4.  **backend/models/__init__.py**: Все модели SQLAlchemy импортируются в этом файле.
5.  **Логи контейнера `backend`**: Подтверждают ошибку `UndefinedTable`.

**Причина**: `db.create_all()` вызывается до того, как все модели SQLAlchemy будут полностью загружены и зарегистрированы в метаданных `db`. Хотя `backend/models/__init__.py` импортирует модели, сам модуль `backend/models` не импортируется напрямую в `backend/app.py` таким образом, чтобы гарантировать загрузку всех моделей до вызова `db.create_all()`.

## План действий

### Шаг 1: Решение - Изменение `backend/app.py`
Добавить строку `import backend.models` в [`backend/app.py`](backend/app.py) перед строкой `with app.app_context():`. Это заставит Python загрузить все модели, определенные в `backend/models`, и зарегистрировать их в объекте `db`.

### Шаг 2: Проверка
После внесения изменений, перезапустить контейнеры и проверить логи, а также подключиться через DBeaver, чтобы убедиться, что таблицы созданы.

## Визуализация плана

```mermaid
graph TD
    A[Начало] --> B{Проблема: Отсутствие таблиц в БД};
    B --> C[Анализ docker-compose.yml: PostgreSQL];
    C --> D[Анализ backend/app.py: init_db(app)];
    D --> E[Анализ backend/database.py: db.create_all()];
    E --> F[Анализ логов: UndefinedTable];
    F --> G[Анализ backend/models/__init__.py: Модели импортированы];
    G --> H{Причина: Модели не загружены до db.create_all()};
    H --> I[Решение: Добавить import backend.models в backend/app.py];
    I --> J[Перезапуск контейнеров];
    J --> K[Проверка таблиц в DBeaver];
    K --> L{Таблицы созданы?};
    L -- Да --> M[Завершение];
    L -- Нет --> N[Дальнейшая диагностика];