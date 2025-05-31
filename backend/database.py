import os
from pathlib import Path
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

convention = {
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}
"""Словарь соглашений об именовании для метаданных SQLAlchemy.

Используется для автоматического создания имен индексов, уникальных ограничений,
проверок, внешних ключей и первичных ключей.
"""

custom_metadata = MetaData(naming_convention=convention)
"""Экземпляр MetaData SQLAlchemy с пользовательскими соглашениями об именовании.

Используется для обеспечения согласованного именования объектов базы данных.
"""
db = SQLAlchemy(metadata=custom_metadata)
"""Экземпляр SQLAlchemy для взаимодействия с базой данных.

Инициализируется с пользовательскими метаданными для применения соглашений об именовании.
"""

def init_db(app):
    """Инициализирует базу данных Flask-SQLAlchemy.

    Создает все таблицы базы данных, определенные в моделях, если они еще не существуют.

    Args:
        app (Flask): Экземпляр приложения Flask.
    """
    with app.app_context():
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        db.create_all()
