from database import db
from datetime import datetime

class Board(db.Model):
    """Модель данных для доски.

    Атрибуты:
        id (int): Уникальный идентификатор доски (первичный ключ).
        project_id (int): ID проекта, к которому принадлежит доска (внешний ключ).
        name (str): Название доски.
        created_at (str): Дата и время создания доски.
        updated_at (str): Дата и время последнего обновления доски.
        board_metadata (str): Дополнительные метаданные доски в формате JSON-строки.
        columns (relationship): Связь с моделью Column (один-ко-многим).
    """
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    board_metadata = db.Column(db.Text, default='{}')

    columns = db.relationship('Column', backref='board', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Преобразует объект Board в словарь.

        Returns:
            dict: Словарь, представляющий доску.
        """
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'metadata': self.board_metadata
        }