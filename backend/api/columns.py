from flask import Blueprint, request, jsonify
from services.column_service import ColumnService
from services.board_service import BoardService

columns_bp = Blueprint('columns', __name__, url_prefix='/api/v1')
"""Блюпринт для управления колонками.

Предоставляет эндпоинты для создания, получения, обновления и удаления колонок.
"""

@columns_bp.route('/boards/<int:board_id>/columns', methods=['GET'])
def get_columns(board_id):
    """Получает список колонок для указанной доски.

    Args:
        board_id (int): ID доски.

    Returns:
        flask.Response: JSON-ответ, содержащий список колонок, или сообщение об ошибке.
    """
    columns = ColumnService.get_columns_by_board(board_id)
    if columns is None:
        return jsonify({'error': 'Board not found'}), 404
    return jsonify([c.to_dict() for c in columns])

@columns_bp.route('/projects/<int:project_id>/columns', methods=['GET'])
def get_columns_by_project(project_id: int):
    """
    Получает список колонок для указанного проекта.

    Args:
        project_id (int): ID проекта.

    Returns:
        flask.Response: JSON-ответ, содержащий список колонок, или сообщение об ошибке.
    """

    boards = BoardService.get_boards_by_project(project_id)
    main_board = min(boards, key=lambda b: b.id)

    columns = ColumnService.get_columns_by_board(main_board)
    return jsonify([c.to_dict() for c in columns])

@columns_bp.route('/boards/<int:board_id>/columns', methods=['POST'])
def create_column(board_id):
    """Создает новую колонку для указанной доски.

    Принимает данные колонки в формате JSON.

    Args:
        board_id (int): ID доски, к которой будет принадлежать колонка.

    Returns:
        flask.Response: JSON-ответ, содержащий новую колонку, или сообщение об ошибке.
    """
    data = request.get_json()
    name = data.get('name')
    position = data.get('position')
    metadata = data.get('metadata', '{}')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_column = ColumnService.create_column(board_id, name, position, metadata)
    if new_column is None:
        return jsonify({'error': 'Board not found'}), 404
    return jsonify(new_column.to_dict()), 201

@columns_bp.route('/columns/<int:column_id>', methods=['GET'])
def get_column(column_id):
    """Получает колонку по ее ID.

    Args:
        column_id (int): ID колонки.

    Returns:
        flask.Response: JSON-ответ, содержащий колонку, или сообщение об ошибке, если колонка не найдена.
    """
    column = ColumnService.get_column_by_id(column_id)
    if column is None:
        return jsonify({'error': 'Column not found'}), 404
    return jsonify(column.to_dict())

@columns_bp.route('/columns/<int:column_id>', methods=['PUT'])
def update_column(column_id):
    """Обновляет существующую колонку.

    Принимает ID колонки и данные для обновления в формате JSON.

    Args:
        column_id (int): ID колонки.

    Returns:
        flask.Response: JSON-ответ, содержащий обновленную колонку, или сообщение об ошибке.
    """
    data = request.get_json()
    updated_column = ColumnService.update_column(column_id, data)
    if updated_column is None:
        return jsonify({'error': 'Column not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_column.to_dict())

@columns_bp.route('/columns/<int:column_id>', methods=['DELETE'])
def delete_column(column_id):
    """Удаляет колонку по ее ID.

    Args:
        column_id (int): ID колонки.

    Returns:
        flask.Response: Пустой ответ со статусом 204 при успешном удалении, или сообщение об ошибке.
    """
    if not ColumnService.delete_column(column_id):
        return jsonify({'error': 'Column not found'}), 404
    return '', 204