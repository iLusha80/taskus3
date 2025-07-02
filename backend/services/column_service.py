from database import db
from models.column import Column
from models.board import Board

class ColumnService:
    """Сервис для управления операциями, связанными с колонками.

    Предоставляет статические методы для взаимодействия с моделью Column в базе данных.
    """
    @staticmethod
    def get_columns_by_board(board_id):
        """Получает список колонок для указанной доски.

        Колонки сортируются по их позиции.

        Args:
            board_id (int): ID доски.

        Returns:
            list[Column] or None: Список объектов Column, если доска найдена, иначе None.
        """
        board = Board.query.get(board_id)
        if not board:
            return None
        return Column.query.filter_by(board_id=board_id).order_by(Column.position).all()

    @staticmethod
    def get_columns_by_project_id(project_id):
        """Получает список колонок для указанного проекта.

        Args:
            project_id (int): ID проекта.

        Returns:
            list[Column] or None: Список объектов Column, если проект найден, иначе None.
        """
        return Column.query.filter_by(project_id=project_id).all()

    @staticmethod
    def get_column_by_id(column_id):
        """Получает колонку по ее ID.

        Args:
            column_id (int): ID колонки.

        Returns:
            Column or None: Объект Column, если найден, иначе None.
        """
        return Column.query.get(column_id)

    @staticmethod
    def create_column(board_id, name, position, metadata):
        """Создает новую колонку для указанной доски.

        Args:
            board_id (int): ID доски, к которой будет принадлежать колонка.
            name (str): Название колонки.
            position (int): Позиция колонки на доске.
            metadata (str): Дополнительные метаданные колонки в формате JSON-строки.

        Returns:
            Column or None: Созданный объект Column, если доска найдена, иначе None.
        """
        board = Board.query.get(board_id)
        if not board:
            return None
        new_column = Column(board_id=board_id, name=name, position=position, metadata=metadata)
        db.session.add(new_column)
        db.session.commit()
        return new_column

    @staticmethod
    def update_column(column_id, data):
        """Обновляет существующую колонку в базе данных.

        Args:
            column_id (int): ID колонки для обновления.
            data (dict): Словарь, содержащий поля для обновления (например, 'name', 'position', 'metadata').

        Returns:
            Column or None: Обновленный объект Column, если найден, иначе None.
        """
        column = Column.query.get(column_id)
        if not column:
            return None
        
        if 'name' in data:
            column.name = data['name']
        if 'position' in data:
            column.position = data['position']
        if 'metadata' in data:
            column.metadata = data['metadata']
        
        db.session.commit()
        return column

    @staticmethod
    def delete_column(column_id):
        """Удаляет колонку из базы данных.

        Args:
            column_id (int): ID колонки для удаления.

        Returns:
            bool: True, если колонка успешно удалена, иначе False.
        """
        column = Column.query.get(column_id)
        if not column:
            return False
        db.session.delete(column)
        db.session.commit()
        return True