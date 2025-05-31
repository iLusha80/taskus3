from database import db
from datetime import datetime
from models.card import Card # Импортируем модель Card

class Column(db.Model):
    """Модель данных для колонки на доске.

    Атрибуты:
        id (int): Уникальный идентификатор колонки (первичный ключ).
        board_id (int): ID доски, к которой принадлежит колонка (внешний ключ).
        name (str): Название колонки.
        position (int): Позиция колонки на доске.
        created_at (str): Дата и время создания колонки.
        updated_at (str): Дата и время последнего обновления колонки.
        column_metadata (str): Дополнительные метаданные колонки в формате JSON-строки.
        cards (relationship): Связь с моделью Card (один-ко-многим).
    """
    id = db.Column(db.Integer, primary_key=True)
    board_id = db.Column(db.Integer, db.ForeignKey('board.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    position = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    column_metadata = db.Column(db.Text, default='{}')

    cards = db.relationship('Card', backref='column', lazy='joined', cascade="all, delete-orphan", order_by="Card.position")

    def to_dict(self):
        """Преобразует объект Column в словарь.

        Включает в себя список карточек, принадлежащих этой колонке.

        Returns:
            dict: Словарь, представляющий колонку.
        """
        return {
            'id': self.id,
            'board_id': self.board_id,
            'name': self.name,
            'position': self.position,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'metadata': self.column_metadata,
            'cards': [card.to_dict() for card in self.cards] # Добавляем карточки
        }