from database import db
from models.column import Column
from models.board import Board

class ColumnService:
    @staticmethod
    def get_columns_by_board(board_id):
        board = Board.query.get(board_id)
        if not board:
            return None
        return Column.query.filter_by(board_id=board_id).order_by(Column.position).all()

    @staticmethod
    def get_column_by_id(column_id):
        return Column.query.get(column_id)

    @staticmethod
    def create_column(board_id, name, position, metadata):
        board = Board.query.get(board_id)
        if not board:
            return None
        new_column = Column(board_id=board_id, name=name, position=position, metadata=metadata)
        db.session.add(new_column)
        db.session.commit()
        return new_column

    @staticmethod
    def update_column(column_id, data):
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
        column = Column.query.get(column_id)
        if not column:
            return False
        db.session.delete(column)
        db.session.commit()
        return True