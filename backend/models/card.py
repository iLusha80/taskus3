from database import db
from datetime import datetime

class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    column_id = db.Column(db.Integer, db.ForeignKey('column.id', ondelete='CASCADE'), nullable=False)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.Text, default='open')
    priority = db.Column(db.Text, default='medium')
    assigned_agent_id = db.Column(db.Text)
    task_type = db.Column(db.Text)
    start_date = db.Column(db.Text)
    due_date = db.Column(db.Text)
    position = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    updated_at = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'), onupdate=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    card_metadata = db.Column(db.Text, default='{}')

    history = db.relationship('CardHistory', backref='card', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'column_id': self.column_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'assigned_agent_id': self.assigned_agent_id,
            'task_type': self.task_type,
            'start_date': self.start_date,
            'due_date': self.due_date,
            'position': self.position,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'metadata': self.card_metadata
        }