from flask import Blueprint, request, jsonify
from services.project_service import ProjectService

projects_bp = Blueprint('projects', __name__, url_prefix='/api/v1/projects')

@projects_bp.route('/', methods=['GET'])
def get_projects():
    projects = ProjectService.get_all_projects()
    return jsonify([p.to_dict() for p in projects])

@projects_bp.route('/', methods=['POST'])
def create_project():
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    metadata = data.get('metadata', '{}')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_project = ProjectService.create_project(name, description, metadata)
    return jsonify(new_project.to_dict()), 201

@projects_bp.route('/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = ProjectService.get_project_by_id(project_id)
    if project is None:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(project.to_dict())

@projects_bp.route('/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.get_json()
    updated_project = ProjectService.update_project(project_id, data)
    if updated_project is None:
        return jsonify({'error': 'Project not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_project.to_dict())

@projects_bp.route('/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    if not ProjectService.delete_project(project_id):
        return jsonify({'error': 'Project not found'}), 404
    return '', 204