from flask import Blueprint, request, jsonify
from services.milestone_service import MilestoneService

milestones_bp = Blueprint('milestones', __name__, url_prefix='/api/v1')
"""Блюпринт для управления этапами (Milestones).

Предоставляет эндпоинты для создания, получения, обновления и удаления этапов.
"""

@milestones_bp.route('/objectives/<int:objective_id>/milestones', methods=['POST'])
def create_milestone(objective_id):
    """Создает новый этап для указанной цели.

    Принимает данные этапа в формате JSON.

    Args:
        objective_id (int): ID цели, к которой будет относиться этап.

    Returns:
        flask.Response: JSON-ответ, содержащий новый этап, или сообщение об ошибке.
    """
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    due_date = data.get('due_date')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_milestone = MilestoneService.create_milestone(objective_id, name, description, due_date)
    if new_milestone is None:
        return jsonify({'error': 'Objective not found'}), 404
    return jsonify(new_milestone.to_dict()), 201

@milestones_bp.route('/objectives/<int:objective_id>/milestones', methods=['GET'])
def get_milestones_for_objective(objective_id):
    """Получает список этапов для указанной цели.

    Args:
        objective_id (int): ID цели.

    Returns:
        flask.Response: JSON-ответ, содержащий список этапов.
    """
    milestones = MilestoneService.get_milestones_by_objective(objective_id)
    return jsonify([m.to_dict() for m in milestones])

@milestones_bp.route('/milestones/<int:milestone_id>', methods=['GET'])
def get_milestone(milestone_id):
    """Получает этап по его ID.

    Args:
        milestone_id (int): ID этапа.

    Returns:
        flask.Response: JSON-ответ, содержащий этап, или сообщение об ошибке, если этап не найден.
    """
    milestone = MilestoneService.get_milestone_by_id(milestone_id)
    if milestone is None:
        return jsonify({'error': 'Milestone not found'}), 404
    return jsonify(milestone.to_dict())

@milestones_bp.route('/milestones/<int:milestone_id>', methods=['PUT'])
def update_milestone(milestone_id):
    """Обновляет существующий этап.

    Принимает ID этапа и данные для обновления в формате JSON.

    Args:
        milestone_id (int): ID этапа.

    Returns:
        flask.Response: JSON-ответ, содержащий обновленный этап, или сообщение об ошибке.
    """
    data = request.get_json()
    updated_milestone = MilestoneService.update_milestone(milestone_id, data)
    if updated_milestone is None:
        return jsonify({'error': 'Milestone not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_milestone.to_dict())

@milestones_bp.route('/milestones/<int:milestone_id>', methods=['DELETE'])
def delete_milestone(milestone_id):
    """Удаляет этап по его ID.

    Args:
        milestone_id (int): ID этапа.

    Returns:
        flask.Response: Пустой ответ со статусом 204 при успешном удалении, или сообщение об ошибке.
    """
    if not MilestoneService.delete_milestone(milestone_id):
        return jsonify({'error': 'Milestone not found'}), 404
    return '', 204