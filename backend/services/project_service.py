from database import db
from models.project import Project
from services.board_service import BoardService

class ProjectService:
    """Сервис для управления операциями, связанными с проектами.

    Предоставляет статические методы для взаимодействия с моделью Project в базе данных.
    """
    @staticmethod
    def get_all_projects():
        """Получает все проекты из базы данных.

        Returns:
            list[Project]: Список всех объектов Project.
        """
        return Project.query.all()

    @staticmethod
    def get_project_by_id(project_id):
        """Получает проект по его ID.

        Args:
            project_id (int): ID проекта.

        Returns:
            Project or None: Объект Project, если найден, иначе None.
        """
        return Project.query.get(project_id)

    @staticmethod
    def create_project(name, description, metadata):
        """Создает новый проект в базе данных.

        Args:
            name (str): Название проекта.
            description (str): Описание проекта.
            metadata (str): Дополнительные метаданные проекта в формате JSON-строки.

        Returns:
            Project: Созданный объект Project.
        """
        new_project = Project(name=name, description=description, metadata=metadata)
        db.session.add(new_project)
        db.session.commit()
        # Создаем доску "main" для нового проекта
        BoardService.create_board(new_project.id, "main", "{}")
        return new_project

    @staticmethod
    def update_project(project_id, data):
        """Обновляет существующий проект в базе данных.

        Args:
            project_id (int): ID проекта для обновления.
            data (dict): Словарь, содержащий поля для обновления (например, 'name', 'description', 'metadata').

        Returns:
            Project or None: Обновленный объект Project, если найден, иначе None.
        """
        project = Project.query.get(project_id)
        if not project:
            return None
        
        if 'name' in data:
            project.name = data['name']
        if 'description' in data:
            project.description = data['description']
        if 'metadata' in data:
            project.metadata = data['metadata']
        
        db.session.commit()
        return project

    @staticmethod
    def delete_project(project_id):
        """Удаляет проект из базы данных.

        Args:
            project_id (int): ID проекта для удаления.

        Returns:
            bool: True, если проект успешно удален, иначе False.
        """
        project = Project.query.get(project_id)
        if not project:
            return False
        db.session.delete(project)
        db.session.commit()
        return True