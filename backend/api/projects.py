from flask import Blueprint, request, jsonify
from services.project_service import ProjectService

projects_bp = Blueprint('projects', __name__, url_prefix='/api/v1/projects')
"""Блюпринт для управления проектами.

Предоставляет эндпоинты для создания, получения, обновления и удаления проектов.
"""

@projects_bp.route('/', methods=['GET'])
def get_projects():
    """Получает список всех проектов.

    Returns:
        flask.Response: JSON-ответ, содержащий список проектов.
    """
    projects = ProjectService.get_all_projects()
    return jsonify([p.to_dict() for p in projects])

@projects_bp.route('/', methods=['POST'])
def create_project():
    """Создает новый проект.

    Принимает данные проекта в формате JSON.

    Returns:
        flask.Response: JSON-ответ, содержащий новый проект, или сообщение об ошибке.
    """
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    metadata = data.get('metadata', '{}')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_project = ProjectService.create_project(name=name, description=description, metadata=metadata)
    return jsonify(new_project.to_dict()), 201

@projects_bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Получает проект по его ID.

    Args:
        project_id (int): ID проекта.

    Returns:
        flask.Response: JSON-ответ, содержащий проект, или сообщение об ошибке, если проект не найден.
    """
    project = ProjectService.get_project_by_id(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project.to_dict())

@projects_bp.route('/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    """Обновляет существующий проект.

    Принимает ID проекта и данные для обновления в формате JSON.

    Args:
        project_id (int): ID проекта.

    Returns:
        flask.Response: JSON-ответ, содержащий обновленный проект, или сообщение об ошибке.
    """
    data = request.get_json()
    updated_project = ProjectService.update_project(project_id, data)
    if updated_project is None:
        return jsonify({'error': 'Project not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_project.to_dict())

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Удаляет проект по его ID.

    Args:
        project_id (int): ID проекта.

    Returns:
        flask.Response: Пустой ответ со статусом 204 при успешном удалении, или сообщение об ошибке.
    """
    if not ProjectService.delete_project(project_id):
        return jsonify({'error': 'Project not found'}), 404
    return '', 204