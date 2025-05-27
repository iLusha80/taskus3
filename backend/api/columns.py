from flask import Blueprint, request, jsonify
from services.column_service import ColumnService

columns_bp = Blueprint('columns', __name__, url_prefix='/api/v1')

@columns_bp.route('/boards/<int:board_id>/columns', methods=['GET'])
def get_columns(board_id):
    columns = ColumnService.get_columns_by_board(board_id)
    if columns is None:
        return jsonify({'error': 'Board not found'}), 404
    return jsonify([c.to_dict() for c in columns])

@columns_bp.route('/boards/<int:board_id>/columns', methods=['POST'])
def create_column(board_id):
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
    column = ColumnService.get_column_by_id(column_id)
    if column is None:
        return jsonify({'error': 'Column not found'}), 404
    return jsonify(column.to_dict())

@columns_bp.route('/columns/<int:column_id>', methods=['PUT'])
def update_column(column_id):
    data = request.get_json()
    updated_column = ColumnService.update_column(column_id, data)
    if updated_column is None:
        return jsonify({'error': 'Column not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_column.to_dict())

@columns_bp.route('/columns/<int:column_id>', methods=['DELETE'])
def delete_column(column_id):
    if not ColumnService.delete_column(column_id):
        return jsonify({'error': 'Column not found'}), 404
    return '', 204