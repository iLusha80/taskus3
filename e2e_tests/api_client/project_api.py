from .base_client import BaseApiClient

class ProjectApi(BaseApiClient):
    """
    Клиент для взаимодействия с API проектов.

    Предоставляет методы для создания проектов.
    """

    def create_project(self, name, description=""):
        """
        Создает новый проект.

        Args:
            name (str): Название проекта.
            description (str, optional): Описание проекта. По умолчанию "".

        Returns:
            str: ID созданного проекта.
        """
        print(f"Создание проекта: {name}")
        endpoint = "/projects"
        payload = {"name": name, "description": description}
        project = self._make_request('POST', endpoint, payload)
        print(f"Проект создан: ID={project['id']}, Name={project['name']}")
        return project['id']

    def get_all_projects(self):
        """
        Получает список всех проектов.

        Returns:
            list: Список словарей, представляющих проекты.
        """
        print("Получение всех проектов...")
        endpoint = "/projects"
        projects = self._make_request('GET', endpoint)
        print(f"Получено проектов: {len(projects)}")
        return projects