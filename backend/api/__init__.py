from flask_restx import Namespace

def register_api_namespaces(api):
    """Регистрирует все пространства имен API в приложении Flask-RESTX.

    Args:
        api (Api): Экземпляр Flask-RESTX Api.
    """
    from .projects import api as projects_ns
    from .boards import api as boards_ns
    from .columns import api as columns_ns
    from .cards import api as cards_ns
    from .objectives import api as objectives_ns
    from .milestones import api as milestones_ns
    from .agents import api as agents_ns

    api.add_namespace(projects_ns)
    api.add_namespace(boards_ns)
    api.add_namespace(columns_ns)
    api.add_namespace(cards_ns)
    api.add_namespace(objectives_ns)
    api.add_namespace(milestones_ns)
    api.add_namespace(agents_ns)