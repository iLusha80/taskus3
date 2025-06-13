from database import db
from datetime import datetime

class Objective(db.Model):
    """Модель данных для цели (Objective).

    Атрибуты:
        id (int): Уникальный идентификатор цели (первичный ключ).
        project_id (int): ID проекта, к которому относится цель (внешний ключ).
        name (str): Название цели.
        description (str): Подробное описание цели.
        status (str): Текущий статус цели ('not_started', 'in_progress', 'completed', 'blocked').
        owner_agent_id (str, nullable): ID главного агента, ответственного за цель.
        start_date (date, nullable): Дата начала цели.
        target_date (date, nullable): Целевая дата завершения цели.
        created_at (str): Дата и время создания цели.
        updated_at (str): Дата и время последнего обновления цели.
    """
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.Text, default='not_started')
    owner_agent_id = db.Column(db.Text, nullable=True)
    start_date = db.Column(db.Text, nullable=True)
    target_date = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

    milestones = db.relationship('Milestone', backref='objective', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        """Преобразует объект Objective в словарь.

        Returns:
            dict: Словарь, представляющий цель.
        """
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'owner_agent_id': self.owner_agent_id,
            'start_date': self.start_date,
            'target_date': self.target_date,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }