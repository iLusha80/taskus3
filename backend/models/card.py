from database import db
from datetime import datetime
from models.agent import Agent

class Card(db.Model):
    """Модель данных для карточки задачи.

    Атрибуты:
        id (int): Уникальный идентификатор карточки (первичный ключ).
        column_id (int): ID колонки, к которой принадлежит карточка (внешний ключ).
        title (str): Название карточки.
        description (str): Описание карточки.
        priority (str): Приоритет карточки (например, 'low', 'medium', 'high').
        assigned_agent_id (str): ID назначенного агента (необязательно).
        task_type (str): Тип задачи (например, 'bug', 'feature', 'task').
        start_date (str): Дата начала задачи.
        due_date (str): Дата выполнения задачи.
        position (int): Позиция карточки в колонке.
        created_at (str): Дата и время создания карточки.
        updated_at (str): Дата и время последнего обновления карточки.
        card_metadata (str): Дополнительные метаданные карточки в формате JSON-строки.
        history (relationship): Связь с моделью CardHistory (один-ко-многим).
    """
    id = db.Column(db.Integer, primary_key=True)
    column_id = db.Column(db.Integer, db.ForeignKey('column.id', ondelete='CASCADE'), nullable=False)
    milestone_id = db.Column(db.Integer, db.ForeignKey('milestone.id', ondelete='SET NULL'), nullable=True)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    priority = db.Column(db.Text, default='medium')
    assigned_agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=True)
    task_type = db.Column(db.Text)
    start_date = db.Column(db.Text)
    due_date = db.Column(db.Text)
    position = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    card_metadata = db.Column(db.Text, default='{}')

    assigned_agent = db.relationship('Agent', backref='cards', lazy=True)

    history = db.relationship('CardHistory', backref='card', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Преобразует объект Card в словарь.

        Returns:
            dict: Словарь, представляющий карточку.
        """
        return {
            'id': self.id,
            'column_id': self.column_id,
            'milestone_id': self.milestone_id,
            'title': self.title,
            'description': self.description,
            'priority': self.priority,
            'assigned_agent_id': self.assigned_agent_id,
            'assigned_agent_name': self.assigned_agent.name if self.assigned_agent else None,
            'task_type': self.task_type,
            'start_date': self.start_date,
            'due_date': self.due_date,
            'position': self.position,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'metadata': self.card_metadata
        }