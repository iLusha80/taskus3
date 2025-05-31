from .base_client import BaseApiClient

class BoardApi(BaseApiClient):
    """
    Клиент для взаимодействия с API досок.

    Предоставляет методы для создания досок.
    """

    def create_board(self, project_id, name):
        """
        Создает новую доску для указанного проекта.

        Args:
            project_id (str): ID проекта, к которому будет привязана доска.
            name (str): Название доски.

        Returns:
            str: ID созданной доски.
        """
        print(f"Создание доски '{name}' для проекта ID={project_id}")
        endpoint = f"/projects/{project_id}/boards"
        payload = {"name": name}
        board = self._make_request('POST', endpoint, payload)
        print(f"Доска создана: ID={board['id']}, Name={board['name']}")
        return board['id']

    def get_boards_by_project(self, project_id):
        """
        Получает все доски для указанного проекта.

        Args:
            project_id (str): ID проекта, для которого нужно получить доски.

        Returns:
            list: Список словарей, представляющих доски.
        """
        print(f"Получение досок для проекта ID={project_id}")
        endpoint = f"/projects/{project_id}/boards"
        boards = self._make_request('GET', endpoint)
        print(f"Получено досок: {[b['name'] for b in boards]}")
        return boards