from database import db
from models.board import Board
from models.project import Project
from services.column_service import ColumnService

class BoardService:
    @staticmethod
    def get_boards_by_project(project_id):
        project = Project.query.get(project_id)
        if not project:
            return None
        return Board.query.filter_by(project_id=project_id).all()

    @staticmethod
    def get_board_by_id(board_id):
        return Board.query.get(board_id)

    @staticmethod
    def create_board(project_id, name, metadata):
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
        board = Board.query.get(board_id)
        if not board:
            return False
        db.session.delete(board)
        db.session.commit()
        return True