import os

class Config:
    """Класс конфигурации для приложения Flask.

    Определяет настройки базы данных и другие конфигурационные параметры.
    """
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///data/tasks.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False