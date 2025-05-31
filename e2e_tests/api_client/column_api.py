from .base_client import BaseApiClient

class ColumnApi(BaseApiClient):
    """
    Клиент для взаимодействия с API колонок.

    Предоставляет методы для создания и получения колонок.
    """

    def create_column(self, board_id, name, position):
        """
        Создает новую колонку для указанной доски.

        Args:
            board_id (str): ID доски, к которой будет привязана колонка.
            name (str): Название колонки.
            position (int): Позиция колонки в доске.

        Returns:
            str: ID созданной колонки.
        """
        print(f"Создание колонки '{name}' для доски ID={board_id}")
        endpoint = f"/boards/{board_id}/columns"
        payload = {"name": name, "position": position}
        column = self._make_request('POST', endpoint, payload)
        print(f"Колонка создана: ID={column['id']}, Name={column['name']}")
        return column['id']

    def get_columns_by_board(self, board_id):
        """
        Получает все колонки для указанной доски.

        Args:
            board_id (str): ID доски, для которой нужно получить колонки.

        Returns:
            list: Список словарей, представляющих колонки.
        """
        print(f"Получение колонок для доски ID={board_id}")
        endpoint = f"/boards/{board_id}/columns"
        columns = self._make_request('GET', endpoint)
        print(f"Получены колонки: {[c['name'] for c in columns]}")
        return columns