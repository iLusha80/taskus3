from database import db

class Agent(db.Model):
    """Модель данных для исполнителя (Agent).

    Атрибуты:
        id (int): Уникальный идентификатор исполнителя (первичный ключ).
        name (str): Название роли исполнителя (например, 'Менеджер проекта').
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)

    def to_dict(self):
        """Преобразует объект Agent в словарь.

        Returns:
            dict: Словарь, представляющий исполнителя.
        """
        return {
            'id': self.id,
            'name': self.name
        }