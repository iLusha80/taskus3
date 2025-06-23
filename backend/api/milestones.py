from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from services.milestone_service import MilestoneService
from database import db # Добавляем импорт db

api = Namespace('milestones', description='Операции, связанные с этапами')

# Модель для ответа этапа
milestone_model = api.model('Milestone', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор этапа'),
    'objective_id': fields.Integer(required=True, description='ID цели, к которой принадлежит этап'),
    'name': fields.String(required=True, description='Название этапа'),
    'description': fields.String(description='Описание этапа'),
    'status': fields.String(description='Статус этапа (например, not_started, in_progress, completed)'),
    'start_date': fields.DateTime(description='Дата начала этапа'),
    'target_date': fields.DateTime(description='Целевая дата завершения этапа'),
    'created_at': fields.DateTime(readOnly=True, description='Дата создания этапа'),
    'updated_at': fields.DateTime(readOnly=True, description='Дата последнего обновления этапа'),
})

# Модель для входных данных этапа
milestone_input_model = api.model('MilestoneInput', {
    'name': fields.String(required=True, description='Название этапа'),
    'description': fields.String(description='Описание этапа'),
    'status': fields.String(enum=['not_started', 'in_progress', 'completed'], description='Статус этапа'),
    'start_date': fields.DateTime(description='Дата начала этапа (YYYY-MM-DD)'),
    'target_date': fields.DateTime(description='Целевая дата завершения этапа (YYYY-MM-DD)'),
})

@api.route('/objectives/<int:objective_id>/milestones')
@api.param('objective_id', 'Уникальный идентификатор цели')
@api.response(404, 'Цель не найдена')
class MilestoneList(Resource):
    @api.doc('create_milestone')
    @api.expect(milestone_input_model)
    @api.marshal_with(milestone_model, code=201)
    @api.response(400, 'Неверные входные данные')
    def post(self, objective_id):
        """Создать новый этап для указанной цели"""
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        due_date = data.get('due_date')

        if not name:
            api.abort(400, 'Название обязательно')

        new_milestone = MilestoneService.create_milestone(objective_id, name, description, due_date)
        if new_milestone is None:
            api.abort(404, 'Цель не найдена')
        return new_milestone.to_dict(), 201

    @api.doc('list_milestones_for_objective')
    @api.marshal_list_with(milestone_model)
    def get(self, objective_id):
        """Получить список этапов для указанной цели"""
        milestones = MilestoneService.get_milestones_by_objective(objective_id)
        return [m.to_dict() for m in milestones]

@api.route('/projects/<int:project_id>/milestones')
@api.param('project_id', 'Уникальный идентификатор проекта')
class ProjectMilestoneList(Resource):
    @api.doc('list_milestones_for_project')
    @api.marshal_list_with(milestone_model)
    def get(self, project_id):
        """Получить список этапов для указанного проекта"""
        milestones = MilestoneService.get_milestones_by_project(project_id)
        return [m.to_dict() for m in milestones]

@api.route('/milestones/<int:milestone_id>')
@api.param('milestone_id', 'Уникальный идентификатор этапа')
@api.response(404, 'Этап не найден')
class Milestone(Resource):
    @api.doc('get_milestone')
    @api.marshal_with(milestone_model)
    def get(self, milestone_id):
        """Получить этап по его ID"""
        milestone = MilestoneService.get_milestone_by_id(milestone_id)
        if milestone is None:
            api.abort(404, 'Этап не найден')
        return milestone.to_dict()

    @api.doc('update_milestone')
    @api.expect(milestone_input_model)
    @api.marshal_with(milestone_model)
    @api.response(400, 'Нет данных для обновления')
    def put(self, milestone_id):
        """Обновить существующий этап"""
        data = request.get_json()
        updated_milestone = MilestoneService.update_milestone(milestone_id, data)
        if updated_milestone is None:
            api.abort(404, 'Этап не найден')
        if not data:
            api.abort(400, 'Нет полей для обновления')
        return updated_milestone.to_dict()

    @api.doc('delete_milestone')
    @api.response(204, 'Этап успешно удален')
    def delete(self, milestone_id):
        """Удалить этап"""
        if not MilestoneService.delete_milestone(milestone_id):
            api.abort(404, 'Этап не найден')
        return '', 204