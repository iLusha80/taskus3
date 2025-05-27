from flask import Blueprint, request, jsonify
from services.card_service import CardService

cards_bp = Blueprint('cards', __name__, url_prefix='/api/v1')

@cards_bp.route('/columns/<int:column_id>/cards', methods=['GET'])
def get_cards(column_id):
    cards = CardService.get_cards_by_column(column_id)
    if cards is None:
        return jsonify({'error': 'Column not found'}), 404
    return jsonify([c.to_dict() for c in cards])

@cards_bp.route('/columns/<int:column_id>/cards', methods=['POST'])
def create_card(column_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status', 'open')
    priority = data.get('priority', 'medium')
    assigned_agent_id = data.get('assigned_agent_id')
    task_type = data.get('task_type')
    start_date = data.get('start_date')
    due_date = data.get('due_date')
    position = data.get('position')
    metadata = data.get('metadata', '{}')

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    new_card = CardService.create_card(column_id, title, description, status, priority, assigned_agent_id, task_type, start_date, due_date, position, metadata)
    if new_card is None:
        return jsonify({'error': 'Column not found'}), 404
    return jsonify(new_card.to_dict()), 201

@cards_bp.route('/cards/<int:card_id>', methods=['GET'])
def get_card(card_id):
    card = CardService.get_card_by_id(card_id)
    if card is None:
        return jsonify({'error': 'Card not found'}), 404
    return jsonify(card.to_dict())

@cards_bp.route('/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    data = request.get_json()
    updated_card = CardService.update_card(card_id, data)
    if updated_card is None:
        return jsonify({'error': 'Card not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_card.to_dict())

@cards_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    if not CardService.delete_card(card_id):
        return jsonify({'error': 'Card not found'}), 404
    return '', 204

@cards_bp.route('/cards/<int:card_id>/history', methods=['GET'])
def get_card_history(card_id):
    history = CardService.get_card_history(card_id)
    if history is None:
        return jsonify({'error': 'Card not found'}), 404
    return jsonify([h.to_dict() for h in history])