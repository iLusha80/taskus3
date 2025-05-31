import time
import argparse
import requests.exceptions

from api_client.project_api import ProjectApi
from api_client.board_api import BoardApi
from api_client.column_api import ColumnApi
from api_client.card_api import CardApi

BASE_URL = "http://localhost:5000/api/v1"

def automate_tasks(num_tasks=5, delay_seconds=10):
    """
    Автоматизирует создание и перемещение задач в проекте.

    Задачи создаются в проекте с наименьшим ID, затем перемещаются
    последовательно по столбцам доски.

    Args:
        num_tasks (int, optional): Количество задач для создания. По умолчанию 5.
        delay_seconds (int, optional): Задержка между шагами в секундах. По умолчанию 10.
    """
    try:
        print("--- Запуск автоматизации задач ---")

        project_api = ProjectApi(BASE_URL)
        board_api = BoardApi(BASE_URL)
        column_api = ColumnApi(BASE_URL)
        card_api = CardApi(BASE_URL)

        # 1. Найти проект с наименьшим ID
        projects = project_api.get_all_projects()
        if not projects:
            print("Ошибка: Проекты не найдены. Создайте хотя бы один проект.")
            return

        # Сортируем проекты по ID и берем первый (наименьший ID)
        projects.sort(key=lambda p: p['id'])
        target_project_id = projects[0]['id']
        print(f"Целевой проект для задач: ID={target_project_id}, Name={projects[0]['name']}")

        # 2. Найти или создать доску в целевом проекте
        boards = board_api.get_boards_by_project(target_project_id)
        board_id = None
        if boards:
            # Используем первую найденную доску
            board_id = boards[0]['id']
            print(f"Используется существующая доска: ID={board_id}, Name={boards[0]['name']}")
        else:
            # Если досок нет, создаем новую
            board_name = "Automated Tasks Board"
            board_id = board_api.create_board(target_project_id, board_name)
            print(f"Создана новая доска: ID={board_id}, Name={board_name}")

        if not board_id:
            print("Ошибка: Не удалось найти или создать доску для проекта.")
            return


        # 3. Получение колонок для доски
        columns = column_api.get_columns_by_board(board_id)
        if not columns:
            print("Ошибка: Колонки не найдены для доски. Убедитесь, что доска имеет колонки.")
            return
        
        # Сортируем колонки по позиции, чтобы перемещать задачи последовательно
        columns.sort(key=lambda c: c['position'])
        column_ids = [col['id'] for col in columns]
        column_names = [col['name'] for col in columns]

        if len(column_ids) < 2:
            print("Ошибка: Для перемещения задач требуется как минимум две колонки.")
            return

        for i in range(1, num_tasks + 1):
            task_title = f"Автоматическая задача {i}"
            print(f"\n--- Создание и перемещение задачи: {task_title} ---")

            # Создание задачи в первой колонке
            initial_column_id = column_ids[0]
            initial_column_name = column_names[0]
            print(f"Создание задачи '{task_title}' в колонке '{initial_column_name}' (ID={initial_column_id})...")
            card_id = card_api.create_card(
                initial_column_id,
                task_title,
                description=f"Описание для автоматической задачи {i}",
                status="open",
                priority="medium",
                task_type="task",
                position=i
            )
            print(f"Задача '{task_title}' создана с ID={card_id}.")

            # Перемещение задачи по колонкам
            for j in range(len(column_ids)):
                if j == 0: # Пропускаем первую колонку, так как задача уже там
                    continue

                current_column_id = column_ids[j-1]
                next_column_id = column_ids[j]
                current_column_name = column_names[j-1]
                next_column_name = column_names[j]

                print(f"Ожидание {delay_seconds} секунд перед перемещением задачи из '{current_column_name}' в '{next_column_name}'...")
                time.sleep(delay_seconds)

                print(f"Перемещение задачи '{task_title}' из '{current_column_name}' (ID={current_column_id}) в '{next_column_name}' (ID={next_column_id})...")
                updated_card = card_api.update_card(card_id, {"column_id": next_column_id})
                print(f"Задача '{updated_card['title']}' теперь в колонке '{next_column_name}' (ID={updated_card['column_id']}).")

                # Проверка текущего состояния карточки
                retrieved_card = card_api.get_card(card_id)
                if retrieved_card['column_id'] == next_column_id:
                    print(f"Успех: Задача '{task_title}' успешно перемещена в '{next_column_name}'.")
                else:
                    print(f"Ошибка: Задача '{task_title}' не была перемещена в '{next_column_name}'.")

        print("\n--- Автоматизация задач завершена ---")

    except requests.exceptions.RequestException as e:
        print(f"Ошибка при выполнении API запроса: {e}")
        if e.response is not None:
            print(f"Статус код: {e.response.status_code}")
            print(f"Ответ сервера: {e.response.text}")
    except Exception as e:
        print(f"Произошла непредвиденная ошибка: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Автоматизация создания и перемещения задач в Kanban доске.")
    parser.add_argument("--num_tasks", type=int, default=5,
                        help="Количество задач для создания (по умолчанию: 5)")
    parser.add_argument("--delay", type=int, default=10,
                        help="Задержка между шагами в секундах (по умолчанию: 10)")
    args = parser.parse_args()

    automate_tasks(args.num_tasks, args.delay)