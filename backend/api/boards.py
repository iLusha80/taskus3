from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from services.board_service import BoardService
from database import db # Добавляем импорт db

api = Namespace('boards', description='Операции, связанные с досками')

# Модель для ответа доски
board_model = api.model('Board', {
    'id': fields.Integer(readOnly=True, description='Уникальный идентификатор доски'),
    'project_id': fields.Integer(required=True, description='ID проекта, к которому принадлежит доска'),
    'name': fields.String(required=True, description='Название доски'),
    'metadata': fields.String(description='Метаданные доски в формате JSON'),
    'created_at': fields.DateTime(readOnly=True, description='Дата создания доски'),
    'updated_at': fields.DateTime(readOnly=True, description='Дата последнего обновления доски'),
})

# Модель для входных данных доски
board_input_model = api.model('BoardInput', {
    'name': fields.String(required=True, description='Название доски'),
    'metadata': fields.String(description='Метаданные доски в формате JSON'),
})

@api.route('/projects/<int:project_id>/boards')
@api.param('project_id', 'Уникальный идентификатор проекта')
@api.response(404, 'Проект не найден')
class BoardList(Resource):
    @api.doc('list_boards')
    @api.marshal_list_with(board_model)
    def get(self, project_id):
        """Получить список досок для указанного проекта"""
        boards = BoardService.get_boards_by_project(project_id)
        if boards is None:
            api.abort(404, 'Проект не найден')
        return [b.to_dict() for b in boards]

    @api.doc('create_board')
    @api.expect(board_input_model)
    @api.marshal_with(board_model, code=201)
    @api.response(400, 'Неверные входные данные')
    def post(self, project_id):
        """Создать новую доску для указанного проекта"""
        data = request.get_json()
        name = data.get('name')
        metadata = data.get('metadata', '{}')

        if not name:
            api.abort(400, 'Название обязательно')

        new_board = BoardService.create_board(project_id, name, metadata)
        if new_board is None:
            api.abort(404, 'Проект не найден')
        return new_board.to_dict(), 201

@api.route('/boards/<int:board_id>')
@api.param('board_id', 'Уникальный идентификатор доски')
@api.response(404, 'Доска не найдена')
class Board(Resource):
    @api.doc('get_board')
    @api.marshal_with(board_model)
    def get(self, board_id):
        """Получить доску по ее ID"""
        board = BoardService.get_board_by_id(board_id)
        if board is None:
            api.abort(404, 'Доска не найдена')
        return board.to_dict()

    @api.doc('update_board')
    @api.expect(board_input_model)
    @api.marshal_with(board_model)
    @api.response(400, 'Нет данных для обновления')
    def put(self, board_id):
        """Обновить существующую доску"""
        data = request.get_json()
        updated_board = BoardService.update_board(board_id, data)
        if updated_board is None:
            api.abort(404, 'Доска не найдена')
        if not data:
            api.abort(400, 'Нет полей для обновления')
        return updated_board.to_dict()

    @api.doc('delete_board')
    @api.response(204, 'Доска успешно удалена')
    def delete(self, board_id):
        """Удалить доску"""
        if not BoardService.delete_board(board_id):
            api.abort(404, 'Доска не найдена')
        return '', 204