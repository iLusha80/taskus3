from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from services.column_service import ColumnService
from database import db # Добавляем импорт db

api = Namespace('columns', description='Операции, связанные с колонками')

# Модель для ответа колонки
column_model = api.model('Column', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор колонки'),
    'board_id': fields.Integer(required=True, description='ID доски, к которой принадлежит колонка'),
    'name': fields.String(required=True, description='Название колонки'),
    'position': fields.Integer(description='Позиция колонки на доске'),
    'metadata': fields.String(description='Метаданные колонки в формате JSON'),
    'created_at': fields.DateTime(readOnly=True, description='Дата создания колонки'),
    'updated_at': fields.DateTime(readOnly=True, description='Дата последнего обновления колонки'),
})

# Модель для входных данных колонки
column_input_model = api.model('ColumnInput', {
    'name': fields.String(required=True, description='Название колонки'),
    'position': fields.Integer(description='Позиция колонки на доске'),
    'metadata': fields.String(description='Метаданные колонки в формате JSON'),
})

@api.route('/boards/<int:board_id>/columns')
@api.param('board_id', 'Уникальный идентификатор доски')
@api.response(404, 'Доска не найдена')
class ColumnList(Resource):
    @api.doc('list_columns')
    @api.marshal_list_with(column_model)
    def get(self, board_id):
        """Получить список колонок для указанной доски"""
        columns = ColumnService.get_columns_by_board(board_id)
        if columns is None:
            api.abort(404, 'Доска не найдена')
        return [c.to_dict() for c in columns]

    @api.doc('create_column')
    @api.expect(column_input_model)
    @api.marshal_with(column_model, code=201)
    @api.response(400, 'Неверные входные данные')
    def post(self, board_id):
        """Создать новую колонку для указанной доски"""
        data = request.get_json()
        name = data.get('name')
        position = data.get('position')
        metadata = data.get('metadata', '{}')

        if not name:
            api.abort(400, 'Название обязательно')

        new_column = ColumnService.create_column(board_id, name, position, metadata)
        if new_column is None:
            api.abort(404, 'Доска не найдена')
        return new_column.to_dict(), 201

@api.route('/columns/<int:column_id>')
@api.param('column_id', 'Уникальный идентификатор колонки')
@api.response(404, 'Колонка не найдена')
class Column(Resource):
    @api.doc('get_column')
    @api.marshal_with(column_model)
    def get(self, column_id):
        """Получить колонку по ее ID"""
        column = ColumnService.get_column_by_id(column_id)
        if column is None:
            api.abort(404, 'Колонка не найдена')
        return column.to_dict()

    @api.doc('update_column')
    @api.expect(column_input_model)
    @api.marshal_with(column_model)
    @api.response(400, 'Нет данных для обновления')
    def put(self, column_id):
        """Обновить существующую колонку"""
        data = request.get_json()
        updated_column = ColumnService.update_column(column_id, data)
        if updated_column is None:
            api.abort(404, 'Колонка не найдена')
        if not data:
            api.abort(400, 'Нет полей для обновления')
        return updated_column.to_dict()

    @api.doc('delete_column')
    @api.response(204, 'Колонка успешно удалена')
    def delete(self, column_id):
        """Удалить колонку"""
        if not ColumnService.delete_column(column_id):
            api.abort(404, 'Колонка не найдена')
        return '', 204