from flask import Blueprint, request, jsonify
from services.card_service import CardService
from services.milestone_service import MilestoneService

cards_bp = Blueprint('cards', __name__, url_prefix='/api/v1')
"""Блюпринт для управления карточками.

Предоставляет эндпоинты для создания, получения, обновления и удаления карточек,
а также для получения истории изменений карточек.
"""

@cards_bp.route('/columns/<int:column_id>/cards', methods=['GET'])
def get_cards(column_id):
    """Получает список карточек для указанной колонки.

    Args:
        column_id (int): ID колонки.

    Returns:
        flask.Response: JSON-ответ, содержащий список карточек, или сообщение об ошибке.
    """
    cards = CardService.get_cards_by_column(column_id)
    if cards is None:
        return jsonify({'error': 'Column not found'}), 404
    return jsonify([c.to_dict() for c in cards])

@cards_bp.route('/columns/<int:column_id>/cards', methods=['POST'])
def create_card(column_id):
    """Создает новую карточку для указанной колонки.

    Принимает данные карточки в формате JSON.

    Args:
        column_id (int): ID колонки, к которой будет принадлежать карточка.

    Returns:
        flask.Response: JSON-ответ, содержащий новую карточку, или сообщение об ошибке.
    """
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    status = data.get('status', 'open')
    priority = data.get('priority', 'medium')
    assigned_agent_id = data.get('assigned_agent_id')
    task_type = data.get('task_type')
    start_date = data.get('start_date')
    due_date = data.get('due_date')
    position = data.get('position', 0) # Устанавливаем значение по умолчанию 0, если не предоставлено
    metadata = data.get('metadata', '{}')
    milestone_id = data.get('milestone_id')

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    new_card = CardService.create_card(column_id, title, description, status, priority, assigned_agent_id, task_type, start_date, due_date, position, metadata, milestone_id)
    if new_card is None:
        return jsonify({'error': 'Column not found'}), 404
    return jsonify(new_card.to_dict()), 201

@cards_bp.route('/cards/<int:card_id>', methods=['GET'])
def get_card(card_id):
    """Получает карточку по ее ID.

    Args:
        card_id (int): ID карточки.

    Returns:
        flask.Response: JSON-ответ, содержащий карточку, или сообщение об ошибке, если карточка не найдена.
    """
    card = CardService.get_card_by_id(card_id)
    if card is None:
        return jsonify({'error': 'Card not found'}), 404
    return jsonify(card.to_dict())

@cards_bp.route('/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    """Обновляет существующую карточку.

    Принимает ID карточки и данные для обновления в формате JSON.

    Args:
        card_id (int): ID карточки.

    Returns:
        flask.Response: JSON-ответ, содержащий обновленную карточку, или сообщение об ошибке.
    """
    data = request.get_json()
    updated_card = CardService.update_card(card_id, data)
    if updated_card is None:
        return jsonify({'error': 'Card not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_card.to_dict())

@cards_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    """Удаляет карточку по ее ID.

    Args:
        card_id (int): ID карточки.

    Returns:
        flask.Response: Пустой ответ со статусом 204 при успешном удалении, или сообщение об ошибке.
    """
    if not CardService.delete_card(card_id):
        return jsonify({'error': 'Card not found'}), 404
    return '', 204

@cards_bp.route('/cards/<int:card_id>/history', methods=['GET'])
def get_card_history(card_id):
    """Получает историю изменений для указанной карточки.

    Args:
        card_id (int): ID карточки.

    Returns:
        flask.Response: JSON-ответ, содержащий историю изменений карточки, или сообщение об ошибке.
    """
    history = CardService.get_card_history(card_id)
    if history is None:
        return jsonify({'error': 'Card not found'}), 404
    return jsonify([h.to_dict() for h in history])

@cards_bp.route('/objectives/<int:objective_id>/milestones/<int:milestone_id>/cards', methods=['GET'])
def get_cards_for_milestone(objective_id, milestone_id):
    """Получает список карточек для указанного этапа, принадлежащего определенной цели.

    Args:
        objective_id (int): ID цели.
        milestone_id (int): ID этапа.

    Returns:
        flask.Response: JSON-ответ, содержащий список карточек, или сообщение об ошибке.
    """
    milestone = MilestoneService.get_milestone_by_id(milestone_id)
    if milestone is None:
        return jsonify({'error': 'Milestone not found'}), 404
    
    if milestone.objective_id != objective_id:
        return jsonify({'error': 'Milestone does not belong to the specified objective'}), 400

    cards = CardService.get_cards_by_milestone(milestone_id)
    return jsonify([c.to_dict() for c in cards])