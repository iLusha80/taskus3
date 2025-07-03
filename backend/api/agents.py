from flask import Blueprint, jsonify, request
from models.agent import Agent
from database import db

agents_bp = Blueprint('agents', __name__, url_prefix='/api/v1')

@agents_bp.route('/agents', methods=['GET'])
def get_agents():
    agents = Agent.query.all()
    return jsonify([agent.to_dict() for agent in agents])

@agents_bp.route('/agents', methods=['POST'])
def create_agent():
    data = request.get_json()
    name = data.get('name')
    color = data.get('color')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    existing_agent = Agent.query.filter_by(name=name).first()
    if existing_agent:
        return jsonify({'error': 'Agent with this name already exists'}), 409

    new_agent = Agent(name=name, color=color)
    db.session.add(new_agent)
    db.session.commit()
    return jsonify(new_agent.to_dict()), 201

@agents_bp.route('/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    agent = Agent.query.get(agent_id)
    if not agent:
        return jsonify({'error': 'Agent not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided for update'}), 400

    if 'name' in data:
        # Проверяем, не занято ли новое имя другим агентом
        existing_agent = Agent.query.filter(Agent.name == data['name'], Agent.id != agent_id).first()
        if existing_agent:
            return jsonify({'error': 'Agent with this name already exists'}), 409
        agent.name = data['name']
    
    if 'color' in data:
        agent.color = data['color']

    db.session.commit()
    return jsonify(agent.to_dict())