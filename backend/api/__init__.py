from flask import Blueprint

def register_blueprints(app):
    from .projects import projects_bp
    from .boards import boards_bp
    from .columns import columns_bp
    from .cards import cards_bp

    app.register_blueprint(projects_bp)
    app.register_blueprint(boards_bp)
    app.register_blueprint(columns_bp)
    app.register_blueprint(cards_bp)