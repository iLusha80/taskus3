from flask import Flask
from flask_cors import CORS
from config import Config
from database import db, init_db
from api import register_blueprints
from models.project import Project
from models.board import Board
from models.column import Column
from models.card import Card
from models.history import CardHistory

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})

db.init_app(app)

with app.app_context():
    init_db(app)

register_blueprints(app)
