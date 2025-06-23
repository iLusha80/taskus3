from flask import jsonify, request # Добавляем request
from flask_restx import Namespace, Resource, fields # Изменяем импорт
from models.agent import Agent
from database import db # Добавляем импорт db

api = Namespace('agents', description='Операции, связанные с агентами') # Изменяем на Namespace

# Модель для ответа агента
agent_model = api.model('Agent', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор агента'),
    'name': fields.String(required=True, description='Имя агента'),
    'color': fields.String(description='Цвет агента (HEX-код)'),
})

# Модель для входных данных агента
agent_input_model = api.model('AgentInput', {
    'name': fields.String(required=True, description='Имя агента'),
    'color': fields.String(description='Цвет агента (HEX-код)'),
})

@api.route('/agents') # Изменяем декоратор
class AgentList(Resource):
    @api.doc('list_agents')
    @api.marshal_list_with(agent_model)
    def get(self):
        """Получить список всех агентов"""
        agents = Agent.query.all()
        return [agent.to_dict() for agent in agents]

    @api.doc('create_agent')
    @api.expect(agent_input_model)
    @api.marshal_with(agent_model, code=201)
    @api.response(400, 'Неверные входные данные')
    @api.response(409, 'Агент с таким именем уже существует')
    def post(self):
        """Создать нового агента"""
        data = request.get_json()
        name = data.get('name')
        color = data.get('color')

        if not name:
            api.abort(400, 'Имя обязательно')

        existing_agent = Agent.query.filter_by(name=name).first()
        if existing_agent:
            api.abort(409, 'Агент с таким именем уже существует')

        new_agent = Agent(name=name, color=color)
        db.session.add(new_agent)
        db.session.commit()
        return new_agent.to_dict(), 201

@api.route('/agents/<int:agent_id>') # Изменяем декоратор
@api.param('agent_id', 'Уникальный идентификатор агента')
@api.response(404, 'Агент не найден')
class Agent(Resource):
    @api.doc('get_agent')
    @api.marshal_with(agent_model)
    def get(self, agent_id):
        """Получить агента по ID"""
        agent = Agent.query.get(agent_id)
        if not agent:
            api.abort(404, 'Агент не найден')
        return agent.to_dict()

    @api.doc('update_agent')
    @api.expect(agent_input_model)
    @api.marshal_with(agent_model)
    @api.response(400, 'Нет данных для обновления')
    @api.response(409, 'Агент с таким именем уже существует')
    def put(self, agent_id):
        """Обновить существующего агента"""
        agent = Agent.query.get(agent_id)
        if not agent:
            api.abort(404, 'Агент не найден')

        data = request.get_json()
        if not data:
            api.abort(400, 'Нет данных для обновления')

        if 'name' in data:
            existing_agent = Agent.query.filter(Agent.name == data['name'], Agent.id != agent_id).first()
            if existing_agent:
                api.abort(409, 'Агент с таким именем уже существует')
            agent.name = data['name']
        
        if 'color' in data:
            agent.color = data['color']

        db.session.commit()
        return agent.to_dict()

    @api.doc('delete_agent')
    @api.response(204, 'Агент успешно удален')
    def delete(self, agent_id):
        """Удалить агента"""
        agent = Agent.query.get(agent_id)
        if not agent:
            api.abort(404, 'Агент не найден')
        db.session.delete(agent)
        db.session.commit()
        return '', 204