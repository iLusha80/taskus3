import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from config import Config
from database import db, init_db
from api import register_blueprints
from models.project import Project
from models.board import Board
from models.column import Column
from models.card import Card
from models.history import CardHistory
from models.agent import Agent # Импортируем модель Agent

app = Flask(__name__)
"""Основное приложение Flask для AI Task Tracker.

Инициализирует приложение Flask, настраивает CORS, подключается к базе данных
и регистрирует все API-блюпринты. Также обслуживает статические файлы фронтенда.
"""
app.config.from_object(Config)

CORS(app, resources={r"/api/*": {"origins": "*"}})

db.init_app(app)

with app.app_context():
    init_db(app)

    # Инициализация предопределенных агентов
    initial_agents_data = {
        'Менеджер проекта': '#FF5733', # Оранжевый
        'Архитектор': '#33FF57',      # Зеленый
        'Backend-разработчик': '#3357FF', # Синий
        'Frontend-разработчик': '#FF33F0', # Розовый
        'DevOps': '#33FFF0'           # Бирюзовый
    }
    for agent_name, agent_color in initial_agents_data.items():
        if not Agent.query.filter_by(name=agent_name).first():
            new_agent = Agent(name=agent_name, color=agent_color)
            db.session.add(new_agent)
    db.session.commit()

register_blueprints(app)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Обслуживает статические файлы фронтенда.

    Args:
        path (str): Путь к запрашиваемому файлу.

    Returns:
        flask.Response: Запрошенный статический файл или index.html, если файл не найден.
    """
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

app.static_folder = os.path.abspath('../frontend')
