from flask import Blueprint

def register_blueprints(app):
    """Регистрирует все блюпринты API в приложении Flask.

    Args:
        app (Flask): Экземпляр приложения Flask.
    """
    from .projects import projects_bp
    from .boards import boards_bp
    from .columns import columns_bp
    from .cards import cards_bp
    from .objectives import objectives_bp
    from .milestones import milestones_bp
    from .agents import agents_bp

    app.register_blueprint(projects_bp)
    app.register_blueprint(boards_bp)
    app.register_blueprint(columns_bp)
    app.register_blueprint(cards_bp)
    app.register_blueprint(objectives_bp)
    app.register_blueprint(milestones_bp)
    app.register_blueprint(agents_bp)