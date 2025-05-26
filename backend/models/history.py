from database import db
from datetime import datetime

class CardHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('card.id', ondelete='CASCADE'), nullable=False)
    timestamp = db.Column(db.Text, default=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    event_type = db.Column(db.Text, nullable=False)
    field_name = db.Column(db.Text)
    old_value = db.Column(db.Text)
    new_value = db.Column(db.Text)
    duration_in_seconds = db.Column(db.Integer)
    history_metadata = db.Column(db.Text, default='{}')

    def to_dict(self):
        return {
            'id': self.id,
            'card_id': self.card_id,
            'timestamp': self.timestamp,
            'event_type': self.event_type,
            'field_name': self.field_name,
            'old_value': self.old_value,
            'new_value': self.new_value,
            'duration_in_seconds': self.duration_in_seconds,
            'metadata': self.metadata
        }