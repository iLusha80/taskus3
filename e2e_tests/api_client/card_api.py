from .base_client import BaseApiClient

class CardApi(BaseApiClient):
    """
    Клиент для взаимодействия с API карточек.

    Предоставляет методы для создания, обновления и получения карточек.
    """

    def create_card(self, column_id, title, description="", status="open", priority="medium", assigned_agent_id="", task_type="task", start_date="", due_date="", position=None, metadata="{}"):
        """
        Создает новую карточку в указанной колонке.

        Args:
            column_id (str): ID колонки, к которой будет привязана карточка.
            title (str): Заголовок карточки.
            description (str, optional): Описание карточки. По умолчанию "".
            status (str, optional): Статус карточки. По умолчанию "open".
            priority (str, optional): Приоритет карточки. По умолчанию "medium".
            assigned_agent_id (str, optional): ID назначенного агента. По умолчанию "".
            task_type (str, optional): Тип задачи. По умолчанию "task".
            start_date (str, optional): Дата начала. По умолчанию "".
            due_date (str, optional): Дата выполнения. По умолчанию "".
            position (int, optional): Позиция карточки в колонке. По умолчанию None.
            metadata (str, optional): Метаданные в формате JSON-строки. По умолчанию "{}".

        Returns:
            str: ID созданной карточки.
        """
        print(f"Создание карточки '{title}' для колонки ID={column_id}")
        endpoint = f"/columns/{column_id}/cards"
        payload = {
            "title": title,
            "description": description,
            "status": status,
            "priority": priority,
            "assigned_agent_id": assigned_agent_id,
            "task_type": task_type,
            "start_date": start_date,
            "due_date": due_date,
            "position": position,
            "metadata": metadata
        }
        card = self._make_request('POST', endpoint, payload)
        print(f"Карточка создана: ID={card['id']}, Title={card['title']}")
        return card['id']

    def update_card(self, card_id, data):
        """
        Обновляет существующую карточку.

        Args:
            card_id (str): ID карточки для обновления.
            data (dict): Словарь с данными для обновления карточки.

        Returns:
            dict: Обновленная карточка в виде словаря.
        """
        print(f"Обновление карточки ID={card_id} с данными: {data}")
        endpoint = f"/cards/{card_id}"
        updated_card = self._make_request('PUT', endpoint, data)
        print(f"Карточка обновлена: ID={updated_card['id']}, Title={updated_card['title']}, Column ID={updated_card['column_id']}")
        return updated_card

    def get_card(self, card_id):
        """
        Получает информацию о карточке по ее ID.

        Args:
            card_id (str): ID карточки для получения.

        Returns:
            dict: Карточка в виде словаря.
        """
        print(f"Получение информации о карточке ID={card_id}")
        endpoint = f"/cards/{card_id}"
        card = self._make_request('GET', endpoint)
        print(f"Получена карточка: ID={card['id']}, Title={card['title']}, Column ID={card['column_id']}")
        return card