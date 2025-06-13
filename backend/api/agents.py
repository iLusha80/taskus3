from flask import Blueprint, jsonify
from models.agent import Agent

agents_bp = Blueprint('agents', __name__, url_prefix='/api/v1')

@agents_bp.route('/agents', methods=['GET'])
def get_agents():
    agents = Agent.query.all()
    return jsonify([agent.to_dict() for agent in agents])