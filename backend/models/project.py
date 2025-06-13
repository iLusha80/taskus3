from database import db
from datetime import datetime

class Project(db.Model):
    """Модель данных для проекта.

    Атрибуты:
        id (int): Уникальный идентификатор проекта (первичный ключ).
        name (str): Название проекта.
        description (str): Описание проекта.
        created_at (str): Дата и время создания проекта.
        updated_at (str): Дата и время последнего обновления проекта.
        project_metadata (str): Дополнительные метаданные проекта в формате JSON-строки.
        boards (relationship): Связь с моделью Board (один-ко-многим).
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    project_metadata = db.Column(db.Text, default='{}')

    boards = db.relationship('Board', backref='project', lazy=True, cascade="all, delete-orphan")
    objectives = db.relationship('Objective', backref='project', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Преобразует объект Project в словарь.

        Returns:
            dict: Словарь, представляющий проект.
        """
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'metadata': self.project_metadata
        }