from flask import Blueprint, request, jsonify
from services.objective_service import ObjectiveService
from services.milestone_service import MilestoneService # Для вложенных этапов

objectives_bp = Blueprint('objectives', __name__, url_prefix='/api/v1')
"""Блюпринт для управления целями (Objectives).

Предоставляет эндпоинты для создания, получения, обновления и удаления целей,
а также для получения вложенных этапов.
"""

@objectives_bp.route('/projects/<int:project_id>/objectives', methods=['POST'])
def create_objective(project_id):
    """Создает новую цель для указанного проекта.

    Принимает данные цели в формате JSON.

    Args:
        project_id (int): ID проекта, к которому будет относиться цель.

    Returns:
        flask.Response: JSON-ответ, содержащий новую цель, или сообщение об ошибке.
    """
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    status = data.get('status', 'not_started') # Получаем статус из данных, по умолчанию 'not_started'
    start_date = data.get('start_date')
    target_date = data.get('target_date')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_objective = ObjectiveService.create_objective(project_id, name, description, status, start_date, target_date)
    if new_objective is None:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(new_objective.to_dict()), 201

@objectives_bp.route('/projects/<int:project_id>/objectives', methods=['GET'])
def get_objectives_for_project(project_id):
    """Получает список целей для указанного проекта с вложенными этапами.

    Args:
        project_id (int): ID проекта.

    Returns:
        flask.Response: JSON-ответ, содержащий список целей.
    """
    objectives = ObjectiveService.get_objectives_by_project(project_id)
    objectives_data = []
    for obj in objectives:
        obj_dict = obj.to_dict()
        milestones = MilestoneService.get_milestones_by_objective(obj.id)
        obj_dict['milestones'] = [m.to_dict() for m in milestones]
        objectives_data.append(obj_dict)
    return jsonify(objectives_data)

@objectives_bp.route('/objectives/<int:objective_id>', methods=['GET'])
def get_objective(objective_id):
    """Получает цель по ее ID.

    Args:
        objective_id (int): ID цели.

    Returns:
        flask.Response: JSON-ответ, содержащий цель, или сообщение об ошибке, если цель не найдена.
    """
    objective = ObjectiveService.get_objective_by_id(objective_id)
    if objective is None:
        return jsonify({'error': 'Objective not found'}), 404
    
    objective_dict = objective.to_dict()
    milestones = MilestoneService.get_milestones_by_objective(objective.id)
    objective_dict['milestones'] = [m.to_dict() for m in milestones]
    return jsonify(objective_dict)

@objectives_bp.route('/objectives/<int:objective_id>', methods=['PUT'])
def update_objective(objective_id):
    """Обновляет существующую цель.

    Принимает ID цели и данные для обновления в формате JSON.

    Args:
        objective_id (int): ID цели.

    Returns:
        flask.Response: JSON-ответ, содержащий обновленную цель, или сообщение об ошибке.
    """
    data = request.get_json()
    updated_objective = ObjectiveService.update_objective(objective_id, data)
    if updated_objective is None:
        return jsonify({'error': 'Objective not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_objective.to_dict())

@objectives_bp.route('/objectives/<int:objective_id>', methods=['DELETE'])
def delete_objective(objective_id):
    """Удаляет цель по ее ID.

    Args:
        objective_id (int): ID цели.

    Returns:
        flask.Response: Пустой ответ со статусом 204 при успешном удалении, или сообщение об ошибке.
    """
    if not ObjectiveService.delete_objective(objective_id):
        return jsonify({'error': 'Objective not found'}), 404
    return '', 204