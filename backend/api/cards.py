from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from services.card_service import CardService
from services.milestone_service import MilestoneService
from database import db # Добавляем импорт db

api = Namespace('cards', description='Операции, связанные с карточками')

# Модель для ответа карточки
card_model = api.model('Card', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор карточки'),
    'column_id': fields.Integer(required=True, description='ID колонки, к которой принадлежит карточка'),
    'title': fields.String(required=True, description='Название карточки'),
    'description': fields.String(description='Описание карточки'),
    'priority': fields.String(description='Приоритет карточки (low, medium, high)'),
    'assigned_agent_id': fields.Integer(description='ID назначенного агента'),
    'task_type': fields.String(description='Тип задачи (например, bug, feature, chore)'),
    'start_date': fields.DateTime(description='Дата начала задачи'),
    'due_date': fields.DateTime(description='Срок выполнения задачи'),
    'position': fields.Integer(description='Позиция карточки в колонке'),
    'metadata': fields.String(description='Метаданные карточки в формате JSON'),
    'milestone_id': fields.Integer(description='ID этапа, к которому относится карточка'),
    'created_at': fields.DateTime(readOnly=True, description='Дата создания карточки'),
    'updated_at': fields.DateTime(readOnly=True, description='Дата последнего обновления карточки'),
})

# Модель для входных данных карточки
card_input_model = api.model('CardInput', {
    'title': fields.String(required=True, description='Название карточки'),
    'description': fields.String(description='Описание карточки'),
    'priority': fields.String(enum=['low', 'medium', 'high'], description='Приоритет карточки (low, medium, high)'),
    'assigned_agent_id': fields.Integer(description='ID назначенного агента'),
    'task_type': fields.String(description='Тип задачи (например, bug, feature, chore)'),
    'start_date': fields.DateTime(description='Дата начала задачи (YYYY-MM-DD)'),
    'due_date': fields.DateTime(description='Срок выполнения задачи (YYYY-MM-DD)'),
    'position': fields.Integer(description='Позиция карточки в колонке'),
    'metadata': fields.String(description='Метаданные карточки в формате JSON'),
    'milestone_id': fields.Integer(description='ID этапа, к которому относится карточка'),
})

# Модель для истории изменений карточки
card_history_model = api.model('CardHistory', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор записи истории'),
    'card_id': fields.Integer(required=True, description='ID карточки, к которой относится запись'),
    'field_name': fields.String(required=True, description='Название измененного поля'),
    'old_value': fields.String(description='Старое значение поля'),
    'new_value': fields.String(description='Новое значение поля'),
    'changed_at': fields.DateTime(readOnly=True, description='Дата и время изменения'),
})

@api.route('/columns/<int:column_id>/cards')
@api.param('column_id', 'Уникальный идентификатор колонки')
@api.response(404, 'Колонка не найдена')
class CardList(Resource):
    @api.doc('list_cards')
    @api.marshal_list_with(card_model)
    def get(self, column_id):
        """Получить список карточек для указанной колонки"""
        cards = CardService.get_cards_by_column(column_id)
        if cards is None:
            api.abort(404, 'Колонка не найдена')
        return [c.to_dict() for c in cards]

    @api.doc('create_card')
    @api.expect(card_input_model)
    @api.marshal_with(card_model, code=201)
    @api.response(400, 'Неверные входные данные')
    def post(self, column_id):
        """Создать новую карточку для указанной колонки"""
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        priority = data.get('priority', 'medium')
        assigned_agent_id = data.get('assigned_agent_id')
        if assigned_agent_id is not None:
            try:
                assigned_agent_id = int(assigned_agent_id)
            except ValueError:
                api.abort(400, 'assigned_agent_id должен быть целым числом')
        task_type = data.get('task_type')
        start_date = data.get('start_date')
        due_date = data.get('due_date')
        position = data.get('position', 0)
        metadata = data.get('metadata', '{}')
        milestone_id = data.get('milestone_id')

        if not title:
            api.abort(400, 'Название обязательно')

        new_card = CardService.create_card(column_id, title, description, priority, assigned_agent_id, task_type, start_date, due_date, position, metadata, milestone_id)
        if new_card is None:
            api.abort(404, 'Колонка не найдена')
        return new_card.to_dict(), 201

@api.route('/cards/<int:card_id>')
@api.param('card_id', 'Уникальный идентификатор карточки')
@api.response(404, 'Карточка не найдена')
class Card(Resource):
    @api.doc('get_card')
    @api.marshal_with(card_model)
    def get(self, card_id):
        """Получить карточку по ее ID"""
        card = CardService.get_card_by_id(card_id)
        if card is None:
            api.abort(404, 'Карточка не найдена')
        return card.to_dict()

    @api.doc('update_card')
    @api.expect(card_input_model)
    @api.marshal_with(card_model)
    @api.response(400, 'Нет данных для обновления')
    def put(self, card_id):
        """Обновить существующую карточку"""
        data = request.get_json()
        updated_card = CardService.update_card(card_id, data)
        if updated_card is None:
            api.abort(404, 'Карточка не найдена')
        if not data:
            api.abort(400, 'Нет полей для обновления')
        return updated_card.to_dict()

    @api.doc('delete_card')
    @api.response(204, 'Карточка успешно удалена')
    def delete(self, card_id):
        """Удалить карточку"""
        if not CardService.delete_card(card_id):
            api.abort(404, 'Карточка не найдена')
        return '', 204

@api.route('/cards/<int:card_id>/history')
@api.param('card_id', 'Уникальный идентификатор карточки')
@api.response(404, 'Карточка не найдена')
class CardHistory(Resource):
    @api.doc('get_card_history')
    @api.marshal_list_with(card_history_model)
    def get(self, card_id):
        """Получить историю изменений для указанной карточки"""
        history = CardService.get_card_history(card_id)
        if history is None:
            api.abort(404, 'Карточка не найдена')
        return [h.to_dict() for h in history]

@api.route('/objectives/<int:objective_id>/milestones/<int:milestone_id>/cards')
@api.param('objective_id', 'Уникальный идентификатор цели')
@api.param('milestone_id', 'Уникальный идентификатор этапа')
@api.response(404, 'Этап не найден')
@api.response(400, 'Этап не принадлежит указанной цели')
class MilestoneCards(Resource):
    @api.doc('get_cards_for_milestone')
    @api.marshal_list_with(card_model)
    def get(self, objective_id, milestone_id):
        """Получить список карточек для указанного этапа, принадлежащего определенной цели"""
        milestone = MilestoneService.get_milestone_by_id(milestone_id)
        if milestone is None:
            api.abort(404, 'Этап не найден')
        
        if milestone.objective_id != objective_id:
            api.abort(400, 'Этап не принадлежит указанной цели')

        cards = CardService.get_cards_by_milestone(milestone_id)
        return [c.to_dict() for c in cards]