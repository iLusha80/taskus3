from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from services.project_service import ProjectService
from database import db # Добавляем импорт db

api = Namespace('projects', description='Операции, связанные с проектами')

# Модель для ответа проекта
project_model = api.model('Project', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор проекта'),
    'name': fields.String(required=True, description='Название проекта'),
    'description': fields.String(description='Описание проекта'),
    'metadata': fields.String(description='Метаданные проекта в формате JSON'),
    'created_at': fields.DateTime(readOnly=True, description='Дата создания проекта'),
    'updated_at': fields.DateTime(readOnly=True, description='Дата последнего обновления проекта'),
})

# Модель для входных данных проекта
project_input_model = api.model('ProjectInput', {
    'name': fields.String(required=True, description='Название проекта'),
    'description': fields.String(description='Описание проекта'),
    'metadata': fields.String(description='Метаданные проекта в формате JSON'),
})

@api.route('/')
class ProjectList(Resource):
    @api.doc('list_projects')
    @api.marshal_list_with(project_model)
    def get(self):
        """Получить список всех проектов"""
        projects = ProjectService.get_all_projects()
        return [p.to_dict() for p in projects]

    @api.doc('create_project')
    @api.expect(project_input_model)
    @api.marshal_with(project_model, code=201)
    @api.response(400, 'Неверные входные данные')
    def post(self):
        """Создать новый проект"""
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        metadata = data.get('metadata', '{}')

        if not name:
            api.abort(400, 'Название обязательно')

        new_project = ProjectService.create_project(name, description, metadata)
        return new_project.to_dict(), 201

@api.route('/<int:project_id>')
@api.param('project_id', 'Уникальный идентификатор проекта')
@api.response(404, 'Проект не найден')
class Project(Resource):
    @api.doc('get_project')
    @api.marshal_with(project_model)
    def get(self, project_id):
        """Получить проект по ID"""
        project = ProjectService.get_project_by_id(project_id)
        if project is None:
            api.abort(404, 'Проект не найден')
        return project.to_dict()

    @api.doc('update_project')
    @api.expect(project_input_model)
    @api.marshal_with(project_model)
    @api.response(400, 'Нет данных для обновления')
    def put(self, project_id):
        """Обновить существующий проект"""
        data = request.get_json()
        updated_project = ProjectService.update_project(project_id, data)
        if updated_project is None:
            api.abort(404, 'Проект не найден')
        if not data:
            api.abort(400, 'Нет полей для обновления')
        return updated_project.to_dict()

    @api.doc('delete_project')
    @api.response(204, 'Проект успешно удален')
    def delete(self, project_id):
        """Удалить проект"""
        if not ProjectService.delete_project(project_id):
            api.abort(404, 'Проект не найден')
        return '', 204