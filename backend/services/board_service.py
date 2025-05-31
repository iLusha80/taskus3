from database import db
from models.board import Board
from models.project import Project
from services.column_service import ColumnService

class BoardService:
    """Сервис для управления операциями, связанными с досками.

    Предоставляет статические методы для взаимодействия с моделью Board в базе данных.
    """
    @staticmethod
    def get_boards_by_project(project_id):
        """Получает список досок для указанного проекта.

        Args:
            project_id (int): ID проекта.

        Returns:
            list[Board] or None: Список объектов Board, если проект найден, иначе None.
        """
        project = Project.query.get(project_id)
        if not project:
            return None
        return Board.query.filter_by(project_id=project_id).all()

    @staticmethod
    def get_board_by_id(board_id):
        """Получает доску по ее ID.

        Args:
            board_id (int): ID доски.

        Returns:
            Board or None: Объект Board, если найден, иначе None.
        """
        return Board.query.get(board_id)

    @staticmethod
    def create_board(project_id, name, metadata):
        """Создает новую доску для указанного проекта.

        Также создает набор колонок по умолчанию для новой доски.

        Args:
            project_id (int): ID проекта, к которому будет принадлежать доска.
            name (str): Название доски.
            metadata (str): Дополнительные метаданные доски в формате JSON-строки.

        Returns:
            Board or None: Созданный объект Board, если проект найден, иначе None.
        """
        project = Project.query.get(project_id)
        if not project:
            return None
        new_board = Board(project_id=project_id, name=name, metadata=metadata)
        db.session.add(new_board)
        db.session.commit()

        # Create default columns
        default_columns = ["Сделать", "В работе", "На Тестах", "Готово"]
        for i, col_name in enumerate(default_columns):
            ColumnService.create_column(new_board.id, col_name, i, "{}")

        return new_board

    @staticmethod
    def update_board(board_id, data):
        """Обновляет существующую доску в базе данных.

        Args:
            board_id (int): ID доски для обновления.
            data (dict): Словарь, содержащий поля для обновления (например, 'name', 'metadata').

        Returns:
            Board or None: Обновленный объект Board, если найден, иначе None.
        """
        board = Board.query.get(board_id)
        if not board:
            return None
        
        if 'name' in data:
            board.name = data['name']
        if 'metadata' in data:
            board.metadata = data['metadata']
        
        db.session.commit()
        return board

    @staticmethod
    def delete_board(board_id):
        """Удаляет доску из базы данных.

        Args:
            board_id (int): ID доски для удаления.

        Returns:
            bool: True, если доска успешно удалена, иначе False.
        """
        board = Board.query.get(board_id)
        if not board:
            return False
        db.session.delete(board)
        db.session.commit()
        return True