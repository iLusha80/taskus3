from database import db
from datetime import datetime

class Milestone(db.Model):
    """Модель данных для этапа (Milestone).

    Атрибуты:
        id (int): Уникальный идентификатор этапа (первичный ключ).
        objective_id (int): ID цели, к которой относится этап (внешний ключ).
        name (str): Название этапа.
        description (str): Описание этапа.
        status (str): Текущий статус этапа ('not_started', 'in_progress', 'completed', 'blocked').
        due_date (date, nullable): Целевая дата завершения этапа.
        created_at (str): Дата и время создания этапа.
        updated_at (str): Дата и время последнего обновления этапа.
    """
    id = db.Column(db.Integer, primary_key=True)
    objective_id = db.Column(db.Integer, db.ForeignKey('objective.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.Text, default='not_started')
    due_date = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    cards = db.relationship('Card', backref='milestone', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Преобразует объект Milestone в словарь.

        Returns:
            dict: Словарь, представляющий этап.
        """
        return {
            'id': self.id,
            'objective_id': self.objective_id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'due_date': self.due_date,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }