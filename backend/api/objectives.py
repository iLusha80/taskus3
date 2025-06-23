from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from services.objective_service import ObjectiveService
from services.milestone_service import MilestoneService
from database import db # Добавляем импорт db

api = Namespace('objectives', description='Операции, связанные с целями')

# Модель для ответа этапа (для вложенности в цель)
milestone_nested_model = api.model('MilestoneNested', {
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

# Модель для ответа цели
objective_model = api.model('Objective', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор цели'),
    'project_id': fields.Integer(required=True, description='ID проекта, к которому принадлежит цель'),
    'name': fields.String(required=True, description='Название цели'),
    'description': fields.String(description='Описание цели'),
    'status': fields.String(description='Статус цели (например, not_started, in_progress, completed)'),
    'start_date': fields.DateTime(description='Дата начала цели'),
    'target_date': fields.DateTime(description='Целевая дата завершения цели'),
    'created_at': fields.DateTime(readOnly=True, description='Дата создания цели'),
    'updated_at': fields.DateTime(readOnly=True, description='Дата последнего обновления цели'),
    'milestones': fields.List(fields.Nested(milestone_nested_model), description='Список этапов, принадлежащих этой цели'),
})

# Модель для входных данных цели
objective_input_model = api.model('ObjectiveInput', {
    'name': fields.String(required=True, description='Название цели'),
    'description': fields.String(description='Описание цели'),
    'status': fields.String(enum=['not_started', 'in_progress', 'completed'], description='Статус цели'),
    'start_date': fields.DateTime(description='Дата начала цели (YYYY-MM-DD)'),
    'target_date': fields.DateTime(description='Целевая дата завершения цели (YYYY-MM-DD)'),
})

@api.route('/projects/<int:project_id>/objectives')
@api.param('project_id', 'Уникальный идентификатор проекта')
@api.response(404, 'Проект не найден')
class ObjectiveList(Resource):
    @api.doc('create_objective')
    @api.expect(objective_input_model)
    @api.marshal_with(objective_model, code=201)
    @api.response(400, 'Неверные входные данные')
    def post(self, project_id):
        """Создать новую цель для указанного проекта"""
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        status = data.get('status', 'not_started')
        start_date = data.get('start_date')
        target_date = data.get('target_date')

        if not name:
            api.abort(400, 'Название обязательно')

        new_objective = ObjectiveService.create_objective(project_id, name, description, status, start_date, target_date)
        if new_objective is None:
            api.abort(404, 'Проект не найден')
        return new_objective.to_dict(), 201

    @api.doc('list_objectives_for_project')
    @api.marshal_list_with(objective_model)
    def get(self, project_id):
        """Получить список целей для указанного проекта с вложенными этапами"""
        objectives = ObjectiveService.get_objectives_by_project(project_id)
        objectives_data = []
        for obj in objectives:
            obj_dict = obj.to_dict()
            milestones = MilestoneService.get_milestones_by_objective(obj.id)
            obj_dict['milestones'] = [m.to_dict() for m in milestones]
            objectives_data.append(obj_dict)
        return objectives_data

@api.route('/objectives/<int:objective_id>')
@api.param('objective_id', 'Уникальный идентификатор цели')
@api.response(404, 'Цель не найдена')
class Objective(Resource):
    @api.doc('get_objective')
    @api.marshal_with(objective_model)
    def get(self, objective_id):
        """Получить цель по ее ID"""
        objective = ObjectiveService.get_objective_by_id(objective_id)
        if objective is None:
            api.abort(404, 'Цель не найдена')
        
        objective_dict = objective.to_dict()
        milestones = MilestoneService.get_milestones_by_objective(objective.id)
        objective_dict['milestones'] = [m.to_dict() for m in milestones]
        return objective_dict

    @api.doc('update_objective')
    @api.expect(objective_input_model)
    @api.marshal_with(objective_model)
    @api.response(400, 'Нет данных для обновления')
    def put(self, objective_id):
        """Обновить существующую цель"""
        data = request.get_json()
        updated_objective = ObjectiveService.update_objective(objective_id, data)
        if updated_objective is None:
            api.abort(404, 'Цель не найдена')
        if not data:
            api.abort(400, 'Нет полей для обновления')
        return updated_objective.to_dict()

    @api.doc('delete_objective')
    @api.response(204, 'Цель успешно удалена')
    def delete(self, objective_id):
        """Удалить цель"""
        if not ObjectiveService.delete_objective(objective_id):
            api.abort(404, 'Цель не найдена')
        return '', 204