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

custom_metadata = MetaData(naming_convention=convention)
db = SQLAlchemy(metadata=custom_metadata)

def init_db(app):
    with app.app_context():
        db_uri = app.config['SQLALCHEMY_DATABASE_URI']
        db.create_all()
