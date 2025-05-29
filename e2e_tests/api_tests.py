import requests
import json
import time # Добавляем импорт time
import time # Добавляем импорт time

BASE_URL = "http://localhost:5000/api/v1"

def create_project(name, description=""):
    print(f"Создание проекта: {name}")
    url = f"{BASE_URL}/projects"
    payload = {"name": name, "description": description}
    response = requests.post(url, json=payload)
    response.raise_for_status()
    project = response.json()
    print(f"Проект создан: ID={project['id']}, Name={project['name']}")
    return project['id']

def create_board(project_id, name):
    print(f"Создание доски '{name}' для проекта ID={project_id}")
    url = f"{BASE_URL}/projects/{project_id}/boards"
    payload = {"name": name}
    response = requests.post(url, json=payload)
    response.raise_for_status()
    board = response.json()
    print(f"Доска создана: ID={board['id']}, Name={board['name']}")
    return board['id']

def create_column(board_id, name, position):
    print(f"Создание колонки '{name}' для доски ID={board_id}")
    url = f"{BASE_URL}/boards/{board_id}/columns"
    payload = {"name": name, "position": position}
    response = requests.post(url, json=payload)
    response.raise_for_status()
    column = response.json()
    print(f"Колонка создана: ID={column['id']}, Name={column['name']}")
    return column['id']

def create_card(column_id, title, description="", status="open", priority="medium", assigned_agent_id="", task_type="task", start_date="", due_date="", position=None, metadata="{}"):
    print(f"Создание карточки '{title}' для колонки ID={column_id}")
    url = f"{BASE_URL}/columns/{column_id}/cards"
    payload = {"title": title, "description": description}
    response = requests.post(url, json=payload)
    response.raise_for_status()
    card = response.json()
    print(f"Карточка создана: ID={card['id']}, Title={card['title']}")
    return card['id']

def update_card(card_id, data):
    print(f"Обновление карточки ID={card_id} с данными: {data}")
    url = f"{BASE_URL}/cards/{card_id}"
    response = requests.put(url, json=data)
    response.raise_for_status()
    updated_card = response.json()
    print(f"Карточка обновлена: ID={updated_card['id']}, Title={updated_card['title']}, Column ID={updated_card['column_id']}")
    return updated_card

def get_card(card_id):
    print(f"Получение информации о карточке ID={card_id}")
    url = f"{BASE_URL}/cards/{card_id}"
    response = requests.get(url)
    response.raise_for_status()
    card = response.json()
    print(f"Получена карточка: ID={card['id']}, Title={card['title']}, Column ID={card['column_id']}")
    return card

def get_columns_by_board(board_id):
    print(f"Получение колонок для доски ID={board_id}")
    url = f"{BASE_URL}/boards/{board_id}/columns"
    response = requests.get(url)
    response.raise_for_status()
    columns = response.json()
    print(f"Получены колонки: {[c['name'] for c in columns]}")
    return columns

def main():
    try:
        print("--- Запуск E2E тестов API ---")

        # 1. Создание проекта
        project_id = create_project("Test Project for E2E", "Проект для автоматизированных тестов")

        # 2. Создание доски
        board_id = create_board(project_id, "Test Board for E2E")

        # 3. Получение существующих колонок
        columns = get_columns_by_board(board_id)
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
        card_id = create_card(
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
        updated_card = update_card(card_id, {"column_id": in_progress_column_id})
        print(f"Карточка '{updated_card['title']}' теперь в колонке ID={updated_card['column_id']}")

        # 6. Проверка текущего состояния карточки
        retrieved_card = get_card(card_id)
        if retrieved_card['column_id'] == in_progress_column_id:
            print("Успех: Карточка успешно перемещена в 'In Progress'.")
        else:
            print("Ошибка: Карточка не была перемещена в 'In Progress'.")

        # 7. Добавление 10 задач с задержкой
        print("\n--- Добавление 10 тестовых задач ---")
        for i in range(1, 11):
            task_title = f"Автоматическая задача {i}"
            print(f"Создание задачи: {task_title}")
            create_card(
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
                print(f"Ожидание 20 секунд перед созданием следующей задачи...")
                time.sleep(20)

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