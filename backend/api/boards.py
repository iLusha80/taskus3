from flask import Blueprint, request, jsonify
from services.board_service import BoardService

boards_bp = Blueprint('boards', __name__, url_prefix='/api/v1')

@boards_bp.route('/projects/<int:project_id>/boards', methods=['GET'])
def get_boards(project_id):
    boards = BoardService.get_boards_by_project(project_id)
    if boards is None:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify([b.to_dict() for b in boards])

@boards_bp.route('/projects/<int:project_id>/boards', methods=['POST'])
def create_board(project_id):
    data = request.get_json()
    name = data.get('name')
    metadata = data.get('metadata', '{}')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    new_board = BoardService.create_board(project_id, name, metadata)
    if new_board is None:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify(new_board.to_dict()), 201

@boards_bp.route('/boards/<int:board_id>', methods=['GET'])
def get_board(board_id):
    board = BoardService.get_board_by_id(board_id)
    if board is None:
        return jsonify({'error': 'Board not found'}), 404
    return jsonify(board.to_dict())

@boards_bp.route('/boards/<int:board_id>', methods=['PUT'])
def update_board(board_id):
    data = request.get_json()
    updated_board = BoardService.update_board(board_id, data)
    if updated_board is None:
        return jsonify({'error': 'Board not found'}), 404
    if not data:
        return jsonify({'error': 'No fields to update'}), 400
    return jsonify(updated_board.to_dict())

@boards_bp.route('/boards/<int:board_id>', methods=['DELETE'])
def delete_board(board_id):
    if not BoardService.delete_board(board_id):
        return jsonify({'error': 'Board not found'}), 404
    return '', 204