import time
import requests.exceptions

from api_client.project_api import ProjectApi
from api_client.board_api import BoardApi
from api_client.column_api import ColumnApi
from api_client.card_api import CardApi

BASE_URL = "http://localhost:5000/api/v1"

def main():
    """
    Основная функция для выполнения E2E тестов API.

    Выполняет последовательность операций API для создания проекта, доски,
    карточек и их обновления, а также проверяет их состояние.
    """
    try:
        print("--- Запуск E2E тестов API ---")

        project_api = ProjectApi(BASE_URL)
        board_api = BoardApi(BASE_URL)
        column_api = ColumnApi(BASE_URL)
        card_api = CardApi(BASE_URL)

        # 1. Создание проекта
        project_id = project_api.create_project("Test Project for E2E", "Проект для автоматизированных тестов")

        # 2. Создание доски
        board_id = board_api.create_board(project_id, "Test Board for E2E")

        # 3. Получение существующих колонок
        columns = column_api.get_columns_by_board(board_id)
        todo_column_id = None
        in_progress_column_id = None
        for col in columns:
            if col['name'] == "Сделать":
                todo_column_id = col['id']
            elif col['name'] == "В работе":
                in_progress_column_id = col['id']
        
        if not todo_column_id or not in_progress_column_id:
            print("Ошибка: Не удалось найти колонки 'Сделать' или 'В работе'.")
            return

        # 4. Создание карточки в колонке "To Do"
        card_id = card_api.create_card(
            todo_column_id,
            "Buy groceries",
            description="Купить молоко, хлеб и яйца.",
            status="open",
            priority="medium",
            assigned_agent_id="",
            task_type="task",
            start_date="",
            due_date="",
            position=1,
            metadata="{}"
        )

        # 5. Перемещение карточки в "In Progress"
        print("\nПеремещение карточки 'Buy groceries' в 'In Progress'...")
        updated_card = card_api.update_card(card_id, {"column_id": in_progress_column_id})
        print(f"Карточка '{updated_card['title']}' теперь в колонке ID={updated_card['column_id']}")

        # 6. Проверка текущего состояния карточки
        retrieved_card = card_api.get_card(card_id)
        if retrieved_card['column_id'] == in_progress_column_id:
            print("Успех: Карточка успешно перемещена в 'In Progress'.")
        else:
            print("Ошибка: Карточка не была перемещена в 'In Progress'.")

        # 7. Добавление 10 задач с задержкой
        print("\n--- Добавление 10 тестовых задач ---")
        for i in range(1, 11):
            task_title = f"Автоматическая задача {i}"
            print(f"Создание задачи: {task_title}")
            card_api.create_card(
                todo_column_id,
                task_title,
                description=f"Описание для автоматической задачи {i}",
                status="open",
                priority="medium",
                assigned_agent_id="",
                task_type="task",
                start_date="",
                due_date="",
                position=i+1, # Увеличиваем позицию для новых карточек
                metadata="{}"
            )
            if i < 10:
                print(f"Ожидание 8 секунд перед созданием следующей задачи...")
                time.sleep(8)

        print("\n--- E2E тесты API завершены ---")

    except requests.exceptions.RequestException as e:
        print(f"Ошибка при выполнении API запроса: {e}")
        if e.response is not None:
            print(f"Статус код: {e.response.status_code}")
            print(f"Ответ сервера: {e.response.text}")
    except Exception as e:
        print(f"Произошла непредвиденная ошибка: {e}")

if __name__ == "__main__":
    main()